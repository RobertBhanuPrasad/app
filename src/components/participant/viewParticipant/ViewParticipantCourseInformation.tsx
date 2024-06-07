import { useOne } from '@refinedev/core'
import { translatedText } from 'src/common/translations'
import { CardLabel, CardValue } from 'src/ui/TextTags'
import { useTranslation } from 'next-i18next';


// Component for viewing participant course information
function ViewParticipantCourseInformation({ participantId }: any) {
  
  // Query for fetching participant registration data
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select:
        '*,contact_id!inner(*,gender_id(value),city_id(name),country_id(name),state_id(name)),program_id!inner(*,program_alias_name_id(*),program_type_id(id,name),program_teachers!inner(*,user_id(*,contact_id(full_name)))),participant_attendence_status_id(*))' // Selecting specific fields
    }
    
  }
  const {t} = useTranslation(["common", "course.participants", "new_strings"])
  // Fetching participant course data
  const { data: participantCourseData, isLoading, isError } = useOne(query)

  // Extracting teacher full names
  const teacherFullNames = participantCourseData?.data?.program_id?.program_teachers
    ?.map((teacher: { user_id: { contact_id: { full_name: any } } }) => teacher.user_id.contact_id.full_name)
    .join(', ')

  // Participant course information
  const coursePaticipantInformation = [
    { key: t('course_type'), value: translatedText(participantCourseData?.data?.program_id?.program_type_id?.name) },
    {
      key: t('new_strings:course_name'),
      value: participantCourseData?.data?.program_id?.program_alias_name_id?.alias_name
        ? translatedText(participantCourseData?.data?.program_id?.program_alias_name_id?.alias_name)
        : '-'
    },
    { key: t('course.participants:view_participant.course_information_tab.Teachers(S)'), value: teacherFullNames },
    { key: t('course.participants:view_participant.course_information_tab.attendance_status'), value: participantCourseData?.data?.participant_attendence_status_id?.value },
    { key: t('course.participants:view_participant.course_information_tab.discount_amount'), value: participantCourseData?.data?.discounted_amount }
  ]

  return (
    <div>
     <div className="grid grid-cols-3 gap-4 mt-[20px]">
        {/* Rendering course information */}
        {coursePaticipantInformation.map((info, index) => (
          <div key={index}>
            <CardLabel>{info?.key}</CardLabel>
            <CardValue className="text-sm">{info?.value}</CardValue>
          </div>
        ))}
      </div>
      <div className='pt-[10px] border-b-2'></div>
    </div>
  )
}

export default ViewParticipantCourseInformation
