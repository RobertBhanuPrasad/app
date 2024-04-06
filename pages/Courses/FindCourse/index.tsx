import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import FilterIcon from "@public/assets/FilterIcon";
import SearchIcon from "@public/assets/Search";
import { CrudFilter, CrudFilters, useSelect, useTable } from "@refinedev/core";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import Filters from "@components/course/findCourse/Filters";
import { Sheet, SheetContent, SheetTrigger } from "src/ui/sheet";
import Form from "@components/Formfield";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { Input } from "src/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { format } from "date-fns";
import CrossIcon from "@public/assets/CrossIcon";

function index() {
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
  const [date, setDate] = React.useState<DateRange | undefined>();

  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false);

  const { newAdvanceFilterData, setNewAdvanceFilterData } = newCourseStore();

  console.log("hey redux data", newAdvanceFilterData);

  const count =
    Object.keys(newAdvanceFilterData).filter(
      (key) => newAdvanceFilterData[key] !== undefined
    ).length || 0;

  const filters: any = { permanent: [] };

  if (newAdvanceFilterData?.course_name) {
    filters.permanent.push({
      field: "program_alias_name_id",
      operator: "eq",
      value: newAdvanceFilterData.course_name,
    });
  }

  if (newAdvanceFilterData?.course_type) {
    filters.permanent.push({
      field: "program_type_id",
      operator: "eq",
      value: newAdvanceFilterData?.course_type,
    });
  }

  if (newAdvanceFilterData?.state) {
    filters.permanent.push({
      field: "state_id",
      operator: "eq",
      value: newAdvanceFilterData?.state,
    });
  }

  if (newAdvanceFilterData?.city) {
    filters.permanent.push({
      field: "city_id",
      operator: "eq",
      value: newAdvanceFilterData?.city,
    });
  }

  if (newAdvanceFilterData?.center) {
    filters.permanent.push({
      field: "center_id",
      operator: "eq",
      value: newAdvanceFilterData?.center,
    });
  }

  if (newAdvanceFilterData?.course_teacher) {
    filters.permanent.push({
      field: "program_teachers.user_id",
      operator: "eq",
      value: newAdvanceFilterData.course_teacher,
    });
  }

  if (newAdvanceFilterData?.program_organiser) {
    filters.permanent.push({
      field: "program_organizers.user_id",
      operator: "in",
      value: newAdvanceFilterData?.program_organiser,
    });
  }
  if (newAdvanceFilterData?.visibility) {
    filters.permanent.push({
      field: "visibility_id",
      operator: "eq",
      value: newAdvanceFilterData?.visibility,
    });
  }
  if (newAdvanceFilterData?.course_status) {
    filters.permanent.push({
      field: "status_id",
      operator: "in",
      value: newAdvanceFilterData?.course_status,
    });
  }
  const {
    tableQueryResult: programData,
    // pageCount,
    // pageSize,
    // setPageSize,
    // current,
    // setCurrent,
  } = useTable({
    resource: "program",
    meta: {
      select:
        "*,program_types(name) , state(name) , city(name) , center(name) ,program_teachers!inner(users!inner(user_name)) ,program_organizers!inner(users!inner(user_name)) , program_type_alias_names(alias_name), participant_registration(*),program_schedules(*)",
    },
  });

  console.log("hey table data", programData);

  console.log("heyy redux data", newAdvanceFilterData);

  return (
    <div className="flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4">
      <div>
        <Sheet open={advanceFilterOpen}>
          <SheetTrigger className="p-0">
            <Button
              onClick={() => {
                setAdvanceFilterOpen(true);
              }}
              className="flex flex-row gap-2 !rounded-xl"
              variant="outline"
            >
              All Filters
              <FilterIcon />
              {count > 0 && <CountComponent count={count} />}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[446px] rounded-l-xl">
            <Form onSubmit={() => {}} defaultValues={newAdvanceFilterData}>
              <Filters
                setAdvanceFilterOpen={setAdvanceFilterOpen}
                // newAdvanceFilterData={newAdvanceFilterData}
                setNewAdvanceFilterData={setNewAdvanceFilterData}
              />
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-row justify-center items-center border border-[1px] px-2 rounded-xl">
        <SearchIcon />
        <Input
          type="text"
          className="border-none focus:outline-none"
          placeholder={`Search by Course ID`}
        />
      </div>
      <div>
        {" "}
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
              variant="outline"
            >
              <CalenderIcon />
              {date?.from ? (
                date?.to ? (
                  <>
                    {format(date.from, "MM/dd/yyyy")} -{" "}
                    {format(date.to, "MM/dd/yyyy")}
                    <div
                      onClick={() => {
                        setDate(undefined);
                      }}
                    ></div>
                  </>
                ) : (
                  format(date.from, "MM/dd/yyyy")
                )
              ) : (
                <div className="flex gap-2 font-normal">
                  Select the Date Range
                </div>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
            <DateRangePickerComponent
              setOpen={setOpen}
              value={date}
              onSelect={setDate}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <CourseTypeComponent
          newAdvanceFilterData={newAdvanceFilterData}
          setNewAdvanceFilterData={setNewAdvanceFilterData}
        />
      </div>
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
  return (
    <div>
      <div>Table section</div>
    </div>
  );
};

export const DateRangePickerComponent = ({ setOpen, value, onSelect }: any) => {
  return (
    <div className="relative">
      <DateRangePicker
        mode="range"
        defaultMonth={value?.from}
        selected={value}
        onSelect={onSelect}
        numberOfMonths={2}
        captionLayout="dropdown-buttons"
        fromYear={2000}
        toYear={2025}
      />
      <div className="flex flex-row gap-4 justify-center items-center fixed p-2 rounded-b-3xl bottom-0 left-0 w-full shadow-[rgba(0,_0,_0,_0.24)_0px_2px_8px]">
        <Button
          onClick={() =>
            onSelect({
              from: new Date(),
              to: new Date(),
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

export const CountComponent = ({ count }: any) => {
  return (
    <div className="flex justify-center items-center w-5 h-5 !rounded-full bg-[#7677F4]/10">
      <div className="text-xs text-[#7677F4]">{count}</div>
    </div>
  );
};

export const CourseTypeComponent = ({
  newAdvanceFilterData,
  setNewAdvanceFilterData,
}: any) => {
  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch } = useSelect({
    resource: "program_types",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value: any) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],

    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  return (
    <Select
      value={newAdvanceFilterData?.course_type}
      onValueChange={(val: any) => {
        setNewAdvanceFilterData({
          ...newAdvanceFilterData,
          course_type: val,
        });
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select Course Type" />
      </SelectTrigger>
      <SelectContent>
        <Input onChange={(val) => onSearch(val.target.value)} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options.map((option: any, index: number) => (
            <>
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
            </>
          ))}
        </SelectItems>
      </SelectContent>
    </Select>
  );
};
