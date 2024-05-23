"use client";
import Add from "@public/assets/Add";
import CalenderIcon from "@public/assets/CalenderIcon";
import Clock from "@public/assets/Clock";
import Delete from "@public/assets/Delete";
import DropDown from "@public/assets/DropDown";
import EditIcon from "@public/assets/EditIcon";
import SearchIcon from "@public/assets/SearchIcon";
import {
  CrudFilters,
  useGetIdentity,
  useList,
  useOne,
  useSelect,
} from "@refinedev/core";
import { format } from "date-fns";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import {
  useController,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch
} from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { DateCalendar } from "src/ui/DateCalendar";
import { Badge } from "src/ui/badge";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/ui/dialog";
import { Input } from "src/ui/input";
import { supabaseClient } from "src/utility";

import {
  CenterDropDown,
  CityDropDown,
  PostalCodeComponent,
  StateDropDown,
  StreetAddressComponent,
  VenueNameComponent,
} from "@components/CommonComponents/DropDowns";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import Important from "@public/assets/Important";
import { translatedText } from "src/common/translations";
import { NewCourseStep3FormNames } from "src/constants/CourseConstants";
import {
  NATIONAL_ADMIN,
  SUPER_ADMIN,
  TIME_FORMAT_12_HOURS,
} from "src/constants/OptionValueOrder";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { Label } from "src/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { RadioGroup, RadioGroupCircleItem } from "src/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";
import { useValidateCurrentStepFields } from "src/utility/ValidationSteps";
import useDebounce from "src/utility/useDebounceHook";

import { useTranslation } from "next-i18next";

function NewCourseStep3() {
  const { watch } = useFormContext();

  const { program_type_id } = watch();

  const { data: programTypeData, isLoading } = useOne({
    resource: "program_types",
    id: program_type_id,
  });

  if (isLoading) {
    return <section className="flex w-full justify-center items-center h-[400px]"><div className="loader"></div></section>
  }

  return (
    <div className="space-y-8 w-full">
      <div>
        {programTypeData?.data?.is_online_program === true ? (
          <OnlineProgram />
        ) : (
          <Venue />
        )}
      </div>
      <Schedules />
    </div>
  );
}

export default NewCourseStep3;

const OnlineProgram = () => {
  const { t } = useTranslation(["course.new_course", "new_strings"]);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: NewCourseStep3FormNames?.online_url,
  });

  const {setValue,clearErrors}=useFormContext()

  //Requirement: Fee is fetch based on program_type,location and course start date.So when ever state_id,city_id and center_id is changed need to remove existing fee levels.
  const handleRemoveFeeLevels=()=>{
    setValue("program_fee_level_settings",[])
    setValue("is_early_bird_enabled",undefined)
    setValue("early_bird_cut_off_period",undefined)
    setTimeout(() => {
      clearErrors(["program_fee_level_settings","is_early_bird_enabled","early_bird_cut_off_period"]);
    }, 10);
  }
  return (
    <div className="">
      <div>
        <div className="flex flex-row gap-1 items-center">
          {t("course.new_course:time_and_venue_tab.online_meeting_url")}{" "}
          <div className="text-[#7677F4]"> *</div>
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px]">
                {t("new_strings:online_course_hovered_text")}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="w-80">
          <Input
            placeholder={t("new_strings:url")}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            error={error ? true : false}
          />
          {error && (
            <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
          )}
          <div className="text-xs font-normal text-[#666666] italic w-[320px] overflow-hidden">
            <div>{t("new_strings:note_participants")}</div>
            <div>{t("new_strings:virtual_venue")}</div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div>
          {t("course.new_course:time_and_venue_tab.specific_location")}
        </div>
        <div className="flex gap-7">
          <div className="flex-1">
            <StateDropDown name="state_id" onChange={handleRemoveFeeLevels} />
          </div>
          <div className="flex-1">
            <CityDropDown name="city_id" onChange={handleRemoveFeeLevels}/>
          </div>
          <div className="flex-1">
            <CenterDropDown name="center_id" onChange={handleRemoveFeeLevels}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const Schedules = () => {
  const { errors } = useFormState();

  return (
    <div className="flex flex-col gap-4">
      <SchedulesHeader />

      <Sessions />

      {errors?.schedules && (
        <span className="text-[#FF6D6D] text-[12px]">
          {errors?.schedules?.message as string}
        </span>
      )}
    </div>
  );
};

const SchedulesHeader = () => {
  const { t } = useTranslation(["course.new_course", "new_strings"]);
  const {
    field: { value: hoursFormat, onChange: hoursFormatOnChange },
    fieldState: { error: schedulesHeaderErrors },
  } = useController({ name: NewCourseStep3FormNames?.hour_format_id });

  const {
    field: { value: timeZones, onChange: timeZonesOnChange },
    fieldState: { error: timeZoneError },
  } = useController({ name: NewCourseStep3FormNames?.time_zone_id });

  let timeFormatOptions =
    getOptionValuesByOptionLabel(TIME_FORMAT)?.[0]?.option_values;

  timeFormatOptions = timeFormatOptions?.map(
    (val: { id: any; name: object }) => {
      return {
        value: val?.id,
        label: val?.name,
      };
    }
  );

  const { options } = useSelect({
    resource: "time_zones",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  return (
    <div className="h-9 flex">
      <div className="text-base text-[#333333] flex items-center">
        {t("course.new_course:time_and_venue_tab.event_date_and_time")}
      </div>
      <div className="flex gap-4 w-[434px] ml-auto">
        <div className={`w-[161px]   ${options && options.length <= 1 ? 'ml-auto' : ''}`}>
          <Select
            value={hoursFormat}
            onValueChange={(val: any) => {
              hoursFormatOnChange(val);
            }}
          >
            <SelectTrigger
              className="w-[161px]"
              error={schedulesHeaderErrors ? true : false}
            >
              <SelectValue placeholder={t("new_strings:select_format")} />
            </SelectTrigger>
            <SelectContent className="w-[161px]">
              {timeFormatOptions?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {translatedText(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {schedulesHeaderErrors && (
            <span className="text-[#FF6D6D] text-[12px]">
              {schedulesHeaderErrors?.message}
            </span>
          )}
        </div>

        {/* Time Zone For each country we need to store their time zone in time_zones table.
        So if a coutry have time zone as India then we need to store it in time_zones table
        here we need to display the time zone dropdown only when it have more than one time zone
        */}
        {options?.length > 1 && (
          <div className="w-[257px]">
            <Select
              value={timeZones}
              onValueChange={(value: any) => {
                timeZonesOnChange(value);
              }}
            >
              <SelectTrigger
                className="w-[257px]"
                error={timeZoneError ? true : false}
              >
                <SelectValue placeholder={t("new_strings:select_time_zone")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItems onBottomReached={() => {}}>
                  {options?.map((option, index) => {
                    return (
                      <div>
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
            {timeZoneError && (
              <span className="text-[#FF6D6D] text-[12px]">
                {timeZoneError?.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Sessions = () => {
  const { append, remove, fields } = useFieldArray({
    name: "schedules",
  });

  const { watch } = useFormContext();

  const formData = watch();
  const schedules = formData?.schedules || [];

  /**
   * We need to add a new session when user click on add session
   * But here we have so much requirement
   * Requirement: 1. If it is first session then we need to add a new session with date : today, startHour: 
   * if the time format is 12 hour format
      i need to append startHour=12, startMinute=00, endHour=12, endMinute=00.  
    if the time format is 24 hour format
    i need to append startHour=00, endHour=00, startMinute=00, endMinute=00
    * Requirement 2 : If it is not first session then we need to add a new session with date : previous next date, startHour,endHour, startMinute, endMinute as same as above schedule
    */
  const handleAddSession = () => {
    // we will take one temporary objetc initially with date and then based on timezone id we need to add proper startHour, startMinute, endHour, endMinute
    // we need to store startTimeFormat and endTimeFormat also because it is 12 hour or 24 hour format right we need to store wether it is AM or PM.
    const tempSchedule: {
      date?: Date;
      startHour?: string;
      startMinute?: string;
      endHour?: string;
      endMinute?: string;
      startTimeFormat?: string;
      endTimeFormat?: string;
    } = {};

    const today = new Date();

    const tomorrowDate = new Date(today).setDate(today.getDate() + 1);

    // as per requirement we need to set to tomorrow date
    tempSchedule.date = new Date(tomorrowDate);

    // and we need to set to 06:00PM as start time and end time as 08:00PM for all countries
    // in future if client asks we need to set date and time as per each country what ever theu want

    if (formData?.hour_format_id === timeFormat12HoursId) {
      tempSchedule["startHour"] = "06";
      tempSchedule["startMinute"] = "00";
      tempSchedule["endHour"] = "08";
      tempSchedule["endMinute"] = "00";
      tempSchedule["startTimeFormat"] = "PM";
      tempSchedule["endTimeFormat"] = "PM";
    } else {
      tempSchedule["startHour"] = "18";
      tempSchedule["startMinute"] = "00";
      tempSchedule["endHour"] = "20";
      tempSchedule["endMinute"] = "00";
    }

    if (schedules?.length === 0) {
      append(tempSchedule);
    } else {
      // date we need to increase to next day of previous date
      const date = new Date(schedules[schedules?.length - 1]?.date);

      date.setDate(date.getDate() + 1);

      append({
        date,
        startHour: schedules[schedules?.length - 1]?.startHour,
        startMinute: schedules[schedules?.length - 1]?.startMinute,
        endHour: schedules[schedules?.length - 1]?.endHour,
        endMinute: schedules[schedules?.length - 1]?.endMinute,
        startTimeFormat: schedules[schedules?.length - 1]?.startTimeFormat,
        endTimeFormat: schedules[schedules?.length - 1]?.endTimeFormat,
      });
    }
  };

  useEffect(() => {
    if (schedules?.length <= 0 || !schedules) {
      handleAddSession();
    }
  }, []);

  const handleRemoveSession = (index: number) => {
    remove(index);
  };
  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id;

  return (
    <div className="flex flex-col gap-4">
      {fields?.map((schedule: any, index: number) => {
        return (
          <div key={schedule.id}>
            <ScheduleComponent
              index={index}
              handleAddSession={handleAddSession}
              handleRemoveSession={handleRemoveSession}
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * This is a component where we can call inside map
 * we have taken because to get updated with useWatch and mapping with field
 * @returns
 */
const ScheduleComponent = ({
  index,
  handleAddSession,
  handleRemoveSession,
}: {
  index: number;
  handleAddSession: any;
  handleRemoveSession: any;
}) => {
  const { errors }: any = useFormState();
  const [open, setOpen] = useState(false);
  const [deleteSession, setDeleteSession] = useState(false);

  const { watch } = useFormContext();
  const formData = watch();

  const schedule = formData?.schedules[index];

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id;
  const { t } = useTranslation(["common", "course.new_course","new_strings"]);

  return (
    <div className="h-15 flex flex-col gap-1 justify-between">
      <div className="h-4 font-[#333333] font-normal flex text-xs">
        <div>
          {t("course.new_course:time_and_venue_tab.session")} {index + 1}{" "}
        </div>
        <div className="text-[#7677F4]">&nbsp;*</div>
      </div>
      <div className="h-10 flex items-center gap-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className={`w-[233px] h-[40px] flex flex-row items-center justify-start gap-2 ${
                errors?.schedules?.[index] && "border-[#FF6D6D]"
              }`}
              variant="outline"
            >
              <div>
                <CalenderIcon color="#999999" />
              </div>
              <div>
                {schedule?.date &&
                  format(new Date(schedule.date), "dd MMM, yyyy")}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="!w-[810px] !h-[511px] bg-[#FFFFFF]">
            <CalenderComponent index={index} setOpen={setOpen}/>
          </DialogContent>
        </Dialog>
        <TimePicker
          index={index}
          is12HourFormat={
            formData?.hour_format_id == timeFormat12HoursId ? true : false
          }
        />
        <div className="w-[127px] flex gap-4 ">
          {index == formData?.schedules?.length - 1 && (
            <div
              onClick={() => {
                handleAddSession();
              }}
              className="text-[#7677F4] font-normal cursor-pointer flex items-center gap-[6px]"
            >
              <Add /> {t("add_button")}
            </div>
          )}
          {formData?.schedules?.length > 1 && (
           <Dialog open={deleteSession} onOpenChange={setDeleteSession}>
             <DialogTrigger
             onClick={() => {
              setDeleteSession(true)
             }}
             className="text-[#7677F4] font-normal cursor-pointer flex items-center gap-[6px]"
             >
             <Delete />
             {t('delete_button')}
             </DialogTrigger>
             <DialogContent className="w-[414px] h-[189px] !py-6 !px-6 !rounded-[24px]">
             <DialogHeader>
             <DialogTitle className="flex justify-center">{t('delete_button')}</DialogTitle>
             <DialogDescription className="flex justify-center !pt-[14px] text-[16px] text-[#333333]">
               {t('new_strings:are_you_sure_you_want_to_delete_the_session')}
             </DialogDescription>
             </DialogHeader>
             <DialogFooter className="w-full flex !justify-center gap-6">
             <DialogClose>
             <Button className="border border-[#7677F4] bg-[white] w-[71px] h-[46px] text-[#7677F4] font-semibold">
                {t('no_button')}
             </Button>
             </DialogClose>
             <DialogClose>
             <Button
              className="bg-[#7677F4] w-[71px] h-[46px] rounded-[12px] font-semibold"
              onClick={() => {
              handleRemoveSession(index)
              }}
             >
             {t('yes')}
             </Button>
             </DialogClose>
             </DialogFooter>
             </DialogContent>
           </Dialog>
          )}
        </div>
      </div>
  
      {errors?.schedules &&
        errors?.schedules?.length > 0 &&
        errors?.schedules?.[index] && (
          <span className="text-[#FF6D6D] text-[12px]">
            {errors?.schedules?.[index]?.message as string}
          </span>
        )}
    </div>
  );
};

const Venue = () => {
  const { t } = useTranslation(["course.new_course", "new_strings"]);

  const { watch, setValue, resetField,clearErrors } = useFormContext();

  const removeVenue = () => {
    setValue("newVenue", undefined);
    // After click remove then due to the following fields are not removed before, because of that
    // due to the reset field in the add new venue function the data which is already present we did not removed is prefilling
    // So we are removing the data for the following fields also.
    setValue("state_id", undefined);
    setValue("name", undefined);
    setValue("city_id", undefined);
    setValue("center_id", undefined);
    setValue("postal_code", undefined);
    setValue("address", undefined);
  };

  const formData = watch();
  const { errors } = useFormState();

  const {
    field: { onChange: isNewVenueOnchange },
    fieldState: { error: isVenueSelectedError },
  } = useController({
    name: "isNewVenue",
  });

  const { data } = useList({
    resource: "venue",
  });

  const {
    field: { value: existingVenue },
  } = useController({
    name: "existingVenue",
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "is_existing_venue",
  });

  const supabase = supabaseClient();

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const [openAddNewVenue, setOpenAddNewVenue] = useState(false);

  const [warningmessage, setwarningmessage] = useState(false);
  // here we are quering because if we create a new venue details with already existing venue data it should not be duplicated we need to show some warning message
  // for showing the warning message we created a state variable with intial value false
  // if the form data matches with the already existing the venue we are updating the state to true...
  const handleAddNewVenue = async () => {
    const { data } = await supabase
      .from("venue")
      .select("*")
      .eq("state_id", formData?.state_id)
      .eq("center_id", formData?.center_id)
      .eq("city_id", formData?.city_id)
      .eq("address", formData?.address)
      .eq("postal_code", formData?.postal_code)
      .eq("name", formData?.name);

    const isAllFieldsFilled = await ValidateCurrentStepFields([
      "city_id",
      "center_id",
      "state_id",
      "name",
      "address",
      "postal_code",
    ]);

    if (isAllFieldsFilled) {
      if (data && data?.length > 0) {
        // here we are updating state to true to show the warning message
        setwarningmessage(true);
      } else {
        const newVenueData={
          city_id: formData?.city_id,
          city: formData?.city,
          state_id: formData?.state_id,
          state: formData?.state,
          center_id: formData?.center_id,
          center: formData?.center,
          postal_code: formData?.postal_code,
          address: formData?.address,
          name: formData?.name,
        }
        //Requirement: Fee is fetch based on program_type,location and course start date.So when ever New Venue's state_id,city_id and center_id is changed need to remove existing fee levels.
        if(!(formData?.newVenue?.state_id==newVenueData?.state_id && formData?.newVenue?.city_id==newVenueData?.city_id && formData?.newVenue?.center_id==newVenueData?.center_id)){
          setValue("program_fee_level_settings",[])
          setValue("is_early_bird_enabled",undefined)
          setValue("early_bird_cut_off_period",undefined)
          setTimeout(() => {
            clearErrors(["program_fee_level_settings","is_early_bird_enabled","early_bird_cut_off_period"]);
          }, 10);
        }
        setValue("newVenue", newVenueData);
        onChange("new-venue");
        setOpenAddNewVenue(false);
      }
    } else {
      setOpenAddNewVenue(true);
    }
  };

  const handleOpenEditNewVenue = () => {
    setValue("name", formData?.newVenue?.name);
    setValue("address", formData?.newVenue?.address);
    setValue("state_id", formData?.newVenue?.state_id);
    setValue("state", formData?.newVenue?.state);
    setValue("city_id", formData?.newVenue?.city_id);
    setValue("city", formData?.newVenue?.city);
    setValue("center_id", formData?.newVenue?.center_id);
    setValue("center", formData?.newVenue?.center);
    setValue("postal_code", formData?.newVenue?.postal_code);
    isNewVenueOnchange(true);
    setOpenAddNewVenue(true);
  };

  const handleOpenAddNewVenue = () => {
    // we are making the state varaible to false for not showing the warning message so that after
    // closing the dialog it will not show the data
    setwarningmessage(false);
    resetField("center_id");
    resetField("state_id");
    resetField("address");
    resetField("postal_code");
    resetField("city_id");
    resetField("name");
    isNewVenueOnchange(true);
    setOpenAddNewVenue(true);
  };

  const handleRemoveFeeLevel=()=>{
    //Requirement: Fee is fetch based on program_type,location and course start date.So when ever venue is changed need to remove existing fee levels.
    setValue("program_fee_level_settings", []);
    setValue("is_early_bird_enabled", undefined);
    setValue("early_bird_cut_off_period", undefined);
    setTimeout(() => {
      clearErrors([
        "program_fee_level_settings",
        "is_early_bird_enabled",
        "early_bird_cut_off_period"
      ]);
    }, 10);
  }

  return (
    <div>
      <RadioGroup
        className="flex flex-row gap-7"
        value={value}
        onValueChange={(val)=>{onChange(val);handleRemoveFeeLevel();}}
      >
        <Label htmlFor="existing-venue" className="flex-[1]">
          <div
            className={`rounded-[16px] h-[118px] relative flex py-[24px] px-6 flex-col ${
              value === "existing-venue"
                ? "border border-[#7677F4]"
                : "border border-[#D6D7D8]"
            }`}
          >
            <div className="text-[#7677F4] text-[16px] font-semibold flex flex-row gap-[12px]">
              {formData?.existingVenue !== undefined && (
                <RadioGroupCircleItem
                  value={"existing-venue"}
                  id="existing-venue"
                  className={` ${
                    value == "existing-venue"
                      ? "!bg-[#7677F4] "
                      : "border !border-[#D6D7D8] border-[1.5px] "
                  }`}
                />
              )}
              {/* If we not selected the existing venue then it is not in the position moving to the left so if we not selected then we are adjusting it with the ml */}
              <div>
                {t("course.new_course:time_and_venue_tab.existing_venue")}
              </div>
            </div>
            {data ? (
              <div className="h-full">
                {existingVenue ? (
                  <ExistingVenueDetails />
                ) : (
                  <div className="leading-6 font-normal">
                    {t("new_strings:select_a_venue_by_clicking_viewall_button")}
                  </div>
                )}
                {/* {!(value === 'new-venue') && ( */}
                <Dialog>
                  <DialogTrigger>
                    <Badge
                      variant="outline"
                      className="absolute right-[43%] -bottom-3 bg-[white] w-[93px] h-[34px] items-center justify-center text-[#7677F4] border border-[#7677F4]"
                    >
                      {t("course.new_course:time_and_venue_tab.view_all")}
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="!w-[858px] h-[585px] !rounded-[24px] !py-[24px] !pl-[24px] !pr-[8px]">
                    <ExistingVenueList />
                  </DialogContent>
                </Dialog>
                {/* )} */}
              </div>
            ) : (
              <div className="px-[30px] leading-6 font-normal">
                {t("new_strings:no_existing_venue_found")}
              </div>
            )}
          </div>
        </Label>
        {formData?.newVenue ? (
          <Label htmlFor="new-venue" className="flex-[1]">
            <div
              className={`h-[118px]  rounded-[16px] border break-all border-[#7677F4] px-4 py-6 ${
                value === "new-venue"
                  ? "border border-[#7677F4]"
                  : "border border-[#D6D7D8]"
              }`}
            >
              <div className=" flex flex-row justify-between">
                <div className="text-[16px] font-semibold text-[#7677F4] gap-3 flex flex-row">
                  {formData?.newVenue !== undefined && (
                    <RadioGroupCircleItem
                      value="new-venue"
                      id="new-venue"
                      className={` ${
                        value == "new-venue"
                          ? "!bg-[#7677F4] "
                          : "border !border-[#D6D7D8] border-[1.5px] "
                      }`}
                    />
                  )}
                  <div>
                    {t("course.new_course:time_and_venue_tab.new_venue")}
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <Dialog
                    open={openAddNewVenue}
                    onOpenChange={setOpenAddNewVenue}
                  >
                    <DialogTrigger onClick={handleOpenEditNewVenue}>
                      <EditIcon />
                    </DialogTrigger>
                    <DialogContent className="!w-[636px] !h-[430px] pt-6 px-[25px] rounded-6">
                      <AddOrEditVenue handleSubmit={handleAddNewVenue} />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger>
                      <Delete />
                    </DialogTrigger>
                    <DialogContent className="w-[414px] h-[189px] !py-6 !px-6 !rounded-[24px]">
                      <DeleteVenueComponent
                        handleDeleteVenue={() => {
                          onChange(undefined);
                          if (
                            existingVenue !== undefined &&
                            existingVenue !== null
                          ) {
                            onChange("existing-venue");
                          }
                          removeVenue();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <NewVenueDetails />
            </div>
          </Label>
        ) : (
          <Dialog open={openAddNewVenue} onOpenChange={setOpenAddNewVenue}>
            <DialogTrigger onClick={handleOpenAddNewVenue} className="flex-[1]">
              <div className="h-[118px] rounded-[16px] border flex items-center justify-center text-[#7677F4]">
                + {t("course.new_course:time_and_venue_tab.add_new_venue")}
              </div>
            </DialogTrigger>
            <DialogContent className="!w-[636px] !h-[430px] pt-6 px-[25px] !rounded-[24px]">
              <AddOrEditVenue
                handleSubmit={handleAddNewVenue}
                message={warningmessage}
              />
            </DialogContent>
          </Dialog>
        )}
      </RadioGroup>
      {/* 
      In errors if we have the error for the is_existing_venue then we will display the message 
       */}
      {errors?.is_existing_venue && (
        <span className="text-[#FF6D6D] text-[14px]">
          {"Venue is a required field"}
        </span>
      )}
    </div>
  );
};

const NewVenueDetails = () => {
  const { getValues } = useFormContext();
  const {
    newVenue: { city_id, address, postal_code, name },
  } = getValues();

  const { data, isLoading } = useOne({
    resource: "city",
    id: city_id,
    meta: {
      select: "*,state_id(*)",
    },
  });

  console.log("new venue data is", data);

  if (isLoading) {
    return <div className="loader !w-[30px]"></div>;
  }

  return (
    <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666] h-full overflow-y-scroll">
    {name  ? `${name}, ` : ''}
    {address  ? `${address}, ` : ''}{data?.data?.name}, {data?.data?.state_id?.name}
    {postal_code  ? `, ${" "}${postal_code} ` : ''}
  </div>
  );
};

const ExistingVenueDetails = () => {
  const { getValues } = useFormContext();
  const { existingVenue } = getValues();

  //Requirement: Need to show selected venue data. Selected venue is stored in existingVenue form variable.will store only city_is and state_id in existingVenue.
  const { data: cityData, isLoading } = useOne({
    resource: "city",
    meta: { select: "name,state(name)" },
    id: existingVenue?.city_id,
  });

  if (isLoading) {
    return <div className="loader !w-[30px]"></div>;
  }

  return (
    <div className="ml-7 text-wrap text-[16px] h-full font-normal leading-6 text-[#666666] break-all overflow-y-auto ">
      {existingVenue?.name?`${existingVenue?.name}, `:""}{existingVenue?.address?`${existingVenue?.address}, `:''}{cityData?.data?.name},{" "}
      {cityData?.data?.state.name}{existingVenue?.postal_code?`, ${existingVenue?.postal_code}`:''}
    </div>
  );
};

const TimePicker = ({
  index,
  is12HourFormat,
}: {
  index: number;
  is12HourFormat: Boolean;
}) => {
  const { t } = useTranslation("course.new_course");

  const { errors }: any = useFormState();

  const { trigger } = useFormContext();

  const formData = useWatch();

  const { schedules } = formData;

  /**
   * This useEffect we are writing on two reasons
   * We are using this useEffect to trigger the validation
   * Reason 1: Because of we are prefilling next schedule with previous schedule this useEffect will not harm us
   * Reason 2: We need to validate the current changing schedule because we need red errors on the fly
   * Implementation 1: We need to keep schedules in dependency array so what ever i am changing the current schedule we will get only that error
   * Implementation 2: We need to trigger the validation on schedules
   */
  useEffect(() => {
    trigger(`${NewCourseStep3FormNames?.schedules}`);
  }, [schedules[index]]);

  return (
    <div className="flex items-center gap-6">
      <div className="text-sm text-[#999999] font-normal">
        {t("course.new_course:time_and_venue_tab.from")}
      </div>
      <div className="w-[233px]">
        <TimeSelector
          name={`${NewCourseStep3FormNames?.schedules}[${index}].start`}
          is12HourFormat={is12HourFormat}
          error={errors?.schedules?.[index] ? true : false}
        />
      </div>
      <div className="text-sm text-[#999999] font-normal">
        {t("course.new_course:time_and_venue_tab.to")}
      </div>
      <div className="w-[233px]">
        <TimeSelector
          name={`${NewCourseStep3FormNames?.schedules}[${index}].end`}
          is12HourFormat={is12HourFormat}
          error={errors?.schedules?.[index] ? true : false}
        />
      </div>
    </div>
  );
};
const CalenderComponent = ({ index, setOpen }: any) => {
  const { t } = useTranslation(["common", "course.new_course"]);
  // Get the date value and onChange function from the controller
  const {
    field: { value: dateValue, onChange },
    formState: { dirtyFields },
  } = useController({
    name: `${NewCourseStep3FormNames?.schedules}[${index}].date`,
  });

  const [pageSize, setPageSize] = useState(10);

  const { trigger, watch,getValues,setValue,clearErrors } = useFormContext();

  const formData = watch();
  const {schedules}=getValues()
  /**
   * This variable holds the state id
   */
  let stateId: number = 0;

  /**
   * This variable holds the city id
   */
  let cityId: number = 0;

  /**
   * Getting settings Program type databased on program type id form form 
   */
  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: formData?.program_type_id,
  });


  //we need to check whether it is online program or not and the we need to assign state , city ids
  if (programTypeData?.data?.is_online_program) {
    stateId = formData?.state_id;
    cityId = formData?.city_id;
  } else {
    if (formData.is_existing_venue == "new-venue") {
      stateId = formData?.newVenue?.state_id;
      cityId = formData?.newVenue?.city_id;
    } else if (formData?.is_existing_venue == "existing-venue") {
      stateId = formData?.existingVenue?.state_id;
      cityId = formData?.existingVenue?.city_id;
    }
  }

  // Initialize state for the selected date, defaulting to the provided dateValue or today's date
  const [date, setDate] = useState<any>(dateValue ? dateValue : new Date());
  // Fetch organization calendar settings
  const { data: settingsData } = useList<any>({
    resource: "organization_calender_settings",
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: formData?.organization_id,
      },
    ],
  });
  // Define filters based on the selected date
  const dateFilters: CrudFilters = [
    {
      field: "start_time",
      operator: "gte",
      value: date && new Date(date?.setHours(0, 0, 0, 0))?.toISOString(),
    },
    {
      field: "end_time",
      operator: "lt",
      value:
        date && new Date(date?.getTime() + 24 * 60 * 60 * 1000)?.toISOString(),
    },
  ];
  // Add additional filters based on organization calendar settings
  const filter = [...dateFilters];
  if (settingsData?.data && settingsData?.data?.length > 0) {
    if (settingsData?.data[0]?.is_city_enabled) {
      filter.push({
        field: "program_id.city_id.id",
        operator: "eq",
        value: cityId,
      });
    }
    if (settingsData?.data[0]?.is_state_enabled && stateId) {
      filter.push({
        field: "program_id.state_id.id",
        operator: "eq",
        value: stateId,
      });
    }
    if (settingsData?.data[0]?.Is_venue_enabled && formData?.venue_id) {
      filter.push({
        field: "program_id.venue_id",
        operator: "eq",
        value: formData?.venue_id,
      });
    }
  } else {
    //If there is no settings data then it default to should show courses based on city and selected date
    filter.push({
      field: "program_id.city_id.id",
      operator: "eq",
      value: cityId,
    });
  }

  // Fetch program schedules based on the filters
  const { data } = useList<any>({
    resource: "program_schedules",
    meta: {
      select:
        "*,program_id!inner(program_type_id!inner(name),city_id!inner(id ,name),state_id!inner(id ,name),venue_id))",
    },
    pagination: {
      pageSize: pageSize,
    },
    filters: filter,
  });

  // Handle date selection in the calendar
  const handleOnSelect = (selected: Date | undefined) => {
    setDate(selected);
  };
  // Format time string
  const formatTime = (timeString: string) => {
    const dateObj = new Date(timeString);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };

  //Need to check weather start date of course is changed or not.
  const handleRemoveFeeLevel=(date:any)=>{
  const {schedules}=getValues()
  //In order to check weather changed date is course start date or not.
  //Taking two variables sort them and compare first object.if first object is changed then start date is changed. 
  let originalSchedule=_.cloneDeep(schedules)
  let tempSchedule=_.cloneDeep(schedules)
  
  //Updating temporary variable
  tempSchedule[index].date=date

  //sorting original schedule
  let sortedOriginalSchedules = originalSchedule?.sort(
    (a: any, b: any) => {
      let aDate = new Date(a.date);
      aDate.setHours(a?.startHour, a?.startMinute);

      let bDate = new Date(b.date);
      bDate.setHours(b?.startHour, b?.startMinute);

      return aDate.getTime() - bDate.getTime();
    }
  );

  //sorting temporary schedule
  let sortedTempSchedules = tempSchedule?.sort(
    (a: any, b: any) => {
      let aDate = new Date(a.date);
      aDate.setHours(a?.startHour, a?.startMinute);

      let bDate = new Date(b.date);
      bDate.setHours(b?.startHour, b?.startMinute);

      return aDate.getTime() - bDate.getTime();
    }
  );

  //After sorting if first schedule is different for both original and temporary schedule then user as changed start date of course (start date is first schedule)
  if(sortedOriginalSchedules?.[0]?.date.getTime()!=sortedTempSchedules?.[0]?.date.getTime()){
    //Requirement: Fee is fetch based on program_type,location and course start date.So when ever start date of schedule is changed need to remove existing fee levels.
    setValue("program_fee_level_settings",[])
    setValue("is_early_bird_enabled",undefined)
    setValue("early_bird_cut_off_period",undefined)
    setTimeout(() => {
      clearErrors(["program_fee_level_settings","is_early_bird_enabled","early_bird_cut_off_period"]);
    }, 10);
  }

  }
  return (
    <div className="flex flex-col gap-4">
      <div className="h-[401px] flex flex-row gap-4">
        {/* Calendar component */}
        <div className="flex-[1]">
          <DateCalendar
            mode="single"
            selected={date}
            onSelect={handleOnSelect}
            className="rounded-md"
            count={data?.total || 0}
          />
        </div>
        {/* Course details */}
        <div className="border-l border-gray-300 h-full"></div>
        <div className="flex flex-col gap-4 flex-[1] p-2 h-[401px]">
          <div className="flex flex-row justify-between text-[20px] font-semibold">
            {t("course.new_course:time_and_venue_tab.course")}
            {/* Close button */}
          </div>

          {/* Added get scroll alert so that when we reached at end of the scroll another set of records will loads */}
          <GetScrollTypesAlert
            id="course-calender"
            onBottom={() => {
              if (data && (data?.total as number) >= pageSize) {
                setPageSize((previousLimit: number) => previousLimit + 10);
              }
            }}
          >
            <div
              id={"course-calender"}
              className="flex flex-col gap-4 max-h-[352px] scrollbar overflow-y-auto"
            >
              {/* Display course details */}
              {data?.data?.map((course: any) => (
                <div key={course.id}>
                  <div className="text-[12px] text-[#999999] tracking-wider font-semibold">
                    {formatTime(course.start_time)} -{" "}
                    {formatTime(course?.end_time)} .{" "}
                    {course?.program_id?.city_id?.name},{" "}
                    {course?.program_id?.state_id?.name}
                  </div>
                  <div className="font-semibold text-[16px]">
                    {translatedText(course.program_id?.program_type_id?.name)}
                  </div>
                </div>
              ))}
            </div>
          </GetScrollTypesAlert>
        </div>
      </div>
      {/* Submit button */}
      <div className="flex self-center">
        <Button
          onClick={() => {
            handleRemoveFeeLevel(date)
            onChange(date);
            setOpen(false);

            // we need to validate schedules after date changes to get instant errors
            trigger("schedules");
          }}
          className="w-24 rounded-[12px]"
        >
          {t("save_button")}
        </Button>
      </div>
    </div>
  );
};

const ExistingVenueList = () => {
  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);
  const { data: loginUserData }: any = useGetIdentity();

  const { watch ,setValue,clearErrors} = useFormContext();

  const formData = watch();

  const [searchValue, searchOnChange] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [otherVenueSkip, setOtherVenueSkip] = useState<number>(0);

  const [venueData, setVenueData] = useState<any[]>([]);

  const {
    field: { onChange: isNewVenueSelectedOnchange },
  } = useController({
    name: "isNewVenueSelected",
  });

  const {
    field: { value: existingVenue, onChange: existingVenueOnChange },
  } = useController({
    name: "existingVenue",
  });

  const {
    field: { value: deletedVenueIds = [] },
  } = useController({
    name: "deletedVenueID",
  });

  //Fetching initial Data of venues
  useEffect(() => {
    if (venueData?.length == 0) fetchVenueData();
  }, []);

  //Fetching venue data after search
  useEffect(() => {
    setIsLoading(true);
    setVenueData([]);
    setOtherVenueSkip(0);

    fetchVenueData();
  }, [debouncedSearchValue]);

  const fetchVenueData = async () => {
    const loginUserVenues = ((await fetchLoginUserVenue()) as any[]) ?? [];
    const otherVenueData = ((await fetchOtherVenues()) as any[]) ?? [];
    let modifiedVenueData = [...loginUserVenues, ...otherVenueData];
    if (existingVenue) {
      modifiedVenueData = [existingVenue, ...modifiedVenueData];
      modifiedVenueData = _.uniqBy(modifiedVenueData, "id");
    }
    setVenueData(modifiedVenueData);
    setIsLoading(false);
  };
/**
   * we are writing the is_existing_venue controller here because we need to update the is_existing_venue when we click on the submit of the existing venue
   */
const {
  field: { onChange: isExistingVenueOnchange },
} = useController({
  name: "is_existing_venue",
});


  const fetchLoginUserVenue = async () => {
    const supabase = supabaseClient();

    const { data } = await supabase
      .from("venue_view_with_names")
      .select("*")
      .eq("created_by_user_id", loginUserData?.userData?.id)
      .or(
        `name.ilike."%${debouncedSearchValue}%",state_name.ilike.%${debouncedSearchValue}%,city_name.ilike."%${debouncedSearchValue}%",center_name.ilike."%${debouncedSearchValue}%"`
      )
      .eq("is_deleted", false); // this line to filter out records where is_deleted is false

    return data;
  };
  const fetchOtherVenues = async () => {
    const supabase = supabaseClient();

    const { data } = await supabase
      .from("venue_view_with_names")
      .select("*")
      .neq("created_by_user_id", loginUserData?.userData?.id)
      .or(
        `name.ilike."%${debouncedSearchValue}%",state_name.ilike.%${debouncedSearchValue}%,city_name.ilike."%${debouncedSearchValue}%",center_name.ilike."%${debouncedSearchValue}%"`
      )
      .eq("is_deleted", false) // this line to filter out records where is_deleted is false
      .range(otherVenueSkip, otherVenueSkip + 5);
    return data;
  };

  //fetching other venue data after scrolling
  useEffect(() => {
    const fetchOtherVenueDataAfterScroll = async () => {
      const otherVenueData = ((await fetchOtherVenues()) as any[]) ?? [];
      setVenueData([...filteredVenueData, ...otherVenueData]);
    };
    fetchOtherVenueDataAfterScroll();
  }, [otherVenueSkip]);

  //Fetching venue data after search
  useEffect(() => {
    setVenueData([]);
    setOtherVenueSkip(0);

    fetchVenueData();
  }, [debouncedSearchValue]);

  const onBottomReached = () => {
    if (filteredVenueData && filteredVenueData?.length >= 6)
      setOtherVenueSkip((previousLimit: number) => previousLimit + 6);
  };

  const handleSubmitVenueList = () => {
    const existingVenueObject = venueData.filter(
      (venue) => venue.id == formData[NewCourseStep3FormNames.venue_id]
    );

    //Requirement: Fee is fetch based on program_type,location and course start date.So when ever venue is changed need to remove existing fee levels.
    if(existingVenue?.id!=existingVenueObject?.[0]){
      setValue("program_fee_level_settings",[])
      setValue("is_early_bird_enabled",undefined)
      setValue("early_bird_cut_off_period",undefined)
      setTimeout(() => {
        clearErrors(["program_fee_level_settings","is_early_bird_enabled","early_bird_cut_off_period"]);
      }, 10);
    }

    existingVenueOnChange(existingVenueObject?.[0]);
  };

  let filteredVenueData = venueData.filter(
    (obj: { id: number }) => !deletedVenueIds.includes(obj.id)
  );

  return (
    <div>
      <div className="rounded-[24px] ">
        <div className="flex justify-center text-[24px] font-semibold">
          {t("course.new_course:time_and_venue_tab.existing_venues")}
        </div>
        <div className="relative w-[390px] h-[40px] flex justify-end items-center mx-auto mt-4">
          <Input
            placeholder={t("new_strings:search_by_venue_name_city_or_state")}
            className="border border-gray-400 rounded-lg pl-10"
            value={searchValue}
            onChange={(val) => {
              searchOnChange(val.target.value);
            }}
          />
          <div className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground">
            <SearchIcon />
          </div>
        </div>
        <GetScrollTypesAlert
          id={"options"}
          onBottom={() => {
            onBottomReached();
          }}
        >
          <div
            className="h-[330px] mt-6 overflow-auto overscroll-none flex flex-row flex-wrap gap-6 gap-x-[30px] gap-y-[24px]"
            id={"options"}
          >
            {/* <div className="flex flex-row flex-wrap gap-6 "> */}

            {/* loader for existing venue list  */}
            {filteredVenueData?.length === 0 ? (
              <div className="flex w-[100%] flex-row items-center justify-center">
                {isLoading ? <div className="loader"></div> : <p>No Venues</p>}
              </div>
            ) : (
              filteredVenueData?.map((item: any, index: number) => (
                <ExistingVenueListSection
                  venueData={venueData}
                  setVenueData={setVenueData}
                  item={item}
                  index={index}
                />
              ))
            )}
          </div>
        </GetScrollTypesAlert>
      </div>
      <div className="w-full flex items-center justify-center mt-8">
        <DialogClose>
          <Button
            type="submit"
            onClick={() => {
              isNewVenueSelectedOnchange("existing-venue");
              formData[NewCourseStep3FormNames.venue_id] && isExistingVenueOnchange("existing-venue")
              handleSubmitVenueList();
            }}
          >
            {t("save_button")}
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export const ExistingVenueListSection = ({
  venueData,
  setVenueData,
  item,
  index,
}: any) => {
  const { data: loginUserData }: any = useGetIdentity();
  const { setValue, watch } = useFormContext();
  const formData = watch();
  const [openExistingVenue, setOpenExistingVenue] = useState(false);

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const isVenueSelected =
    formData[NewCourseStep3FormNames.venue_id] === item.id;

  const {
    field: { onChange: setIsNewVenue },
  } = useController({
    name: "isNewVenue",
  });

  // for checking user has edited the existing venue
  const {
    field: { onChange: setIsExistingVenueEdited },
  } = useController({
    name: "isExistingVenueEdited",
    defaultValue: false,
  });

  const {
    field: { value: deletedVenueIds = [], onChange: deleteVenueIdOnChange },
  } = useController({
    name: "deletedVenueID",
  });

  const {
    field: { onChange: tempExistingVenueOnChange },
  } = useController({
    name: "tempExistingVenue",
  });


  const handleCheckboxChange = (item: any) => {
    setValue(NewCourseStep3FormNames.venue_id, item.id);
  };

  const handleOpenExistingVenue = (item: any) => {
    setIsNewVenue(false);
    setValue("name", item?.name);
    setValue("address", item?.address);
    setValue("state_id", item?.state_id);
    setValue("city_id", item?.city_id);
    setValue("center_id", item?.center_id);
    setValue("postal_code", item?.postal_code);
  };

  const handleSubmitExistingVenue = async (index: number) => {
    const supabase = supabaseClient();

    const { data } = await supabase
      .from("venue")
      .select("*")
      .eq("state_id", formData?.state_id)
      .eq("center_id", formData?.center_id)
      .eq("city_id", formData?.city_id)
      .eq("address", formData?.address)
      .eq("postal_code", formData?.postal_code)
      .eq("name", formData?.name);

    const isAllFieldsFilled = await ValidateCurrentStepFields([
      "city_id",
      "center_id",
      "state_id",
      "name",
      "address",
      "postal_code",
    ]);

    const allVenuesData = [...venueData];
    allVenuesData[index] = {
      ...allVenuesData[index],
      name: formData?.name,
      address: formData?.address,
      state_id: formData?.state_id,
      city_id: formData?.city_id,
      center_id: formData?.center_id,
      postal_code: formData?.postal_code,
    };

    //Requirement: Need to show updated data in venue list.So storing edited venue data in tempExistingVenue form variable
    tempExistingVenueOnChange({
      id: formData?.venue_id,
      name: formData?.name,
      address: formData?.address,
      state_id: formData?.state_id,
      city_id: formData?.city_id,
      center_id: formData?.center_id,
      postal_code: formData?.postal_code,
    });

    if (isAllFieldsFilled) {
      setVenueData(allVenuesData);
      setOpenExistingVenue(false);
      // we are checking whether the user edited any value
      setIsExistingVenueEdited(data && data.length > 0 ? false : true);
    } else {
      setOpenExistingVenue(true);
    }
  };

  const deleteVenue = (id: any) => {
    deleteVenueIdOnChange([...deletedVenueIds, id]);
  };

  const user_roles: any[] = loginUserData?.userData?.user_roles;

  const isUserNationAdminOrSuperAdmin = user_roles?.find(
    (role) =>
      role.role_id.order == NATIONAL_ADMIN || role.role_id.order == SUPER_ADMIN
  );
  return (
    <div className="flex flex-row justify-between !w-[390px] h-[102px] items-start space-x-3 space-y-0 rounded-[16px] border p-4 overflow-y-scroll break-all">
      <Checkbox
        id={item.id}
        value={item.id}
        onCheckedChange={() => handleCheckboxChange(item)}
        checked={
          formData[NewCourseStep3FormNames.venue_id] == item.id ? true : false
        }
      />
      <div className="space-y-1 leading-none w-full">

      {item.name ? (
  <>
    <div className="font-semibold">{item.name}</div>
    <VenueItem item={item} />
  </>
) : (
  <div><VenueItem item={item} /></div>
)}

      </div>
      <div className="flex flex-row gap-3">
            {(item?.created_by_user_id == loginUserData?.userData?.id ||
              isUserNationAdminOrSuperAdmin) && (
              <Dialog
                open={openExistingVenue}
                onOpenChange={setOpenExistingVenue}
              >
                <DialogTrigger
                  className={
                    !isVenueSelected
                      ? "cursor-not-allowed  opacity-50"
                      : "opacity-none"
                  }
                  disabled={!isVenueSelected}
                  onClick={() => {
                    handleOpenExistingVenue(item);
                  }}
                >
                  <EditIcon />
                </DialogTrigger>
                <DialogContent className="!w-[636px] !h-[430px] pt-6 px-[25px] rounded-6">
                  <AddOrEditVenue
                    handleSubmit={() => {
                      handleSubmitExistingVenue(index);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
            {isUserNationAdminOrSuperAdmin && (
              // isUserNationAdminOrSuperAdmin
              <Dialog>
                <DialogTrigger>
                  <Delete />
                </DialogTrigger>
                <DialogContent className="w-[414px] h-[189px] !py-6 !px-6 !rounded-[24px]">
                  <DeleteVenueComponent
                    handleDeleteVenue={() => {
                      deleteVenue(item?.id);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
    </div>
  );
};

/**
 * @function VenueItem is used to show each venue details in venue list
 * @item consist of all details of venue
 */
const VenueItem = ({ item }: { item: any }) => {
  const { watch } = useFormContext();

  const formData = watch();

  const tempExistingVenue = formData?.tempExistingVenue;

  //Requirment: If user Edit any of the information in venue.Need to show Edited Venue Data.
  //Edit venue data is stored in tempExistingVenue variable. so if venue is edited need to show tempExistingVenue data else need to show API Data.
  if (
    formData?.venue_id == item?.id &&
    formData?.venue_id == tempExistingVenue?.id
  ) {
    const { data: cityData, isLoading } = useOne({
      resource: "city",
      meta: { select: "name,state_id(name)" },
      id: tempExistingVenue?.city_id,
    });

    if (isLoading) {
      return <div className="loader"></div>;
    }

    return (
      <div>
        {tempExistingVenue.name?`${tempExistingVenue.name}, `:''}{tempExistingVenue.address?`${tempExistingVenue.address}, `:""}
        {cityData?.data?.name}, {cityData?.data?.state_id?.name}
        {tempExistingVenue.postal_code?`, ${tempExistingVenue.postal_code}`:''}
      </div>
    );
  } else {
    return (
      <div className="leading-tight">
        {item.name?`${item.name}, `:''}{item.address?`${item.address}, `:''}{item.city_name}, {item.state_name}
        {item.postal_code ?`, ${item.postal_code}`:''}
      </div>
    );
  }
};

export const AddOrEditVenue = ({
  handleSubmit,
  message,
}: {
  handleSubmit: () => void;
  message?: boolean;
}) => {
  const { watch } = useFormContext();

  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);

  const formData = watch();

  const isNewVenue = formData?.isNewVenue;

  return (
    <div>
      {isNewVenue ? (
        <div className="flex justify-center text-[24px] font-semibold mb-5">
          {t("course.new_course:time_and_venue_tab.new_venue")}
        </div>
      ) : (
        <div className="flex justify-center text-[24px] font-semibold">
          {t("new_strings:edit_venue")}
        </div>
      )}
      {/* TODO : Integrated after solving the error }
      {/* <MapComponent /> */}
      {/* <div className="w-[586px] h-[140px] border my-5"></div> */}
      <div className="flex flex-row gap-[30px] mt-10">
        <div className="flex flex-col gap-5">
          <VenueNameComponent />
          <PostalCodeComponent />
          <CityDropDown name="city_id" />
        </div>

        <div className="flex flex-col gap-5">
          <StreetAddressComponent />
          <StateDropDown name="state_id" />
          <CenterDropDown name="center_id" />
        </div>
      </div>
      {message && (
        <span className="text-[#FF6D6D] text-[14px] text-md">
          {t("new_strings:venue_with_the_provided")}
        </span>
      )}
      <DialogFooter>
        <div className="w-full flex items-center justify-center mt-8">
          <Button onClick={handleSubmit}>{t("save_button")}</Button>
        </div>
      </DialogFooter> 
    </div>
  );
};

// Component for selecting time with hour and minute inputs
const TimeSelector = ({
  name, // Name of the time selector
  is12HourFormat, // Boolean indicating whether to display time in 12-hour format
  error,
}: {
  name: string;
  is12HourFormat: Boolean;
  error: boolean;
}) => {
  /**
   * Why we have taken this ref
   * problems
   * 1. We have taken useEffect where it will run every time when user add a new session or any state change.
   * 2. but the useEffect what ever we have written ideally need to run only when time format option change
   * 3. not on initial render
   * Solutions:
   * 1. For this i have taken one isMountingRef variable
   * 2. initially it is false
   * 3. i will not render the useEffect when it is false i will render only isMountingRef is true.
   * 4. The main goal behind this we are already adding a new session when user click on Add button in handleAddSession() function
   * 5. at that its better to not to run the useEffect
   */
  const isMountingRef = useRef(false);

  // Maximum hours depending on the time format
  const maximumHours = is12HourFormat ? "12" : "23";
  // Extracting hour value and onChange function using useController hook
  const {
    field: { value: hourValue = "00", onChange: hourOnChange },
  } = useController({ name: `${name}Hour` });
  // Extracting minute value and onChange function using useController hook
  const {
    field: { value: minuteValue = "00", onChange: minuteOnChange },
  } = useController({ name: `${name}Minute` });

  // Extracting time format value and onChange function using useController hook
  const {
    field: { value: timeFormat = "AM", onChange: timeFormatOnChange },
  } = useController({ name: `${name}TimeFormat` });

  // Function to preprocess input value (add leading zeros and remove non-numeric characters)
  const preProcessInputValue = (value: string): string => {
    while (value.length < 2) {
      value = "0" + value;
    }
    // Remove any non-numeric characters from the input
    const numericValue = value.replace(/[^0-9]/g, "");
    // Truncate to 2 characters
    const truncatedValue = numericValue.slice(-2);
    return truncatedValue;
  };
  // Event handler for hour input change
  const handleHour = (event: { target: { value: any } }) => {
    let inputValue = event.target.value;
    const hour = preProcessInputValue(inputValue);
    hourOnChange(hour);
  };
  // Event handler for incrementing hour
  const handleHourUpArrow = () => {
    //if it is 12 hour format we need to check if it 01 or not if it is 01 then we need to set to maximum hours
    if (is12HourFormat && hourValue == "01") {
      hourOnChange(maximumHours);
      return;
    }
    //if it is 24 hour format we need to check if it 00 or not if it is 00 then we need to set to maximum hours
    if (!is12HourFormat && hourValue == "00") {
      hourOnChange(maximumHours);
      return;
    }

    let hour = (parseInt(hourValue) - 1).toString();
    hour = preProcessInputValue(hour);
    hourOnChange(hour);
  };
  /**
   * Event handler for incrementing  the hour.
   *
   * If the current hour value is greater than or equal to the maximum hours,
   * depending on whether the time format is 12-hour or not, it handles the
   * increment accordingly.
   */
  const handleHourDownArrow = () => {
    // Temporary variable to hold the hour value
    let tempHourValue = hourValue;

    // Check if the current hour is greater than or equal to the maximum hours
    if (tempHourValue >= maximumHours) {
      // If the time format is not 12-hour, set the hour to 00
      if (is12HourFormat === false) {
        hourOnChange("00");
        return;
      } else {
        // If the time format is 12-hour, set the tempHourValue to 00
        tempHourValue = "00";
      }
    }

    // Increment the tempHourValue and update the hour value
    let hour = (parseInt(tempHourValue) + 1).toString();
    hour = preProcessInputValue(hour);
    hourOnChange(hour);
  };
  // Event handler for minute input change
  const handleMinute = (event: { target: { value: any } }) => {
    let inputValue = event.target.value;
    const minute = preProcessInputValue(inputValue);
    minuteOnChange(minute);
  };
  // Event handler for incrementing minutes
  const handleMinutesUpArrow = () => {
    if (minuteValue == "00") {
      minuteOnChange("59");
      return;
    }
    let minute = (parseInt(minuteValue) - 1).toString();
    minute = preProcessInputValue(minute);
    minuteOnChange(minute);
  };
  // Event handler for decrementing minutes
  const handleMinutesDownArrow = () => {
    if (minuteValue == "59") {
      minuteOnChange("00");
      return;
    }
    let minute = (parseInt(minuteValue) + 1).toString();
    minute = preProcessInputValue(minute);
    minuteOnChange(minute);
  };

  // Effect to handle hour format change
  useEffect(() => {
    if (isMountingRef.current === false) return;

    if (is12HourFormat == true) {
      if (hourValue >= 12) {
        // if hourValue is 12 then we dont need to subtract
        // if hourValue is not 12 then we need to subtract
        if (hourValue != 12) {
          const hours = parseInt(hourValue) - 12;
          const newHourValue = preProcessInputValue(hours.toString());
          hourOnChange(newHourValue);
        }

        timeFormatOnChange("PM");
      } else {
        // but here one edge case if there in 24 hour format if hour is 00 then if i change to 12 hour format then i need to keep 12 right now
        if (hourValue == "00") {
          const newHourValue = preProcessInputValue("12");
          hourOnChange(newHourValue);
        }

        // if time is less than 12 then we just need to set AM.
        timeFormatOnChange("AM");
      }
    } else {
      // this block will call if user selects 24 hour format.
      // if timeFormat is AM and hourValue is 12 then we need to set 00
      // if timeFormat is PM then we need to add 12
      // If timeFormat is AM and hourValue is 12 then we set hourValue to 00
      // because in 24 hour format 00 is same as 12 AM
      if (timeFormat == "AM" && hourValue == 12) {
        const newHourValue = preProcessInputValue("00");
        hourOnChange(newHourValue);
      } else if (timeFormat == "PM" && hourValue == 12) {
        // If timeFormat is PM and hourValue is 12 then we need to keep it as it is
        // because in 24 hour format 12 is same as 00 PM
        const newHourValue = preProcessInputValue("12");
        hourOnChange(newHourValue);
      } else if (timeFormat == "PM" && hourValue < 12) {
        // If timeFormat is PM and hourValue is less than 12
        // then we need to add 12 to the hourValue
        // because in 24 hour format PM starts from 12 to 23
        const newHourValue = preProcessInputValue(
          (parseInt(hourValue) + 12).toString()
        );
        hourOnChange(newHourValue);
      } else if (timeFormat == "PM" && hourValue == 12) {
        // If timeFormat is PM and hourValue is 12 then we set hourValue to 00
        // because in 24 hour format 00 is same as 12 PM
        const newHourValue = preProcessInputValue("00");
        hourOnChange(newHourValue);
      }

      // when user change timeFormat from 12 hour format to 24 hour format we need to set timeFormat to null
      // becuase in 24 hour format we dont need to store AM or PM in startTimeFormat and endTimeFormat
      timeFormatOnChange(null);
    }
  }, [is12HourFormat]);

  // if you observe i have written condition on above useEffect
  // and now i will do true so the useEffect will not run initial render
  // but from next render it will run automatically
  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  return (
    <Popover>
      <PopoverTrigger name={`TimeSelector ${name}`}>
        <div
          className={`border border-1 py-[10px] px-[14px] flex justify-between items-center rounded-xl cursor-pointer w-[233px] ${
            error && "border-[red]"
          }`}
        >
          <div className="flex gap-2 items-center">
            <Clock />
            <div>
              {hourValue} : {minuteValue} {is12HourFormat && timeFormat}
            </div>
          </div>
          <div className="px-1 py-[7px]">
            <DropDown />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="!w-[233px] h-[154px] flex items-center justify-center">
        <div className="flex w-[200px] items-center justify-center">
          <div className="flex basis-4/5 items-center justify-center gap-3">
            <div className="flex items-center justify-center flex-col gap-4">
              <div
                className="rotate-180 cursor-pointer"
                onClick={handleHourUpArrow}
              >
                <DropDown fill="#7677F4" />
              </div>
              <div>
                <Input
                  className="w-12"
                  name={`${name}-hours`}
                  value={hourValue}
                  onChange={handleHour}
                  onBlur={() => {
                    if (hourValue > maximumHours) {
                      hourOnChange(maximumHours);
                    }
                  }}
                />
              </div>
              <div className="cursor-pointer" onClick={handleHourDownArrow}>
                <DropDown fill="#7677F4" />
              </div>
            </div>
            :
            <div>
              <div className="flex items-center justify-center flex-col gap-4">
                <div
                  className="rotate-180 cursor-pointer"
                  onClick={handleMinutesUpArrow}
                >
                  <DropDown fill="#7677F4" />
                </div>
                <div>
                  <Input
                    className="w-12"
                    name={`${name}-minutes`}
                    value={minuteValue}
                    onChange={handleMinute}
                    onBlur={() => {
                      if (minuteValue > 59) {
                        minuteOnChange(59);
                      }
                    }}
                  />
                </div>
                <div
                  className="cursor-pointer"
                  onClick={handleMinutesDownArrow}
                >
                  <DropDown fill="#7677F4" />
                </div>
              </div>
            </div>
          </div>
          {is12HourFormat && (
            <div className="flex basis-1/5 flex-col items-center justify-center gap-2">
              <div
                className="w-12 h-10 border border-2 border-[blue] flex items-center justify-center bg-blue-600 text-white font-medium rounded-md cursor-pointer"
                onClick={() => {
                  timeFormatOnChange("AM");
                }}
              >
                AM
              </div>
              <div
                className="w-12 h-10 border border-2 border-[blue] flex items-center justify-center bg-blue-600 text-white font-medium rounded-md cursor-pointer"
                onClick={() => {
                  timeFormatOnChange("PM");
                }}
              >
                PM
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
const DeleteVenueComponent = ({
  handleDeleteVenue,
}: {
  handleDeleteVenue: () => void;
}) => {
  const { t } = useTranslation(["common", "new_strings"]);

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex justify-center">
          {t("delete_button")}
        </DialogTitle>
        <DialogDescription className="flex justify-center !pt-[14px] text-[16px] text-[#333333]">
          {t("new_strings:are_you_sure_you_want_to_delete_the_address")}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="w-full mt-[20px] flex !justify-center gap-6">
        <DialogClose>
          <Button className="border border-[#7677F4] bg-[white] w-[71px] h-[46px] text-[#7677F4] font-semibold">
            {t("no_button")}
          </Button>
        </DialogClose>
        <DialogClose>
          <Button
            className="bg-[#7677F4] w-[71px] h-[46px] rounded-[12px] font-semibold"
            onClick={handleDeleteVenue}
          >
            {t("yes")}
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};
