import { BaseTable } from "@components/course/findCourse/BaseTable";
import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { columns } from "./Columns";
import { HttpError, useTable } from "@refinedev/core";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";

function index() {
  const { viewPreviewPage } = newCourseStore();

  // If user click on edit course in menu option we have to open review page instead of table
  if (viewPreviewPage) {
    return <NewCourseReviewPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <HeaderSection />
      <TableSection />
    </div>
  );
}

export default index;

const HeaderSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4">
      <div>All filters</div>
      <div>Search</div>
      <div>
        {" "}
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
              <div></div>
            </Button>
          </DialogTrigger>
          <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
            <DateRangePickerComponent setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div>course type</div>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row gap-2 items-center text-sm font-semibold text-[#7677F4]">
          <ClearAll />
          <div>Clear All</div>
        </div>
        <Button className="h-9 w-18 rounded-xl">Apply</Button>
      </div>
    </div>
  );
};
const TableSection = () => {
  const {
    tableQueryResult: programData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
  } = useTable({
    resource: "program",
    meta: {
      select:
        "*,program_types(name) , state(name) , city(name) , center(name) ,program_teachers(users(*)) ,program_organizers(users!inner(user_name)) , program_type_alias_names(alias_name) , visibility_id(id,value), participant_registration(*),program_schedules(*)",
    },
  });

  const modifiedData = programData?.data?.data || [];

  const [rowSelection, setRowSelection] = React.useState({});

  return (
    <div>
      <BaseTable
        current={current}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        checkboxSelection={true}
        setCurrent={setCurrent}
        pageCount={pageCount}
        total={programData?.data?.total || 0}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pagination={true}
        tableStyles={{
          table: "",
          rowStyles: "!important border-none",
        }}
        columns={columns}
        data={modifiedData}
        columnPinning={true}
      />
    </div>
  );
};

const DateRangePickerComponent = ({ setOpen }: any) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(2024, 3, 20),
  });

  return (
    <div className="relative">
      <DateRangePicker
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        captionLayout="dropdown-buttons"
        fromYear={2000}
        toYear={2025}
      />
      <div className="flex flex-row gap-4 justify-center items-center fixed p-2 rounded-b-3xl bottom-0 left-0 w-full shadow-[rgba(0,_0,_0,_0.24)_0px_2px_8px]">
        <Button
          onClick={() =>
            setDate({
              from: new Date(),
              to: new Date(2024, 3, 20),
            })
          }
          className="border rounded-xl border-[#7677F4] bg-[white] w-[94px] h-10 text-[#7677F4] font-semibold"
        >
          Reset
        </Button>
        <Button
          onClick={() => setOpen(false)}
          className=" w-[94px] h-10 rounded-xl"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
