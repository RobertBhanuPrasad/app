import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from "../../src/ui/popover.tsx"

export default function BalanceDue() {
  return (
    <Popover>
      <PopoverTrigger>
        <button>Open Popover</button>
      </PopoverTrigger>
      <PopoverContent className="w-[643px]">
        <div className="popovercontainer">
          <div className="text-[#333333] text-center">
            <div className="font-semibold text-lg leading-6">Balance due fee component details</div>
            <div className="font-normal text-xs italic leading-4">(Additional payment request)</div>
          </div>
          <div className="body">
            <div className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="font-semibold text-base leading-5">Organization fee:</span>
              <span className="font-normal text-base leading-5">EUR 1,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-base leading-5">Accommodation fee:</span>
              <span className="font-normal text-base leading-5">EUR 100.00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-base leading-5">Total:</span>
              <span className="font-normal text-base leading-5">EUR 1,100.00</span>
            </div>
          </div>
          </div>
        </div>
    </PopoverContent>
    </Popover>
  )
}



