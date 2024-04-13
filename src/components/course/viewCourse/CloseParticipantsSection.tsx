import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "src/ui/button";

function CloseParticipantsSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, back } = useRouter();
  function setParamValue(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("current_section", term);
    }
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
        onClick={() => {
          setParamValue("revenue");
        }}
      >
        Next
      </Button>
    </div>
  );
}

export default CloseParticipantsSection;
