function ViewParticipantInformation() {
  const textStyle = 'font-sans text-[14px]' // Common text style for both key and value
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]` // Style for keys
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]` // Style for values

  const participantInfo = [
    { key: 'Participants Name', value: 'Sumit Test' },
    { key: 'Memo', value: 'Lorem ipsum dolor sit amet consectetur. Enim ultrices tristique' },
    { key: 'Gender', value: 'Male' },
    { key: 'Date Of Birth', value: '27 Mar 2023' },
    { key: 'NIF', value: '12345678' },
    { key: 'Address', value: '3517 W. Gray St. Utica, Pennsylvania 57867' },
    { key: 'Phone Number', value: '(907) 555-0101' },
    { key: 'Home/Work Phone', value: '' },
    { key: 'Occupation', value: 'Manager' },
    { key: 'Email', value: 'sumittest1@yopmail.com' },
    { key: 'Url for registration completion', value: 'https://artofliving.zoom.u..' },
    { key: 'How did you find out about the program?', value: 'NA' }
  ]

  return (
    <div className="w-[303px] bg-[white] border border-[#D9D9D9] rounded-[15px] shadow-lg flex justify-center items-center">
      <div className="w-[263px]">
        <p className="font-[600] text-[18px] font-sans">Participants Information</p>
        {participantInfo.map((info, index) => (
          <div key={index} className="mt-[23px]">
            <p className={keyTextStyle}>{info.key}</p>
            <p className={valueTextStyle}>{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewParticipantInformation
