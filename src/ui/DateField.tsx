import CalenderIcon from "@public/assets/CalenderIcon";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { cn } from "src/lib/utils";
import { Button } from "src/ui/button";
import { Calendar } from "src/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";

interface DateFieldProps {
  /**
   * The selected date to be displayed in the calendar.
   */
  value?: Date;

  /**
   * Function to set the selected date.
   * @param value - The date to set as the selected date.
   */
  onChange: (value: Date) => void;

  /**
   * Placeholder text to display when no date is selected.
   */
  placeholder?: string;
  /**
   * className to change stylings of the calendar.
   */
  className?: string;
}
export const DateField = ({
  value,
  onChange,
  placeholder,
  className,
}: DateFieldProps) => {
  // State to manage the visibility of the popover
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Function to handle the selected date
   */
  const handleSelectDate = (value: any) => {
    onChange(value);
    setIsOpen(false);
  };

  // Ref for the popover element
  const popoverRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] flex flex-row gap-2 justify-start",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalenderIcon color="#666666" className="mr-2 h-4 w-4" />

          {/* Render the formatted date if date is selected, otherwise render the placeholder */}

          {value ? (
            format(value, "dd MMM, yyyy")
          ) : (
            <span>{placeholder ? placeholder : "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={popoverRef} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
