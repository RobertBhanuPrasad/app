function ViewParticipantCourseInformation() {
  const textStyle = 'font-sans text-[14px]' // Common text style for both key and value
  const keyTextStyle = `${textStyle} font-[400] text-[#999999]` // Style for keys
  const valueTextStyle = `${textStyle} font-[600] text-[#666666]` // Style for values
  const coursePaticipantInformation = [
    { key: 'Course Type', value: 'Happiness Program' },
    { key: 'CourseName', value: 'Happiness Program' },
    { key: 'Teachers', value: 'Test Teachers' },
    { key: 'Attendance Status', value: 'Pending' },
    { key: 'Discount Amount', value: '0.00' }
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
