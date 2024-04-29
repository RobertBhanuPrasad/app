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

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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

/**
 * Function to handle copying the registration link to the clipboard.
 * It first copies the registration link to the clipboard, then sets the state
 * to indicate that the link has been copied. After 3 seconds, it resets the
 * state to false.
 * 
 * @returns {void}
 */
  const handleCopyRegistrationLink = () => {
    copyText(participantData?.data?.program_id?.registration_link);
    setCopiedRegistrationLink(true);

    setTimeout(() => {
      setCopiedRegistrationLink(false);
    }, 3000);
  };

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
    {
      key: 'Phone Number',
      value:
        contactData?.mobile_country_code && contactData?.mobile
          ? contactData?.mobile_country_code + ' ' + contactData?.mobile
          : '-'
    },
    { key: 'Home/Work Phone', value: contactData?.work_phone ?? '-' },
    { key: 'Occupation', value: contactData?.occupation ?? '-' },
    { key: 'Email', value: contactData?.email ?? '-' },
    {
      key: 'Url for registration completion',
      value: participantData?.data?.program_id?.registration_link ? (
        <div className="flex ">
          <div className="text-[14px] font-semibold text-[#7677F4] underline pr-[10px] truncate">
            {participantData?.data?.program_id?.registration_link}
          </div>
          <div
            onClick={() => {
              handleCopyRegistrationLink()
            }}
            className="relative mt-1 cursor-pointer"
          >
            {/* here we have to show copy icon or copied text based on two conditions
             /* at first we have to show copy icon when user click on copy icon
             /* the we have to show copied text for 3 sec in the place of icon 
             /* after 3 sec again we have to show copy icon.
            */}
           {!copiedRegistrationLink ? <CopyIcon />  : <p className="text-[#7677F4] -left-12 bottom-8 rounded-md px-5 shadow-md sm:-left-8 sm:bottom-12">Copied</p>}
          </div>
        </div>
      ) : (
        '-'
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
