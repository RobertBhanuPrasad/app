import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "src/ui/button";

function CloseParticipantsSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { replace } = useRouter();

  /**
   * When user click on next button we have to change the close_registration section to revenue section
   * For that we are updating current_section params
   */
  function handleNextClick() {
    const params = new URLSearchParams(searchParams);

    params.set("current_section", "revenue");

    // we have to use this replace method 
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      CloseParticipantsSection
      <Button
        className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
        onClick={() => {
          replace("/Courses/ViewCourse/2");
        }}
      >
        Previous
      </Button>
      <Button
        className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
        onClick={handleNextClick}
      >
        Next
      </Button>
    </div>
  );
}

export default CloseParticipantsSection;
