import { IsEditCourse } from "@components/course/newCourse/EditCourseUtil"
import { Select, SelectContent, SelectItems, SelectItem, SelectTrigger, SelectValue } from "src/ui/select"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { Input } from "src/ui/input"
import { useMVPSelect } from "src/utility/useMVPSelect"
import { MultiSelect } from "src/ui/multi-select"
import { USER_ROLE } from "src/constants/OptionLabels"
import { NATIONAL_ADMIN, PROGRAM_ORGANIZER, SUPER_ADMIN } from "src/constants/OptionValueOrder"
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel"
import { useGetIdentity } from "@refinedev/core"
import { Switch } from "src/ui/switch"
import { RadioGroup } from "src/ui/radio-group"
import { RadioButtonCard } from "src/ui/radioButtonCard"
import { NewEventStep1FormNames } from "src/constants/EventConstants"

export const NewEventStep1 = () => {
  const { watch } = useFormContext()

  const formdata = watch()

  const {data: loginUserData}: any = useGetIdentity()

  // Checking weather login user is super admin or not
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    ( val: { role_id: { order: number} } ) => val.role_id.order == SUPER_ADMIN
  )

  // Checking weather login user is National admin or not
  const hasNationalAdminRole = loginUserData?.userData?.user_roles.find(
    ( val: { role_id: { order: number } } ) => val.role_id.order == NATIONAL_ADMIN
  )

  return (
    <div className="w-full" >
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <div className="w-80 h-20">
          <OrganizationDropDown />
        </div>
        <div className="w-80 h-20">
          <ProgramOrganizerDropDown />
        </div>
        <div className="w-80 h-20">
          <RegistrationGateway />
        </div>
        { formdata?.is_registration_required && (
          <div className="w-80 h-20">
            <MaximumTickets />
          </div>
        )}
        { formdata?.is_registration_required && (
          <div className="w-80 h-20">
            <GroupInformation />
          </div>
        )}
      </div>
      {/* 'Registration via 3rd Party' field should be visible only to Super Admin and National Admin */}
      {(hasSuperAdminRole || hasNationalAdminRole) && (
        <div>
          <Registration3rdPartyGateway />
        </div>
      )}
    </div>
  )
}

const OrganizationDropDown= ()=>{
  const pathname = usePathname()
  const isEditCourse = IsEditCourse(pathname)

  const {
    field: { value, onChange },
    fieldState: { error: organizationError }
  } = useController({
    name: NewEventStep1FormNames?.organization_id
  })

  return(
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 items-center">
        <div className="text-xs font-normal text-[#333333]">
          Organization <span className="text-[#7677F4]">*</span>
        </div>
      </div>
      <Select
        value={value}
        onValueChange={(val)=>{
          onChange(val)
        }}
        //disabling the organization dropdown when it is edit
        disabled={isEditCourse}
      >
        <SelectTrigger
          error={organizationError ? true : false}
        >
          <SelectValue
            placeholder="Select Organization"
          />
        </SelectTrigger>
        <SelectContent>
          {/* <Input /> */}
          <SelectItems>
            <SelectItem value="1">Organization</SelectItem>
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
  
  const {
    field: { value, onChange },
    fieldState: { error: programOrganizerError}
  } =  useController({
    name: NewEventStep1FormNames?.organizer_ids
  })

  // Finding program Organizer role id
  // const programOrganizationId = getOptionValueObjectByOptionOrder(
  //   USER_ROLE,
  //   PROGRAM_ORGANIZER
  // )?.id

  // console.log('PROGRAM_ORGANIZER', programOrganizationId)
  // const { options }: any = useMVPSelect({
  //   resource: "users",
  //   meta: {
  //     select: "*, contact_id!inner(full_name), user_roles!inner(role_id)"
  //   },
  //   optionLabel: "contact_id.full_name",
  //   optionValue: "id",
  //   filters: [
  //     {
  //       field: "user_roles.role_id",
  //       operator: "eq",
  //       value: programOrganizationId,
  //     }
  //   ]
    
  // })
  // console.log("option", options)

  const Organizers  = [{ label: "Ravi shankar", value: "1" }]
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 items-center">
        <div className="text-xs font-normal text-[#333333]">
          Program Organizer <span className="text-[#7677F4]">*</span>
        </div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Program organizer Name"
        data={Organizers}
        onBottomReached={() =>{

        }}
        onSearch={() => {

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

const RegistrationGateway = () => {
  const {
    field: { value = false, onChange }
  } = useController({
    name: NewEventStep1FormNames?.is_registration_required
  })

  return (
    <div className="flex gap-[9px] pt-6">
      <div className="text-sm text-[#323232] font-normal text-wrap w-[254px] ">
        Registrations Required ?
      </div>
      <Switch
        id="is_registration_required"
        className="!w-[57px] !h-[24px]"
        checked={value}
        onCheckedChange={(value: boolean) => {
          onChange(value);
        }}
      />
    </div>
  )
}

const MaximumTickets = () => {
  const {
    field: { value = 1, onChange },
    fieldState: { error: maximumTicketsError }
  } = useController({
    name: NewEventStep1FormNames?.max_number_of_tickets
  })

  const {
    field: { value: GroupInformationValue, onChange: GroupInformationOnChange }
  } = useController({
    name: NewEventStep1FormNames?.is_group_information_required
  })
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal">
        Maximum Number of Tickets Allowed  Per Customer <span className="text-[#7677F4]">*</span>
      </div>
      <Input
        value={value}
        onChange={(val) => {
          onChange(val)
          val.target.value==="1" ? GroupInformationOnChange(true) : GroupInformationOnChange(false)
        }}
        className={`text-[#333333] ${ value=="1" && 'text-[#999999] focus:text-[#333333]'} rounded-xl`}
      />
      { maximumTicketsError && (
        <span className="text-[#FF6D6D] text-xs font-semibold">
          {maximumTicketsError.message}
        </span>
      )}
    </div>
  )
}

const GroupInformation = () => {
  const {
    field: { value = true, onChange }
  } = useController({
    name: NewEventStep1FormNames?.is_group_information_required
  })

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal">
        Information of all Participant in Group Required?
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(val: string) => {
          val == "true" ? onChange(true) : onChange(false)
        }}
      >
        <div className="flex gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] !h-[40px] rounded-xl"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] !h-[40px] rounded-xl"
          />
        </div>
      </RadioGroup>
    </div>
  )
}

const Registration3rdPartyGateway = () => {
  const {
    field: {value = false, onChange},
  } = useController({
    name: NewEventStep1FormNames?.is_registration_via_3rd_party
  })

  const {
    field: {value: registrationUrl , onChange: RegistrationUrlOnChange },
    fieldState: {error}
  } = useController({
    name: NewEventStep1FormNames?.registration_via_3rd_party_url
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
            <div className="text-xs font-normal text-[#333333]">
              Please input the site's URL <span className="text-[#7677F4]">*</span>
            </div>
          </div>
          <div className="w-80">
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