import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import Filters from "src/participants/Filters";
import { Sheet, SheetContent, SheetTrigger } from "src/ui/sheet";
import Form from "@components/Formfield";

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
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4">
      <div>
        <Sheet>
          <SheetTrigger className="p-0">
            <Button variant="outline">All Filters</Button>
          </SheetTrigger>
          <SheetContent className="w-[446px] rounded-l-xl">
            <Form onSubmit={() => {}} defaultValues={{}}>
              <Filters />
            </Form>
          </SheetContent>
        </Sheet>
      </div>
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
            <DateRangePickerComponent
              setOpen={setOpen}
              value={date}
              onSelect={setDate}
            />
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
