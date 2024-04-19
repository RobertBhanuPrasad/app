import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/ui/button";

function SubmitCourseAccountingFormTab() {
  const router = useRouter();

  /**
   * Function to handle click of continue button
   * We have to navigate to the close participants section out of 3 sections
   * other sections also we have  1. close_Registration section 2. revenue_section 3. expense_section
   */
  const handleClickContinue = () => {
    router.push(
      `${router.asPath}/course-accounting-form?current_section=close_participants`
    );
  };

  return (
    <div>
      {/* //TODO: We have to keep rule sction code here */}
      <div>rulesSection</div>

      <Button
        className="bg-[#7677F4] text-[white]"
        onClick={handleClickContinue}
      >
        Continue
      </Button>
    </div>
  );
}

export default SubmitCourseAccountingFormTab;
