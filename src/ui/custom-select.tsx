"use client";

import React from "react";
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

export default function CustomSelect({
  options,
  onSearch,
  onBottomReached,
  selectedValue,
  onChange,
  placeholder,
}: any) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: any) => {
    setOpen(false);
    onSearch("");
    onChange(value);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-80 h-[40px] border-[#E1E1E1] rounded-xl"
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
      </PopoverTrigger>
      <PopoverContent className="border-[#D6D7D8] w-80 p-0">
        <Command>
          <Input
            onChange={(e) => onSearch(e.target.value)}
            className="border-none focus:outline-none rounded-xl"
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
              {options?.map((option: any, index: number) => {
                return (
                  <div key={option.value}>
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
}
