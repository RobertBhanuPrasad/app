import QuestionIcon from '@public/assets/QuestionMark'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from 'src/ui/button'

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

  return (
    <div>
      <div className=" flex flex-row justify-between gap-10 m-20  ">
        <p className="text-[#333333] text-[23px] font-semibold">Revenue</p>
        <div className="flex flex-row gap-2 item-center ">
          <QuestionIcon />
          <p className="text-[#7677F4]">Questions & Instruction</p>
        </div>
      </div>

      <div className="flex self-end justify-center gap-3 pb-10 ">
        <Button
          className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4] "
          onClick={() => {
            setParamValue('close_participants')
          }}
        >
          Previous
        </Button>
        <Button
          className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white] pl-4"
          onClick={() => {
            setParamValue('expense')
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default RevenueSection
