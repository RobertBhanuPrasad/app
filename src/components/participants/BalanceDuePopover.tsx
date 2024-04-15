import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../../../src/ui/popover'
import CrossIcon from "@public/assets/CrossIcon";
import { Header, Text } from '../../../src/ui/TextTags';

export default function BalanceDue({balanceDue}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onClose={() => setOpen(false)}>
      <PopoverTrigger>
        <div onClick={() => setOpen(true)}>
          {/* {balanceDue} */}
          183.34
          </div>
      </PopoverTrigger>
      <PopoverContent  style={{width: 643}}>
        <div className="">
        <div className="flex justify-end">
         <div className="cursor-pointer" onClick={() => setOpen(false)}          >
            <CrossIcon width={16} height={16} />
        </div> 
        </div>
          <div className="text-center">
            <Header className="leading-6">Balance due fee component details</Header>
            <Text className="font-normal text-xs italic leading-4">(Additional payment request)</Text>
          </div>
          
          <div className="">
            <div className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <Text className="font-semibold text-base leading-5">Organization fee:</Text>
              <Text className="font-normal text-base leading-5">EUR 1,000.00</Text>
            </div>
            <div className="flex justify-between">
              <Text className="font-semibold text-base leading-5">Accommodation fee:</Text>
              <Text className="font-normal text-base leading-5">EUR 100.00</Text>
            </div>
            <div className="flex justify-between">
              <Text className="font-semibold text-base leading-5">Total:</Text>
              <Text className="font-normal text-base leading-5">EUR 1,100.00</Text>
            </div>
          </div>
          </div>
        </div>
     </PopoverContent>
     </Popover>
  );
}
