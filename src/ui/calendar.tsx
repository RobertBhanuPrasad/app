import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "src/lib/utils";
import { buttonVariants } from "src/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Badge({ count = 1 }: any) {
  return (
    <div className="absolute top-0 right-0 h-5 w-5 text-white rounded-full flex items-center justify-center text-xs">
      <Badge variant="destructive">{count}</Badge>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-md font-medium",
        nav: "bg-[pink] space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8  p-0 border border-[1px] border-[#D6D7D8]"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell:
          "text-muted-foreground !rounded-full w-10 font-normal text-sm",
        row: "flex w-full mt-2",
        cell: "h-12 w-12 text-center !rounded-full text-lg  relative [&:has([aria-selected].day-range-end)]:rounded-full [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-full focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-12 w-12 p-0 font-normal aria-selected:opacity-100 "
        ),
        day_range_end: "day-range-end",
        day_selected:
          "!rounded-full bg-primary text-primary-foreground hover:bg-primary hover:!rounded-full hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground !rounded-full",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ ...props }) => {
          // Extract the month from the props
          const { displayMonth } = props;

          const month = displayMonth.toLocaleString("default", {
            month: "long",
          });
          const year = displayMonth.getFullYear();

          return (
            <div className="flex flex-col items-center gap-1 font-semibold">
              <div className="text-[20px]">{month}</div>
              <div className="text-[#999999] text-[12px]">{year}</div>
            </div>
          );
        },
        HeadRow: () => {
          const weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

          return (
            <div className="flex flex-row gap-6 text-[#999999] items-center justify-center">
              {weekNames.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
          );
        },
        DayContent: ({ date, ...dayprops }) => {
          // Check if selected is a Date object
          const isSelected =
            props.selected instanceof Date &&
            date.getDate() === props.selected.getDate() &&
            date.getMonth() === props.selected.getMonth() &&
            date.getFullYear() === props.selected.getFullYear();

          return (
            <div>
              {date?.getDate()}
              {isSelected && <Badge count={1} />}{" "}
              {/* Render badge if the day is selected */}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
