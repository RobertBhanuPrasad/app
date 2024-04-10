import { Button } from "src/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "src/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/ui/accordion";
import { Label } from "src/ui/label";
import { Input } from "src/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import CalenderIcon from "@public/assets/CalenderIcon";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import React, { useState } from "react";
import { format } from "date-fns";
import { Checkbox } from "src/ui/checkbox";
import { Separator } from "src/ui/separator";
import FilterIcon from "@public/assets/FilterIcon";
import CrossIcon from "@public/assets/CrossIcon";
import { useController, useFormContext } from "react-hook-form";
import { CountComponent } from "pages/Courses/FindCourse";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import {
  FEE_LEVEL,
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
  PAYMENT_METHOD,
  TRANSACTION_TYPE,
} from "src/constants/OptionLabels";
import ClearAllIcon from "@public/assets/ClearAllIcon";
import { MultiSelect } from "src/ui/multi-select";

export function ParticipantsAdvanceFilter() {
  const { watch, setValue } = useFormContext();
  const formData = watch();
  const [openAdvFilter, setOpenAdvFilter] = useState(false);
  const count =
    (formData?.advanceFilter &&
      Object.keys(formData?.advanceFilter).filter(
        (key) =>
          formData.advanceFilter[key] !== undefined &&
          formData.advanceFilter[key] !== "" &&
          formData.advanceFilter[key].length > 0
      ).length) ||
    0;

  return (
    <Sheet open={openAdvFilter}>
      <SheetTrigger
        onClick={() => {
          setOpenAdvFilter(true);
        }}
      >
        <Button variant="outline" className="flex gap-4 px-10 pl-5">
          {" "}
          <FilterIcon />
          All Filters
          {count > 0 && <CountComponent count={count} />}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[446px] rounded-l-xl">
        <div className="flex flex-col gap-4">
          <div className="max-h-[90vh] overflow-y-auto scrollbar pr-4">
            <SheetHeader className="p-3 text-2xl font-semibold flex flex-row">
              <div className="flex justify-between items-center flex-grow">
                <div className="text-2xl font-semibold">Filter By</div>
                <div
                  onClick={() => {
                    setOpenAdvFilter(false);
                  }}
                  className="cursor-pointer"
                >
                  <CrossIcon width={16} height={16} />
                </div>
              </div>
            </SheetHeader>
            <Separator />
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-row gap-3 items-center">
                    <div>Contact Details</div>
                    {(formData?.tempFilters?.full_name?.length > 0 ||
                      formData?.tempFilters?.email?.length > 0 ||
                      formData?.tempFilters?.mobile?.length > 0) && (
                      <CountComponent count={1} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ContactDetails />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-2">
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex flex-row gap-3 items-center">
                    <div>Registration Date</div>
                    {formData?.tempFilters?.registration_date_range && (
                      <CountComponent count={1} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <RegistrationDate />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-3">
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Transaction Status</div>
                    {formData?.tempFilters?.transaction_status?.length > 0 && (
                      <CountComponent
                        count={
                          formData?.tempFilters?.transaction_status?.length
                        }
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <TransactionStatus />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-4">
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Transaction Type</div>
                    {formData?.tempFilters?.transaction_type?.length > 0 && (
                      <CountComponent
                        count={formData?.tempFilters?.transaction_type?.length}
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <TransactionType />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-5">
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Payment Method</div>
                    {formData?.tempFilters?.payment_method?.length > 0 && (
                      <CountComponent
                        count={formData?.tempFilters?.payment_method?.length}
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <PaymentMethod />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-6">
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Fee Level</div>
                    {formData?.tempFilters?.fee_level?.length > 0 && (
                      <CountComponent
                        count={formData?.tempFilters?.fee_level?.length}
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <FeeLevel />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible defaultValue="item-7">
              <AccordionItem value="item-7">
                <AccordionTrigger>Attendance Status</AccordionTrigger>
                <AccordionContent>
                  <AttendanceStatus />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-8">
              <AccordionItem value="item-8">
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Health Consent Status</div>
                    {formData?.tempFilters &&
                      Object.values(
                        formData?.tempFilters?.health_consent_status
                      ).filter((value) => value === true)?.length > 0 && (
                        <CountComponent
                          count={
                            Object.values(
                              formData?.tempFilters?.health_consent_status
                            ).filter((value) => value === true)?.length
                          }
                        />
                      )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <HealthConsentStatus />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible defaultValue="item-9">
              <AccordionItem value="item-9">
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Program Agreement Status</div>
                    {formData?.tempFilters &&
                      Object.values(
                        formData?.tempFilters?.program_agreement_status
                      ).filter((value) => value === true).length > 0 && (
                        <CountComponent
                          count={
                            Object.values(
                              formData?.tempFilters?.program_agreement_status
                            ).filter((value) => value === true).length
                          }
                        />
                      )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ProgramAgreementStatus />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <SheetFooter>
              <div className="flex justify-end w-full gap-4">
                <div
                  onClick={() => {
                    setValue("tempFilters.full_name", "");
                    setValue("tempFilters.email", "");
                    setValue("tempFilters.mobile", "");
                    setValue("tempFilters.registration_date_range", "");
                    setValue("tempFilters.transaction_status", "");
                    setValue("tempFilters.transaction_type", "");
                    setValue("tempFilters.payment_method", "");
                    setValue("tempFilters.fee_level", "");
                    setValue("tempFilters.attendance_status", "");
                    setValue("tempFilters.health_consent_status", {
                      completed: false,
                      pending: false,
                    });
                    setValue("tempFilters.program_agreement_status", {
                      completed: false,
                      pending: false,
                    });
                  }}
                  className="flex gap-1 items-center cursor-pointer"
                >
                  <ClearAllIcon />
                  <p className="text-primary font-semibold"> Clear All</p>
                </div>
                <Button
                  className=" font-bold"
                  onClick={() => {
                    const tempFilterData = { ...formData };

                    setValue("advanceFilter", tempFilterData?.tempFilters);
                    setValue(
                      "registration_date",
                      tempFilterData?.tempFilters?.registration_date_range
                    );
                    setOpenAdvFilter(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const ContactDetails = () => {
  const {
    field: { value: contactName, onChange: onNameChange },
  } = useController({
    name: "tempFilters.full_name",
  });

  const {
    field: { value: contactEmail, onChange: onEmailChange },
  } = useController({
    name: "tempFilters.email",
  });

  const {
    field: { value: contactPhone, onChange: onPhoneChange },
  } = useController({
    name: "tempFilters.mobile",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input onChange={onNameChange} value={contactName}></Input>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input onChange={onEmailChange} value={contactEmail}></Input>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Phone</Label>
        <Input onChange={onPhoneChange} value={contactPhone}></Input>
      </div>
    </div>
  );
};

export const RegistrationDate = () => {
  const [open, setOpen] = useState(false);
  const {
    field: { value: RegistrationDate, onChange: RegistrationDateChange },
  } = useController({
    name: "tempFilters.registration_date_range",
  });

  const { watch, setValue } = useFormContext();
  const formData = watch();

  console.log(formData, "sa");

  return (
    <div className="flex flex-col gap-2">
      <div>Date Range</div>{" "}
      <Dialog open={open}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            className="w-full h-[40px] flex flex-row items-center justify-start gap-3"
            variant="outline"
          >
            <div>
              <CalenderIcon color="#666666" />
            </div>
            <div>
              {RegistrationDate?.from ? (
                RegistrationDate.to ? (
                  <>
                    {format(RegistrationDate.from, "MM/dd/yyyy")} -{" "}
                    {format(RegistrationDate.to, "MM/dd/yyyy")}
                  </>
                ) : (
                  format(RegistrationDate.from, "MM/dd/yyyy")
                )
              ) : (
                <span className="font-normal">Select Registration Date</span>
              )}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
          <DateRangePickerComponent
            setOpen={setOpen}
            value={RegistrationDate}
            onSelect={RegistrationDateChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const TransactionStatus = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const {
    field: { value: statusValues = [], onChange: onStatusChange },
  } = useController({
    name: "tempFilters.transaction_status",
  });

  const transactionStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

  const toggleTransactionStatus = (id: number) => {
    const selectedValues = statusValues?.includes(id)
      ? statusValues?.filter((val: number) => val !== id)
      : [...statusValues, id];

    onStatusChange(selectedValues);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {transactionStatusOptions?.map((status: any, index: number) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              statusValues?.includes(status?.id)
                ? "bg-primary text-white"
                : "bg-white border border-[#D6D7D8]"
            }`}
            variant="outline"
            onClick={() => toggleTransactionStatus(status?.id)}
          >
            {status?.value}
          </Button>
        </div>
      ))}
    </div>
  );
};

export const TransactionType = () => {
  const {
    field: { value: transactionTypes = [], onChange: onStatusChange },
  } = useController({
    name: "tempFilters.transaction_type",
  });

  const transactionTypeOptions =
    getOptionValuesByOptionLabel(TRANSACTION_TYPE)?.[0]?.option_values;

  const toggleTransactionStatus = (id: number) => {
    const selectedValues = transactionTypes?.includes(id)
      ? transactionTypes?.filter((val: number) => val !== id)
      : [...transactionTypes, id];

    onStatusChange(selectedValues);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {transactionTypeOptions?.map((status: any, index: number) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              transactionTypes?.includes(status?.id)
                ? "bg-primary text-white"
                : "bg-white border border-[#D6D7D8]"
            }`}
            variant="outline"
            onClick={() => toggleTransactionStatus(status?.id)}
          >
            {status?.value}
          </Button>
        </div>
      ))}
    </div>
  );
};

export const PaymentMethod = () => {
  const {
    field: { value: paymentMethods, onChange: onSelectChange },
  } = useController({
    name: "tempFilters.payment_method",
  });

  const paymentMethodOptions =
    getOptionValuesByOptionLabel(PAYMENT_METHOD)?.[0]?.option_values;

  const paymentMethodValues = paymentMethodOptions.map((record: any) => {
    return {
      label: record?.value,
      value: record?.id,
    };
  });

  return (
    <div>
      <MultiSelect
        value={paymentMethods}
        placeholder="Select Program Organiser"
        data={paymentMethodValues}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={onSelectChange}
      />
    </div>
  );

  // paymentMethodOptions.map()
};

export const FeeLevel = () => {
  const {
    field: { value: feeLevels, onChange: onSelectChange },
  } = useController({
    name: "tempFilters.fee_level",
  });

  const feeLevelOptions =
    getOptionValuesByOptionLabel(FEE_LEVEL)?.[0]?.option_values;

  const feeLevelValues = feeLevelOptions.map((record: any) => {
    return {
      label: record?.value,
      value: record?.id,
    };
  });

  return (
    <div>
      <MultiSelect
        value={feeLevels}
        placeholder="Select Fee Level"
        data={feeLevelValues}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={onSelectChange}
      />
    </div>
  );
};

export const AttendanceStatus = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const {
    field: { value: attendanceValues = [], onChange: onStatusChange },
  } = useController({
    name: "tempFilters.attendance_status",
  });

  const attendanceStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  const toggleTransactionStatus = (id: number) => {
    const selectedValues = attendanceValues?.includes(id)
      ? attendanceValues?.filter((val: number) => val !== id)
      : [...attendanceValues, id];

    onStatusChange(selectedValues);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {attendanceStatusOptions?.map((status: any, index: number) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              attendanceValues?.includes(status?.id)
                ? "bg-primary text-white"
                : "bg-white border border-[#D6D7D8]"
            }`}
            variant="outline"
            onClick={() => toggleTransactionStatus(status?.id)}
          >
            {status?.value}
          </Button>
        </div>
      ))}
    </div>
  );
};

export const HealthConsentStatus = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const {
    field: { value: healthDeclarationStatus = {}, onChange: onStatusChange },
  } = useController({
    name: "tempFilters.health_consent_status",
    defaultValue: { completed: false, pending: false },
  });

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <div
        className="flex items-center space-x-2
                      border-2 p-2 rounded-lg"
      >
        <Checkbox
          id="1"
          checked={formData?.tempFilters?.health_consent_status?.completed}
          onClick={() => {
            healthDeclarationStatus?.completed
              ? (healthDeclarationStatus.completed = false)
              : (healthDeclarationStatus.completed = true);
            onStatusChange(healthDeclarationStatus);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {"Completed"}
        </label>
      </div>
      <div
        className="flex items-center space-x-2
                      border-2 p-2 rounded-lg"
      >
        <Checkbox
          id="2"
          checked={formData?.tempFilters?.health_consent_status?.pending}
          onClick={() => {
            healthDeclarationStatus?.pending
              ? (healthDeclarationStatus.pending = false)
              : (healthDeclarationStatus.pending = true);
            onStatusChange(healthDeclarationStatus);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {"Pending"}
        </label>
      </div>
    </div>
  );
};

export const ProgramAgreementStatus = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const {
    field: { value: programAgreementStatus = {}, onChange: onStatusChange },
  } = useController({
    name: "tempFilters.program_agreement_status",
    defaultValue: { completed: false, pending: false },
  });

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <div
        className="flex items-center space-x-2
                      border-2 p-2 rounded-lg"
      >
        <Checkbox
          id="1"
          checked={formData?.tempFilters?.program_agreement_status?.completed}
          onClick={() => {
            programAgreementStatus?.completed
              ? (programAgreementStatus.completed = false)
              : (programAgreementStatus.completed = true);
            onStatusChange(programAgreementStatus);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {"Completed"}
        </label>
      </div>
      <div
        className="flex items-center space-x-2
                      border-2 p-2 rounded-lg"
      >
        <Checkbox
          id="2"
          checked={formData?.tempFilters?.program_agreement_status?.pending}
          onClick={() => {
            programAgreementStatus?.pending
              ? (programAgreementStatus.pending = false)
              : (programAgreementStatus.pending = true);
            onStatusChange(programAgreementStatus);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {"Pending"}
        </label>
      </div>
    </div>
  );
};

const DateRangePickerComponent = ({ setOpen, value, onSelect }: any) => {
  return (
    <div className="relative">
      <DateRangePicker
        mode="range"
        defaultMonth={value?.from}
        selected={value}
        onSelect={onSelect}
        numberOfMonths={2}
        captionLayout="dropdown-buttons"
        fromYear={2000}
        toYear={2025}
      />
      <div className="flex flex-row gap-4 justify-center items-center fixed p-2 rounded-b-3xl bottom-0 left-0 w-full shadow-[rgba(0,_0,_0,_0.24)_0px_2px_8px]">
        <Button
          onClick={() => onSelect({})}
          className="border rounded-xl border-[#7677F4] bg-[white] w-[94px] h-10 text-[#7677F4] font-semibold"
        >
          Reset
        </Button>
        <Button
          onClick={() => setOpen(false)}
          className=" w-[94px] h-10 rounded-xl"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
