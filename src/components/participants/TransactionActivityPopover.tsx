import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "src/ui/sheet";
import { Button } from '../../../src/ui/button'
import { Separator } from "src/ui/separator";
import CrossIcon from "@public/assets/CrossIcon";


export default function TransactionActivity({transactionHistory}) {
  console.log("transactionHistory",transactionHistory);
  console.log("transaction total amount",transactionHistory[0]?.total_amount);
  const [open, setOpen] = useState(false);

  const transactions = [
    {
      type: "Sale Completed",
      details: {
        amount: "EUR 100.00",
        timeStamp: "Jan 22, 2023 | 01:42:56",
        transactionId: "TS12356GF4",
        status: "Completed",
        statusColor: "#FF6D6D",
      },
    },
    {
      type: "Partial Refund Raised",
      details: {
        amount: "EUR 60.00",
        timeStamp: "Jan 22, 2023 | 01:42:56",
        transactionId: "TS12356GF4",
        status: "Cancel",
        statusColor: "#FF6D6D",
      },
    },
    {
      type: "Refund Raised",
      details: {
        amount: "EUR 40.00",
        timeStamp: "Jan 22, 2023 | 01:42:56",
        transactionId: "TS12356GF4",
        status: "Cancel",
        statusColor: "#FF6D6D",
      },
    },
  ];
  const getTransactionIcon = (type) => {
    switch (type) {
      case "Sale":
        return (
          <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C9.62663 2 7.30655 2.70379 5.33316 4.02236C3.35977 5.34094 1.8217 7.21508 0.913451 9.4078C0.00519941 11.6005 -0.232441 14.0133 0.230582 16.3411C0.693605 18.6689 1.83649 20.807 3.51472 22.4853C5.19295 24.1635 7.33115 25.3064 9.65892 25.7694C11.9867 26.2324 14.3995 25.9948 16.5922 25.0865C18.7849 24.1783 20.6591 22.6402 21.9776 20.6668C23.2962 18.6934 24 16.3734 24 14C23.9966 10.8184 22.7313 7.76814 20.4816 5.51843C18.2319 3.26872 15.1816 2.00336 12 2ZM17.2685 11.8838L10.8069 18.3454C10.7212 18.4312 10.6194 18.4993 10.5073 18.5457C10.3953 18.5922 10.2752 18.6161 10.1538 18.6161C10.0325 18.6161 9.91243 18.5922 9.80037 18.5457C9.68831 18.4993 9.5865 18.4312 9.50077 18.3454L6.73154 15.5762C6.55834 15.4029 6.46103 15.168 6.46103 14.9231C6.46103 14.6781 6.55834 14.4432 6.73154 14.27C6.90475 14.0968 7.13967 13.9995 7.38462 13.9995C7.62957 13.9995 7.86449 14.0968 8.0377 14.27L10.1538 16.3873L15.9623 10.5777C16.0481 10.4919 16.1499 10.4239 16.2619 10.3775C16.374 10.3311 16.4941 10.3072 16.6154 10.3072C16.7367 10.3072 16.8568 10.3311 16.9688 10.3775C17.0809 10.4239 17.1827 10.4919 17.2685 10.5777C17.3542 10.6635 17.4223 10.7653 17.4687 10.8773C17.5151 10.9894 17.539 11.1095 17.539 11.2308C17.539 11.3521 17.5151 11.4722 17.4687 11.5842C17.4223 11.6963 17.3542 11.7981 17.2685 11.8838Z"
              fill="#15AF53"
            />
          </svg>
        );
      case "Partial refund":
        return (
          <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="28" fill="white" />
            <circle cx="12" cy="14" r="12" fill="#EC7357" />
            <path
              d="M12 12.0556H9.6006L9.6 19.3889H8.4V12.0556H6L9 9L12 12.0556ZM18 16.9444L15 20L12 16.9444H14.4V9.61111H15.6V16.9444H18Z"
              fill="white"
            />
          </svg>
        );
      case "Refund":
        return (
          <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="28" fill="white" />
            <circle cx="12" cy="14" r="12" fill="#EC7357" />
            <path
              d="M12 12.0556H9.6006L9.6 19.3889H8.4V12.0556H6L9 9L12 12.0556ZM18 16.9444L15 20L12 16.9444H14.4V9.61111H15.6V16.9444H18Z"
              fill="white"
            />
          </svg>
        );
      default:
        return null; // Default case if no matching transaction type is found
    }
  };

  const getTransactionTypeName = (type) => {
    switch (type) {
      case "Sale":
        return (
          <div>Sale Completed</div>
        );
      case "Partial refund":
        return (
          <div>Partial Refund Raised</div>
        );
      case "Refund":
        return (
          <div>Refund Raised</div>
        );
      default:
        return null; // Default case if no matching transaction type is found
    }
  };

  return (
    <Sheet open={open} onClose={() => setOpen(false)}>
      <SheetTrigger onClick={() => setOpen(true)}>
        <div>
          {transactionHistory[0].transaction_type_id.value}
          </div>
      </SheetTrigger>
      <SheetContent className="w-[470px] h-fit rounded-l-xl">
      <SheetHeader className="p-3 text-2xl font-semibold flex flex-row">
              <div className="flex justify-between items-center flex-grow">
                <div className="text-2xl font-semibold">Transaction Activity</div>
                <div
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                >
                  <CrossIcon width={16} height={16} />
                </div>
              </div>
            </SheetHeader>
            <Separator />

<div className="m-l-5 p-t-10">
      {transactionHistory.map((transaction, index) => (
        <div key={index} className="flex flex-row gap-4">
          <div className="flex flex-col items-center justify-start">
            <div className="flex">{getTransactionIcon(transaction.transaction_type_id.value)}</div>
        {index !== transactionHistory.length - 1 && (
          <div
            className={`flex !w-[3px] h-[170px] m-t-2 m-b-2`}
            style={{
              background:
                transaction.transaction_type_id && transaction.transaction_type_id.value === "Sale"
                  ? "#15AF53"
                  : "#EC7357",
            }}
          ></div>
        )}
          </div>
          <div className="flex flex-col">
             <div
                className="flex text-xl font-bold m-b-10"
                style={{
                  color:
                    transaction.transaction_type_id && transaction.transaction_type_id.value === "Sale"
                      ? "#15AF53"
                      : "#EC7357",
                }}
              >
              {getTransactionTypeName(transaction.transaction_type_id.value)}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">
                  Transaction Amount:
                </span>
                <span className="font-normal text-base leading-5">
                  EUR {transaction?.total_amount}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">
                  Time Stamp:
                </span>
                <span className="font-normal text-base leading-5">
                  {transaction.created_at}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">
                  Transaction id:
                </span>
                <span className="font-normal text-base leading-5">
                  {transaction.transaction_id ? transaction.transaction_id : '-'} 
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">
                  Transaction Status:
                </span>
                <span
                  className="font-normal text-base leading-5"
                  style={{
                    color:
                      transaction.transaction_type_id && transaction.transaction_type_id.value === "Sale"
                        ? "#15AF53"
                        : "#EC7357",
                  }}
                >
                  {transaction.transaction_status_id}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center p-t-5">
    <Button
                  className="font-bold"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
    </div>
    </SheetContent>
    </Sheet>
  );
}