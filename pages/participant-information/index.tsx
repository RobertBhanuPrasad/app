const index = () => {
  const participantInformation = [
    {
      name: 'Sumit Test',
      memo: 'Lorem ipsum dolor sit amet consectetur. Enim ultrices tristique',
      gender: 'Male',
      dob: '27 Mar 2023',
      nif: 12345678,
      address: '3517 W. Gray St. Utica, Pennsylvania 57867',
      phoneNumber: '(907) 555-0101',
      homeOrWorkPhone: '',
      occupation: 'Manager',
      email: 'sumittest1@yopmail.com',
      url: 'https://artofliving.zoom.u',
      find: 'NA'
    }
  ]
  return (
    <div>
      <div className="w-[303px] rounded-lg m-8  shadow-xl pt-[18px] pl-[23px] mt-[100px]">
        <p className="text-lg font-semibold">Participants Information</p>
        {participantInformation.map(participant => {
          return (
            <div className="flex flex-col gap-[23px] mt-5">
              <div>
                <p className="text-grey text-sm font-normal">Participants Name</p>
                <p className="text-sm font-semibold">{participant.name}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Memo</p>
                <p className="text-sm font-semibold">{participant.memo}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Gender</p>
                <p className="text-sm font-semibold">{participant.gender}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Date Of Birth</p>
                <p className="text-sm font-semibold">{participant.dob}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">NIF</p>
                <p className="text-sm font-semibold">{participant.nif}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Address</p>
                <p className="text-sm font-semibold">{participant.address}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Phone Number</p>
                <p className="text-sm font-semibold">{participant.phoneNumber}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Home / Work Phone</p>
                <p className="text-sm font-semibold">{participant.homeOrWorkPhone}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Occupation</p>
                <p className="text-sm font-semibold">{participant.occupation}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Email</p>
                <p className="text-sm font-semibold">{participant.email}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">Url for registration completion</p>
                <p className="text-sm font-semibold">{participant.url}</p>
              </div>
              <div>
                <p className="text-grey text-sm font-normal">How did you find out about the program?</p>
                <p className="text-sm font-semibold">{participant.find}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div>jcsdbhjb</div>
    </div>
  )
}

export default index
