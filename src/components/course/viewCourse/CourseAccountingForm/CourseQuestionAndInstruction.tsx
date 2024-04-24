import QuestionInstruction from "@public/assets/QuestionInstructionIcon";
import { useList, useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { MainHeader } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "src/ui/dialog";

export const QuestionInstructionData = () => {
  const router = useRouter();

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select: "organization_id",
    },
  });
  const { data: questionInstructionData } = useList({
    resource: "course_accounting_config",
    config: {
      filters: [
        {
          field: "organization_id",
          operator: "eq",
          value: courseData?.data?.organization_id,
        },
      ],
    },
    meta: {
      select: "caf_instructions_text",
    },
  });

  return (
    <div>
      <MainHeader
        className="text-[24px] border-b"
        children="Questions & Instruction"
      />
      <div className="pt-5">
        <div
          dangerouslySetInnerHTML={{
            __html: questionInstructionData?.data?.[0]?.caf_instructions_text,
          }}
        />
      </div>
    </div>
  );
};

export const QuestionInstructionModal = () => {
  const [openQuestionDetails, setOpenQuestionDetails] = useState(false);

  return (
    <div className="pt-1 pr-2">
      <Dialog open={openQuestionDetails}>
        <DialogTrigger asChild>
          <div>
            <div
              onClick={() => setOpenQuestionDetails(true)}
              className="cursor-pointer flex flex-row"
            >
              <div className="pt-1 pr-2">
                <QuestionInstruction />
              </div>
              <div>Questions & Instruction</div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[556px] h-[668px] overflow-auto">
          <QuestionInstructionData />
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
            <Button
              onClick={() => setOpenQuestionDetails(false)}
              className="w-[100px] border border-[#7677F4] bg-[#7677F4] text-[white] text-[16px] font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
