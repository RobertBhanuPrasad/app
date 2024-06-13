import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/ui/button";
import Success from "@public/assets/RulesSuccess";
import Fail from "@public/assets/RulesFail";

function SubmitCourseAccountingFormTab() {
  const router = useRouter();

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  /**
   * Function to handle click of continue button
   * We have to navigate to the close participants section out of 3 sections
   * other sections also we have  1. close_Registration section 2. revenue_section 3. expense_section
   */
  const handleClickContinue = () => {
    router.push(
      `/courses/${Id}/course-accounting-form?current_section=close_participants`
    );
  };

  // invoke course-accounting-rules edge function to fetch all rules for the given program along with their status, i.e. if
  // the rules are passed or not

  const rulesObj = [
    {"rule": "All registrations and payments have been completely entered into the system. In order to register any additional participants, process their payments, or to change their payment method, please go to the view course participants page.", "isFail": false},
    {"rule": "There are no participants whose transaction status is \"pending\".", "isFail": true},
    {"rule": "There are no participants whose attendance status is \"pending\".", "isFail": true},
    {"rule": "There are no participants whose program agreement status is \"pending\".", "isFail": true},
    {"rule": "There are no participants whose health declaration is \"pending\".", "isFail": true},
    {"rule": "There are no pending transfer requests.", "isFail": false},
    {"rule": "There are no pending refund requests.", "isFail": false},
    {"rule": "There are no participants whose outstanding balance is greater than zero.", "isFail": false},
  ]
  
  return (
    <div>
      {/* //TODO: We have to keep rule section code here */}
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold leading-6 text-left">
          In order to submit the course accounting form, all course participant registrations must be closed for this course, for which the following conditions must be met:
        </div>
        {rulesObj.map((rule) => {
            return (
              <div className="flex items-center gap-2">
                {rule.isFail ? <Fail /> : <Success />}
                <div className="text-sm font-normal leading-6 text-left">
                  {rule.rule}
                </div>
              </div>
            );
          }
        )}
      </div>
      <br />
      <Button className="bg-[#7677F4] text-white" onClick={handleClickContinue}>
        Continue
      </Button>
    </div>
  );
}

export default SubmitCourseAccountingFormTab;
