import Add from "@public/assets/Add";
import Arrow from "@public/assets/Arrow";
import Clock from "@public/assets/Clock";
import Delete from "@public/assets/Delete";
import DropDown from "@public/assets/DropDown";
import CalenderIcon from "@public/assets/CalenderIcon";
import Calender from "@public/assets/CalenderIcon";
import { CrudFilters, useList, useSelect } from "@refinedev/core";
import { format, setDate } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { Button } from "src/ui/button";
import { DateCalendar } from "src/ui/DateCalendar";
import CustomSelect from "src/ui/custom-select";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Input } from "src/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";
import { date } from "zod";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import { NewCourseStep3FormNames } from "src/constants/CourseConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectItems,
  SelectValue,
} from "src/ui/select";

function NewCourseStep3() {
  const { watch } = useFormContext();
  const formData = watch();
  return (
    <div>
      <div>
        {formData?.courseTypeSettings?.is_online_program ? (
          <OnlineProgram />
        ) : (
          <div>Render Venue</div>
        )}
      </div>
      <Schedules />
    </div>
  );
}

export default NewCourseStep3;

const OnlineProgram = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewCourseStep3FormNames?.online_url,
  });
  return (
    <div className="h-[218px] flex flex-col gap-8">
      <div>
        <div className="">Online zoom URL </div>
        <div className="w-80">
          <Input
            placeholder="URL"
            className="rounded-[12px]"
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
          <div className="">
            Note: Participants will join your online course through your virtual
            venue
          </div>
        </div>
      </div>
      <div>
        <div className="">
          Please associate your course with a specific location for reporting
          purposes
        </div>
        <div>Location drop downs</div>
      </div>
    </div>
  );
};

const Schedules = () => {
  return (
    <div className="flex flex-col gap-4 w-[1016px]">
      <SchedulesHeader />
      <Sessions />
    </div>
  );
};

const SchedulesHeader = () => {
  const {
    field: { value: hoursFormat, onChange: hoursFormatOnChange },
  } = useController({ name: NewCourseStep3FormNames?.hour_format_id });

  const {
    field: { value: timeZones, onChange: timeZonesOnChange },
  } = useController({ name: NewCourseStep3FormNames?.time_zone_id });

  let timeFormatOptions =
    getOptionValuesByOptionLabel(TIME_FORMAT)?.[0]?.option_values;

  timeFormatOptions = timeFormatOptions?.map(
    (val: { id: any; value: string }) => {
      return {
        value: val?.id,
        label: val?.value,
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
    <div className="h-9 flex justify-between">
      <div className="font-semibold text-[#333333] flex items-center">
        Event Date and Time
      </div>
      <div className="flex gap-4">
        <div className="w-[161px]">
          <Select
            value={hoursFormat}
            onValueChange={(val: any) => {
              hoursFormatOnChange(val);
            }}
          >
            <SelectTrigger className="w-[161px]">
              <SelectValue placeholder="Select Format" />
            </SelectTrigger>
            <SelectContent>
              {timeFormatOptions?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[257px]">
          <Select
            value={timeZones}
            onValueChange={(value: any) => {
              timeZonesOnChange(value);
            }}
          >
            <SelectTrigger className="w-[257px]">
              <SelectValue placeholder="Select Time Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItems onBottomReached={() => {}}>
                {options?.map((option,index) => {
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
        </div>
      </div>
    </div>
  );
};
const Sessions = () => {
  const { append, remove } = useFieldArray({
    name: "schedules",
  });

  const { watch } = useFormContext();

  const [open, setOpen] = useState(false);

  const formData = watch();

  const schedules = formData?.schedules;

  const handleAddSession = () => {
    append({
      startHour: "00",
      startMinute: "00",
      endHour: "00",
      endMinute: "00",
      startTimeFormat: "AM",
      endTimeFormat: "AM",
      date: new Date(),
    });
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
      {schedules?.map((schedule: any, index: number) => {
        return (
          <div
            className="h-15 flex flex-col gap-1 justify-between"
            key={schedule?.id}
          >
            <div className="h-4 font-[#333333] font-normal flex text-xs">
              <div>Session {index + 1} </div>
              <div className="text-[#7677F4]">&nbsp;*</div>
            </div>
            <div className="h-10 flex items-center gap-6">
              <Dialog open={open}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpen(true)}
                    className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
                    variant="outline"
                  >
                    <div>
                      <CalenderIcon />
                    </div>
                    <div>
                      {format(new Date(schedule?.date), "dd MMM, yyyy")}
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="!w-[810px] !h-[511px] bg-[#FFFFFF]">
                  <CalenderComponent index={index} setOpen={setOpen} />
                </DialogContent>
              </Dialog>
              <TimePicker
                index={index}
                is12HourFormat={
                  formData?.hoursFormat?.value == timeFormat12HoursId
                    ? true
                    : false
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
                    <Add /> Add
                  </div>
                )}
                {index != 0 && (
                  <div
                    onClick={() => {
                      handleRemoveSession(index);
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer flex items-center gap-[6px]"
                  >
                    <Delete />
                    Delete
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
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
  return (
    <div className="flex items-center gap-6">
      <div className="text-sm text-[#999999] font-normal">From</div>
      <div className="w-[233px]">
        <TimeSelector
          name={`${NewCourseStep3FormNames?.schedules}[${index}].start`}
          is12HourFormat={is12HourFormat}
        />
      </div>
      <div className="text-sm text-[#999999] font-normal">To</div>
      <div className="w-[233px]">
        <TimeSelector
          name={`${NewCourseStep3FormNames?.schedules}[${index}].end`}
          is12HourFormat={is12HourFormat}
        />
      </div>
    </div>
  );
};
const CalenderComponent = ({ index, setOpen }: any) => {
  // Get the date value and onChange function from the controller
  const {
    field: { value: dateValue, onChange },
  } = useController({
    name: `${NewCourseStep3FormNames?.schedules}[${index}].date`,
  });

  // Initialize state for the selected date, defaulting to the provided dateValue or today's date
  const [date, setDate] = useState<any>(dateValue ? dateValue : new Date());

  // Fetch organization calendar settings
  const { data: settingsData } = useList<any>({
    resource: "organization_calender_settings",
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: 1,
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
  if (settingsData) {
    if (settingsData?.data[0]?.is_city_enabled) {
      filter.push({
        field: "program_id.city_id.id",
        operator: "eq",
        value: 1,
      });
    }
    if (settingsData?.data[0]?.is_state_enabled) {
      filter.push({
        field: "program_id.state_id.id",
        operator: "eq",
        value: 1,
      });
    }
    if (settingsData?.data[0]?.is_venue_enabled) {
      filter.push({
        field: "program_id.venue_id",
        operator: "eq",
        value: 1,
      });
    }
  }

  // Fetch program schedules based on the filters
  const { data } = useList<any>({
    resource: "program_schedules",
    meta: {
      select:
        "*,program_id!inner(program_type_id!inner(name),city_id!inner(id ,name),state_id!inner(id ,name),venue_id))",
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
            Course
            {/* Close button */}
            <div
              onClick={() => {
                setOpen(false);
              }}
            >
              <X className="h-6 w-6" />
            </div>
          </div>
          <div className="flex flex-col gap-4 max-h-[352px] scrollbar overflow-y-auto">
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
                  {course.program_id?.program_type_id?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Submit button */}
      <div className="flex self-center">
        <Button
          onClick={() => {
            onChange(date);
            setOpen(false);
          }}
          className="w-24 rounded-[12px]"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

// Component for selecting time with hour and minute inputs
const TimeSelector = ({
  name, // Name of the time selector
  is12HourFormat, // Boolean indicating whether to display time in 12-hour format
}: {
  name: string;
  is12HourFormat: Boolean;
}) => {
  // Maximum hours depending on the time format
  const maximumHours = is12HourFormat ? 12 : 23;

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
    if (hourValue == "00") {
      hourOnChange(maximumHours);
      return;
    }

    let hour = (parseInt(hourValue) - 1).toString();
    hour = preProcessInputValue(hour);
    hourOnChange(hour);
  };

  // Event handler for decrementing hour
  const handleHourDownArrow = () => {
    if (hourValue >= maximumHours) {
      hourOnChange("00");
      return;
    }

    let hour = (parseInt(hourValue) + 1).toString();
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
    if (is12HourFormat == true) {
      if (hourValue > 12) {
        const hours = parseInt(hourValue) - 12;
        const newHourValue = preProcessInputValue(hours.toString());
        hourOnChange(newHourValue);
        timeFormatOnChange("PM");
      }
    } else {
      if (timeFormat == "PM" && hourValue != 12) {
        const hours = parseInt(hourValue) + 12;
        const newHourValue = preProcessInputValue(hours.toString());
        hourOnChange(newHourValue);
      }
    }
  }, [is12HourFormat]);

  return (
    <Popover>
      <PopoverTrigger name={`TimeSelector ${name}`}>
        <div className="border border-1 py-[10px] px-[14px] flex justify-between items-center rounded-xl cursor-pointer w-[233px]">
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
