import CopyIcon from '@public/assets/CopyIcon'
import LoadingIcon from '@public/assets/LoadingIcon'
import { useOne } from '@refinedev/core'
import { useState } from 'react'
import { CardLabel, CardValue } from 'src/ui/TextTags'
import { handleCopyRegistrationLink } from 'src/utility/CopyText'
import { formatGlobalDate } from 'src/utility/DateFunctions'

function ViewParticipantInformation({ participantId }: any) {
  // State variable to track whether the registration link has been copied
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false)

  // Query object for fetching participant data
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select:
        '*,contact_id(*,gender_id(value),city_id(name),country_id(name),state_id(name)),program_id(id,registration_link)'
    }
  }

  // Fetching participant data using useOne hook
  const { data: participantData, isLoading, isError } = useOne(query)
  
  // Extracting contact data from participantData
  const contactData = participantData?.data?.contact_id

  // Array containing participant information with keys and values
  const participantInfo = [
    { key: 'Participants Name', value: contactData?.full_name ?? '-' },
    { key: 'Memo', value: participantData?.data?.memo ?? '-' },
    { key: 'Gender', value: contactData?.gender_id?.value ?? '-' },
    { key: 'Date Of Birth', value: formatGlobalDate(contactData?.date_of_birth) ?? '-' },
    { key: 'NIF', value: contactData?.nif ?? '-' },
    {
      key: 'Address',
      value: contactData
        ? contactData?.city_id?.name ??
          '' + ' ' + contactData?.state_id?.name ??
          '' + ' ' + contactData?.country_id?.name ??
          '' + ' ' + contactData?.postal_code ??
          ''
        : '-'
    },
    { key: 'Phone Number', value: contactData?.mobile_country_code + ' ' + contactData?.mobile ?? '-' },
    { key: 'Home/Work Phone', value: contactData?.work_phone ?? '-' },
    { key: 'Occupation', value: contactData?.occupation ?? '-' },
    { key: 'Email', value: contactData?.email ?? '-' },
    {
      key: 'Url for registration completion',
      value: (
        <div className="flex ">
          <div className="text-[14px] font-semibold text-[#7677F4] underline pr-[10px] truncate">
            {participantData?.data?.program_id?.registration_link}
          </div>
          <div
            onClick={() => {
              handleCopyRegistrationLink(
                setCopiedRegistrationLink,
                participantData?.data?.program_id?.registration_link
              )
            }}
            className="relative mt-1 cursor-pointer"
          >
            <CopyIcon />
            {copiedRegistrationLink ? (
              <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                copied
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      )
    },
    {
      key: 'How did you find out about the program?',
      value: participantData?.data?.hear_program_from_id?.value ?? 'NA'
    }
  ]

  // Render component content based on loading state
  return !isLoading ? (
    <div className="w-[303px] bg-[white] border border-[#D9D9D9] rounded-[15px] shadow-lg flex justify-center items-center">
      <div className="w-[263px]">
        <p className="font-[600] text-[18px] font-sans">Participants Information</p>
        {participantInfo?.map((info, index) => (
          <div key={index} className="mt-[23px]">
            <CardLabel>{info?.key}</CardLabel>
            <CardValue className="text-sm">{info?.value}</CardValue>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <LoadingIcon />
    </div> // Display loading indicator if data is being fetched
  )
}

export default ViewParticipantInformation
