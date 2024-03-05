import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "src/lib/utils";
import Arrow from "@public/assets/Arrow";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(
  (
    { className, align = "center", side = "top", sideOffset = 4, ...props },
    ref
  ) => {
    return (
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 -top-2 -left-2 rounded-md border bg-[#333333] p-4 text-[#FFFFFF] shadow-md outline-none relative",
          className
        )}
        {...props}
      >
        {props.children}

        <div className="absolute w-0 h-0 border-t-8 mt-1 border-solid border-transparent border-popover left-1/2 transform -translate-x-1/2">
          <Arrow />
        </div>
      </HoverCardPrimitive.Content>
    );
  }
);

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
