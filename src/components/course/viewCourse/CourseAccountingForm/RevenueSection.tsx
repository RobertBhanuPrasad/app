import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { MainHeader } from 'src/ui/TextTags'
import { Button } from 'src/ui/button'
import { CourseInformationAccordion } from './CourseInformationAccordion'
import { QuestionInstructionModal } from './CourseQuestionAndInstruction'
import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/ui/alert-dialog"


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



  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      deposits: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'deposits',
  });

  const [isAddButtonDisabled, setAddButtonDisabled] = useState(false);

  const addInitialRow = () => {
    const systemDate = new Date();
    const formattedDate = format(systemDate, 'yyyy-MM-dd'); // Format as per your requirement

    append({
      depositDate: formattedDate,
      depositAmount: '',
      notes: '',
    });
    setAddButtonDisabled(true);
  };

  const addRow = () => {
    append({
      depositDate: '',
      depositAmount: '',
      notes: '',
    });
  };

  const deleteRow = (index: number) => {
    remove(index);
    if (fields.length === 1) {
      setAddButtonDisabled(false);
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };
  

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
          <MainHeader className="text-xl" children="Deposit of Offline Revenue" />
          <button
            onClick={addInitialRow}
            disabled={isAddButtonDisabled}
            className={`text-[15px] relative bottom-[3px] pl-2 ${
              isAddButtonDisabled ? 'text-[#f90707]' : 'text-[#7677F4]'
            }`}
          >
            <span className='text-[22px] relative top-[1px]'>+</span>Add
          </button>
        </div>
        {fields.length > 0 && (
          <div onSubmit={handleSubmit(onSubmit)} className='rounded-[12px]  border border-[#D6D7D8] min-w-fit'>
            <div className="w-full">
              <div>
                <div className='bg-[#7677F41A] border-b text-[18px] flex w-full'>
                  <div className="min-w-[64px]  p-4 ">#</div>
                  <div className=" min-w-[274px] pt-4 pl-4 2xl:pl-[25px] ">Deposit Date</div>
                  <div className=" min-w-[274px] p-4 pl-12 2xl:pl-[65px]">Deposit amount (EUR)</div>
                  <div className="min-w-[466px] pl-[82px] p-4 2xl:pl-[150px]">Notes</div>
                  <div className="min-w-[466px] p-4 pl-[165px] 2xl:pl-[235px]">Actions</div>
                </div>
              </div>
              <div>
                {fields.map((field, index) => (
                  <div className='grid grid-cols-12 min-w-fit  ' key={field.id}>
                    <div className=" p-4 text-[20px] min-w-[64px]">{index + 1}</div>
                    <div className=" p-2 text-[14px] text-[#959599] relative right-14  ">
                      <Controller
                        name={`deposits.${index}.depositDate`}
                        render={({ field }) => (
                          <input
                            type="date"
                            {...field}
                            className="min-w-[250px] h-[44px] border rounded-[12px] pl-4 pr-5"
                          />
                        )}
                      />

                    </div>
                    <div className="p-2 col-span-3 pl-[130px]">
                      <Input
                        placeholder="00.00"
                        className="min-w-[250px]  h-[44px] rounded-[12px]  text-[14px]"
                      />
                    </div>
                    <div className="col-span-4 flex justify-end pl-[80px] p-2">
                      <Input
                        type="text"
                        placeholder="Lorem Epsim..."
                        className="min-w-[457px]  h-[44px] rounded-[12px]  text-[14px]  p-2"
                      />
                    </div>
                    <div className=" p-2 flex justify-between min-w-[177px] pl-20 ">
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
            className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
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
