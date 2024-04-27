"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Badge } from "./badge";
import { Command, CommandGroup, CommandItem } from "./command";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import { Input } from "./input";
import { useEffect } from "react";
import isEqual from "lodash/isEqual";
import _, { uniqBy } from "lodash";

// Define the shape of each data item
export type DataItem = Record<"value" | "label", string>;

// Main MultiSelect component
export function MultiSelect({
  placeholder = "Select an item",
  data = [],
  onBottomReached,
  onSearch,
  onChange,
  value: propValue = [],
  getOptionProps,
  error,
  selectBoxStyles,
  searchBar = true,
}: {
  placeholder?: string;
  data: DataItem[];
  onBottomReached: () => void;
  onSearch: (query: string) => void;
  onChange: any;
  value?: any;
  getOptionProps?: any;
  error?: any;
  selectBoxStyles?: any;
  /**
   * To hide search bar for mutli select dropdowns we can use this prop
   * True: by default it will be true only no need to pass
   * False: it will not display search bar
   */
  searchBar?: boolean;
}) {
  const filteredData = uniqBy(data, "value");

  // Refs to manage focus and detect clicks outside the component
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const popoverDropdownRef = React.useRef<HTMLDivElement>(null);

  // States to manage the component's behavior
  const [open, setOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const [selected, setSelected] = React.useState<any[]>(propValue);

  const headerStyles = selectBoxStyles?.header || "";
  const dropdownStyles = selectBoxStyles?.dropdown || "";

  // Handle unselecting an item from the selected list
  const handleUnselect = (item: number) => {
    setSelected((prev) => prev.filter((s) => s !== item));
    onChange(selected.filter((s) => s !== item));
  };

  const handleOnSelect = (option: any) => {
    onChange([...selected, option]);
    setSelected((prev) => [...prev, option]);
    console.log(data, selected, selectables, "selectables");
  };

  //When prop values changes from external functions, we have to keep the selected state and prop value in sync.
  //How use effect will work was when dependency was changed, it will run
  //here we are doing stringify of propvalue becuase of below reasons
  // reason 1: initially propValue is an empty array []==[] is false it will think like false so it willrun again and again.
  // solution 1: keeping JSON.stringify(propValue) it means "[]"=="[]" is true it will not run again.
  // solution 2: //TODO: In FUTURE we will do complete controlled component without any useEffects
  useEffect(() => {
    setSelected(propValue);
  }, [JSON.stringify(propValue)]);

  // Handle clicks outside the dropdown to close it

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setPopoverOpen(false); // Close the popover as well
      }
      onSearch("");
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, popoverOpen]);

  const findObjectById = (id: any): DataItem | undefined => {
    // Find the object with the given id
    return filteredData.find((obj) => obj.value === id);
  };

  // Filter out selected values from the dropdown
  const selectables = filteredData.filter(
    (obj) => !selected.includes(obj.value)
  );

  return (
    <div className={`grid w-full items-center ${headerStyles}`}>
      <Command className="overflow-visible bg-transparent">
        <div
          className={`rounded-xl px-4 py-2 text-sm relative h-[40px] border ${
            //If error is present then we make the border red to show error
            error ? "border-[#FF6D6D]" : "border-[#E1E1E1]"
          }`}
        >
          {/* Display selected items and provide options to remove them */}
          <div className="flex gap-2 items-center">
            {/* Display up to two selected items with a badge */}
            {selected?.map((item, index) => {
              // Extracting option properties, including 'noIcon' to determine if a cross icon should be displayed
              const optionProps = getOptionProps
                ? getOptionProps(item)
                : {
                    noIcon: false,
                  };
              const { disable: noIcon } = optionProps;
              if (index > 1) return null;

              return (
                <Badge
                  key={item}
                  variant="outline"
                  className="border flex items-center"
                >
                  <div className="max-w-[60px] truncate">
                    <abbr
                      className="no-underline"
                      title={findObjectById(item)?.label}
                    >
                      {findObjectById(item)?.label}
                    </abbr>
                  </div>

                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none"
                    onClick={() => handleUnselect(item)}
                  >
                    {!noIcon && (
                      <X
                        onClick={() => handleUnselect(item)}
                        className="h-4 w-4 cursor-pointer"
                        stroke="#7677F4"
                        strokeWidth={2.5}
                      />
                    )}
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
            <div className="flex flex-row justify-between w-full ">
              <div>
                {selected?.length <= 0 && (
                  <div className="text-[#999999] font-normal">
                    {placeholder}
                  </div>
                )}
              </div>
              <div className="flex self-end">
                <button
                  type="button"
                  className="ml-1 rounded-full text-[#7677F4] text-[12px] font-semibold"
                  onClick={(e) => {
                    setOpen(true);
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Items List (Popover) */}
        <div className="relative" ref={popoverDropdownRef}>
          {popoverOpen ? (
            <CommandGroup
              className={`absolute w-full z-[100]  rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in ${dropdownStyles}`}
            >
              {selected?.map((item, index) => {
                // Extracting option properties, including 'noIcon' to determine if a cross icon should be displayed
                const optionProps = getOptionProps
                  ? getOptionProps(item)
                  : {
                      noIcon: false,
                    };
                    const { disable: noIcon } = optionProps;
                    return (
                  <div key={item}>
                    <div className="flex flex-row justify-between items-center pr-3">
                      <div className="cursor-pointer p-2 text-[12px]">
                        {findObjectById(item)?.label}
                      </div>
                      {!noIcon && (
                        <X
                          onClick={() => handleUnselect(item)}
                          className="h-4 w-4 cursor-pointer"
                          stroke="#7677F4"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                    {/* Add a horizontal line for all items except the last one */}
                    {index < selected?.length - 1 && (
                      <hr className="border-[#D6D7D8]" />
                    )}{" "}
                  </div>
                );
              })}
            </CommandGroup>
          ) : null}
        </div>

        {/* Items to be selected list (Dropdown) */}
        <div className="relative z-50" ref={dropdownRef}>
          {open && (
            <div className="absolute w-full rounded-md border bg-[#FFFFFF] text-popover-foreground shadow-md outline-none animate-in">
              {/* Search input */}
              {searchBar && (
                <Input
                  onChange={(e) => onSearch(e.target.value)}
                  className="border-none rounded-xl focus:outline-none text-[#999999]"
                />
              )}
              <hr className="border-[#D6D7D8]" />

              {/* Scrollable list of selectable items */}
              <GetScrollTypesAlert
                id={"multiselect"}
                onBottom={() => {
                  onBottomReached();
                }}
              >
                <CommandGroup
                  id={"multiselect"}
                  className="max-h-[250px] text-[#333333] mr-1 mt-1 overflow-y-auto scrollbar"
                >
                  {selectables?.map((option, index) => (
                    <div>
                      <CommandItem
                        key={option?.value}
                        onSelect={() => handleOnSelect(option.value)}
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
