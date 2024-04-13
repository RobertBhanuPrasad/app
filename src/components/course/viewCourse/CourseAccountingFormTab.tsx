import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/ui/button";

function CourseAccountingFormTab() {
  const router = useRouter();
  console.log(router.asPath, "router");

  return (
    <div>
      rulesSection
      <Button
        className="bg-[#7677F4] text-[white]"
        onClick={() => {
          router.push(
            `${router.asPath}/course-accounting-form?current_section=close_participants`
          );
        }}
      >
        Continue
      </Button>
    </div>
  );
}

export default CourseAccountingFormTab;
