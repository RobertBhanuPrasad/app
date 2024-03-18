import { useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";

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
  const [value, onChange] = useState<any>();

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
              <div className="w-[233px]">From Time Selector</div>
              <div className="text-sm text-[#999999] font-normal">To</div>
              <div className="w-[233px]">To Time Selector</div>

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

