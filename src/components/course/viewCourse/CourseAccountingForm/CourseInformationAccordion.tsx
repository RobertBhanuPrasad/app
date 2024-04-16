import { useOne } from '@refinedev/core'
import { useRouter } from 'next/router'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { formatDate } from 'src/utility/DateFunctions'

const CourseDetails = () => {
  const router = useRouter()
  const Id: number | undefined = router?.query?.id ? parseInt(router.query.id as string) : undefined

  const { data: courseData } = useOne({
    resource: 'program',
    id: Id,
    meta: {
      select:
        '*,created_by_user_id(contact_id(full_name)),program_type_id(name,is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules!inner(*)'
    }
  })
  const startDate = formatDate(courseData?.data?.program_schedules[0]?.start_time)

  const endDate = formatDate(
    courseData?.data?.program_schedules[courseData?.data?.program_schedules?.length - 1]?.end_time
  )
  console.log(courseData, 'courseData')
  return (
    <div>
      <div className="grid grid-cols-4 gap-9">
        <div>
          <div className="text-[#999999] text-[14px]">Course ID</div>
          <div className="text-[#666666] text-[16px]">{courseData?.data?.program_code}</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Course Type</div>
          <div className="text-[#666666] text-[16px]">{courseData?.data?.program_type_id?.name}</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Course Dates</div>
          <div className="text-[#666666] text-[16px]">
            {startDate} to {endDate}
          </div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Teacher(s)</div>
          <div className="text-[#666666] text-[16px]">Test D7.5</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Teacher Address</div>
          <div className="text-[#666666] text-[16px]">No.58, 6th cross, 8th main Bangalore KA India 657467</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Course Status</div>
          <div className="text-[#666666] text-[16px]">{courseData?.data?.status_id?.value}</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Course Accounting Status</div>
          <div className="text-[#666666] text-[16px]">Not Submitted</div>
        </div>

        <div>
          <div className="text-[#999999] text-[14px]">Announced By</div>
          <div className="text-[#666666] text-[16px]">National Admin Test Venue</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Course Venue</div>
          <div className="text-[#666666] text-[16px]">{courseData?.data?.venue_id?.address}</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Center</div>
          <div className="text-[#666666] text-[16px]">{courseData?.data?.venue_id?.center_id?.name}</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Contact Details</div>
          <div className="text-[#666666] text-[16px]">Automation Tester | User_79251_55428@yopmail.com |9956744783</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Course Revenue</div>
          <div className="text-[#666666] text-[16px]">EUR 600.00</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-11 pt-7">
        <div>
          <div className="text-[#999999] text-[14px]">Course Expenses</div>
          <div className="text-[#666666] text-[16px]">EUR 60.00</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px]">Net Revenue</div>
          <div className="text-[#666666] text-[16px]">EUR 540.00</div>
        </div>
      </div>
    </div>
  )
}

export const CourseInformationAccordion = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="information" className="border rounded-[10px]">
        <AccordionTrigger className="text-base pr-3">
          <div className="ml-4 text-[#333333] text-[18px] font-semibold">
            <div>Course Information</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="ml-4">{CourseDetails()}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
