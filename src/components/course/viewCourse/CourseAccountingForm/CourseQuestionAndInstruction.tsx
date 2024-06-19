import QuestionInstruction from '@public/assets/QuestionInstructionIcon'
import { useList, useOne } from '@refinedev/core'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MainHeader } from 'src/ui/TextTags'
import { Button } from 'src/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from 'src/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from "src/ui/sheet";
import CrossIcon from "@public/assets/CrossIcon";
// export const QuestionInstructionData = () => {

//   const router = useRouter()
  

//   const Id: number | undefined = router?.query?.id ? parseInt(router.query.id as string) : undefined

//   const { data: courseData } = useOne({
//     resource: 'program',
//     id: Id,
//     meta: {
//       select: 'organization_id'
//     }
//   })
//   const { data: questionInstructionData } = useList({
//     resource: 'course_accounting_config',
//     config: {
//       filters: [
//         {
//           field: 'organization_id',
//           operator: 'eq',
//           value: courseData?.data?.organization_id
//         }
//       ]
//     },
//     meta: {
//       select: 'caf_instructions_text'
//     }
//   })
  
  

//   return (
//     <div>
//       <MainHeader className="text-[24px] border-b" children="Questions & Instruction" />
//       <div className="pt-5">
//         <div dangerouslySetInnerHTML={{ __html: questionInstructionData?.data?.[0]?.caf_instructions_text }} />
//       </div>
//     </div>
//   )
// }

export const QuestionInstructionModal = () => {

  
  const { data: programData } = useOne({
    
    resource: "course_accounting_config",
    id:8,
    meta: { select: "*,caf_instructions_text" }
  });
  console.log("res:",programData)




  const [openQuestionDetails, setOpenQuestionDetails] = useState(false)
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <div>
      <Sheet>
        <SheetTrigger className="p-0">
          <div>
            <div onClick={() => setOpen(true)} className="cursor-pointer flex flex-row">
              <div className="pt-1 pr-2">
                <QuestionInstruction />
              </div>
              <div>Questions & Instruction</div>
            </div>
          </div>
        </SheetTrigger>
        {open && (
          <SheetContent className="w-[556px] rounded-l-xl">
            <div className="flex flex-col justify-start">
              <div className="font-semibold text-2xl pb-4 flex justify-between items-center">
                <span>Questions & Instruction</span>
                <div onClick={handleClose} className="cursor-pointer ">
                <CrossIcon  width={16} height={16} fill="#333333"  />

                </div>
                
              </div>
              <hr />
              <div dangerouslySetInnerHTML={{ __html: programData?.data?.caf_instructions_text }} />
            </div>
            <div className="flex justify-center p-4 left-0 items-center w-full absolute bottom-0">
              <Button
                className="bg-[#7677F4] rounded-[12px] text-[white]"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
