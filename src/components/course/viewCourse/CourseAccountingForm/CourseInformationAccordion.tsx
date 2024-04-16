import { useOne } from '@refinedev/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { formatDate } from 'src/utility/DateFunctions'
import { supabaseClient } from 'src/utility/supabaseClient'

const CourseDetails = () => {
  interface fullNameObject {
    user_id?: {
      contact_id?: {
        full_name?: string
      }
    }
  }
  const router = useRouter()
  const Id: number | undefined = router?.query?.id ? parseInt(router.query.id as string) : undefined

  const { data: courseData } = useOne({
    resource: 'program',
    id: Id,
    meta: {
      select:
        '*,created_by_user_id(contact_id(full_name)),program_type_id(name,is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules!inner(*),program_teachers(*,user_id(contact_id(*))),program_accounting_status_id(id,value),program_contact_details(*)'
    }
  })

  const [participantData, setParticipantData] = useState<any>()

  const fetchData = async () => {
    try {
      const { data, error } = await supabaseClient.functions.invoke('get_program_participant_summary', {
        method: 'POST',
        body: {
          program_id: Id
        }
      })
      setParticipantData(data)
    } catch (error) {
      console.error('Error fetching fee data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalRevenue = participantData?.income

  const startDate = formatDate(courseData?.data?.program_schedules[0]?.start_time)

  const endDate = formatDate(
    courseData?.data?.program_schedules[courseData?.data?.program_schedules?.length - 1]?.end_time
  )
  const programTeachersAddress = courseData?.data?.program_teachers?.map((item: fullNameObject) => {
    return item?.user_id?.contact_id
  })

  const { data: venueCountry } = useOne({
    resource: 'country',
    id: programTeachersAddress?.[0]?.country_id
  })

  const Teachercountry = venueCountry?.data?.name

  const { data: venueState } = useOne({
    resource: 'state',
    id: programTeachersAddress?.[0]?.state_id
  })

  const Teacherstate = venueState?.data?.name

  const { data: venueCity } = useOne({
    resource: 'city',
    id: programTeachersAddress?.[0]?.city_id
  })

  const Teachercity = venueCity?.data?.name


  return (
    <div>
      <div className="grid grid-cols-4 gap-9">
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course ID</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.program_code}
          >
            {courseData?.data?.program_code ? courseData?.data?.program_code : '-'}
          </abbr>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Type</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.program_type_id?.name}
          >
            {courseData?.data?.program_type_id?.name ? courseData?.data?.program_type_id?.name : '-'}
          </abbr>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Dates</div>
          <div className="text-[#666666] text-[16px]">
            {startDate} to {endDate}
          </div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Teacher(s)</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={programTeachersAddress?.[0]?.full_name}
          >
            {programTeachersAddress?.[0]?.full_name ? programTeachersAddress?.[0]?.full_name : '-'}
          </abbr>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Teacher Address</div>
          <div className="text-[#666666] text-[16px]">
            {programTeachersAddress?.[0]?.street_address}, {Teachercity}, {Teacherstate},{Teachercountry}{' '}
            {programTeachersAddress?.[0]?.postal_code}
          </div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Status</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.status_id?.value}
          >
            {courseData?.data?.status_id?.value ? courseData?.data?.status_id?.value : '-'}
          </abbr>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Accounting Status</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.program_accounting_status_id?.value}
          >
            {courseData?.data?.program_accounting_status_id?.value
              ? courseData?.data?.program_accounting_status_id?.value
              : '-'}
          </abbr>
        </div>

        <div>
          <div className="text-[#999999] text-[14px] font-normal">Announced By</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.created_by_user_id?.contact_id?.full_name}
          >
            {courseData?.data?.created_by_user_id?.contact_id?.full_name
              ? courseData?.data?.created_by_user_id?.contact_id?.full_name
              : '-'}
          </abbr>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Venue</div>
          <div className="text-[#666666] text-[16px]">
            {courseData?.data?.venue_id?.address}, {courseData?.data?.venue_id?.postal_code},{' '}
            {courseData?.data?.venue_id?.state_id?.name}, {courseData?.data?.venue_id?.city_id?.name}
          </div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Center</div>
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.venue_id?.center_id?.name}
          >
            {courseData?.data?.venue_id?.center_id?.name ? courseData?.data?.venue_id?.center_id?.name : '-'}
          </abbr>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Contact Details</div>
          <div className="text-[#666666] text-[16px]">
            {' '}
            {courseData?.data?.program_contact_details?.[0]?.contact_name} |{' '}
            {courseData?.data?.program_contact_details?.[0]?.contact_email} |{' '}
            {courseData?.data?.program_contact_details?.[0]?.contact_number}
          </div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Revenue</div>
          <div className="text-[#666666] text-[16px]">{totalRevenue}</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-11 pt-7">
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Course Expenses</div>
          <div className="text-[#666666] text-[16px]">EUR 60.00</div>
        </div>
        <div>
          <div className="text-[#999999] text-[14px] font-normal">Net Revenue</div>
          <div className="text-[#666666] text-[16px]">EUR 540.00</div>
        </div>
      </div>
    </div>
  )
}

export const CourseInformationAccordion = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="information" className="border rounded-[10px] ">
        <AccordionTrigger className="text-base border-b-2">
          <div className="ml-4 text-[#333333] text-[18px] font-semibold  ">
            <div>Course Information</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="ml-4 pt-4">{CourseDetails()}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
