import { useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import CustomSelect from "src/ui/custom-select";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";

function NewCourseStep3() {
  return (
    <div>
      <Schedules />
    </div>
  );
}

export default NewCourseStep3;

const Schedules = () => {
  return (
    <div className="flex flex-col gap-4 w-[1016px]">
      <SchedulesHeader />
      <Sessions />
    </div>
  );
};

const SchedulesHeader = () => {
  const [value, onChange] = useState<any>();

  const timeFormatOptions =
    getOptionValuesByOptionLabel(TIME_FORMAT)?.[0]?.option_values;

  return (
    <div className="h-9 flex justify-between">
      <div className="font-semibold text-[#333333] flex items-center">
        Event Date and Time
      </div>
      <div className="flex gap-4">
        <div className="w-[161px]">
          <CustomSelect
            value={value}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              onChange(val);
            }}
          />
        </div>
        <div className="w-[257px]">
          <CustomSelect
            value={value}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              onChange(val);
            }}
          />
        </div>
      </div>
    </div>
  );
};
const Sessions = () => {
  const {
    fields: schedules,
    append,
    remove,
  } = useFieldArray({
    name: "schedules",
  });

  useEffect(() => {
    if (schedules?.length == 0) {
      append({ value: "1" });
    }
  });

  const options: any[] = [];

  const [value, onChange] = useState<any>();

  const handleAddSession = (index: number) => {
    append({ value: index });
  };

  const handleRemoveSession = (index: number) => {
    remove(index);
  };
  return (
    <div>
      {schedules?.map((schedule: any, index: number) => {
        return (
          <div className="h-15 flex flex-col gap-1 justify-between">
            <div className="h-4 font-[#333333] font-normal flex text-xs">
              <div>Session {index + 1} </div>
              <div className="text-[#7677F4]">&nbsp;*</div>
            </div>
            <div className="h-10 flex items-center gap-6">
              <div className="w-[233px] ">Date</div>
              <div className="text-sm text-[#999999] font-normal">From</div>
              <div className="w-[233px] bg-[pink]">From Time Selector</div>
              <div className="text-sm text-[#999999] font-normal">To</div>
              <div className="w-[233px] bg-[red]">To Time Selector</div>

              <div className="w-[127px] flex gap-4 ">
                {index == schedules?.length - 1 && (
                  <div
                    onClick={() => {
                      handleAddSession(index);
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer"
                  >
                    + Add
                  </div>
                )}
                {index != 0 && (
                  <div
                    onClick={() => {
                      handleRemoveSession(index);
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer"
                  >
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
