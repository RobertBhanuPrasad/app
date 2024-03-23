import ClearAllIcon from '@public/assets/ClearAllIcon'
import CrossIcon from '@public/assets/CrossIcon'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { Button } from 'src/ui/button'
import { Input } from 'src/ui/input'
import { Label } from 'src/ui/label'
import { RadioGroup, RadioGroupItem } from 'src/ui/radio-group'
import { ScrollArea } from 'src/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'src/ui/select'
import { Separator } from 'src/ui/separator'

const Filters = () => {
  {
    /*Transaction Status Data*/
  }
  const transactionStatusData = ['Confirmed', 'Pending', 'Failed']

  {
    /*Transaction Type Data*/
  }
  const transactionTypeData = ['All', 'Sale', 'Partial Refund', 'Refund']

  {
    /*Payment Method Data*/
  }
  const paymentMethodData = ['Cash', 'Check', 'Credit Card', 'Pay Later']

  {
    /*Fee Level Data*/
  }
  const feeLevelData = ['Level-1', 'Level-2', 'Level-3']

  {
    /*Attendence Status Data*/
  }
  const attendenceStatusData = ['Completed', 'Pending', 'Canceled']

  {
    /*Agreement Status Data*/
  }
  const agreementStatusData = ['Completed', 'Pending']

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Filter By</p>
        <CrossIcon width={16} height={16} fill="#333333" />
      </div>
      <Separator />
      <ScrollArea className="h-[75vh] relative">
        <Accordion
          type="multiple"
          defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9']}
        >
          {/* Contact Details Accordion */}
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-0 font-semibold pr-8">Contact Details</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-normal">Name</Label>
                  <Input placeholder="Sumit Test" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-normal">Email</Label>
                  <Input placeholder="sumiittest@gmail.com" type="email" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-normal">Phone</Label>
                  <Input placeholder="+916789376838" type="number" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Registration Date Accordion */}
          <AccordionItem value="item-2" className="border-none ">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">Registration Date</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-normal">Date Range</Label>
                <Input placeholder="10/02/2024 - 12/02/2024" />
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Transaction Status Accordion */}
          <AccordionItem value="item-3" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">Transaction Status</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div className="flex gap-2">
                {transactionStatusData.map(status => (
                  <Button className="rounded-full" variant="outline">
                    {status}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Transaction Type Accordion */}
          <AccordionItem value="item-4" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">Transaction Type</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div className="flex justify-between">
                {transactionTypeData.map(type => (
                  <Button className="rounded-full" variant="outline">
                    {type}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Payment Method Accordion */}
          <AccordionItem value="item-5" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">Payment Method</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div className="flex flex-col gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {paymentMethodData.map(method => (
                        <SelectItem value={method}>{method}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="flex justify-between">
                  {paymentMethodData.map(method => (
                    <Button className="rounded-full" variant="outline">
                      {method}
                    </Button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Fee Level Accordion */}
          <AccordionItem value="item-6" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">Fee Level</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fee Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {feeLevelData.map(level => (
                        <SelectItem value={level}>{level}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Attendance status Accordion */}
          <AccordionItem value="item-7" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">Attendance status</AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <div className="flex gap-2">
                {attendenceStatusData.map(type => (
                  <Button className="rounded-full" variant="outline">
                    {type}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Health Consent Status */}
          <AccordionItem value="item-8" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">
              Health Consent Status
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-8">
              <RadioGroup defaultValue="Completed">
                <div className="flex gap-2">
                  {agreementStatusData.map(type => (
                    <Button className="rounded-lg flex gap-1" variant="outline">
                      <RadioGroupItem value={type} />
                      <p>{type}</p>
                    </Button>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Program Agreement Status */}
          <AccordionItem value="item-9" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-8">
              Program Agreement Status
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <RadioGroup defaultValue="Completed">
                <div className="flex gap-2">
                  {agreementStatusData.map(type => (
                    <Button className="rounded-lg flex gap-1" variant="outline">
                      <RadioGroupItem value={type} />
                      <p>{type}</p>
                    </Button>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
      <div className="flex left-0 items-center  gap-4 absolute bottom-0 h-[67px] w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] justify-end pr-6">
        <div className="flex gap-1 items-center cursor-pointer">
          <ClearAllIcon />
          <p className="text-primary"> Clear All</p>
        </div>
        <Button>Apply</Button>
      </div>
    </div>
  )
}

export default Filters
