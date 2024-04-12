import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../../../src/ui/popover'
import CrossIcon from "@public/assets/CrossIcon";

export default function BalanceDue({balanceDue}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onClose={() => setOpen(false)}>
      <PopoverTrigger>
        <div onClick={() => setOpen(true)}>
          {balanceDue}
          </div>
      </PopoverTrigger>
      <PopoverContent  style={{width: 643}}>
        <div className="">
        <div className="flex justify-end">
         <div className="cursor-pointer" onClick={() => setOpen(false)}          >
            <CrossIcon width={16} height={16} />
        </div> 
        </div>
          <div className="text-[#333333] text-center">
            <div className="font-semibold text-lg leading-6">Balance due fee component details</div>
            <div className="font-normal text-xs italic leading-4">(Additional payment request)</div>
          </div>
          
          <div className="">
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
  );
}
