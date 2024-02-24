// Importing React and required components/modules
import React, { useState } from "react";
import DropdownIcon from "@public/icons/DropdownIcon.svg";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "src/ui/command";
import { cn } from "src/lib/utils";
import { Button } from "src/ui/button";
import { Input } from "./input";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import Image from "next/image";

// Defining TypeScript types for props
interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: any;
  onSearch: (searchQuery: string) => void;
  onBottomReached: () => void;
  onChange: (selectedOption: Option) => void;
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onSearch,
  onBottomReached,
  onChange,
  placeholder,
}: CustomSelectProps) => {
  // State to manage the open/closed state of the Popover
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);

  // Handler function when an option is selected
  const handleSelect = (value: Option) => {
     onChange(value);
    setSelectedValue(value)
    setOpen(false);
    onSearch("");
   
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Button acting as a trigger for the Popover */}
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-80 h-[40px] border-[#E1E1E1] rounded-xl"
        >
          <div className="flex w-full justify-between text-sm">
            {/* Displaying selected value or placeholder if none selected */}
            {selectedValue ? (
              <div className="text-[#414141] font-semibold">
                {selectedValue.label}
              </div>
            ) : (
              <div className="text-[#999999] font-normal">{placeholder}</div>
            )}
            {/* Dropdown Icon */}
            <Image
              src={DropdownIcon.src}
              alt="Dropdown Icon"
              width={10}
              height={5}
            />
          </div>
        </Button>
      </PopoverTrigger>
      {/* Popover content */}
      <PopoverContent className="border-[#D6D7D8] w-80 p-0">
        <Command>
          {/* Input for searching options */}
          <Input
            onChange={(e) => onSearch(e.target.value)}
            className="border-none focus:outline-none rounded-xl"
          />
          <hr className="border-[#D6D7D8]" />
          <CommandEmpty>No option found</CommandEmpty>
          {/* Alert for scrolling types */}
          <GetScrollTypesAlert
            id={"options"}
            onBottom={() => {
              onBottomReached();
            }}
          >
            {/* Group of command items representing options */}
            <CommandGroup
              id={"options"}
              className="max-h-[300px] text-[#333333] mr-1 mt-1 overflow-y-auto scrollbar"
            >
              {/* Mapping through options to render each option */}
              {options?.map((option: any, index: number) => {
                return (
                  <div key={option.value}>
                    {/* Individual command item representing an option */}
                    <CommandItem
                      value={option}
                      className={cn({
                        "bg-[#7677F4]/30 hover:!bg-[#7677F4]/30":
                          selectedValue && selectedValue.value === option.value,
                      })}
                      onSelect={() => handleSelect(option)}
                    >
                      {option.label}
                    </CommandItem>
                    {/* Horizontal line as a separator */}
                    {index < options.length - 1 && (
                      <hr className="border-[#D6D7D8]" />
                    )}
                  </div>
                );
              })}
            </CommandGroup>
          </GetScrollTypesAlert>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomSelect;
