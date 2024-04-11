import CalenderIcon from '@public/assets/CalenderIcon'
import CurrencyIcon from '@public/assets/CurrencyIcon'
import Important from '@public/assets/Important'
import LocationIcon from '@public/assets/LocationIcon'
import ParticipantsIcon from '@public/assets/ParticipantsIcon'
import { useList, useOne } from '@refinedev/core'
import { useEffect, useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from 'src/ui/hover-card'
import { supabaseClient } from 'src/utility'
import { formatDate, formatDateString } from 'src/utility/DateFunctions'

function index() {
  const { data: courseData } = useOne({
    resource: 'program',
    id: 1,
    meta: {
      select:
        '*,created_by_user_id(contact_id(full_name)),program_type_id(name,is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules!inner(*)'
    }
  })

  console.log('courseData...', courseData)
  const [participantData, setParticipantData] = useState<any>()

  const fetchData = async () => {
    try {
      const { data, error } = await supabaseClient.functions.invoke('get_program_participant_summary', {
        method: 'POST',
        body: {
          program_id: 1
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

  const { data: countryConfigData } = useList({
    resource: 'country_config'
  })

  const countryName = 'India'

  return (
    <div className="flex flex-col mx-8">
      <div className="flex flex-row justify-between">
        <div className="text-[32px] font-semibold">
          {courseData?.data?.program_alias_name_id
            ? courseData?.data?.program_alias_name_id?.alias_name
            : courseData?.data?.program_type_id?.name}
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <CalenderIcon color="#7677F4" />
        {startDate} to {endDate}
        <div>
          <ParticipantsIcon />
        </div>
        <div
          // onClick={() => {
          //   router.push("/");
          // }}
          className="cursor-pointer"
        >
          {participantData?.participantCount}
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              {participantData?.participantCount} Participants with: Transaction status = Confirmed / Pending Attendance
              status = Confirmed / Pending / Dropout Total participants records:
              {participantData?.totalParticipantCount}
            </div>
          </HoverCardContent>
        </HoverCard>
        <div>
          <CurrencyIcon />
        </div>
        <div
          // onClick={() => {
          //   router.push("/");
          // }}
          className="cursor-pointer"
        >
          {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Revenue from confirmed pending transaction participants revenue:
              {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <LocationIcon />
        {courseData?.data?.venue_id?.address},{courseData?.data?.venue_id?.city_id?.name},
        {courseData?.data?.venue_id?.state_id?.name}, {countryName},{courseData?.data?.venue_id?.postal_code}
      </div>

      <div className="flex flex-row items-center gap-2 w-full justify-end">
        Announced by: {courseData?.data?.created_by_user_id?.contact_id?.full_name}
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Approved by: {courseData?.data?.approved_by_user_id?.contact_id?.full_name} ({' '}
              {formatDateString(new Date(courseData?.data?.program_approved_date))})<br></br>
              Last Modified by: National Admin(17 Mar, 2022)
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="w-full mt-6 sticky">
        <p> Here tab section will come</p>
      </div>
    </div>
  )
}
export default index
