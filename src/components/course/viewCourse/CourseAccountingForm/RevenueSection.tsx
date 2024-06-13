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
    control,
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
            className="text-[15px] relative bottom-[3px] pl-2 text-[#7677F4]"
          >
            <span className='text-[22px] relative top-[1px]'>+</span>Add
          </button>
        </div>
        {fields.length > 0 && (
          <div onSubmit={handleSubmit(onSubmit)} className='rounded-[12px]  border border-[#D6D7D8]'>
            <div className="w-full">
              <div>
                <div className='bg-[#7677F41A] border-b text-[18px] grid grid-cols-10'>
                  <div className="col-span-1 p-4">#</div>
                  <div className="col-span-2 relative right-[90px] p-4">Deposit Date</div>
                  <div className="col-span-4 relative right-[130px] p-4">Deposit amount (EUR)</div>
                  <div className="col-span-2 relative right-[380px] p-4">Notes</div>
                  <div className="relative right-[100px] p-4">Actions</div>
                </div>
              </div>
              <div>
                {fields.map((field, index) => (
                  <div className='grid grid-cols-5 ' key={field.id}>
                    <div className=" p-4 text-[20px]">{index + 1}</div>
                    <div className=" p-2 relative right-[260px] text-[14px] text-[#959599]">
                      <Controller
                        control={control}
                        name={`deposits.${index}.depositDate`}
                        render={({ field }) => (
                          <input
                            type="date"
                            {...field}
                            className="w-[85%] h-[44px] border rounded-[12px] pl-4 pr-5"
                          />
                        )}
                      />

                    </div>
                    <div className=" p-2">
                      <Input
                        placeholder="00.00"
                        // {...register(`deposits.${index}.depositAmount`, { required: true })}
                        className="w-[110%] h-[44px] rounded-[12px] relative right-[290px] text-[14px]"
                      />
                    </div>
                    <div className=" p-2">
                      <Input
                        type="text"
                        placeholder="Lorem Epsim..."
                        // {...register(`deposits.${index}.notes`)}
                        className="w-[190%] h-[44px] rounded-[12px] relative right-[210px] text-[14px]"
                      />
                    </div>
                    <div className=" p-2 flex pl-[100px]">
                      {index === fields.length - 1 ? (
                        <button
                          type="button"
                          onClick={addRow}
                          className="px-4 py-2 text-[#7677F4] font-semibold rounded text-[14px] relative top-[2px]"
                        >
                          <span className='text-[22px] relative top-[1px]'>+ </span>Add
                        </button>
                      ) : null}
                      {/* <AlertDialog >
                        <AlertDialogTrigger className='flex'>
                          <div className='relative top-[22px] left-3'>
                            <Delete />
                          </div>
                          <div
                            className="px-4 py-2 text-[#7677F4] font-semibold rounded text-[14px] relative top-[12px] left-1"
                          >
                            Delete
                          </div></AlertDialogTrigger>
                        <AlertDialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
                          <AlertDialogHeader>
                            <div className="flex items-center w-full justify-center">
                              <Exclamation />
                            </div>
                            <AlertDialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
                              Are you sure you want to approve this Accounting Form
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <div className="w-full flex justify-center items-center gap-5">
                              <div>
                                <AlertDialogCancel className='text-[#7677F4] border border-[#7677F4] w-[71px] h-[46px] mr-5' >No</AlertDialogCancel>
                                <AlertDialogAction className='bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px] ml-5' onClick={() => { deleteRow(index); }}>Yes</AlertDialogAction>
                              </div>
                            </div>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                      <Dialog >
                        <DialogTrigger className='flex'>
                          <div className='relative top-[22px] left-3'>
                            <Delete />
                          </div>
                          <div
                            className="px-4 py-2 text-[#7677F4] font-semibold rounded text-[14px] relative top-[12px] left-1"
                          >
                            Delete
                          </div></DialogTrigger>
                        <DialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
                          <DialogHeader>
                            <div className="flex items-center w-full justify-center">
                              <Exclamation />
                            </div>
                            <DialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
                              Are you sure you want to approve this Accounting Form
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
