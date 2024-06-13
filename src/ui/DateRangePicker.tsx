"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "src/lib/utils";
import { buttonVariants } from "src/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useEffect, useState } from "react";
import useGetLanguageCode, { getDateFnsLocaleByActiveLanguage } from "src/utility/useGetLanguageCode";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function DateRangePicker({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  const locale =   getDateFnsLocaleByActiveLanguage()

  return (
    <DayPicker
      locale={locale}
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        months:
          "flex flex-col justify-center sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month:
          "space-y-4 border border-[#D6D7D8] border-[1px] w-[374px] rounded-xl py-1",
        caption: "flex flex-row relative  border-b border-[#D6D7D8] pb-2",
        caption_dropdowns:
          "flex flex-row mt-1 justify-center gap-2 grow dropdowns",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 p-0 border border-[1px] border-[#D6D7D8]"
        ),
        nav_button_previous: "absolute left-5",
        nav_button_next: "absolute right-5",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-6 font-normal text-[0.8rem]",
        row: "flex flex-row w-full px-4",
        cell: "h-11 w-12 text-center text-xs p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex justify-center items-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-11 w-12 text-xs !rounded-full  font-semibold aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
        HeadRow: () => {
          const dayjs = require("dayjs");
          const weekNames = dayjs.weekdaysShort();

          return (
            <div className="flex flex-row gap-7  text-[#999999] items-center justify-center text-xs">
              {weekNames.map((day:string, index:number) => (
                <div className="capitalize"key={index}>{day}</div>
              ))}
            </div>
          );
        },
        Dropdown: ({ ...props }) => {
          const [selectedValue, setSelectedValue] = useState<string | null>(
            props.value as string
          );

          const handleValueChange = (value: string) => {
            setSelectedValue(value);
            if (props.onChange) {
              handleCalendarChange(value, props.onChange);
            }
          };

          return (
            <Select
              {...props}
              onValueChange={handleValueChange as any}
              value={selectedValue ?? (props.value as string)}
            >
              <SelectTrigger
                className={cn(
                  "font-medium w-[105px] h-9 rounded-xl [.is-between_&]:hidden [.is-end_&]:hidden [.is-start.is-end_&]:flex capitalize"
                )}
              >
                <SelectValue placeholder={props?.caption} className="capitalize">
                {props?.caption}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[var(--radix-popper-available-height);] h-[400px] overflow-y-auto scrollbar capitalize">
                {props.children &&
                  React.Children.map(props.children, (child) => (
                    <SelectItem
                      value={(child as React.ReactElement<any>)?.props?.value}
                      className={cn({
                        "bg-[#7677F4]/10 hover:!bg-[#7677F4]/10 text-[#7677F4] capitalize":
                          selectedValue ===
                          (child as React.ReactElement<any>)?.props?.value,
                      })}
                    >
                     {(child as React.ReactElement<any>)?.props?.children}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        },
        CaptionLabel: () => {
          return null;
        },
      }}
      {...props}
    />
  );
}

export { DateRangePicker };
