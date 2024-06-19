"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { useRef } from "react";
import { cn } from "src/lib/utils";
import { Input, InputProps } from "./input";
/**
 * Select Context interface
 */
interface ISelectContext {
    /**
     * value of a select component
     * undefined | null | or empty string means the user has not selected any value
     * any other than above value means it has value
     */
    value?: string | undefined | null | object;
}

const SelectContext = React.createContext({});

/**
 * Select is a wrapper component around the `@radix-ui/react-select` package.
 * It provides a unified API for working with select components and hides
 * implementation details specific to the `radix-ui/react-select` package.
 *
 * The component is designed to be highly customizable and can be used in
 * different contexts. This is achieved by omitting the `value` and
 * `onValueChange` props from the underlying `radix-ui/react-select` component.
 * These props are managed internally within the `Select` component to provide
 * a consistent API for all select components.
 *
 * This component also handles the conversion of the value to and from a
 * JSON string. This ensures that the value passed to and from the `onValueChange`
 * callback is always a valid JSON object or string. This is important for
 * consistency and to avoid any potential issues with data manipulation.
 */
type SelectProps = Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    "value" | "onValueChange" | "defaultValue"
> & {
    value?: unknown;
    onValueChange?: (value: unknown) => void;
    defaultValue?: unknown;
};

const Select: React.FC<SelectProps> = ({
    children,
    value,
    onValueChange,
    defaultValue,
    ...props
}) => {
    // Convert the value to a JSON string to ensure it can be safely stored and
    // manipulated.
    value = typeof value !== "string" ? JSON.stringify(value) : value;
    defaultValue =
        typeof defaultValue !== "string"
            ? JSON.stringify(defaultValue)
            : defaultValue;

    return (
        <SelectContext.Provider value={{ value }}>
            <SelectPrimitive.Root
                // Set the internal value of the select component.
                value={value as string}
                defaultValue={defaultValue as string}
                // Handle the onValueChange event and convert the value back to its
                // original type before passing it to the consumer.
                onValueChange={(e) =>
                    onValueChange?.(typeof e == "string" ? e : JSON.parse(e))
                }
                // Pass all other props to the underlying select component.
                {...props}
            >
                {children}
            </SelectPrimitive.Root>
        </SelectContext.Provider>
    );
};

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
        error?: boolean;
    }
>(({ className, children, error, ...props }, ref) => {
    const { value }: ISelectContext = React.useContext(SelectContext);

    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex h-10  w-full items-center justify-between rounded-[12px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ",
                className,
                `${error ? "!border-[#FF6D6D] " : ""}`,
                // Requirement: We have to display light color placeholder if user has not selcted the value
                // Implementation: We have taken one context to access the value of select inside children compound components
                // Condition: when value is null or undefined or empty string then display light color
                (value === "" || value === undefined || value === null) &&
                    "font-normal text-[#999999]"
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild className="">
                <ChevronDown className="h-5 w-5 text-black " />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectItems = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Viewport> & {
        onBottomReached?: () => void;
    }
>(({ children, className, onBottomReached, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    /**
     * Calculate the position of the bottom of the last child element
     *
     * @return {void}
     */
    const handleScroll = () => {
        const element: any = scrollRef.current;
        if (!element) return;

        // Calculate the position of the bottom of the last child element
        const lastChildPosition =
            element.children[element.children.length - 1].offsetTop +
            element.children[element.children.length - 1].offsetHeight;

        // Calculate the scroll position of the bottom of the element
        const scrollPosition = element.scrollTop + element.clientHeight;
        // If the user has scrolled to the bottom, call the onBottomReached function
        if (scrollPosition >= lastChildPosition - 5) {
            onBottomReached?.();
        }
    };

    React.useEffect(() => {
        const element = scrollRef.current;
        if (!element) return undefined;

        element.addEventListener("scroll", handleScroll);
        return () => {
            element.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <SelectPrimitive.Viewport
            className={cn(
                "p-1 ",
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}
            {...props}
        >
            <div
                className={cn("overflow-y-auto max-h-[200px]", className)}
                ref={scrollRef}
            >
                {children}
            </div>
        </SelectPrimitive.Viewport>
    );
});

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className
        )}
        {...props}
    >
        <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className
        )}
        {...props}
    >
        <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 min-w-[8rem] overflow-hidden rounded-[12px] border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            {/* <SelectScrollUpButton /> */}
            {/* <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      > */}
            {children}
            {/* </SelectPrimitive.Viewport> */}
            {/* <SelectScrollDownButton /> */}
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

type SelectItemProps = Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    "value"
>;

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    SelectItemProps & { value: unknown }
>(({ className, children, value, ...props }, ref) => {
    value = typeof value !== "string" ? JSON.stringify(value) : value;
    return (
        <>
            <SelectPrimitive.Item
                ref={ref}
                className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className
                )}
                value={value as string}
                {...props}
            >
                <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
            {/* <hr className="border-[#D6D7D8]" /> */}
        </>
    );
});

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

/**
 * Requirement : dropdowns are loosing focus everwhere so to gain focus, we are using
 * SelectInput Component, designed to be used as a wrapper around an Input component
 *
 * Bug no : 1149
 *
 * Implementation : Initially created functional component named SelectInput that accepts props of type InputProps,
 *  and used useRef hook to create a reference to the input element, and initially set to null, and added
 *  onBlur event handler to the Input component, and Return an Input component with the ref attribute set to the
 * inputRef which triggers a function to focus on the input element when it looses focus.
 *
 * @returns
 */
const SelectInput = (props: InputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    return <Input ref={inputRef} onBlur={() => inputRef.current?.focus()} {...props} />
  }
  
  export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
    SelectItems,
    SelectInput
  };
  