import Form from '@components/Formfield'
import CloseParticipantsSection from '@components/course/viewCourse/CloseParticipantsSection'
import ExpenseSection from '@components/course/viewCourse/ExpenseSection'
import RevenueSection from '@components/course/viewCourse/RevenueSection'
import Important from '@public/assets/Important'
import ParticipantsIcon from '@public/assets/ParticipantsIcon'
import { useList, useOne } from '@refinedev/core'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BackArrowIcon from 'src/ui/BackArrowIcon'
import CurrencyIcon from 'src/ui/CurrencyIcon'
import { HoverCard, HoverCardContent, HoverCardTrigger } from 'src/ui/hover-card'
import Line from 'src/ui/line'
import { formatDate } from 'src/utility/DateFunctions'
import { supabaseClient } from 'src/utility/supabaseClient'
import { ActionsDropDown } from '..'

// Define type for sectionComponents

function index() {
  const params = useSearchParams()
  const currentSection = params.get('current_section')
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
  const startDate = formatDate(courseData?.data?.program_schedules[0]?.start_time)

  const endDate = formatDate(
    courseData?.data?.program_schedules[courseData?.data?.program_schedules?.length - 1]?.end_time
  )


  const sections = [
    {
      sectionName: 'close_participants',
      component: <CloseParticipantsSection />
    },
    {
      sectionName: 'revenue',
      component: <RevenueSection />
    },
    {
      sectionName: 'expense',
      component: <ExpenseSection />
    }
  ]

  /**
   * WE have 3 sections right but we have to render only one section at a moment
   * For this we will use find method
   * We will find the component to render based on the current section
   * we will get current section form url params
   * We are storing the curren_section information in params when user click on buttons we are setting
   */
  const componentToRender = sections.find((item: any) => {
    return item.sectionName === currentSection
  })

  const onSubmit = (data: unknown) => {
    console.log('form data', data)
  }

  const { data: countryConfigData } = useList({
    resource: 'country_config'
  })
  const totalRevenue = participantData?.income
  const { replace } = useRouter()

  const headerSection = () => {
    return (
      <div className="flex flex-col  pl-5">
        <div className="flex flex-row item-center justify-between ">
          <div
            className="  text-[#7677F4] pt-3 cursor-pointer"
            onClick={() => {
              replace('/Courses/ViewCourse/2')
            }}
          >
            <BackArrowIcon />
          </div>

          <div className="text-[33px] font-semibold pl-5 ">
            {courseData?.data?.program_alias_name_id
              ? courseData?.data?.program_alias_name_id?.alias_name
              : courseData?.data?.program_type_id?.name}
          </div>
          <div>
            <ActionsDropDown courseData={courseData?.data} />
          </div>
        </div>
        <div className="flex flex-row gap-5 ">
          <p className=" pl-9  text-[#666666] text-[16px]">Course Accounting Form</p>
          <div className="  ">
            <Line />
          </div>
          <div className=" text-[#333333]">
            {startDate} to {endDate}
          </div>
          <div className="">
            <Line />
          </div>

          <div className="">
            <ParticipantsIcon />
          </div>
          <div
            onClick={() => {
              router.push('/')
            }}
            className="cursor-pointer "
          >
            {participantData?.participantCount}
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <div className=" pt-1">
                <Important />
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                {participantData?.participantCount} Participants with: Transaction status = Confirmed / Pending
                Attendance status = Confirmed / Pending / Dropout Total participants records:
                {participantData?.totalParticipantCount}
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="pt-1">
            <CurrencyIcon />
          </div>

          <div
            onClick={() => {
              router.push('/')
            }}
            className="cursor-pointer"
          >
            {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <div className="pt-1">
                <Important />
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Revenue from confirmed pending transaction participants revenue:
                {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section>
        {/* //TODO: here we have to keep header section code here */}
        {/* //TODO: The people we are doing header section US team is already done please dont do again ask them take code and use all only one componet */}
        {headerSection()}
      </section>

      <Form defaultValues={{}} onSubmit={onSubmit}>
        <section>{componentToRender?.component}</section>
      </Form>
    </div>
  )
}

export default index
