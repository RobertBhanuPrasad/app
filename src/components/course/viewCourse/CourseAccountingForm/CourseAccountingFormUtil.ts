import { supabaseClient } from "src/utility";
import _ from "lodash";

export const handleSaveCourseAccountingFormData = async (
  data: CourseAccountingFormFieldTypes
) => {
  // Step 1: Handle Post program_revenue data
  if (data.program_offline_revenue) {
    await handlePostProgramRevenueData(
      data.program_offline_revenue,
      data.program_id as number
    );
  }

  // Step 2: Handle Post program_expenses data
  await handlePostProgramExpensesData(data.program_expenses);

  // Step 3: If user filled course_accounting_user_consent field then we have to store this also
  // patch program table with course_accounting_user_consent this column
  if (data.course_accounting_user_consent !== undefined) {
    const { data: programData, error } = await supabaseClient
      .from("program")
      .update({
        course_accounting_user_consent: data.course_accounting_user_consent,
      })
      .eq("id", data.program_id)
      .select();

    if (error) {
      console.error(error);
    } else {
      console.log(programData, "program data updated");
    }
  }
};

export const handlePostProgramRevenueData = async (
  data: ProgramOfflineRevenueDatabaseType[],
  programId: number
) => {
  try {
    console.log("data to add to  program_offline_revenue data:", data);

    // Step 1: Retrieve existing revenue entries of the program from the database
    const { data: existingRevenueResponse } = await supabaseClient
      .from("program_offline_revenue")
      .select("id")
      .eq("program_id", programId);

    // Extract the IDs of existing revenue entries
    const existingRevenueIds: number[] = existingRevenueResponse?.map(
      (revenue) => revenue.id
    ) as number[];

    // Step 2: Determine revenue entries to remove (if any)
    const revenueToRemove = _.difference(
      existingRevenueIds,
      data.map((item) => item.id)
    );

    // Step 3: Remove revenue entries from the program_revenue table
    if (revenueToRemove.length > 0) {
      const { data: deletedData, error: deletedError } = await supabaseClient
        .from("program_offline_revenue")
        .delete()
        .eq("program_id", programId)
        .in("id", revenueToRemove)
        .select();

      if (deletedError) {
        console.error(
          "Error while deleting program revenue data:",
          deletedError
        );
        throw deletedError;
      } else {
        console.log("Program revenue data deleted successfully:", deletedData);
      }
    }

    // Step 4: Insert or update new revenue entries into the program_revenue table
    if (data.length > 0) {
      const revenueToAddData = data.map(
        (revenueItem: ProgramOfflineRevenueDatabaseType) => {
          let body: ProgramOfflineRevenueDatabaseType = {
            program_id: programId,
            date: revenueItem.date,
            amount: revenueItem.amount,
            organization_id: 1,
            notes: revenueItem.notes,
          };

          if (revenueItem.id) {
            body = {
              ...body,
              id: revenueItem.id,
            };
          }

          return body;
        }
      );

      console.log(
        "data need to add/update to program revenue",
        revenueToAddData
      );

      const { data: programRevenueData, error: programRevenueError } =
        await supabaseClient
          .from("program_offline_revenue")
          .upsert(revenueToAddData)
          .select();

      console.log(
        "Program revenue data is inserted/updated",
        programRevenueData
      );

      if (programRevenueError) {
        console.error(
          "Error while creating program revenue data:",
          programRevenueError
        );
        throw programRevenueError;
      }
    }

    console.log("Program revenue data posted successfully.");
  } catch (error) {
    console.error("Error while posting program revenue data:", error);
    throw error;
  }
};

export const handlePostProgramExpensesData = async (data: any) => {
  // TODO: Implement the logic to post data to program_expenses table after backend code is ready
  try {
    console.log("Posting program_expenses data:", data);
  } catch (error) {
    console.error("Error while posting program_expenses data:", error);
    throw error;
  }
};
