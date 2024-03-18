import CalenderIcon from "@public/assets/CalenderIcon";
import Calender from "@public/assets/CalenderIcon";
import { useList, useSelect } from "@refinedev/core";
import { format, setDate } from "date-fns";
import { useEffect, useState } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { Button } from "src/ui/button";
import { Calendar } from "src/ui/calendar";
import CustomSelect from "src/ui/custom-select";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Input } from "src/ui/input";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import { date } from "zod";

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
  const { append, remove } = useFieldArray({
    name: "schedules",
  });

  const { watch } = useFormContext();

  const [open, setOpen] = useState(false);

  const formData = watch();

  console.log("heyy form daa", formData?.schedules);

  useEffect(() => {
    if (formData?.schedules?.length == 0) {
      append({ value: "1", date: new Date() });
    }
  });

  const handleAddSession = (index: number) => {
    if (formData?.schedules[index]?.date) {
      append({ value: index, date: formData?.schedules[index]?.date });
    } else {
      append({ value: index, date: new Date() });
    }
  };

  const handleRemoveSession = (index: number) => {
    remove(index);
  };

  return (
    <div>
      {formData?.schedules?.map((schedule: any, index: number) => {
        return (
          <div className="h-15 flex flex-col gap-1 justify-between">
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
              <div className="text-sm text-[#999999] font-normal">From</div>
              <div className="w-[233px]">From Time Selector</div>
              <div className="text-sm text-[#999999] font-normal">To</div>
              <div className="w-[233px]">To Time Selector</div>

              <div className="w-[127px] flex gap-4 ">
                {index == formData?.schedules?.length - 1 && (
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

const CalenderComponent = ({ index, setOpen }: any) => {
  const {
    field: { value: dateValue, onChange },
  } = useController({
    name: `schedules[${index}].date`,
  });

  const { data } = useList<any>({
    resource: "program_schedules",
    meta: {
      select:
        "*,program_id!inner(program_type_id!inner(name),city_id!inner(name) , state_id!inner(name)))",
    },
    filters: dateValue
      ? [
          {
            field: "start_time",
            operator: "gte",
            value: new Date(dateValue.setHours(0, 0, 0, 0)).toISOString(),
          },
          {
            field: "end_time",
            operator: "lt",
            value: new Date(
              dateValue.getTime() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ]
      : [],
  });

  const handleOnSelect = (selected: Date | undefined) => {
    onChange(selected);
  };
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
        <div className="flex-[1]">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleOnSelect}
            className="rounded-md"
            count={data?.total || 0}
          />
        </div>
        <div className="border-l border-gray-300 h-full"></div>
        <div className="flex flex-col gap-4 flex-[1] p-2 h-[401px]">
          <div className="text-[20px] font-semibold">Course</div>
          <div className="flex flex-col gap-4 max-h-[352px] scrollbar overflow-y-auto">
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
      <div className="flex self-center">
        <Button onClick={() => setOpen(false)} className="w-24 rounded-[12px]">
          Submit
        </Button>
      </div>
    </div>
  );
};
