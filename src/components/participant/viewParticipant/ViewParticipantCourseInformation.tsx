import { useOne, useSelect } from '@refinedev/core'

function ViewParticipantCourseInformation() {
  const textStyle = 'font-sans text-[14px]' // Common text style for both key and value
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]` // Style for keys
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]` // Style for values

  const selectQuery: any = {
    resource: 'participant_registration',
    id: 4, //TODO:Replace with selected participant ID
    optionLabel: 'name',
    optionValue: 'id',
    meta: {
      select:
        '*,contact_id!inner(*,gender_id(value),city_id(name),country_id(name),state_id(name)),program_id!inner(*,program_alias_name_id(*),program_type_id(id,name)),participant_attendence_status_id(*)'
    }
  }

  const { data: participantCourseData, isLoading, isError } = useOne(selectQuery)

  const { queryResult } = useSelect({
    resource: 'program_teachers',
    meta:{
      select:'*,user_id(*,contact_id(full_name))'
    },
    filters: [
      {
        field: 'program_id',
        operator: 'eq',
        value: 1
      }
    ]
  })

  const coursePaticipantInformation = [
    { key: 'Course Type', value: participantCourseData?.data?.program_id?.program_type_id?.name },
    { key: 'CourseName', value: 'Happiness Program' },
    { key: 'Teachers', value: 'Test Teachers' },
    { key: 'Attendance Status', value: participantCourseData?.data?.participant_attendence_status_id?.value },
    { key: 'Discount Amount', value: participantCourseData?.data?.discounted_amount }
  ]
  return (
    <div>
      <p className="text-[#7677F4] text-[18px] font-[600]">Course Information </p>
      <div className="grid grid-cols-3 gap-4 mt-[20px]">
        {coursePaticipantInformation.map((info, index) => (
          <div key={index}>
            <p className={keyTextStyle}>{info?.key}</p>
            <p className={valueTextStyle}>{info?.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewParticipantCourseInformation
