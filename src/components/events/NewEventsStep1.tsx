import { IsEditCourse } from "@components/course/newCourse/EditCourseUtil"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "src/ui/select"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { Text } from "src/ui/TextTags"
import { Input } from "src/ui/input"
import { SelectItems } from "src/ui/select"
import { useMVPSelect } from "src/utility/useMVPSelect"
import { MultiSelect } from "src/ui/multi-select"
import { USER_ROLE } from "src/constants/OptionLabels"
import { NATIONAL_ADMIN, PROGRAM_ORGANIZER, SUPER_ADMIN } from "src/constants/OptionValueOrder"
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel"
import { useGetIdentity } from "@refinedev/core"
import { Switch } from "src/ui/switch"

export const NewEventStep1 = () => {
  const {data: loginUserData}: any = useGetIdentity()
  console.log("identity", loginUserData)
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(( val: { role_id: { order: number} } ) => val.role_id.order == SUPER_ADMIN)
  const hasNationalAdminRole = loginUserData?.userData?.user_roles.find(( val: { role_id: { order: number } } ) => val.role_id.order == NATIONAL_ADMIN)
  return (
    <div className="w-full " >
      <div className="flex flex-row gap-7 ">
        <div className="h-20">
          <OrganizationDropDown />
        </div>
        <div className="h-20">
          <ProgramOrganizerDropDown />
        </div>
      </div>
      {/* 'Registration via 3rd Party' field should be visible only to Super Admin and National Admin */}
      {(hasSuperAdminRole || hasNationalAdminRole) && (
        <div>
          <RegistrationGateway />
        </div>
      )}
    </div>
  )
}

const RegistrationGateway = () => {
  const {
    field: {value = false, onChange},
  } = useController({
    name: "is_registration_via_3rd_party"
  })

  const {
    field: {value: registrationUrl , onChange: RegistrationUrlOnChange },
    fieldState: {error}
  } = useController({
    name: "registration_via_3rd_party_url"
  })

  return(
    <div className="flex gap-6  mt-[60px]">
      <div className="text-sm font-normal">
        Registration via 3rd party gateway
      </div>
      <Switch
        id="registration"
        className="!w-[57px] !h-[24px]"
        onCheckedChange={onChange}
        checked={value}
      />
      { value && (
        <div className="flex flex-col gap-1 -mt-7 ml-8">
          <div className="flex gap-1 items-center">
            <Text className="text-xs font-normal text-[#333333]">
              Please input the site's URL
            </Text>{" "}
            <Text className="text-[#7677F4]">*</Text>
          </div>
          <div className="w-[320px]">
            <Input
             placeholder="Enter URL"
             value={registrationUrl}
             onChange={RegistrationUrlOnChange}
             className="rounded-[12px]"
             error={error? true: false}
            />
          </div>
          {error && (
            <span className="">
              {error?.message}
            </span>
          )}
        </div>

      )}
    </div>
  )
}

const OrganizationDropDown= ()=>{
  const pathname = usePathname()
  const isEditCourse = IsEditCourse(pathname)

  const [pageSize, setPageSize] = useState<number>(1);

  const {watch} = useFormContext()
  const formdata =watch()

  const [searchValue, setSearchValue] = useState<string>("")

  const {
    field: { value, onChange },
    fieldState: { error: organizationError }
  } = useController({
    name: "organization_id"
  })
  const { options, onSearch, queryResult }= useMVPSelect({
    resource: "organizations",
    optionLabel:"name",
    optionValue: "id",
    onSearch: (value)=>[
      {
        field: "name",
        operator: "contains",
        value,
      }
    ]
  })

  const handleSearch = (val: { target: { value: string } }) => {
    onSearch(val.target.value);
    setSearchValue(val.target.value);
  };

  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize) {
      setPageSize((previousLimit: number) => previousLimit + 10);
    }
  };

  
  return(
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row gap-1 items-center">
        <Text className="text-xs font-normal text-[#333333]">
          Organization
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <Select
        value={value}
        onValueChange={(value: any) => {
          onChange(value);
          // handleClearDependencyValues();
        }}
        //disabling the organization dropdown when it is edit
        disabled={isEditCourse}
      >
        <SelectTrigger
          className="w-[320px]"
          error={organizationError ? true : false}
        >
          <SelectValue
            placeholder="Select Organization"
          />
        </SelectTrigger>
        <SelectContent>
          <Input value={searchValue} onChange={handleSearch} />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options?.map((option : any, index : any) => {
              return (
                <div key={index}>
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="h-[44px]"
                  >
                    {option.label}
                  </SelectItem>
                  {index < options?.length - 1 && (
                    <hr className="border-[#D6D7D8]" />
                  )}
                </div>
              );
            })}
          </SelectItems>
        </SelectContent>
      </Select>

      {organizationError && (
        <span className="text-[#FF6D6D] text-xs font-semibold">
          {organizationError?.message}
        </span>
      )}
    </div>
  )
}

const ProgramOrganizerDropDown = () => {
  const { data: loginUserData }: any = useGetIdentity();

  const [pageSize, setPageSize] = useState(10);
  const {
    field: { value, onChange },
    fieldState: { error: programOrganizerError}
  } =  useController({
    name: "organizer_ids"
  })

  //Finding program Organizer role id
  const programOrganizationId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    PROGRAM_ORGANIZER
  )?.id;
  
  const { options, queryResult, onSearch } = useMVPSelect({
    resource: "users",
    meta: {
      select: "*,contact_id!inner(full_name),user_roles!inner(role_id)",
    },
    optionLabel: "contact_id.full_name",
    optionValue: "id",
    filters: [
      //Fetch the users with Program Organizer role
      {
        field: "user_roles.role_id",
        operator: "eq",
        value: programOrganizationId,
      },
    ],
    defaultValue: value,
    onSearch: (value) => [
      {
        field: "contact_id.full_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  })

  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize)
      setPageSize((previousLimit: number) => previousLimit + 10);
  }

  return (
    <div className="w-80 flex flex-col gap-1">
      <div className="flex flex-row gap-1 items-center">
        <Text className="text-xs font-normal text-[#333333]">
          Program Organizer
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Program organizer Name"
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={onChange}
        error={programOrganizerError}
      />
      {programOrganizerError && (
        <span className="text-[#FF6D6D] text-xs font-semibold">
          {programOrganizerError.message}
        </span>
      )}
    </div>
  )
}
