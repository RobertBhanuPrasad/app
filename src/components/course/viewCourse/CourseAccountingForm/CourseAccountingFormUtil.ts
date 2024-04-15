export const handleSaveCourseAccountingFormData = async (
  data: CourseAccountingFormFieldTypes
) => {
  // Step 1: Handle Post program_revenue data
  await handlePostProgramRevenueData(data.program_revenue);

  // Step 2: Handle Post program_expenses data
  await handlePostProgramExpensesData(data.program_expenses);
};

export const handlePostProgramRevenueData = async (data: any) => {
  // TODO: Implement the logic to post data to program_revenue table after backend code is ready
  try {
    console.log("Posting program_revenue data:", data);
  } catch (error) {
    console.error("Error while posting program_revenue data:", error);
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
