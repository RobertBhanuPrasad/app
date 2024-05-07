import { supabaseClient } from "src/utility";
import _ from "lodash";

const supabase = supabaseClient();

export const handleSaveCourseAccountingFormData = async (
  data: CourseAccountingFormFieldTypes
) => {
  try {
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
      const { data: programData, error } = await supabase
        .from("program")
        .update({
          course_accounting_user_consent: data.course_accounting_user_consent,
        })
        .eq("id", data.program_id)
        .select();

      if (error) {
        console.error(error);

        throw error;
      } else {
        console.log(programData, "program data updated");
      }
    }
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const handlePostProgramRevenueData = async (
  data: ProgramOfflineRevenueDatabaseType[],
  programId: number
) => {
  const supabase = supabaseClient();

  try {
    console.log("data to add to  program_offline_revenue data:", data);

    // Step 1: Retrieve existing revenue entries of the program from the database
    const { data: existingRevenueResponse } = await supabase
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
      const { data: deletedData, error: deletedError } = await supabase
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
        await supabase
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

/**
 * Handles the submission of the Course Accounting Form (CAF).
 * This function updates the course accounting status of a program and inserts a new program accounting activity record.
 * @param data - The data of the Course Accounting Form.
 * @param courseAccountingPendingReviewtatusId - The status ID representing the pending review state of the CAF.
 * @param loggedInUserId - The ID of the logged-in user.
 */
export const handleSubmitCAF = async (
  data: CourseAccountingFormFieldTypes,
  courseAccountingPendingReviewtatusId: number,
  loggedInUserId: number
) => {
  const supabase = supabaseClient();

  data.program_id = 11;
  try {
    // Update the course accounting status of the program
    const { data: programData, error: programError } = await supabase
      .from("program")
      .update({
        program_accounting_status_id: courseAccountingPendingReviewtatusId,
      })
      .eq("id", data.program_id);

    if (programError) {
      console.error("Error while updating status id of CAF:", programError);
      throw programError;
    } else {
      console.log("Status id of CAF updated successfully:", programData);
    }

    // Insert a new program accounting activity record
    const {
      data: programAccountingActivityData,
      error: programAccountingActivityError,
    } = await supabase.from("program_accounting_activity").insert({
      program_id: data.program_id,
      caf_status_id: courseAccountingPendingReviewtatusId,
      user_id: loggedInUserId,
    });

    if (programAccountingActivityError) {
      console.error(
        "Error while updating status id of CAF:",
        programAccountingActivityError
      );

      throw programAccountingActivityError;
    } else {
      console.log(
        "Status id of CAF updated successfully:",
        programAccountingActivityData
      );
    }
  } catch (error) {
    console.error("Error while posting CAF data:", error);
    throw error;
  }
};
