import CrossIcon from '@public/assets/CrossIcon'
import RedReverseIcon from '@public/assets/RedReverseIcon'
import SuccessGreenTick from '@public/assets/SuccessGreenTick'
import { useState } from 'react'
import { Separator } from 'src/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from 'src/ui/sheet'
import { Button } from '../../../src/ui/button'

export default function TransactionActivity({
  transactionHistory,
  renderHeader
}: {
  transactionHistory?: any
  renderHeader?: any
}) {
  const [open, setOpen] = useState(false)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Sale':
        return <SuccessGreenTick />
      case 'Partial refund':
        return <RedReverseIcon />
      case 'Refund':
        return <RedReverseIcon />
      default:
        return null // Default case if no matching transaction type is found
    }
  }

  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case 'Sale':
        return <div>Sale Completed</div>
      case 'Partial refund':
        return <div>Partial Refund Raised</div>
      case 'Refund':
        return <div>Refund Raised</div>
      default:
        return null // Default case if no matching transaction type is found
    }
  }

  const getTransactionStatusName = (status: string) => {
    switch (status) {
      case 'Success':
        return <div>Completed</div>
      case 'Pending':
        return <div>Pending</div>
      case 'Canceled':
        return <div>Cancel</div>
      default:
        return null // Default case if no matching transaction type is found
    }
  }

  return (
    <Sheet open={open}>
      <SheetTrigger onClick={() => setOpen(true)}>
        <div className="text-[#15AF53]">
          {renderHeader ? renderHeader : transactionHistory[0]?.transaction_type_id.value}
        </div>
      </SheetTrigger>
      <SheetContent className="w-[550px] h-fit rounded-l-xl flex flex-col gap-4">
        <SheetHeader className="p-3 text-2xl font-semibold flex flex-row">
          <div className="flex justify-between items-center flex-grow">
            <div className="text-2xl font-semibold">Transaction Activity</div>
            <div onClick={() => setOpen(false)} className="cursor-pointer">
              <CrossIcon width={16} height={16} />
            </div>
          </div>
        </SheetHeader>
        <Separator />

        <div className="m-l-5 p-t-10">
          {transactionHistory?.map((transaction: any, index: number) => (
            <div key={index} className="flex flex-row gap-4">
              <div className="flex flex-col items-center justify-start">
                <div className="flex">{getTransactionIcon(transaction?.transaction_type_id?.value)}</div>
                {index !== transactionHistory.length - 1 && (
                  <div
                    className={`flex !w-[3px] h-[170px] m-t-2 m-b-2`}
                    style={{
                      background:
                        transaction?.transaction_type_id && transaction?.transaction_type_id?.value === 'Sale'
                          ? '#15AF53'
                          : '#EC7357'
                    }}
                  ></div>
                )}
              </div>
              <div className="flex flex-col">
                <div
                  className="flex text-xl font-bold m-b-10"
                  style={{
                    color:
                      transaction.transaction_type_id && transaction.transaction_type_id.value === 'Sale'
                        ? '#15AF53'
                        : '#EC7357'
                  }}
                >
                  {getTransactionTypeName(transaction.transaction_type_id.value)}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <span className="font-semibold text-base leading-5 pr-2">Transaction Amount:</span>
                    <span className="font-normal text-base leading-5">EUR {transaction?.total_amount}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-base leading-5 pr-2">Time Stamp:</span>
                    <span className="font-normal text-base leading-5">
                      {/* // TODO:  Update this with function to display in proper format , praveen has already done it // */}
                      {transaction?.created_at}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-base leading-5 pr-2">Transaction id:</span>
                    <span className="font-normal text-base leading-5">
                      {transaction.transaction_id ? transaction.transaction_id : '-'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-base leading-5 pr-2">Transaction Status:</span>
                    <span
                      className="font-normal text-base leading-5"
                      style={{
                        color:
                          transaction.transaction_type_id && transaction.transaction_type_id.value === 'Sale'
                            ? '#15AF53'
                            : '#EC7357'
                      }}
                    >
                      {getTransactionStatusName(transaction.transaction_status_id.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center p-t-5">
          <Button className="font-bold" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
