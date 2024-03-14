import { useList } from "@refinedev/core";
import { format } from "date-fns/format";
import _ from "lodash";
import React, { useState } from "react";

import { Button } from "src/ui/button";
import { Calendar } from "src/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "src/ui/dialog";

function NewCourseStep1() {
  const [date, setDate] = useState<Date | any>(new Date());

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline"> {format(date, "PPP")}</Button>
        </DialogTrigger>
        <DialogContent className="!w-[810px] !h-[511px] bg-[#FFFFFF]">
          <CalenderComponent date={date} setDate={setDate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewCourseStep1;

const CalenderComponent = ({ date, setDate }: any) => {
  const { data } = useList<any>({
    resource: "program_schedules",
    meta: {
      select:
        "*,program_id!inner(program_type_id!inner(name),city_id!inner(name) , state_id!inner(name)))",
    },
    filters: date
      ? [
          {
            field: "start_time",
            operator: "gte",
            value: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
          },
          {
            field: "end_time",
            operator: "lt",
            value: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          },
        ]
      : [],
  });

  const handleOnSelect = (selected: Date | undefined) => {
    setDate(selected);
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
            selected={date}
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
        <Button className="w-24 rounded-[12px]">Submit</Button>
      </div>
    </div>
  );
};
