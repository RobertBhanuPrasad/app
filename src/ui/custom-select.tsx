import React, { useEffect, useState, useRef } from "react";
import DropdownIcon from "@public/icons/DropdownIcon.svg";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "src/ui/command";
import { cn } from "src/lib/utils";
import { Button } from "src/ui/button";
import { Input } from "./input";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import Image from "next/image";

// Define the shape of each option
interface Option {
  value: string;
  label: string;
}

// Define the props for the CustomSelect component
interface CustomSelectProps {
  data: any;
  onSearch: (searchQuery: string) => void;
  onBottomReached: () => void;
  onChange: (selectedOption: Option) => void;
  placeholder: string;
  value: any;
  error?: any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  data,
  onSearch,
  onBottomReached,
  onChange,
  placeholder,
  value: propValue,
  error,
}: CustomSelectProps) => {
  // State to manage whether the dropdown is open or closed
  const [open, setOpen] = React.useState<boolean>(false);

  // State to keep track of the currently selected option
  const [selectedValue, setSelectedValue] = useState<Option | null>(propValue);

  // Reference to the command div for handling clicks outside the dropdown
  const commandRef = useRef<HTMLDivElement>(null);

  // Update the selected value when the propValue changes
  useEffect(() => {
    if (propValue !== undefined) {
      setSelectedValue(propValue);
    } else {
      setSelectedValue(null);
    }
  }, [propValue]);

  // Handle the selection of an option
  const handleSelect = (value: Option) => {
    onChange(value);
    setSelectedValue(value);
    setOpen(false);
    onSearch("");
  };

  // Add an event listener to close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      onSearch("");
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Render the CustomSelect component
  return (
    <div>
      <Command>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          variant="outline"
          role="combobox"
          className={`w-80 h-[40px] rounded-xl ${
            error ? "border-[#FF6D6D]" : "border-[#E1E1E1]"
          }`}
        >
          <div className="flex w-full justify-between text-sm">
            {selectedValue ? (
              <div className="text-[#414141] font-semibold">
                {selectedValue.label}
              </div>
            ) : (
              <div className="text-[#999999] font-normal">{placeholder}</div>
            )}
            <Image
              src={DropdownIcon.src}
              alt="Dropdown Icon"
              width={10}
              height={5}
            />
          </div>
        </Button>
        <div className="relative mt-2" ref={commandRef}>
          {open && (
            <div className="rounded-xl border border-[1px]">
              <Input
                onChange={(e) => onSearch(e.target.value)}
                className="border-none focus:outline-none rounded-xl text-[#999999]"
              />
              <hr className="border-[#D6D7D8]" />
              <CommandEmpty>No option found</CommandEmpty>
              <GetScrollTypesAlert
                id={"options"}
                onBottom={() => {
                  onBottomReached();
                }}
              >
                <CommandGroup
                  id={"options"}
                  className="max-h-[300px] text-[#333333] mr-1 mt-1 overflow-y-auto scrollbar"
                >
                  {data?.map((option: any, index: number) => {
                    return (
                      <div key={option.value}>
                        <CommandItem
                          value={option}
                          className={cn({
                            "bg-[#7677F4]/30 hover:!bg-[#7677F4]/30":
                              selectedValue &&
                              selectedValue.value === option.value,
                          })}
                          onSelect={() => handleSelect(option)}
                        >
                          {option.label}
                        </CommandItem>
                        {index < data?.length - 1 && (
                          <hr className="border-[#D6D7D8]" />
                        )}
                      </div>
                    );
                  })}
                </CommandGroup>
              </GetScrollTypesAlert>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
};

export default CustomSelect;
