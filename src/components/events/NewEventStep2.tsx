import { IsEditCourse } from "@components/course/newCourse/EditCourseUtil"
import Globe from "@public/assets/Globe"
import Important from "@public/assets/Important"
import LockIcon from "@public/assets/Lock"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { VISIBILITY } from "src/constants/OptionLabels"
import { PRIVATE, PUBLIC, SUPER_ADMIN } from "src/constants/OptionValueOrder"
import { Input } from "src/ui/input"
import { MultiSelect } from "src/ui/multi-select"
import { RadioGroup } from "src/ui/radio-group"
import { RadioButtonCard } from "src/ui/radioButtonCard"
import { Select, SelectContent, SelectItem, SelectItems, SelectTrigger, SelectValue } from "src/ui/select"
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "src/ui/tooltip"
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel"
import { useMVPSelect } from "src/utility/useMVPSelect"
import { EditMangeDialogModal } from "./NewEventStep2EditModal"
import { NewEventStep2FormNames } from "src/constants/EventConstants"
import { useGetIdentity } from "@refinedev/core"

export const NewEventStep2 = () => {
  const { watch } = useFormContext()

  const formData = watch()

  const { data: loginUserData }: any = useGetIdentity();

  // Checking weather login user is super admin or not
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  )

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <div className="w-80 h-20">
          <EventTypeDropDown/>
        </div>
        <div className="w-80 h-20">
          <EventNameDropDown/>
        </div>
        { formData?.event_name_id ==1 && (
          <div className="w-80 h-20">
            <NewEventName/>
          </div>
        )}
        <div className="w-80 h-20">
          <DisplayFacilitator/>
        </div>
        { formData?.is_facilitator_name_available && (
          <div className="w-80 h-20">
            <FacilitatorName/>
          </div>
        )}
        { formData?.is_facilitator_name_available && (
          <div className="w-80 h-20">
            <FacilitatorLabel/>
          </div>
        )}
        <div className="w-80 h-20">
          <LanguageDropDown />
        </div>
        {/* Allow only for super Admin */}
        {hasSuperAdminRole && (
          <div className="w-80 h-20">
            <DisplayTranslation />
          </div>
        )}
        { formData?.is_language_translation_for_participants && (
          <div className="w-80 h-20">
            <LanguageTranslationDropDown/>
          </div>
        )}
        <div className="w-80 h-20">
          <Visibility/>
        </div>
        {hasSuperAdminRole && (
          <div className="w-80 h-20">
            <GeoRestriction />
          </div>
        )}
        { formData?.is_geo_restriction_applicable && (
          <div className="w-80 h-20">
            <AllowedCountriesDropDown/>
          </div>
        )}
      </div>
      <div className="flex gap-[30px]">
        <div className="w-80 flex items-center gap-[10px] h-[39px]">
          <div className="text-sm text-[#323232] font-normal">
            Event Description
          </div>
          <div>
            <EditMangeDialogModal/>
          </div>
        </div>
        <div className="w-80 flex items-center gap-[10px] h-[39px]">
          <div className="text-sm text-[#323232] font-normal">
            Event Notes
          </div>
          <div>
            <EditMangeDialogModal/>
          </div>
        </div>
        <div className="w-80 flex items-center gap-[10px] h-[39px]">
          <div className="text-sm text-[#323232] font-normal">
            Email Notes
          </div>
          <div>
            <EditMangeDialogModal/>
          </div>
        </div>
        
      </div>
    </div>
  )
}

const EventTypeDropDown = () => {

  /**
   * This variable holds the path of the url
   */
  const pathname = usePathname()

  /**
   * Checking whether the url contains the edit or not
   */
  const isEditCourse = IsEditCourse(pathname)
  const {
    field: { value, onChange },
    fieldState: { error: eventTypeError }
  } = useController({
    name: NewEventStep2FormNames?.event_type_id
    })
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-normal text-[#333333]">
        Event Type <span className="text-[#7677F4]">*</span>
      </div>
      <Select
        value={value}
        onValueChange={(val)=>{
          onChange(val)
        }}
        disabled={isEditCourse}
      >
        <SelectTrigger
          error={eventTypeError ? true : false}
        >
          <SelectValue placeholder="Select Event type"/>
        </SelectTrigger>
        <SelectContent>
          {/* <Input/> */}
          <SelectItems>
            {/* <SelectItem value="Event Type">Event Type</SelectItem> */}
            <SelectItem value="1">Intro Talk</SelectItem>
          </SelectItems>
        </SelectContent>
      </Select>
      {eventTypeError && (
        <span className="text-[#FF6D6D] text-xs">
          {eventTypeError?.message}
        </span>
      )}
    </div>
  )
}

const EventNameDropDown = () => {
  const {
    field: { value, onChange }, 
    fieldState: { error: eventNameError }
  } = useController({
    name: NewEventStep2FormNames?.event_name_id
  })
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal">
        Event Name <span className="text-[#7677F4]">*</span>
      </div>
      <Select
        value={value}
        onValueChange={(val)=>{
          console.log("val", val)
          onChange(val)
        }}
      >
        <SelectTrigger
          error={eventNameError ? true : false}
        >
          <SelectValue placeholder="Select Event Name"/>
        </SelectTrigger>
        <SelectContent>
          <Input/>
          <SelectItems>
            <SelectItem value="1">Enter Event Name</SelectItem>
          </SelectItems>
        </SelectContent>
      </Select>
      {eventNameError && (
        <span className="text-[#FF6D6D] text-xs">
          {eventNameError?.message}
        </span>
      )}
    </div>
  )
}

const NewEventName = () => {
  const {
    field: { value, onChange },
    fieldState: { error: newEventNameError }
  } = useController({
    name: NewEventStep2FormNames?.custom_event_name
  })
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal">
        New Event Name <span className="text-[#7677F4]">*</span>
      </div>
      <Input
        placeholder="Enter Event Name"
        value={value}
        onChange={(val)=>{
          onChange(val)
        }}
        className="rounded-xl text-sm"
        error={newEventNameError ? true : false}
      />
      {newEventNameError && (
        <span className="text-[#FF6D6D] text-xs">
          {newEventNameError?.message}
        </span>
      )}
    </div>
  )
}

const DisplayFacilitator = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewEventStep2FormNames?.is_facilitator_name_available
  })
  
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal flex gap-1">
        Facilitator Name to be Displayed? <div className="text-[#7677F4]">*</div>
        {/* popover to show the note to display facilitator */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Important/>
            </TooltipTrigger>
            <TooltipContent className="max-w-[265px] py-3 bg-[#333333] text-white border-none">
              <div className="text-wrap text-xs">
                If 'Yes', facilitator name will be shown on Art Of Living Website.
              </div>
              <TooltipArrow height={15} width={17} fill="#333333"/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(val: string) => {
          val == "true" ? onChange(true) : onChange(false);
        }}
      >
        <div className="flex flex-row gap-6">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  )
}

const FacilitatorName = () => {
  const {
    field: { value, onChange },
    fieldState: {error: facilitatorNameError}
  } = useController({
    name: NewEventStep2FormNames?.facilitator_name
  })
  return(
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal">
        Facilitator Name <span className="text-[#7677F4]">*</span>
      </div>
      <Input
        value={value}
        onChange={(val)=>{
          onChange(val)
        }}
        className="rounded-[12px] text-[14px]"
        error={facilitatorNameError ? true : false}
      />
      {facilitatorNameError && (
        <span className="text-[#FF6D6D] text-xs">
          {facilitatorNameError?.message}
        </span>
      )}
    </div>
  )
}


const FacilitatorLabel = () => {
  const {
    field: { value, onChange },
    fieldState: {error}
  } = useController({
    name: NewEventStep2FormNames?.facilitator_label
  })
  return(
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal flex gap-1">
        Facilitator Lable <div className="text-[#7677F4]">*</div>
        {/* popover to show the note to display facilitator */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Important/>
            </TooltipTrigger>
            <TooltipContent className="max-w-[314px] py-3 bg-[#333333] text-white border-none">
              <div className="text-wrap text-xs">
                Instructor, speaker, Author etc. This label will be shown on Art of Living website
              </div>
              <TooltipArrow height={15} width={17} fill="#333333"/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        placeholder="Facilitator"
        value={value}
        onChange={(val)=>{
          onChange(val)
        }}
        className="rounded-[12px] text-[14px]"
        error={error ? true : false}
      />
    </div>
  )
}

const LanguageDropDown = () => {
  const {
    field: { value, onChange },
    fieldState: { error: languageError }
  } = useController({
    name: NewEventStep2FormNames?.language_ids
  })
  const languague  = [{ label: "English", value: "1" }]
  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Language(s) Course is Taught in
      </div>
      <MultiSelect
        value={value}
        placeholder="Select Language"
        onChange={onChange}
        error={languageError}
        data={languague}
        onSearch={()=>{

        }}
        onBottomReached={()=>{

        }}
      />
      {languageError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {languageError?.message}
        </span>
      )}
    </div>
  )
}

const DisplayTranslation = () => {
  const {
    field: { value, onChange }
  } = useController({
    name: NewEventStep2FormNames?.is_language_translation_for_participants
  })
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#333333] font-normal">
        Display Language Translation 
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(value: string) => {
          value === "true" ? onChange(true) : onChange(false);
        }}
      >
        <div className="flex gap-6">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] h-[40px] rounded-xl"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] h-[40px] rounded-xl"
          />
        </div>
      </RadioGroup>
    </div>
  )
}

const LanguageTranslationDropDown = () => {
  const {
    field: { value, onChange },
    fieldState: { error: languageTranslationError },
  } = useController({
    name: NewEventStep2FormNames?.translation_language_ids
  });
  const languague  = [{ label: "English", value: "1" }]
  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Available Language(s) for Translation
      </div>
      <MultiSelect
        value={value}
        placeholder="Select Language"
        onChange={onChange}
        error={languageTranslationError}
        data={languague}
        onSearch={()=>{

        }}
        onBottomReached={()=>{

        }}
      />
      {languageTranslationError && (
        <span className="text-[#FF6D6D] text-xs">
          {languageTranslationError?.message}
        </span>
      )}
    </div>
  )
}

const Visibility = () => {
  const {
    field: { value, onChange }
  } = useController({
    name: NewEventStep2FormNames?.visibility_id
  })

  //Finding program Organizer role id
  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id

  const privateVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PRIVATE
  )?.id

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex gap-1">
        <div className="text-xs text-[#333333] font-normal">
          Visibility <span className="text-[#7677F4]">*</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Important/>
            </TooltipTrigger>
            <TooltipContent className="max-w-[452px] py-3 bg-[#333333] border-none">
              <div className="text-[#FFFFFF] text-wrap text-xs font-normal mr-[14px]">
                Public events will be listed on Art of Living website, but private events will not be listed. When changing the visibility from private to public, it can take up to 15 minutes for the webpage to be published on the Art of Living website. 
                <br/>An event participant can register for a private event only if the event organizer has shared the registration link with them
              </div>
              <TooltipArrow height={15} width={17} fill="#333333"/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        onValueChange={(val: string) => {
          onChange(parseInt(val));
        }}
        value={JSON.stringify(value)}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value={JSON.stringify(publicVisibilityId)}
            selectedRadioValue={JSON.stringify(value)}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px] "
          />
          <RadioButtonCard
            value={JSON.stringify(privateVisibilityId)}
            selectedRadioValue={JSON.stringify(value)}
            label="Private"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  )
}

const GeoRestriction = () => {
  const {
    field: { value, onChange }
  } = useController({
    name: NewEventStep2FormNames?.is_geo_restriction_applicable
  })
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <div className="text-xs text-[#333333] font-normal">
          Is geo restriction applicable for registrations <span className="text-[#7677F4]">*</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Important/>
            </TooltipTrigger>
            <TooltipContent className="max-w-[231px] py-3 bg-[#333333] border-none">
              <div className="flex flex-row gap-1 items-center">
                <Globe />
                <div className="text-sm font-semibold text-white">Public</div>
              </div>
              <div className="text-xs font-normal text-wrap text-white">There are a lot of things you can do in space, and space essentially is unlimited resources.</div>
              <div className="my-2">
                <hr></hr>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <LockIcon />
                <div className="text-sm font-semibold text-white">Private</div>
              </div>
              <div className="text-xs font-normal text-wrap text-white">There are a lot of things you can do in space, and space essentially is unlimited resources.</div>
              <TooltipArrow height={15} width={17} fill="#333333"/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(value: string) => {
          value === "true" ? onChange(true) : onChange(false);
        }}
      >
        <div className="flex gap-6">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] h-10 rounded-xl"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] h-10 rounded-xl"
          />
        </div>
      </RadioGroup>
    </div>
  )
}

const AllowedCountriesDropDown = () => {
  const {
    field: { value, onChange },
    fieldState: { error: allowedCountriesErrors }
  } = useController({
    name: NewEventStep2FormNames?.allowed_countries
  })
  const countries  = [{ label: "India", value: "1" }]
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 text-xs text-[#333333] font-normal">
        Country(s) from where registrations are allowed <span className="text-[#7677F4]">*</span>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Countries"
        onChange={onChange}
        error={allowedCountriesErrors}
        data={countries}
        onSearch={()=>{

        }}
        onBottomReached={()=>{

        }}
      />
      {allowedCountriesErrors && (
        <span className="text-[#FF6D6D] text-xs">
          {allowedCountriesErrors?.message}
        </span>
      )}
    </div>
  )
}
