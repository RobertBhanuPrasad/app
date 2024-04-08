import React from 'react'

export default function TransactionActivity() {
  return (
    <div className="bg-[#50d71e]">
        <div className="font-semibold text-[24px] leading-8 py-5">Transaction Activity</div>

        <div className="flex flex-col gap-1">
        <div className="text-xl font-bold text-[#15AF53]">Sale Completed</div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
                <span className="font-normal text-base leading-5">EUR 100.00</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
                <span className="font-normal text-base leading-5">Jan 22, 2023 | 01:42:56</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
                <span className="font-normal text-base leading-5">TS12356GF4</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
                <span className="font-normal text-base leading-5 text-[#15AF53]">Completed</span>
            </div>
        </div>

        <div className="flex flex-col gap-1">
        <div className="text-xl font-bold text-[#EC7357]">Partial Refund Raised</div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
                <span className="font-normal text-base leading-5">EUR 60.00</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
                <span className="font-normal text-base leading-5">Jan 22, 2023 | 01:42:56</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
                <span className="font-normal text-base leading-5">TS12356GF4</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
                <span className="font-normal text-base leading-5 text-[#FF6D6D]">Cancel</span>
            </div>
        </div>

        <div className="flex flex-col gap-1">
        <div className="text-xl font-bold text-[#EC7357]">Refund Raised</div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
                <span className="font-normal text-base leading-5">EUR 40.00</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
                <span className="font-normal text-base leading-5">Jan 22, 2023 | 01:42:56</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
                <span className="font-normal text-base leading-5">TS12356GF4</span>
            </div>
            <div className="flex">
                <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
                <span className="font-normal text-base leading-5 text-[#FF6D6D]">Cancel</span>
            </div>
        </div>
    </div>
  )
}
