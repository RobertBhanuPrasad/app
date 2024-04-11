import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from "../../src/ui/popover"
import Cross from './../../public/assets/Cross';

export default function BalanceDue() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onClose={() => setOpen(false)}>
      <PopoverTrigger>
        <button onClick={() => setOpen(true)}>Open Popover</button>
      </PopoverTrigger>
      <PopoverContent className="w-[643px]">
        <div className="bg-[red] ">
        <div className="flex justify-end">
        <div className="cursor-pointer" onClick={() => setOpen(false)}          >
            <Cross />
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

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogClose,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "../../src/ui/dialog.tsx";
// import { Button } from "src/ui/button";
// import Cross from './../../public/assets/Cross';

// export default function BalanceDue() {
//   // const [isOpen, setIsOpen] = useState(false);
//   const [open, setOpen] = useState(false);

//   return (
//     <div>
      // <Dialog open={open} onClose={() => setOpen(false)}>
      //   <DialogTrigger asChild>
      //     <Button
      //       onClick={() => setOpen(true)}
      //       className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
      //       variant="outline"
      //     >
      //       <div>Open Balance due Dialogue</div>
      //     </Button>
      //   </DialogTrigger>
        
        // <DialogContent className="!w-[810px] bg-[#FFFFFF] relative">
        // <DialogClose
        //     className="absolute top-7 right-2 cursor-pointer"
        //     onClick={() => setOpen(false)}
        //   >
        //     <Cross />
        //   </DialogClose>
//           <div className="bg-[red] ">  
//             <div className="flex flex-row justify-center">
//               <div className="flex flex-col text-[#333333] text-center justify-center items-center">
//                 <div className="font-semibold text-lg leading-6">
//                   Balance due fee component details
//                 </div>
//                 <div className="font-normal text-xs italic leading-4">
//                   (Additional payment request)
//                 </div>
//               </div>
//             {/* <div className="flex justify-end">
//             <DialogClose asChild>
//                 <Cross onClick={() => setOpen(false)} />
//               </DialogClose>
//             </div> */}
//               </div>
              
//             </div>
//             <div className="">
//               <div className="flex flex-col gap-2.5">
//                 <div className="flex justify-between">
//                   <span className="font-semibold text-base leading-5">
//                     Organization fee:
//                   </span>
//                   <span className="font-normal text-base leading-5">
//                     EUR 1,000.00
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold text-base leading-5">
//                     Accommodation fee:
//                   </span>
//                   <span className="font-normal text-base leading-5">
//                     EUR 100.00
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold text-base leading-5">
//                     Total:
//                   </span>
//                   <span className="font-normal text-base leading-5">
//                     EUR 1,100.00
//                   </span>
//                 </div>
//               </div>
//             </div>
      //   </DialogContent>
      // </Dialog>
//     </div>
//   );
// }
