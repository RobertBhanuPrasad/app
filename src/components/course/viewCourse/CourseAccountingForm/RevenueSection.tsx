import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { MainHeader } from 'src/ui/TextTags'
import { CourseInformationAccordion } from './CourseInformationAccordion'
import { QuestionInstructionModal } from './CourseQuestionAndInstruction'
import { useState } from 'react';
import { useForm, useFieldArray, Controller, useController, useFormContext } from 'react-hook-form';
import { format } from 'date-fns'; // For formatting the date
import { Input } from "src/ui/input";
import React from 'react'
import Delete from "@public/assets/Delete";
import Exclamation from "@public/assets/Exclamation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,

} from "src/ui/dialog"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "src/lib/utils"
import { Button } from "src/ui/button"
import { Calendar } from "src/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/ui/popover"



function RevenueSection() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, back } = useRouter()
  function setParamValue(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('current_section', term)
    }
    replace(`${pathname}?${params.toString()}`)
  }





  const { fields, append, remove } = useFieldArray({
    name: 'revenue',
  });

  const [isAddButtonDisabled, setAddButtonDisabled] = useState(false);



  const addInitialRow = () => {
    append({
    });
    setAddButtonDisabled(true);
  };

  const addRow = () => {
    append({});
  };

  const deleteRow = (index: number) => {
    remove(index);
    if (fields.length === 1) {
      setAddButtonDisabled(false);
    }
  };
  const { watch } = useFormContext();
  const formData = watch();



  return (
    <div>
      {' '}
      <div className="m-8 text-[#333333] text-[23px] font-semibold	">
        <div className="flex flex-row justify-between">
          <p>Revenue</p>
          <div className="text-[#7677F4] text-[16px] flex flex-row ">
            <QuestionInstructionModal />
          </div>
        </div>
        <div className="pt-5">
          <CourseInformationAccordion />
        </div>
        <div className='flex pt-10 pb-5'>
          <MainHeader className="text-[18px]" children="Deposit of Offline Revenue" />
          <button
            onClick={addInitialRow}
            disabled={isAddButtonDisabled}
            className={`text-[15px] relative bottom-[3px] pl-2 ${isAddButtonDisabled ? 'text-[#AFB0FF]' : 'text-[#7677F4]'
              }`}
          >
            <span className='text-[22px] relative top-[1px]'>+</span>Add
          </button>
        </div>
        {fields.length > 0 && (
          <div className='rounded-[12px] overflow-x-scroll overflow-y-hidden	w-full border border-[#D6D7D8]'>
              
                <div className='flex text-[14px] h-[48px]'>
                  <div className=" bg-[#7677F41A] min-w-[64px] p-4">#</div>
                  <div className=" bg-[#7677F41A] min-w-[274px]  p-4 w-full ">Deposit Date</div>
                  <div className=" bg-[#7677F41A]  min-w-[274px] p-4 w-full pl-10 ">Deposit amount (EUR)</div>
                  <div className="bg-[#7677F41A] min-w-[466px]   p-4 w-full pl-20  ">Notes</div>
                  <div className=" bg-[#7677F41A] min-w-[466px]  p-4 w-full  pl-[250px] ">Actions</div>
                
              </div>
              <div>
                {fields.map((field, index) => (
                  <div className='flex items-center w-full' key={field.id}>
                    <div className=" p-4 text-[14px] text-[#333333]">{index + 1}</div>
                    <div className='w-full p-4 pl-10'>
                      <DepositeDate index={index} />
                    </div>
                    <div className="w-full p-4 pl-8   ">
                      <DepositeAmount index={index} />
                    </div>
                    <div className=" p-4 pl-8">
                      <Notes index={index} />
                    </div>
                    <div className="w-full flex ml-[180px]">
                      {index === fields.length - 1 ? (
                        <button
                          type="button"
                          onClick={addRow}
                          className="px-4 py-2 text-[#7677F4] font-semibold rounded text-[14px] flex relative top-3 right-3"
                        >
                          <span className='text-[22px] relative bottom-2'>+ </span>Add
                        </button>
                      ) : null}
                      <Dialog >
                        <DialogTrigger className='flex'>
                          <div className='relative top-[22px]'>
                            <Delete />
                          </div>
                          <div
                            className="px-2 text-[#7677F4] font-semibold rounded text-[14px] relative top-5 "
                          >
                            Delete
                          </div></DialogTrigger>
                        <DialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
                          <DialogHeader>
                            <div className="flex items-center w-full justify-center">
                              <Exclamation />
                            </div>
                            <DialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
                              Are you sure you want to delete this record?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <div className="w-full flex justify-center items-center gap-5">

                              <DialogClose className='text-[#7677F4] border rounded-lg border-[#7677F4] w-[71px] h-[46px] mr-5' >No</DialogClose>
                              <DialogFooter className='bg-blue-500 border rounded-lg text-white px-6 py-2 w-[71px] h-[46px] ' onClick={() => { deleteRow(index); }}>Yes</DialogFooter>

                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    </div>
                ))}
              </div>
          </div>
        )}

        <div className="flex self-end justify-center gap-2 pt-10 pb-7">
          <Button
            className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
            onClick={() => {
              setParamValue('close_participants')
            }}
          >
            Previous
          </Button>
          <Button
            className=" w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
            onClick={() => {
              setParamValue('expense')
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RevenueSection

const DepositeAmount = ({ index }: { index: number }) => {
  const { field: { value, onChange }, fieldState: { error } } = useController({ name: `revenue.${index}.depositeAmount` })

  return (
    <div>
      <Input
        value={value as number}
        onChange={onChange}
        error={error ? true : false}
        placeholder="00.00"
        className="min-w-[250px] rounded-[12px]  text-[14px] placeholder:text-[#333333]"
      />
    </div>
  )
}
const DepositeDate = ({ index }: { index: number }) => {
  const { field: { value ,onChange }, fieldState: { error } } = useController({ name: `revenue.${index}.depositeDate` })
  const [date, setDate] = useState(value || new Date());

  const today = new Date();
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button

            variant={"outline"}
            className={cn(
              "min-w-[250px]  border rounded-[12px] pl-4 pr-5 flex justify-between text-[#333333]",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
            <CalendarIcon className="mr-2 h-5 w-5 relative left-3 text-[#959599]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            value={date}
            onChange={onChange}
            error={error ? true : false}

            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate && newDate <= today) {
                setDate(newDate);
                onChange(newDate)
              }
            }}
            initialFocus
            disabled={[{ after: today }]}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}


const Notes = ({ index }: { index: number }) => {
  const { field: { value, onChange }, fieldState: { error } } = useController({ name: `revenue.${index}.notes` })

  return (
    <div>
      <Input
        value={value as string}
        onChange={onChange}
        error={error ? true : false}
        type="text"
        placeholder="Lorem Epsim..."
        className="min-w-[457px]  w-full relative left-[20px] rounded-[12px]  text-[14px] placeholder:text-[#333333] "
      />

    </div>
  )
}


