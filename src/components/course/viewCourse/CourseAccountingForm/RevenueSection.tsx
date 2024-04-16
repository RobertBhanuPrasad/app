import QuestionInstruction from '@public/assets/QuestionInstructionIcon'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { Button } from 'src/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from 'src/ui/dialog'
import { CourseInformationAccordion } from './CourseInformationAccordion'

function RevenueSection() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, back } = useRouter()
  function setParamValue(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('current_section', term)
    }
    replace(`${pathname}?${params.toString()}`)
  }
  const [openQuestionDetails, setOpenQuestionDetails] = useState(false)
  const QuestionInstructionModal = () => {
    return (
      <div className="pt-1 pr-2">
        <Dialog open={openQuestionDetails}>
          <DialogTrigger asChild>
            <div>
              <div onClick={() => setOpenQuestionDetails(true)} className="cursor-pointer flex flex-row">
                <div className="pt-1 pr-2">
                  <QuestionInstruction />
                </div>
                <div>Questions & Instruction</div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="w-[556px] ">
            <div className="text-[#333333] text-[24px] font-semibold border-b"> Questions & Instruction</div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
              <Button
                onClick={() => setOpenQuestionDetails(false)}
                className="w-[100px] border border-[#7677F4] bg-[white] text-[#7677F4] font-semibold"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
  
  

  return (
    <div>
      {' '}
      <div className="m-8 text-[#333333] text-[23px] font-semibold	">
        <div className="flex flex-row justify-between">
          <p>Revenue</p>
          <div className="text-[#7677F4] text-[16px] flex flex-row ">{QuestionInstructionModal()}</div>
        </div>
        <div className="pt-5"><CourseInformationAccordion/></div>

        <div className="flex self-end justify-center gap-2 pt-10 pb-7">
          <Button
            className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
            onClick={() => {
              setParamValue('close_participants')
            }}
          >
            Previous
          </Button>
          <Button
            className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
            onClick={() => {
              setParamValue('expense')
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RevenueSection
