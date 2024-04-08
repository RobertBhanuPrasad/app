import { useOne } from '@refinedev/core'

function ViewParticipantInformation() {
  const textStyle = 'font-sans text-[14px]' // Common text style for both key and value
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]` // Style for keys
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]` // Style for values

  const selectQuery: any = {
    resource: 'participant_registration',
    id: 1, //TODO:Replace with selected participant ID
    optionLabel: 'name',
    optionValue: 'id',
    meta: {
      select:
        '*,contact_id!inner(*,gender_id(value),city_id(name),country_id(name),state_id(name)),hear_program_from_id(*)'
    }
  }

  const { data: participantData, isLoading, isError } = useOne(selectQuery)
  const contactData = participantData?.data?.contact_id
  const participantInfo = [
    { key: 'Participants Name', value: participantData?.data?.contact_id?.full_name ?? '-' },
    { key: 'Memo', value: 'Lorem ipsum dolor sit amet consectetur. Enim ultrices tristique' },
    { key: 'Gender', value: participantData?.data?.contact_id?.gender_id?.value ?? '-' },
    { key: 'Date Of Birth', value: participantData?.data?.contact_id?.date_of_birth?.substring(0, 10) ?? '-' },
    { key: 'NIF', value: '12345678' },
    {
      key: 'Address',
      value:
        contactData?.city_id?.name +
          ' ' +
          contactData?.state_id?.name +
          ' ' +
          contactData?.country_id?.name +
          ' ' +
          contactData?.postal_code ?? '-'
    },
    { key: 'Phone Number', value: contactData?.mobile_country_code + ' ' + contactData?.mobile ?? '-' },
    { key: 'Home/Work Phone', value: '' },
    { key: 'Occupation', value: 'Manager' },
    { key: 'Email', value: contactData?.email ?? '-' },
    { key: 'Url for registration completion', value: 'https://artofliving.zoom.u..' },
    {
      key: 'How did you find out about the program?',
      value: participantData?.data?.hear_program_from_id?.value ?? 'NA'
    }
  ]

  console.log('queryResult', participantData?.data)

  return (
    <div className="w-[303px] bg-[white] border border-[#D9D9D9] rounded-[15px] shadow-lg flex justify-center items-center">
      <div className="w-[263px]">
        <p className="font-[600] text-[18px] font-sans">Participants Information</p>
        {participantInfo?.map((info, index) => (
          <div key={index} className="mt-[23px]">
            <p className={keyTextStyle}>{info?.key}</p>
            <p className={valueTextStyle}>{info?.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewParticipantInformation
