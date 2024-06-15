import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "src/lib/utils";
import { buttonVariants } from "src/ui/button";
import dayjs from 'dayjs';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function DateCalendar({
  className,
  classNames,
  showOutsideDays = true,
  count,
  captionLayout,
  ...props
}: CalendarProps & { count?: number }) {
  return (
    <DayPicker
      weekStartsOn={1}
      formatters={{
        formatWeekdayName:(date,options)=>{

          return dayjs(date).format("ddd")
        }
      }}
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-md font-medium",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8  p-0 border border-[1px] border-[#D6D7D8]"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse ",
        head_row: "flex capitalize w-full gap-[14px] text-lg",
        head_cell:
          "text-muted-foreground !rounded-full w-10 font-normal text-sm",
        row: "flex w-full ",
        cell: "h-10 w-10 text-center m-[6px] !rounded-full text-lg  relative [&:has([aria-selected].day-range-end)]:rounded-full [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-full hover:rounded-full focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100  hover:rounded-full "
        ),
        day_range_end: "day-range-end",
        day_selected:
          "!rounded-full !bg-[#735BF2] text-primary-foreground hover:bg-[#735BF2] hover:!rounded-full hover:text-primary-foreground focus:bg-[#735BF2] focus:text-primary-foreground",
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

          const month = dayjs(displayMonth).format("MMMM")

          const year = displayMonth.getFullYear();

          return (
            <div className="flex flex-col items-center gap-1 font-semibold">
              <div className="text-[20px] capitalize">{month}</div>
              <div className="text-[#999999] text-[12px]">{year}</div>
            </div>
          );
        },
        DayContent: ({ date, ...dayprops }) => {
          const isSelected =
            props.selected instanceof Date &&
            date.getDate() === props.selected.getDate() &&
            date.getMonth() === props.selected.getMonth() &&
            date.getFullYear() === props.selected.getFullYear();
          return (
            <div>
              {date?.getDate()}
              {isSelected && (
                <div className="absolute top-[-4px] right-[-4px] h-5 w-5 bg-[#FF6D6D] text-white rounded-full flex items-center justify-center text-xs">
                  {count}
                </div>
              )}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
DateCalendar.displayName = "Calendar";

export { DateCalendar };
