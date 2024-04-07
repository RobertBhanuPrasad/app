import { Button } from "src/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "src/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/ui/accordion";
import { Label } from "src/ui/label";
import { Input } from "src/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import CalenderIcon from "@public/assets/CalenderIcon";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import React, { useState } from "react";
import { format } from "date-fns";
import { Checkbox } from "src/ui/checkbox";

export function ParticipantsAdvanceFilter() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>();
  const transactionStatusOptions = [
    "Confirmed",
    "Pending",
    "Failed",
    "Not Received",
  ];
  const transactionTypeOptions = ["All", "Sale", "Partial Refund", "Refund"];
  const attendanceStatusOptions = ["Completed", "Pending", "Canceled"];
  const healthConsentStatusOptions = ["Completed", "Pending"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">All Filters</Button>
      </SheetTrigger>
      <SheetContent className="w-[446px] rounded-l-xl overflow-scroll">
        <SheetHeader>Filter By</SheetHeader>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Contact Details</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input></Input>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input></Input>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input></Input>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-2">
            <AccordionTrigger>Registration Date</AccordionTrigger>
            <AccordionContent>
              <div>
                {" "}
                <Dialog open={open}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setOpen(true)}
                      className="w-full h-[40px] flex flex-row items-center justify-start gap-2"
                      variant="outline"
                    >
                      <div>
                        <CalenderIcon />
                      </div>
                      <div>
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span className="font-normal">
                            Select Registration Date
                          </span>
                        )}
                      </div>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-3">
            <AccordionTrigger>Transaction Status</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4 flex-wrap">
                {transactionStatusOptions.map((value) => {
                  return (
                    <div className="border-2 rounded-2xl px-3 py-1">
                      {value}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-4">
            <AccordionTrigger>Transaction Type</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4 flex-wrap">
                {transactionTypeOptions.map((value) => {
                  return (
                    <div className="border-2 rounded-2xl px-3 py-1">
                      {value}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-5">
            <AccordionTrigger>Attendance Status</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4 flex-wrap">
                {attendanceStatusOptions.map((value) => {
                  return (
                    <div className="border-2 rounded-2xl px-3 py-1">
                      {value}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-6">
            <AccordionTrigger>Health Consent Status</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4 flex-wrap">
                {healthConsentStatusOptions.map((value) => {
                  return (
                    <div
                      className="flex items-center space-x-2
                      border-2 p-2 rounded-lg"
                    >
                      <Checkbox id="healthterms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {value}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-6">
            <AccordionTrigger>Program Agreement Status</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-4 flex-wrap">
                {healthConsentStatusOptions.map((value) => {
                  return (
                    <div
                      className="flex items-center space-x-2
                      border-2 p-2 rounded-lg"
                    >
                      <Checkbox id="programagreementterms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {value}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}

const DateRangePickerComponent = ({ setOpen, value, onSelect }: any) => {
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
          onClick={() => onSelect({})}
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
