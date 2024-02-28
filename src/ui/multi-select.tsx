"use client";

import { X } from "lucide-react";
import * as React from "react";

import clsx from "clsx";
import { Badge } from "./badge";
import { Command, CommandGroup, CommandItem } from "./command";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import { Input } from "./input";
import { useEffect } from "react";

// Define the shape of each data item
type DataItem = Record<"value" | "label", string>;

// Main MultiSelect component
export function MultiSelect({
  placeholder = "Select an item",
  options,
  onBottomReached,
  onSearch,
  onChange,
  value: propValue,
}: {
  placeholder?: string;
  options: DataItem[];
  onBottomReached: () => void;
  onSearch: (query: string) => void;
  onChange: any;
  value: any;
}) {
  // Refs to manage focus and detect clicks outside the component
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const popoverDropdownRef = React.useRef<HTMLDivElement>(null);

  // States to manage the component's behavior
  const [open, setOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<DataItem[]>(propValue);

  useEffect(() => {
    if (propValue !== undefined) {
      setSelected(propValue);
    } else {
      setSelected([]);
    }
  }, [propValue]);

  // Handle unselecting an item from the selected list
  const handleUnselect = (item: DataItem) => {
    setSelected((prev) => prev.filter((s) => s.value !== item.value));
  };

  // Handle clicks outside the dropdown to close it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  // Filter out selected values from the dropdown
  const selectables = options?.filter((item) => !selected?.includes(item));

  return (
    <div className={clsx("grid w-[320px] items-center")}>
      <Command className="overflow-visible bg-transparent">
        <div className=" border border-[#E1E1E1] rounded-xl px-3 py-2 text-sm relative h-[40px]">
          {/* Display selected items and provide options to remove them */}
          <div className="flex gap-2 items-center">
            {/* Display up to two selected items with a badge */}
            {selected?.map((item, index) => {
              if (index > 1) return null;
              return (
                <Badge key={item.value} variant="outline" className="border">
                  {item.label}
                  <button
                    className="ml-1 rounded-full outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X
                      stroke="#7677F4"
                      strokeWidth={2.5}
                      className="h-3 w-3 cursor-pointer"
                    />
                  </button>
                </Badge>
              );
            })}

            {/* Display a count badge for additional selected items */}
            {selected?.length > 2 && (
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#7677F4]/20 px-2 cursor-pointer">
                <div
                  onClick={() => setPopoverOpen(true)}
                  className="text-[#7677F4] text-[8px] font-bold"
                >{`+${selected?.length - 2}`}</div>
              </div>
            )}

            {/* Display placeholder or "Add" button */}
            <div className="flex flex-row justify-between w-full">
              <div>
                {selected?.length <= 0 && (
                  <div className="text-[#999999] font-normal">
                    {placeholder}
                  </div>
                )}
              </div>
              <div className="flex self-end">
                <button
                  className="ml-1 rounded-full text-[#7677F4] text-[12px] font-semibold"
                  onClick={() => setOpen(true)}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Items List (Popover) */}
        <div className="relative mt-2" ref={popoverDropdownRef}>
          {popoverOpen ? (
            <CommandGroup className="absolute w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              {selected?.map((item, index) => (
                <div key={item.value}>
                  <div className="flex flex-row justify-between items-center pr-3">
                    <div className="cursor-pointer p-2 text-[12px] hover:bg-gray-200">
                      {item.label}
                    </div>
                    <X
                      onClick={() => handleUnselect(item)}
                      className="h-4 w-4 cursor-pointer"
                      stroke="#7677F4"
                      strokeWidth={2.5}
                    />
                  </div>
                  {/* Add a horizontal line for all items except the last one */}
                  {index < selected?.length - 1 && (
                    <hr className="border-[#D6D7D8]" />
                  )}{" "}
                </div>
              ))}
            </CommandGroup>
          ) : null}
        </div>

        {/* Items to be selected list (Dropdown) */}
        <div className="relative mt-2" ref={dropdownRef}>
          {open && (
            <div className="absolute w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              {/* Search input */}
              <Input
                onChange={(e) => onSearch(e.target.value)}
                className="border-none rounded-xl focus:outline-none text-[#999999]"
              />
              <hr className="border-[#D6D7D8]" />

              {/* Scrollable list of selectable items */}
              <GetScrollTypesAlert
                id={"multioptions"}
                onBottom={() => {
                  onBottomReached();
                }}
              >
                <CommandGroup
                  id={"multioptions"}
                  className="max-h-[300px] text-[#333333] mr-1 mt-1 overflow-y-auto scrollbar"
                >
                  {selectables?.map((option, index) => (
                    <div>
                      <CommandItem
                        key={index}
                        className="focus:outline-[red]"
                        onSelect={() => {
                          onChange([...selected, option]);
                          setSelected((prev) => [...prev, option]);
                        }}
                      >
                        {option.label}
                      </CommandItem>
                      {/* Add a horizontal line for all items except the last one */}
                      {index < selectables?.length - 1 && (
                        <hr className="border-[#D6D7D8]" />
                      )}
                    </div>
                  ))}
                </CommandGroup>
              </GetScrollTypesAlert>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}
