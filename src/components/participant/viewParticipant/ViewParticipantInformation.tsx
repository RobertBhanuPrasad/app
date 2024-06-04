import { isDisplayRegistrationCompletionLink } from '@components/courseBusinessLogic'
import CopyIcon from '@public/assets/CopyIcon'
import { useOne } from '@refinedev/core'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { CardLabel, CardValue } from 'src/ui/TextTags'
import { formatGlobalDate } from 'src/utility/DateFunctions'

function ViewParticipantInformation({ participantId }: any) {
  // State variable to track whether the registration link has been copied
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false)
  const { t } = useTranslation('course.participants')
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

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
    copyText(participantData?.data?.program_id?.registration_link)
    setCopiedRegistrationLink(true)

    setTimeout(() => {
      setCopiedRegistrationLink(false)
    }, 3000)
  }

  // Array containing participant information with keys and values
  const participantInfo = [
    { key: t('view_participant.participants_information.participants_name'), value: contactData?.full_name ?? '-' },
    { key: t('view_participant.participants_information.memo'), value: participantData?.data?.memo ?? '-' },
    { key: t('view_participant.participants_information.gender'), value: contactData?.gender ?? '-' },
    {
      key: t('view_participant.participants_information.date_of_birth'),
      value: formatGlobalDate(contactData?.date_of_birth) ?? '-'
    },
    { key: t('view_participant.participants_information.nif'), value: contactData?.nif ?? '-' },
    {
      key: t('view_participant.participants_information.address'),
      value: contactData
        ? contactData?.city_id?.name ??
          '' + ' ' + contactData?.state_id?.name ??
          '' + ' ' + contactData?.country_id?.name ??
          '' + ' ' + contactData?.postal_code ??
          ''
        : '-'
    },
    {
      key: t('view_participant.participants_information.phone_number'),
      value:
        contactData?.mobile_country_code && contactData?.mobile
          ? contactData?.mobile_country_code + ' ' + contactData?.mobile
          : '-'
    },
    { key: t('view_participant.participants_information.home_work_phone'), value: contactData?.work_phone ?? '-' },
    { key: t('view_participant.participants_information.occupation'), value: contactData?.occupation ?? '-' },
    { key: t('view_participant.participants_information.email'), value: contactData?.email ?? '-' },
    {
      key: t('view_participant.participants_information.how_did_you_find_out_about'),
      value: participantData?.data?.how_did_you_find_the_course ?? 'NA'
    }
  ]

  /**
   * Defines the index where the registration link object will be inserted into the participant info array.
   * This index indicates where the registration link will be displayed.
   */
  const registrationLinkObjectIndex = 10

  /**
   * Defines the object representing the registration link.
   * This object contains the URL for registration completion, along with copy functionality.
   * registration link is shown only when manual registration and payment status is failed or pending
   */
  const registrationLinkObject = {
    key: t('view_participant.participants_information.url_for_registration_completion'),
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
         /* then we have to show copied text for 3 sec in the place of icon 
         /* after 3 sec again we have to show copy icon.
        */}
          {!copiedRegistrationLink ? (
            <CopyIcon />
          ) : (
            <p className="text-[#7677F4] -left-12 bottom-8 rounded-md px-5 shadow-md sm:-left-8 sm:bottom-12">Copied</p>
          )}
        </div>
      </div>
    ) : (
      '-'
    )
  }

  // Check if the registration completion link should be displayed
  if (
    isDisplayRegistrationCompletionLink(
      participantData?.data?.is_manual_registration,
      participantData?.data?.payment_status_id
    )
  ) {
    // Insert the registration link object into the participant info array
    participantInfo.splice(registrationLinkObjectIndex, 0, registrationLinkObject)
  } else {
    //If the registration is completed and the payment status is completed.
    participantInfo.splice(registrationLinkObjectIndex, 0, {
      key: t('view_participant.participants_information.url_for_registration_completion'),
      value: 'Completed'
    })
  }

  // Render component content based on loading state
  return !isLoading ? (
    <div className="w-[303px] bg-[white] border border-[#D9D9D9] rounded-[15px] shadow-lg flex justify-center items-center py-[20px]">
      <div className="w-[263px]">
        <p className="font-[600] text-[18px] font-sans">
          {t('view_participant.participants_information.participants_information')}
        </p>
        {participantInfo?.map((info, index) => (
          <div key={index} className="mt-[23px]">
            <CardLabel>{info?.key}</CardLabel>
            <CardValue className="text-sm">{info?.value}</CardValue>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <section className="flex justify-center align-center p-[15%]">
      <div className="loader"></div>
    </section> // Display loading indicator if data is being fetched
  )
}

export default ViewParticipantInformation
