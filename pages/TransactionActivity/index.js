// import React, { useState } from 'react'
// import Cross from './../../public/assets/Cross';
// import {
//     Dialog,
//     DialogTrigger,
//     DialogContent,
//     DialogClose,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
//   } from "../../src/ui/dialog.tsx";
//   import { Button } from "src/ui/button";
// import Stepper from './../../src/ui/stepper';

// export default function TransactionActivity() {
//     const [open, setOpen] = useState(false);
//   return (
//     <div>
//         <Stepper />
//         <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTrigger asChild>
//           <Button
//             onClick={() => setOpen(true)}
//             className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
//             variant="outline"
//           >
//             <div>Open Dialogue</div>
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="!w-[810px] bg-[#FFFFFF] ml-10">
//         <DialogClose
//             className="cursor-pointer"
//             onClick={() => setOpen(false)}
//           >
//         </DialogClose>
//         <div className="font-semibold text-[24px] leading-8 py-5">Transaction Activity</div>
//         <div className="flex flex-col gap-1">
//         <div className="text-xl font-bold text-[#15AF53]">Sale Completed</div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
//                 <span className="font-normal text-base leading-5">EUR 100.00</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
//                 <span className="font-normal text-base leading-5">Jan 22, 2023 | 01:42:56</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
//                 <span className="font-normal text-base leading-5">TS12356GF4</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
//                 <span className="font-normal text-base leading-5 text-[#15AF53]">Completed</span>
//             </div>
//         </div>

//         <div className="flex flex-col gap-1">
//         <div className="text-xl font-bold text-[#EC7357]">Partial Refund Raised</div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
//                 <span className="font-normal text-base leading-5">EUR 60.00</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
//                 <span className="font-normal text-base leading-5">Jan 22, 2023 | 01:42:56</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
//                 <span className="font-normal text-base leading-5">TS12356GF4</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
//                 <span className="font-normal text-base leading-5 text-[#FF6D6D]">Cancel</span>
//             </div>
//         </div>

//         <div className="flex flex-col gap-1">
//         <div className="text-xl font-bold text-[#EC7357]">Refund Raised</div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
//                 <span className="font-normal text-base leading-5">EUR 40.00</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
//                 <span className="font-normal text-base leading-5">Jan 22, 2023 | 01:42:56</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
//                 <span className="font-normal text-base leading-5">TS12356GF4</span>
//             </div>
//             <div className="flex">
//                 <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
//                 <span className="font-normal text-base leading-5 text-[#FF6D6D]">Cancel</span>
//             </div>
//         </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

import React, { useState } from 'react'
import Cross from './../../public/assets/Cross';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "../../src/ui/dialog.tsx";
  import { Button } from "src/ui/button";

export default function TransactionActivity() {
    const [open, setOpen] = useState(false);
    const transactions = [
        {
          type: 'Sale Completed',
          details: {
            amount: 'EUR 100.00',
            timeStamp: 'Jan 22, 2023 | 01:42:56',
            transactionId: 'TS12356GF4',
            status: 'Completed',
            statusColor: '#15AF53'
          }
        },
        {
          type: 'Partial Refund Raised',
          details: {
            amount: 'EUR 60.00',
            timeStamp: 'Jan 22, 2023 | 01:42:56',
            transactionId: 'TS12356GF4',
            status: 'Cancel',
            statusColor: '#FF6D6D'
          }
        },
        {
            type: 'Refund Raised',
            details: {
              amount: 'EUR 40.00',
              timeStamp: 'Jan 22, 2023 | 01:42:56',
              transactionId: 'TS12356GF4',
              status: 'Cancel',
              statusColor: '#FF6D6D'
            }
          }
      ];
      const getTransactionIcon = (type) => {
        switch (type) {
          case 'Sale Completed':
            return (
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.62663 2 7.30655 2.70379 5.33316 4.02236C3.35977 5.34094 1.8217 7.21508 0.913451 9.4078C0.00519941 11.6005 -0.232441 14.0133 0.230582 16.3411C0.693605 18.6689 1.83649 20.807 3.51472 22.4853C5.19295 24.1635 7.33115 25.3064 9.65892 25.7694C11.9867 26.2324 14.3995 25.9948 16.5922 25.0865C18.7849 24.1783 20.6591 22.6402 21.9776 20.6668C23.2962 18.6934 24 16.3734 24 14C23.9966 10.8184 22.7313 7.76814 20.4816 5.51843C18.2319 3.26872 15.1816 2.00336 12 2ZM17.2685 11.8838L10.8069 18.3454C10.7212 18.4312 10.6194 18.4993 10.5073 18.5457C10.3953 18.5922 10.2752 18.6161 10.1538 18.6161C10.0325 18.6161 9.91243 18.5922 9.80037 18.5457C9.68831 18.4993 9.5865 18.4312 9.50077 18.3454L6.73154 15.5762C6.55834 15.4029 6.46103 15.168 6.46103 14.9231C6.46103 14.6781 6.55834 14.4432 6.73154 14.27C6.90475 14.0968 7.13967 13.9995 7.38462 13.9995C7.62957 13.9995 7.86449 14.0968 8.0377 14.27L10.1538 16.3873L15.9623 10.5777C16.0481 10.4919 16.1499 10.4239 16.2619 10.3775C16.374 10.3311 16.4941 10.3072 16.6154 10.3072C16.7367 10.3072 16.8568 10.3311 16.9688 10.3775C17.0809 10.4239 17.1827 10.4919 17.2685 10.5777C17.3542 10.6635 17.4223 10.7653 17.4687 10.8773C17.5151 10.9894 17.539 11.1095 17.539 11.2308C17.539 11.3521 17.5151 11.4722 17.4687 11.5842C17.4223 11.6963 17.3542 11.7981 17.2685 11.8838Z" fill="#15AF53"/>
                </svg>
            );
          case 'Partial Refund Raised':
            return (
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="28" fill="white"/>
                <circle cx="12" cy="14" r="12" fill="#EC7357"/>
                <path d="M12 12.0556H9.6006L9.6 19.3889H8.4V12.0556H6L9 9L12 12.0556ZM18 16.9444L15 20L12 16.9444H14.4V9.61111H15.6V16.9444H18Z" fill="white"/>
              </svg>
            );
          case 'Refund Raised':
                return (
                    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="28" fill="white"/>
                    <circle cx="12" cy="14" r="12" fill="#EC7357"/>
                    <path d="M12 12.0556H9.6006L9.6 19.3889H8.4V12.0556H6L9 9L12 12.0556ZM18 16.9444L15 20L12 16.9444H14.4V9.61111H15.6V16.9444H18Z" fill="white"/>
                  </svg>
                );
          default:
            return null; // Default case if no matching transaction type is found
        }
      };

  return (
    <div>
        {transactions.map((transaction, index) => (
          <div key={index} className="flex flex-row gap-4">
    <div className="flex flex-col items-center justify-start">
                 <div className="flex">
                  {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex w-[3px] h-[120px] m-t-2 m-b-2" style={{ background: transaction.details.statusColor }}></div>
                  </div> 
              <div className="flex flex-col">
              <div className="flex text-xl font-bold text-[#15AF53] m-b-10" style={{ color: transaction.details.statusColor }}>{transaction.type}</div>
              <div className="flex flex-col">
              <div className="flex">
                  <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
                  <span className="font-normal text-base leading-5">{transaction.details.amount}</span>
              </div>
              <div className="flex">
                  <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
                  <span className="font-normal text-base leading-5">{transaction.details.timeStamp}</span>
              </div>
              <div className="flex">
                  <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
                  <span className="font-normal text-base leading-5" style={{ color: transaction.details.statusColor }}>{transaction.details.transactionId}</span>
              </div>
              <div className="flex">
                  <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
                  <span className="font-normal text-base leading-5 text-[#FF6D6D]">{transaction.details.status}</span>
              </div>
              </div>
              </div>
           </div>
        ))}
    </div>
  )
}



