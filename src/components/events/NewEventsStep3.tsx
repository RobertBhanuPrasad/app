import { AddOrEditVenue } from '@components/course/newCourse/NewCourseStep3'
import CalenderIcon from '@public/assets/CalenderIcon'
import Clock from '@public/assets/Clock'
import DropDown from '@public/assets/DropDown'
import { Checkbox } from 'src/ui/checkbox'

import { useTranslation } from 'next-i18next'
import { useEffect, useRef, useState } from 'react'
import { useController, useFieldArray, useFormContext, useFormState } from 'react-hook-form'
import { NewEventStep3FormNames } from 'src/constants/EventConstants'
import { DateCalendar } from 'src/ui/DateCalendar'
import { Text } from 'src/ui/TextTags'
import { Button } from 'src/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'src/ui/dialog'
import { Input } from 'src/ui/input'
import { Label } from 'src/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from 'src/ui/popover'
import { RadioGroup, RadioGroupCircleItem } from 'src/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/ui/select'
import { getOptionValueObjectByOptionOrder } from 'src/utility/GetOptionValuesByOptionLabel'
import { TIME_FORMAT } from 'src/constants/OptionLabels'
import { TIME_FORMAT_12_HOURS } from 'src/constants/OptionValueOrder'
import { format } from 'date-fns'
import Add from '@public/assets/Add'
import Delete from '@public/assets/Delete'
import _ from 'lodash'

export const NewEventStep3 = () => {
  return (
    <div className="space-y-8 w-full">
      <div>
        <EventVenue />
      </div>
      <EventSessions />
    </div>
  )
}



const EventSessions = () => {
  return(

    <div className="flex flex-col gap-4">
    <EventSchedulesHeader />
    <EventRepeat/>

    <Sessions />

    
  </div>

  )
}

const timeFormatNames = () => [
  {
    value: 1,
    label: '12 Houre Formate'
  },
  {
    value: 2,
    label: '24 Houre Formate'
  }
]

const timeZoneNames = () => [
  {
    value: 1,
    label: 'Time Zone 1'
  },
  {
    value: 2,
    label: 'Time Zone 2'
  }
]

const sessionRepeatNames = () => [
  {
    value: 1,
    label: 'Never Repeate'
  },
  {
    value: 2,
    label: 'Daily'
  },
  {
    value: 3,
    label: 'Weekley'
  },
  {
    value: 4,
    label: 'Monthly'
  }
]
const endsNames = () => [
  {
    value: 1,
    label: 'Ends On'
  },
  {
    value: 2,
    label: 'Ends After'
  },
  {
    value: 3,
    label: 'Never Ends'
  }
]
const dayNames = () => [
  {
    value: 1,
    label: 'Monday'
  },
  {
    value: 2,
    label: 'Tuesday'
  },
  {
    value: 3,
    label: 'Wednesday'
  },
  {
    value: 4,
    label: 'Thrusday'
  },
  {
    value: 5,
    label: 'Friday'
  },
  {
    value: 6,
    label: 'Saturday'
  },
  {
    value: 7,
    label: 'Sunday'
  }
]
const EventRepeat = () => {
  const [selectedValue, setSelectedValue] = useState(undefined)
  const repeatNames = sessionRepeatNames()

  const handleValueChange = (value: any) => {
    setSelectedValue(value)
  }

  return (
    <div className="flex flex-col gap-2 text-xs font-normal text-[#333333]">
      Repeat
      <div className="w-[257px]">
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[257px]">
            <SelectValue placeholder="Never Repeat" />
          </SelectTrigger>
          <SelectContent>
            {repeatNames.map(option => (
              <div key={option.value} className="w-[257px]">
                <SelectItem value={option.value}>{option.label}</SelectItem>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* {selectedValue === 1 && <EventSessions />} */}
      {selectedValue === 2 && <EventEnds />}
      {selectedValue === 3 && <EventDaysCheckBox />}
    </div>
  )
}

const EventSchedulesHeader = () => {
  const { getValues } = useFormContext()
  const formData = getValues()
  console.log(formData, 'jdhfg')
  const FormatNames = timeFormatNames()
  const ZoneNames = timeZoneNames()
  const {
    field: { value: hoursFormat, onChange: hoursFormatOnChange },
    fieldState: { error: schedulesHeaderErrors }
  } = useController({ name: NewEventStep3FormNames?.hour_format_id })

  const {
    field: { value: timeZones, onChange: timeZonesOnChange },
    fieldState: { error: timeZoneError }
  } = useController({ name: NewEventStep3FormNames?.time_zone_id })
  return (
    <div className="h-9 flex">
      <div className="text-base text-[#333333] flex items-center">Event Date and Time</div>
      <div className="flex gap-4 w-[434px] ml-auto">
        <div className="w-[257px]">
          <Select
            value={hoursFormat}
            onValueChange={(val: any) => {
              hoursFormatOnChange(val)
            }}
          >
            <SelectTrigger className="w-[161px]" error={schedulesHeaderErrors ? true : false}>
              <SelectValue placeholder={'12 Houre Formate'} />
            </SelectTrigger>
            <SelectContent>
              {FormatNames?.map((option: any) => (
                <div className="w-[161px]">
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[257px]">
          <Select
            value={timeZones}
            onValueChange={(value: any) => {
              timeZonesOnChange(value)
            }}
          >
            <SelectTrigger className="w-[257px]" error={timeZoneError ? true : false}>
              <SelectValue placeholder={'Time Zone 1'} />
            </SelectTrigger>
            <SelectContent>
              {ZoneNames.map(option => (
                <div className="w-[257px]">
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

const EventVenue = () => {
  const [openAddNewVenue, setOpenAddNewVenue] = useState(false)
  const handleOpenEditNewVenue = () => {
    setOpenAddNewVenue(true)
  }

  const handleAddNewVenue = () => {
    setOpenAddNewVenue(false)
  }

  const handleOpenAddNewVenue = () => {
    // we are making the state varaible to false for not showing the warning message so that after
    // closing the dialog it will not show the data

    setOpenAddNewVenue(true)
  }

  return (
    <div>
      <RadioGroup className="flex flex-row gap-7">
        <Label className="flex-[1]">
          <div className="rounded-[16px] h-[118px] relative flex py-[24px] px-6 flex-col">
            <div className="text-[#7677F4] text-[16px] font-semibold flex flex-row gap-[12px]">
              <RadioGroupCircleItem
                value={'existing-venue'}
                id="existing-venue"
                className=" !bg-[#7677F4] border !border-[#D6D7D8] border-[1.5px]"
              />

              {/* If we not selected the existing venue then it is not in the position moving to the left so if we not selected then we are adjusting it with the ml */}
              <div>existing-venue</div>
            </div>
          </div>
        </Label>

        <Label className="flex-[1]">
          <div>
            <Dialog open={openAddNewVenue} onOpenChange={setOpenAddNewVenue}>
              <DialogTrigger onClick={handleOpenAddNewVenue} className="flex-[1]">
                <div className="h-[118px] w-[400px] text-[#7677F4] text-[15px]  rounded-[16px] border break-all border-[#7677F4] px-4 py-6 ">
                  + add new venue
                </div>
              </DialogTrigger>
              <DialogContent className="!w-[636px] !h-[430px] pt-6 px-[25px] !rounded-[24px]">
                <AddOrEditVenue handleSubmit={handleAddNewVenue} />
              </DialogContent>
            </Dialog>
          </div>
        </Label>
      </RadioGroup>
    </div>
  )
}

export const NewVenueEventDetails = () => {
  return (
    <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666] h-full overflow-y-scroll"></div>
  )
}


const Sessions = () => {
  const { append, remove, fields } = useFieldArray({
    name: "schedules",
  });

  const { watch } = useFormContext();

  const formData = watch();
  const schedules = formData?.schedules || [];

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id;

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

  const handleRemoveSession = (index: number) => {
    remove(index);
  };
  useEffect(() => {
    if (schedules?.length <= 0 || !schedules) {
      handleAddSession();
    }
  }, []);

  return(
    <div className="flex flex-col gap-4">
      
    {fields?.map((schedule: any, index: number) => {
      return (
        <div key={schedule.id}>
          <EventScheduleComponent
            index={index}
            handleAddSession={handleAddSession}
            handleRemoveSession={handleRemoveSession}
          />
        </div>
      );
    })}
  </div>

  )
}

const EventScheduleComponent = ({
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

  return(
<div className="h-15 flex flex-col gap-1 justify-between">
      <div className="h-4 font-[#333333] font-normal flex text-xs">
        <div>
          {"Event Start Date*"} {index + 1}{" "}
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
            <EventCalendarComponent index={index} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
        <EventTimePicker
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
             <DialogTitle className="flex justify-center">Delete</DialogTitle>
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
    </div>  )
}




// const Sessions = () => {
//   const [open, setOpen] = useState(false)

//   return (
//     <div className="h-15 flex flex-col gap-1 justify-between">
//       <div className="h-4 font-[#333333] font-normal flex text-xs">
//         <div>Event Sessions</div>
//         <div className="text-[#7677F4]">&nbsp;*</div>
//       </div>
//       <div className="h-10 flex items-center gap-6">
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button
//               onClick={() => setOpen(true)}
//               className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
//               variant="outline"
//             >
//               <div>
//                 <CalenderIcon color="#999999" />
//               </div>
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="!w-[810px] !h-[511px] bg-[#FFFFFF]">
//             <EventCalendarComponent />
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   )
// }

const EventTimePicker = ({
  index,
  is12HourFormat,
}: {
  index: number;
  is12HourFormat: Boolean;
}) => {
  const { errors }: any = useFormState();

  return (
    <div className="flex items-center gap-6">
    <div className="text-sm text-[#999999] font-normal">
      From
    </div>
    <div className="w-[233px]">
      <EventTimeSelector
        name={`${NewEventStep3FormNames?.schedules}[${index}].start`}
        is12HourFormat={is12HourFormat}
        error={errors?.schedules?.[index] ? true : false}
      />
    </div>
    <div className="text-sm text-[#999999] font-normal">
      To
    </div>
    <div className="w-[233px]">
      <EventTimeSelector
        name={`${NewEventStep3FormNames?.schedules}[${index}].end`}
        is12HourFormat={is12HourFormat}
        error={errors?.schedules?.[index] ? true : false}
      />
    </div>
  </div>
  )
}

const EventTimeSelector = ({
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
              {hourValue}:{minuteValue} {is12HourFormat && timeFormat}
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

// const EventTimeSelector = () => {
//   return (
//     <Popover>
//       <PopoverTrigger>
//         <div className="border border-1 py-[10px] px-[14px] flex justify-between items-center rounded-xl cursor-pointer w-[233px]">
//           <div className="flex gap-2 items-center">
//             <Clock />
//             <div>
//               {'00'}:{'00'}
//             </div>
//             <div className="px-1 py-[7px]">
//               <DropDown />
//             </div>
//           </div>
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="!w-[233px] h-[154px] flex items-center justify-center">
//         <div className="flex w-[200px] items-center justify-center">
//           <div className="flex basis-4/5 items-center justify-center gap-3">
//             <div className="flex items-center justify-center flex-col gap-4">
//               <div className="rotate-180 cursor-pointer">
//                 <DropDown fill="#7677F4" />
//               </div>
//               <div>
//                 <Input className="w-12" name={'hours'} />
//               </div>
//               <div className="cursor-pointer">
//                 <DropDown fill="#7677F4" />
//               </div>
//             </div>
//             :
//             <div>
//               <div className="flex items-center justify-center flex-col gap-4">
//                 <div className="rotate-180 cursor-pointer">
//                   <DropDown fill="#7677F4" />
//                 </div>
//                 <div>
//                   <Input className="w-12" name={`${name}-minutes`} />
//                 </div>
//                 <div className="cursor-pointer">
//                   <DropDown fill="#7677F4" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

const EventEnds = () => {
  const [eventEndsSelectedValue, setEventEndsSelectingValue] = useState(undefined)
  const names = endsNames()
  const handleEventEndsValueChange = (value: any) => {
    setEventEndsSelectingValue(value)
  }
  return (
    <div className="flex flex-col gap-2 text-xs font-normal text-[#333333] ">
      Event Ends *
      <div className="w-[257px]">
        <Select value={undefined} onValueChange={handleEventEndsValueChange}>
          <SelectTrigger>
            <SelectValue placeholder={'Ends on'} />
          </SelectTrigger>
          <SelectContent>
            <div className="w-[257px]">
              {names.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
      {/* {eventEndsSelectedValue === 1 && <EventSessions />} */}
      {eventEndsSelectedValue === 2 && <EndsAfterOccurrence />}
    </div>
  )
}

const EventDay = () => {
  const names = dayNames()
  return (
    <div className="flex flex-col gap-2 text-xs font-normal text-[#333333] ">
      Days
      <div className="w-[257px]">
        <Select value={undefined} onValueChange={() => {}}>
          <SelectTrigger>
            <SelectValue placeholder={'Ends on'} />
          </SelectTrigger>
          <SelectContent>
            <div className="w-[257px]">
              {names.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const EventDaysCheckBox = () => {
  return (
    <div>
      <p className="text-xs font-normal text-[#333333] pb-2">Repeat On</p>
      <div className="flex gap-20">
        <div className="flex gap-1 item-center ">
          <Checkbox />
          Sun
        </div>
        <div className="flex gap-1 ">
          <Checkbox />
          Mon
        </div>
        <div className="flex gap-1 ">
          <Checkbox />
          Tue
        </div>
        <div className="flex gap-1 ">
          <Checkbox />
          Wed
        </div>
        <div className="flex gap-1 ">
          <Checkbox />
          Thu
        </div>
        <div className="flex gap-1 ">
          <Checkbox />
          Fri
        </div>
        <div className="flex gap-1 ">
          <Checkbox />
          Sat
        </div>
      </div>
    </div>
  )
}

const EventCalendarComponent = ({ index, setOpen }: any) => {
  const { t } = useTranslation(['common', 'course.new_course'])

  const {
    field: { value: dateValue, onChange },
    formState: { dirtyFields }
  } = useController({
    name: `${NewEventStep3FormNames?.schedules}[${1}].date`
  })
  const [date, setDate] = useState<any>(dateValue ? dateValue : new Date())
  const handleOnSelect = (selected: Date | undefined) => {
    setDate(selected)
  }
  const { trigger, watch,getValues,setValue,clearErrors } = useFormContext();

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
    
    
  
    }
  

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[401px] flex flex-row gap-4">
        <div className="flex-[1]">
          <DateCalendar mode="single" selected={date} onSelect={handleOnSelect} className="rounded-md" />
        </div>
        <div className="border-l border-gray-300 h-full"></div>
        <div className="flex flex-col gap-4 flex-[1] p-2 h-[401px]">
          <div className="flex flex-row justify-between text-[20px] font-semibold">
            {t('course.new_course:time_and_venue_tab.course')}
            {/* Close button */}
          </div>
        </div>
      </div>
      <div className="flex self-center">
        <Button
          onClick={() => {
            handleRemoveFeeLevel(date)
            onChange(date);
            setOpen(false);

            // we need to validate schedules after date changes to get instant errors
            trigger("schedules");
          }}
          className="w-24 rounded-[12px] text-base"
        >
          {t("save_button")}
        </Button>
      </div>
    </div>
  )
}

const EndsAfterOccurrence = () => {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({
    name: NewEventStep3FormNames?.occurrences
  })
  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row gap-1 items-center font-normal text-[#333333]">
        <Text>Enter Occurrences*</Text>
      </div>
      <Input
        value={value}
        onChange={val => {
          onChange(val)
        }}
        className="rounded-[12px] text-[14px] w-[320px]"
      ></Input>
    </div>
  )
}
