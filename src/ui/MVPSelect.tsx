import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import {  Search } from "lucide-react";
import CrossIcon from "@public/assets/CrossIcon";



import { cn } from "src/lib/utils";
import { Button } from "./button";
import DropDownArrow from "@public/assets/DropDownArrow";
import { onChange } from "react-toastify/dist/core/store";


const MVPSelect = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> & {
    open?: boolean;
    onChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
  }
>(({ open,onChange, onOpenChange, ...props }, ref) => {
const handleOpen = (val:any) =>{
onChange && onChange(val)
}
  return(
  <PopoverPrimitive.Root
    open={open}
    onOpenChange={handleOpen}
    {...props}
  />
)});

MVPSelect.displayName = PopoverPrimitive.Root.displayName;

const Trigger = PopoverPrimitive.Trigger;

const MVPSelectTrigger = React.forwardRef<
  React.ElementRef<typeof Trigger>,
  {
    placeholder: string;
    open?: boolean; 
    value?: string; 
    setValue?: React.Dispatch<React.SetStateAction<string>>; 
    className?: string ;
  } & React.ComponentPropsWithoutRef<typeof Trigger>
>(({ placeholder, open, value, setValue, className, ...props }, ref) => (
  <Trigger asChild>
    <Button
      ref={ref}
      variant="outline"
      type="button"
      role="combobox"
      aria-expanded={open}
      className={cn("w-72 text-sm justify-between", className)}
      {...props}
    >
      {value ? value : placeholder}
      {value ? (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the outer button's click event
            setValue && setValue("");
          }}
        >
          <CrossIcon height={10} />
        </button>
      ) : (
        <DropDownArrow />
      )}
    </Button>
  </Trigger>
));
MVPSelectTrigger.displayName = 'MVPSelectTrigger';

const MVPSelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { children?: React.ReactNode }
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <CommandPrimitive
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground",
          className
        )}
      >
        {children}
      </CommandPrimitive>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
MVPSelectContent.displayName = 'CombinedComponent';


const MVPSelectList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

MVPSelectList.displayName = CommandPrimitive.List.displayName;

const MVPSelectInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
  </div>
));

MVPSelectInput.displayName = CommandPrimitive.Input.displayName;


const MVPSelectEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => {
  console.log(props,"props are")
  return(
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  >No Results found
    </CommandPrimitive.Empty>
)});

MVPSelectEmpty.displayName = CommandPrimitive.Empty.displayName;

const MVPSelectItems = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));

MVPSelectItems.displayName = CommandPrimitive.Group.displayName;

const MVPSelectItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    onChange?: (value: string) => void;
    value: string;
  }
>(({ className, onChange, value, children, ...props }, ref) => {
  const handleSelect = (val:string) => {
    onChange && onChange(val);

  };

  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex h-[42px] cursor-default select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-[#7677F4]/10 aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
      onSelect={handleSelect}
    >
      {children}
    </CommandPrimitive.Item>
  );
});

MVPSelectItem.displayName = CommandPrimitive.Item.displayName;

const MVPSelectSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
MVPSelectSeparator.displayName = CommandPrimitive.Separator.displayName;



export { MVPSelect, MVPSelectTrigger, MVPSelectContent,MVPSelectInput,MVPSelectItems, MVPSelectItem, MVPSelectSeparator, MVPSelectList,MVPSelectEmpty };