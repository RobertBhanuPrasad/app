import CopyIcon from '@public/assets/CopyIcon'
import { useOne } from '@refinedev/core'
import { useState } from 'react'

interface Contact {
  id: number
  nif: string | null
  email: string | null
  gender: string | null
  mobile: string | null
  city_id: number | null
  hx_pkey: number | null
  state_id: number | null
  full_name: string
  gender_id: number | null
  last_name: string
  country_id: number | null
  created_at: string
  first_name: string
  occupation: string | null
  work_phone: string | null
  postal_code: string | null
  contact_type: string | null
  date_of_birth: string | null
  street_address: string | null
  identification_num: string | null
  identification_type: string | null
  mobile_country_code: string | null
  identification_type_id: number | null
  preferred_to_receive_notifications: boolean | null
}

interface Program {
  id: number
  registration_link: string
}

interface CustomerDeviceDetails {
  source: string
  program_type: number
  delivery_status: string
  open_time_stamp: string
  delivery_time_stamp: string
}

interface EmailDeliveryLog {
  browser: string
  ip_address: string
  time_stamp: string
  transaction_id: string
  operating_system: string
}

interface UtmParameters {
  term: string
  medium: string
  source: string
  content: string
  campaign: string
  http_refer: string
  program_type_id: string
}

interface ParticipantRegistrationDetails {
  id: number
  created_at: string
  contact_id: Contact
  discount_code_id: number | null
  is_payment_refund_request: boolean
  is_payment_refunded: boolean
  participant_attendence_status_id: number
  price_category_id: number | null
  program_category_id: number
  program_id: Program
  discount_code: string
  discounted_amount: number
  is_health_declaration_checked: boolean
  is_program_agreement_checked: boolean
  legal_agreement_version: number
  payment_status_id: number
  customer_device_details_section: CustomerDeviceDetails[]
  email_delivery_logs_section: EmailDeliveryLog[]
  utm_parameters_section: UtmParameters[]
  basic_amount: number
  tax: number
  total_amount: number
  how_did_you_find_the_course: string
  hx_pkey: number
  health_declaration_consent_date: string
  program_agreement_date: string
  memo: string
}

function ViewParticipantInformation() {
  const textStyle = 'font-sans text-[14px]' // Common text style for both key and value
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]` // Style for keys
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]` // Style for values
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false)

  const selectQuery: any = {
    resource: 'participant_registration',
    id: 4, //TODO:Replace with selected participant ID
    optionLabel: 'name',
    optionValue: 'id',
    meta: {
      select:
        '*,contact_id!inner(*,gender_id(value),city_id(name),country_id(name),state_id(name)),program_id!inner(id,registration_link)'
    }
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleCopyRegistrationLink = () => {
    copyText(participantData?.data?.program_id?.registration_link)
    setCopiedRegistrationLink(true)

    setTimeout(() => {
      setCopiedRegistrationLink(false)
    }, 1000)
  }

  const { data: participantData, isLoading, isError } = useOne(selectQuery)
  const contactData = participantData?.data?.contact_id
  const participantInfo = [
    { key: 'Participants Name', value: contactData?.full_name ?? '-' },
    { key: 'Memo', value: participantData?.data?.memo ?? '-' },
    { key: 'Gender', value: contactData?.gender_id?.value ?? '-' },
    { key: 'Date Of Birth', value: contactData?.date_of_birth?.substring(0, 10) ?? '-' },
    { key: 'NIF', value: contactData?.nif ?? '-' },
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
    { key: 'Home/Work Phone', value: contactData?.work_phone ?? '-' },
    { key: 'Occupation', value: contactData?.occupation ?? '-' },
    { key: 'Email', value: contactData?.email ?? '-' },
    {
      key: 'Url for registration completion',
      value: (
        <div className="flex ">
          <div className="text-[14px] font-semibold text-[#7677F4] underline pr-[10px]">
            {participantData?.data?.program_id?.registration_link?.substring(0, 25) + '..'}
          </div>
          <div
            onClick={() => {
              handleCopyRegistrationLink()
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

  return !isLoading ? (
    <div className="w-[303px] bg-[white] border border-[#D9D9D9] rounded-[15px] shadow-lg flex justify-center items-center pt-[10px]">
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
  ) : (
    <div>Loading..</div>
  )
}

export default ViewParticipantInformation
