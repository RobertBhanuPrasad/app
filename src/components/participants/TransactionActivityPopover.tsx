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
import SuccessGreenTick from '@public/assets/SuccessGreenTick';
import RedReverseIcon from '@public/assets/RedReverseIcon';


export default function TransactionActivity({transactionHistory}) {
  const [open, setOpen] = useState(false);

  console.log("transactionHistory",transactionHistory)

  const getTransactionIcon = (type) => {
    switch (type) {
      case "Sale":
        return (
          <SuccessGreenTick />
        );
      case "Partial refund":
        return (
          <RedReverseIcon />
        );
      case "Refund":
        return (
          <RedReverseIcon />
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
                  {/* // TODO:  Update this with function to display in proper format , praveen has already done it // */}
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
                    {/* // TODO:  Updated this transaction_status_id's value */}
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