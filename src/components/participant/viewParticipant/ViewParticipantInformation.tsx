import CopyIcon from '@public/assets/CopyIcon'; 
import { useOne } from '@refinedev/core';
import { useState } from 'react'; 

function ViewParticipantInformation() {
  const textStyle = 'font-sans text-[14px]'; // Common text style for both key and value
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]`; // Style for keys
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]`; // Style for values

  // State variable to track whether the registration link has been copied
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false);

  // Query object for fetching participant data
  const selectQuery: any = {
    resource: 'participant_registration',
    id: 4, // TODO: Replace with selected participant ID
    optionLabel: 'name',
    optionValue: 'id',
    meta: {
      select: '*,contact_id!inner(*,gender_id(value),city_id(name),country_id(name),state_id(name)),program_id!inner(id,registration_link)'
    }
  };

  // Function to copy text to clipboard
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Function to handle copying the registration link
  const handleCopyRegistrationLink = () => {
    copyText(participantData?.data?.program_id?.registration_link); // Copy the registration link to clipboard
    setCopiedRegistrationLink(true); // Set copiedRegistrationLink state to true

    // Reset copiedRegistrationLink state after a delay
    setTimeout(() => {
      setCopiedRegistrationLink(false);
    }, 1000);
  };

  // Fetching participant data using useOne hook
  const { data: participantData, isLoading, isError } = useOne(selectQuery);

  // Extracting contact data from participantData
  const contactData = participantData?.data?.contact_id;

  // Array containing participant information with keys and values
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

  // Render component content based on loading state
  return !isLoading ? (
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
  ) : (
    <div>Loading..</div> // Display loading indicator if data is being fetched
  );
}

export default ViewParticipantInformation;
