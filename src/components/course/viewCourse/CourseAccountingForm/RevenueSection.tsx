import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { MainHeader } from "src/ui/TextTags";
import { CourseInformationAccordion } from "./CourseInformationAccordion";
import { QuestionInstructionModal } from "./CourseQuestionAndInstruction";
import { useState } from "react";
import { useFieldArray, useController, useFormContext } from "react-hook-form";
import React from "react";
import Delete from "@public/assets/Delete";
import Exclamation from "@public/assets/Exclamation";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "src/ui/dialog";
import { Button } from "src/ui/button";
import { useValidateCurrentStepFields } from "src/utility/ValidationSteps";
import { DateField } from "src/ui/DateField";
import { Input } from "src/ui/input";
import { Bounce, ToastContainer, toast } from "react-toastify";

function RevenueSection() {
  const searchParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();
  const { replace, back } = useRouter();
  const { getValues } = useFormContext();
  function setParamValue(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("current_section", term);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const { fields, append, remove } = useFieldArray({
    name: "revenue",
  });

  const [isAddButtonDisabled, setAddButtonDisabled] = useState(false);

  const addInitialRow = () => {
    append({ deposit_date: new Date() });
    setAddButtonDisabled(true);
  };

  /**
   * This function is used to add the row to the table
   */
  const addRow = () => {
    append({ deposit_date: new Date() });
  };

  /**
   * 
   * @param index The function is used to delete the row in the table of particular index
   */
  const deleteRow = (index: number) => {
    //Need to remove the this row when we delete the particular row
    remove(index);
    if (fields.length === 1) {
      setAddButtonDisabled(false);
    }

    //we need to display alert for 3 sec after deleting the row
    toast("Record deleted successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();

  const handleClickNext = async (currentStepFormNames: any[]) => {
    let isAllFieldsFilled = await ValidateCurrentStepFields(
      currentStepFormNames
    );

    if (isAllFieldsFilled) {
      setParamValue("expense");
    }
  };

  return (
    <div className="bg-[white]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />{" "}
      <div className="m-8 text-[#333333] flex flex-col gap-6 text-[23px] font-semibold">
        <div className="flex flex-row justify-between">
          <p>Revenue</p>
          <div className="text-[#7677F4] text-[16px] flex flex-row ">
            <QuestionInstructionModal />
          </div>
        </div>
        <div>
          <CourseInformationAccordion />
        </div>

        <div className="flex">
          <MainHeader
            className="text-[18px]"
            children="Deposit of Offline Revenue"
          />
          <button
            onClick={addInitialRow}
            disabled={isAddButtonDisabled || fields?.length > 0}
            className={`text-[15px] relative bottom-[3px] pl-2 ${
              isAddButtonDisabled || fields?.length > 0
                ? "text-[#AFB0FF]"
                : "text-[#7677F4]"
            }`}
          >
            <span className="text-[22px] relative top-[1px]">+</span>Add
          </button>
        </div>
        {fields.length > 0 && (
          <div className="rounded-[12px] overflow-x-scroll w-full border border-[#D6D7D8]">
            <div className="flex text-[14px] bg-[#7677F41A] min-w-fit h-[48px]">
              <div className="min-w-[62px] p-4">#</div>
              <div className="min-w-[274px] w-full p-4">Deposit Date</div>
              <div className="min-w-[274px] w-full p-4 ">
                Deposit amount (EUR)
              </div>
              <div className="min-w-[466px] w-full p-4">Notes</div>
              <div className="min-w-[226px] w-full p-4">Actions</div>
            </div>
            <div className="my-2">
              {fields.map((field, index) => (
                <div className="flex items-center h-auto w-full" key={field.id}>
                  <div className="min-w-[62px] text-[14px] p-4 text-[#333333]">
                    {index + 1}
                  </div>
                  <div className="w-full min-w-[274px] p-4">
                    <DepositeDate index={index} />
                  </div>
                  <div className="w-full min-w-[274px] p-4">
                    <DepositeAmount index={index} />
                  </div>
                  <div className="w-full min-w-[466px] p-4">
                    <Notes index={index} />
                  </div>
                  <div className="w-full min-w-[226px] flex gap-4 p-4">
                    {index === fields.length - 1 && (
                      <div
                        onClick={addRow}
                        className="text-[#7677F4] font-semibold rounded text-[14px] flex gap-[1px] items-center"
                      >
                        <span className="text-[22px] mb-1">+ </span>
                        Add
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger>
                        <div className="flex gap-[1px] items-center">
                          <Delete />
                          <div className="text-[#7677F4] font-semibold rounded text-[14px]">
                            Delete
                          </div>
                        </div>
                      </DialogTrigger>
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
                            <DialogClose className="text-[#7677F4] border rounded-lg border-[#7677F4] w-[71px] h-[46px] mr-5">
                              No
                            </DialogClose>
                            <DialogFooter
                              className="bg-blue-500 border rounded-lg text-white px-6 py-2 w-[71px] h-[46px] "
                              onClick={() => {
                                deleteRow(index);
                              }}
                            >
                              Yes
                            </DialogFooter>
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

        <div className="flex flex-row gap-2 justify-center">
          <Button
            className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
            onClick={() => {
              setParamValue("close_participants");
            }}
            type="button"
          >
            Previous
          </Button>
          <Button
            className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              await handleClickNext(Object.values({ revenue: "revenue" }));
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RevenueSection;

const DepositeAmount = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: `revenue[${index}].deposit_amount` });

  return (
    <div className="flex flex-col gap-1 h-[40px]">
      <Input
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        placeholder="Enter amount"
        error={error ? true : false}
        className="min-w-[250px] w-full rounded-[12px] text-[14px] placeholder:text-[#999999]"
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
    </div>
  );
};
const DepositeDate = ({ index }: { index: number }) => {
  const today = new Date();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: `revenue[${index}].deposit_date` });

  return (
    <div className="flex flex-col gap-1 h-[40px]">
      <DateField
        value={value as Date}
        onChange={(date: any) => {
          onChange(date);
        }}
        placeholder="Select Date"
        className="!w-[250px]"
        disableDate={today}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
    </div>
  );
};

const Notes = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: `revenue[${index}].notes` });

  return (
    <div className="flex flex-col gap-1 h-[40px]">
      <Input
        value={value as string}
        onChange={onChange}
        error={error ? true : false}
        type="text"
        placeholder="Enter Notes here..."
        className="min-w-[457px] rounded-[12px] text-[14px] placeholder:text-[#999999]"
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
    </div>
  );
};
