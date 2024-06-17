"use client"

// shadcn tooltip which appears when a cursor is positioned over an icon, image, hyperlink, or other element.
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"

import { cn } from "src/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = (props: TooltipPrimitive.TooltipTriggerProps) => (
  <TooltipPrimitive.Trigger {...props} type="button" />
)

const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
const TooltipArrow = TooltipPrimitive.Arrow

TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipArrow, TooltipPortal, TooltipContent, TooltipProvider, TooltipTrigger }
