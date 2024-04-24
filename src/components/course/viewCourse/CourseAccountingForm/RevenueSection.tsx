import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MainHeader } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { CourseInformationAccordion } from "./CourseInformationAccordion";
import { QuestionInstructionModal } from "./CourseQuestionAndInstruction";

function RevenueSection() {
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
      {" "}
      <div className="m-8 text-[#333333] text-[23px] font-semibold	">
        <div className="flex flex-row justify-between">
          <p>Revenue</p>
          <div className="text-[#7677F4] text-[16px] flex flex-row ">
            <QuestionInstructionModal />
          </div>
        </div>
        <div className="pt-5">
          <CourseInformationAccordion />
        </div>
        <MainHeader
          className="pt-5 text-[18px]"
          children="Deposit of Offline Revenue"
        />

        <div className="flex self-end justify-center gap-2 pt-10 pb-7">
          <Button
            className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
            onClick={() => {
              setParamValue("close_participants");
            }}
          >
            Previous
          </Button>
          <Button
            className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
            onClick={() => {
              setParamValue("expense");
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RevenueSection;
