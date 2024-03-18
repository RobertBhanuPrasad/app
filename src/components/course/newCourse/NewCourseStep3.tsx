import Add from "@public/assets/Add";
import Arrow from "@public/assets/Arrow";
import Clock from "@public/assets/Clock";
import Delete from "@public/assets/Delete";
import DropDown from "@public/assets/DropDown";
import { useEffect, useState } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";

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
  return (
    <div className="h-[218px] flex flex-col gap-8">
      <div>
        <div className="">Online zoom URL </div>
        <div className="w-80">
          <Input placeholder="URL" className="rounded-[12px]" />
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
  } = useController({ name: "hoursFormat" });

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
  return (
    <div className="h-9 flex justify-between">
      <div className="font-semibold text-[#333333] flex items-center">
        Event Date and Time
      </div>
      <div className="flex gap-4">
        <div className="w-[161px]">
          <CustomSelect
            value={hoursFormat}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              hoursFormatOnChange(val);
            }}
          />
        </div>
        <div className="w-[257px]">
          <CustomSelect
            value={""}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
const Sessions = () => {
  const { watch } = useFormContext();

  const formData = watch();

  const {
    fields: schedules,
    append,
    remove,
  } = useFieldArray({
    name: "schedules",
  });

  useEffect(() => {
    if (schedules?.length == 0) {
      handleAddSession();
    }
  }, []);

  const handleAddSession = () => {
    append({
      startHour: "00",
      startMinute: "00",
      endHour: "00",
      endMinute: "00",
      startTimeFormat: "AM",
      endTimeFormat: "AM",
    });
  };

  const handleRemoveSession = (index: number) => {
    remove(index);
  };

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id;

  return (
    <div>
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
              <div className="w-[233px] ">Date</div>
              <TimePicker
                index={index}
                is12HourFormat={
                  formData?.hoursFormat?.value == timeFormat12HoursId
                    ? true
                    : false
                }
              />
              <div className="w-[127px] flex gap-4 ">
                {index == schedules?.length - 1 && (
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
          name={`schedules[${index}].start`}
          is12HourFormat={is12HourFormat}
        />
      </div>
      <div className="text-sm text-[#999999] font-normal">To</div>
      <div className="w-[233px]">
        <TimeSelector
          name={`schedules[${index}].end`}
          is12HourFormat={is12HourFormat}
        />
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
