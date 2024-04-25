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
import React, { useEffect, useRef, useState } from "react";
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
  PAYMENT_METHOD,
  TRANSACTION_TYPE,
} from "src/constants/OptionLabels";
import ClearAllIcon from "@public/assets/ClearAllIcon";
import { MultiSelect } from "src/ui/multi-select";
import { ParticipantStore } from "src/zustandStore/ParticipantStore";

export function ParticipantsAdvanceFilter() {
  const {
    setParticpantFiltersData,
    advanceFilterCount,
    setAdvanceFilterCount,
  } = ParticipantStore();
  const { watch, setValue, getValues } = useFormContext();
  const formData = watch();
  const [openAdvFilter, setOpenAdvFilter] = useState(false);
  const [count, setCount] = useState(0);

  const filterCount = () => {
    const { advanceFilter } = getValues();
    let res = 0;
    if (
      advanceFilter?.full_name?.length ||
      advanceFilter?.email?.length ||
      advanceFilter?.mobile?.length
    )
      res += 1;
    // if (advanceFilter?.email?.length) res += 1;
    // if (advanceFilter?.mobile?.length) res += 1;
    if (advanceFilter?.transaction_type?.length) res += 1;
    if (advanceFilter?.payment_method?.length) res += 1;
    if (advanceFilter?.fee_level?.length) res += 1;
    if (advanceFilter?.attendance_status?.length) res += 1;
    if (
      advanceFilter?.health_consent_status?.completed ||
      advanceFilter?.health_consent_status?.pending
    )
      res += 1;
    // if (advanceFilter?.health_consent_status?.pending) res += 1;
    if (
      advanceFilter?.program_agreement_status?.completed ||
      advanceFilter?.program_agreement_status?.pending
    )
      res += 1;
    // if (advanceFilter?.program_agreement_status?.pending) res += 1;

    setAdvanceFilterCount(res);

    return res;
  };

  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        setOpenAdvFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sheetRef]);

  return (
    <Sheet open={openAdvFilter}>
      <SheetTrigger
        onClick={() => {
          setOpenAdvFilter(true);
        }}
      >
        <Button
          variant="outline"
          className="flex gap-4 px-10 pl-5"
          onClick={() => {
            const advanceFilterValues = { ...formData };

            setValue("tempFilters", advanceFilterValues.advanceFilter);
          }}
        >
          {" "}
          <FilterIcon />
          All Filters
          {advanceFilterCount > 0 && (
            <CountComponent count={advanceFilterCount} />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[446px] rounded-l-xl" ref={sheetRef}>
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
                    {getContactCount()}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ContactDetails />
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
                <AccordionTrigger>
                  <div className="flex gap-3 items-center">
                    <div>Attendance Status</div>
                    {formData?.tempFilters?.attendance_status?.length > 0 && (
                      <CountComponent
                        count={formData?.tempFilters?.attendance_status?.length}
                      />
                    )}
                  </div>
                </AccordionTrigger>
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
                        formData?.tempFilters?.health_consent_status || {}
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
                        formData?.tempFilters?.program_agreement_status || {}
                      ).filter((value) => value === true).length > 0 && (
                        <CountComponent
                          count={
                            Object.values(
                              formData?.tempFilters?.program_agreement_status ||
                                {}
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
                    setValue("tempFilters.transaction_type", "");
                    setValue("tempFilters.payment_method", []);
                    setValue("tempFilters.fee_level", []);
                    setValue("tempFilters.attendance_status", "");
                    setValue("tempFilters.health_consent_status", {
                      completed: false,
                      pending: false,
                    });
                    setValue("tempFilters.program_agreement_status", {
                      completed: false,
                      pending: false,
                    });
                    setValue("advanceFilter", {});
                  }}
                  className="flex gap-1 items-center cursor-pointer"
                >
                  <ClearAllIcon />
                  <p className="text-primary font-semibold"> Clear All</p>
                </div>
                <Button
                  className=" font-bold"
                  onClick={() => {
                    const tempFilterData = getValues();

                    setValue("advanceFilter", tempFilterData?.tempFilters);
                    setParticpantFiltersData(getValues());
                    setOpenAdvFilter(false);
                    setCount(filterCount);
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

  const emailRegex: RegExp =
    /^[^\s]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleNameChange = (event: any) => {
    const { value } = event.target;
    const updatedName = value.replace(/[^\w\s]|[\d_]/gi, ""); //Regex to allow only alphabets

    if (updatedName.length <= 50) {
      onNameChange({ target: { value: updatedName } });
    }
  };

  const handlePhoneChange = (event: any) => {
    const { value } = event.target;
    const updatedPhone = value.replace(/\D/g, ""); // Regex to allow only numeric characters

    onPhoneChange({ target: { value: updatedPhone } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          onChange={handleNameChange}
          value={contactName}
          type="text"
          maxLength={50}
        ></Input>
        {contactName?.length >= 50 && (
          <div className=" text-red-600">
            Reached maximum character limit: 50
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          onChange={onEmailChange}
          value={contactEmail}
          type="email"
        ></Input>
        {contactEmail?.length >= 1 &&
          (emailRegex.test(contactEmail) ? (
            ""
          ) : (
            <div className="text-red-600">
              Enter valid email id and Enter only one email at a time
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Phone</Label>
        <Input
          onChange={handlePhoneChange}
          value={contactPhone}
          type="tel"
        ></Input>
      </div>
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
        placeholder="Select Payment Method"
        data={paymentMethodValues}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={onSelectChange}
        searchBar={false}
      />
    </div>
  );
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
        searchBar={false}
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

const getContactCount = () => {
  let count = 0;
  const { getValues } = useFormContext();
  const formData = getValues();

  if (formData?.tempFilters?.full_name?.length > 0) count += 1;
  if (formData?.tempFilters?.email?.length > 0) count += 1;
  if (formData?.tempFilters?.mobile?.length > 0) count += 1;

  if (count > 0) {
    return <CountComponent count={count} />;
  }
};
