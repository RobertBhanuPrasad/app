import { useOne } from '@refinedev/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CardLabel, MainHeader } from 'src/ui/TextTags'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { formatDate } from 'src/utility/DateFunctions'
import { supabaseClient } from 'src/utility/supabaseClient'

/**
 * CourseDetails component fetches and displays detailed information about a course.
 * It fetches course data and participant summary data from the server,
 * calculates revenue, and renders the information in a structured format.
 * 
 * @returns {JSX.Element} Detailed information about the course including ID, type, dates, teacher(s), status, venue, etc.
 */
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

  // for fetcing the program table data we are calling API call here
  const { data: courseData } = useOne({
    resource: 'program',
    id: Id,
    meta: {
      select:
        '*,created_by_user_id(contact_id(full_name)),program_type_id(name,is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules(*),program_teachers(*,user_id(contact_id(*))),program_accounting_status_id(id,value),program_contact_details(*)'
    }
  })

  // Define state for holding participant data
  const [participantData, setParticipantData] = useState<any>()

  // Function to fetch participant data from server
  const fetchData = async () => {
    try {
      // Invoke serverless function to get participant summary data
      const { data, error } = await supabaseClient.functions.invoke('get_program_participant_summary', {
        method: 'POST',
        body: {
          program_id: Id
        }
      })
      // Set fetched participant data to state
      setParticipantData(data)
    } catch (error) {
      // Handle any errors that occur during fetching data
      console.error('Error fetching fee data:', error)
    }
  }

  // Fetch participant data when component mounts
  useEffect(() => {
    fetchData()
  }, [])

  // Get total revenue from participant data
  const totalRevenue = participantData?.income

  // here startDate and endDate will show when the course startdate and end date
  // ACTULLY we are getting start date from backend  2024-04-20T00:00:00+00:00 like this
  // by using formatedate function we are converting to 20th Apr 2:56 pm we will be getting months hours etc
  const startDate = formatDate(courseData?.data?.program_schedules[0]?.start_time)
  const endDate = formatDate(
    courseData?.data?.program_schedules[courseData?.data?.program_schedules?.length - 1]?.end_time
  )

  // it is program  Teacher address where we are maping and getting the contact of the teacher
  // to show the address of the teacher we are using this
  const programTeachersAddress = courseData?.data?.program_teachers?.map((item: fullNameObject) => {
    return item?.user_id?.contact_id
  })

  //from programTeachersAddress we are getting the teacher contact id
  // from this id we are calling contact table and feting country, state, city names to show them in accordian
  const { data: teacherPlace } = useOne({
    resource: 'contact',
    id: programTeachersAddress?.[0]?.id,
    meta: { select: 'city_id(name),state_id(name,id),country_id(name,id)' }
  })

  return (
    <div>
      <div className="grid grid-cols-4 gap-9">
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course ID" />
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.program_code}
          >
            {courseData?.data?.program_code ? courseData?.data?.program_code : '-'}
          </abbr>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course Type" />
          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.program_type_id?.name}
          >
            {courseData?.data?.program_type_id?.name ? courseData?.data?.program_type_id?.name : '-'}
          </abbr>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course Dates" />
          <div className="text-[#666666] text-[16px]">
            {startDate} to {endDate}
          </div>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Teacher(s)" />

          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={programTeachersAddress?.[0]?.full_name}
          >
            {programTeachersAddress?.[0]?.full_name ? programTeachersAddress?.[0]?.full_name : '-'}
          </abbr>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Teacher Address" />

          <div className="text-[#666666] text-[16px]">
            {programTeachersAddress?.[0]?.street_address}, {teacherPlace?.data?.city_id?.name},{' '}
            {teacherPlace?.data?.state_id?.name},{teacherPlace?.data?.country_id?.name}{' '}
            {programTeachersAddress?.[0]?.postal_code}
          </div>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course Status" />

          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.status_id?.value}
          >
            {courseData?.data?.status_id?.value ? courseData?.data?.status_id?.value : '-'}
          </abbr>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course Accounting Status" />

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
          <CardLabel className=" text-[14px] font-normal" children="Announced By" />

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
          <CardLabel className=" text-[14px] font-normal" children="Course Venue" />

          <div className="text-[#666666] text-[16px]">
            {courseData?.data?.venue_id?.address}, {courseData?.data?.venue_id?.postal_code},{' '}
            {courseData?.data?.venue_id?.state_id?.name}, {courseData?.data?.venue_id?.city_id?.name}
          </div>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Center" />

          <abbr
            className=" no-underline  truncate block text-[16px] text-[#666666]"
            title={courseData?.data?.venue_id?.center_id?.name}
          >
            {courseData?.data?.venue_id?.center_id?.name ? courseData?.data?.venue_id?.center_id?.name : '-'}
          </abbr>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Contact Details" />

          <div className="text-[#666666] text-[16px]">
            {' '}
            {courseData?.data?.program_contact_details?.[0]?.contact_name} |{' '}
            {courseData?.data?.program_contact_details?.[0]?.contact_email} |{' '}
            {courseData?.data?.program_contact_details?.[0]?.contact_number}
          </div>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course Revenue" />

          <div className="text-[#666666] text-[16px]">{totalRevenue}</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-11 pt-7">
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Course Expenses" />
          {/* Todo need to update the total Course Expense when we enter into expense tab */}
          <div className="text-[#666666] text-[16px]">EUR 60.00</div>
        </div>
        <div>
          <CardLabel className=" text-[14px] font-normal" children="Net Revenue" />
          {/* Todo need to update Net Revenue when we enter into expense tab totalRevenue - total Course Expense */}
          <div className="text-[#666666] text-[16px]">EUR 540.00</div>
        </div>
      </div>
    </div>
  )
}

/**
 * CourseInformationAccordion component renders an accordion UI element 
 * to display course information.
 * 
 * @returns {JSX.Element} Accordion UI component for displaying course information.
 */

export const CourseInformationAccordion = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="information" className="border rounded-[10px] ">
        <AccordionTrigger className="text-base border-b pr-4">
          <MainHeader className="ml-4 text-[18px]" children="Course Information" />
        </AccordionTrigger>
        <AccordionContent className="ml-4 pt-4">{CourseDetails()}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
