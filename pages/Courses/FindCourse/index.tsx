import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import FilterIcon from "@public/assets/FilterIcon";
import SearchIcon from "@public/assets/Search";
import { useSelect } from "@refinedev/core";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Input } from "src/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";

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

  const [selectType, setSelectType] = useState();
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
    <div className="flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4">
      <div>
        <Button className="flex flex-row gap-2 !rounded-xl" variant="outline">
          <FilterIcon />
          <div>All Filters</div>
        </Button>
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
      <div>
        <Select
          value={selectType}
          onValueChange={(val: any) => {
            setSelectType(val);
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
