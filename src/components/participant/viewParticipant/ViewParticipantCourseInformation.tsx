import { useOne, useSelect } from '@refinedev/core'
import { CardLabel, CardValue } from 'src/ui/TextTags';

// Component for viewing participant course information
function ViewParticipantCourseInformation({participantId}: any) {
  console.log(participantId,"participantId");
  
  // Common text styles
  const textStyle = 'font-sans text-[14px]'
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]`
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]`

  // Query for fetching participant registration data
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select:
        '*,contact_id!inner(*,gender_id(value),city_id(name),country_id(name),state_id(name)),program_id!inner(*,program_alias_name_id(*),program_type_id(id,name)),participant_attendence_status_id(*))' // Selecting specific fields
    }
  }

  // Fetching participant course data
  const { data: participantCourseData, isLoading, isError } = useOne(query)

  console.log('participantCourseData', participantCourseData)

  // Query for fetching program teachers
  const { queryResult } = useSelect({
    resource: 'program_teachers',
    meta: {
      select: '*,user_id(*,contact_id(full_name))' // Selecting specific fields
    },
    filters: [
      {
        field: 'program_id',
        operator: 'eq',
        value: 1 // Program ID (TODO: Replace with actual program ID)
      }
    ]
  })

  // Extracting teacher full names
  const teacherFullNames = queryResult?.data?.data?.map(teacher => teacher.user_id.contact_id.full_name).join(', ')

  // Participant course information
  const coursePaticipantInformation = [
    { key: 'Course Type', value: participantCourseData?.data?.program_id?.program_type_id?.name },
    {
      key: 'CourseName',
      value: participantCourseData?.data?.program_id?.program_alias_name_id?.alias_name
        ? participantCourseData?.data?.program_id?.program_alias_name_id?.alias_name
        : participantCourseData?.data?.program_id?.program_type_id?.name
    },
    { key: 'Teachers', value: teacherFullNames },
    { key: 'Attendance Status', value: participantCourseData?.data?.participant_attendence_status_id?.value },
    { key: 'Discount Amount', value: participantCourseData?.data?.discounted_amount }
  ]

  return (
    <div>
      <p className="text-[#7677F4] text-[18px] font-[600]">Course Information </p>
      <div className="grid grid-cols-3 gap-4 mt-[20px]">
        {/* Rendering course information */}
        {coursePaticipantInformation.map((info, index) => (
          <div key={index}>
            <CardLabel>{info?.key}</CardLabel>
            <CardValue className='text-sm'>{info?.value}</CardValue>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewParticipantCourseInformation
