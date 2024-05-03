import Form from "@components/Formfield";
import { BaseTable } from "@components/course/findCourse/BaseTable";
import { ParticipantsAdvanceFilter } from "@components/participants/ParticipantsListAdvanceFilters";
import { ParticipantsListMainHeader } from "@components/participants/ParticipantsListMainHeader";
import { columns } from "@components/participants/columns";
import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import CrossIcon from "@public/assets/CrossIcon";
import DropDown from "@public/assets/DropDown";
import Tick from "@public/assets/Tick";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { CrudFilters, useTable } from "@refinedev/core";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { CountComponent } from "pages/courses/list";
import React, { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
} from "src/constants/OptionLabels";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { AlertDialog, AlertDialogContent } from "src/ui/alert-dialog";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { Input } from "src/ui/input";
import { MultiSelect } from "src/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import { supabaseClient } from "src/utility/supabaseClient";
import { ParticipantStore } from "src/zustandStore/ParticipantStore";

function index() {
  const router = useRouter();
  const programID: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const {
    ParticpantFiltersData,
    setSelectedTableRows,
    setSelectedRowObjects,
    selectedTableRows,
    selectedRowObjects,
  } = ParticipantStore();
  const filters: {
    /**
     * Initial filter state
     */
    initial?: CrudFilters;
    /**
     * Default and unchangeable filter state
     *  @default `[]`
     */
    permanent: CrudFilters;
    /**
     * Default behavior of the `setFilters` function
     * @default `"merge"`
     */
    /**
     * Whether to use server side filter or not.
     * @default "server"
     */
    mode?: "server" | "off";
  } = {
    permanent: [{ field: "program_id", operator: "eq", value: programID }],
  };

  if (ParticpantFiltersData?.participant_code) {
    filters.permanent.push({
      field: "participant_code",
      operator: "contains",
      value: ParticpantFiltersData?.participant_code,
    });
  }

  if (
    ParticpantFiltersData?.registration_date &&
    ParticpantFiltersData?.registration_date?.from != "" &&
    ParticpantFiltersData?.registration_date?.to != ""
  ) {
    filters.permanent.push(
      {
        field: "created_at",
        operator: "gte",
        value:
          new Date(
            ParticpantFiltersData?.registration_date.from?.setHours(0, 0, 0, 0)
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      },
      {
        field: "created_at",
        operator: "lte",
        value:
          new Date(
            ParticpantFiltersData?.registration_date.to?.setHours(23, 59, 0, 0)
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      }
    );
  }

  if (ParticpantFiltersData?.transaction_status?.length) {
    filters.permanent.push({
      field: "payment_status_id",
      operator: "in",
      value: ParticpantFiltersData?.transaction_status,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.full_name?.length) {
    filters.permanent.push({
      field: "contact_id.full_name",
      operator: "contains",
      value: ParticpantFiltersData?.advanceFilter?.full_name,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.email?.length) {
    filters.permanent.push({
      field: "contact_id.email",
      operator: "contains",
      value: ParticpantFiltersData?.advanceFilter?.email,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.mobile?.length) {
    filters.permanent.push({
      field: "contact_id.mobile",
      operator: "contains",
      value: ParticpantFiltersData?.advanceFilter?.mobile,
    });
  }

  if (
    ParticpantFiltersData?.advanceFilter?.registration_date_range &&
    ParticpantFiltersData?.advanceFilter?.registration_date_range?.from != "" &&
    ParticpantFiltersData?.advanceFilter?.registration_date_range?.to != ""
  ) {
    filters.permanent.push(
      {
        field: "created_at",
        operator: "gte",
        value:
          new Date(
            ParticpantFiltersData?.advanceFilter?.registration_date_range?.from?.setHours(
              0,
              0,
              0,
              0
            )
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      },
      {
        field: "created_at",
        operator: "lte",
        value:
          new Date(
            ParticpantFiltersData?.advanceFilter?.registration_date_range?.to?.setHours(
              23,
              59,
              0,
              0
            )
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      }
    );
  }

  if (ParticpantFiltersData?.advanceFilter?.transaction_status?.length) {
    filters.permanent.push({
      field: "payment_status_id",
      operator: "in",
      value: ParticpantFiltersData?.advanceFilter?.transaction_status,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.transaction_type?.length) {
    filters.permanent.push({
      field: "transaction_type",
      operator: "in",
      value: ParticpantFiltersData?.advanceFilter?.transaction_type,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.payment_method?.length) {
    filters.permanent.push({
      field: "payment_method",
      operator: "in",
      value: ParticpantFiltersData?.advanceFilter?.payment_method,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.fee_level?.length) {
    filters.permanent.push({
      field: "price_category_id.fee_level_id",
      operator: "in",
      value: ParticpantFiltersData?.advanceFilter?.fee_level,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.attendance_status?.length) {
    filters.permanent.push({
      field: "participant_attendence_status_id",
      operator: "in",
      value: ParticpantFiltersData?.advanceFilter?.attendance_status,
    });
  }

  if (ParticpantFiltersData?.advanceFilter?.health_consent_status) {
    if (
      ParticpantFiltersData?.advanceFilter?.health_consent_status?.completed ==
        true &&
      ParticpantFiltersData?.advanceFilter?.health_consent_status?.pending ==
        true
    ) {
      filters.permanent.push({
        field: "is_health_declaration_checked",
        operator: "in",
        value: [true, false],
      });
    } else if (
      ParticpantFiltersData?.advanceFilter?.health_consent_status?.completed ==
      true
    ) {
      filters.permanent.push({
        field: "is_health_declaration_checked",
        operator: "eq",
        value: true,
      });
    } else if (
      ParticpantFiltersData?.advanceFilter?.health_consent_status?.pending ==
      true
    ) {
      filters.permanent.push({
        field: "is_health_declaration_checked",
        operator: "eq",
        value: false,
      });
    }
  }

  if (ParticpantFiltersData?.advanceFilter?.program_agreement_status) {
    if (
      ParticpantFiltersData?.advanceFilter?.program_agreement_status
        ?.completed == true &&
      ParticpantFiltersData?.advanceFilter?.program_agreement_status?.pending ==
        true
    ) {
      filters.permanent.push({
        field: "is_program_agreement_checked",
        operator: "in",
        value: [true, false],
      });
    } else if (
      ParticpantFiltersData?.advanceFilter?.program_agreement_status
        ?.completed == true
    ) {
      filters.permanent.push({
        field: "is_program_agreement_checked",
        operator: "eq",
        value: true,
      });
    } else if (
      ParticpantFiltersData?.advanceFilter?.program_agreement_status?.pending ==
      true
    ) {
      filters.permanent.push({
        field: "is_program_agreement_checked",
        operator: "eq",
        value: false,
      });
    }
  }

  const {
    tableQueryResult: participantData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
  } = useTable({
    resource: "participant_registration",
    meta: {
      select:
        "*, payment_method(*), transaction_type(*), contact_id!inner(full_name, date_of_birth, nif, email, country_id, mobile, mobile_country_code), price_category_id(fee_level_id(value), total), participant_attendence_status_id(*), payment_status_id(*), participant_payment_history(*, transaction_type_id(*), payment_method_id(*), transaction_status_id(*)))",
    },
    filters: filters,
    sorters: {
      permanent: [
        {
          field: "id",
          order: "asc",
        },
      ],
    },
  });

  const supabase = supabaseClient();

  console.log("Participant table data", participantData);

  const [rowSelection, setRowSelection] = React.useState({});
  const [allSelected, setAllSelected] = useState();
  const [
    displayTransactionStatusBulkActionError,
    setDisplayTransactionStatusBulkActionError,
  ] = useState(false);
  const [bulkActionsErrorMessage, setBulkActionsErrorMessage] = useState("");
  const [bulkActionsErrorTitle, setBulkActionsErrorTitle] = useState("");
  const [bulkActionsSuccessIcon, setbulkActionsSuccessIcon] = useState(false);

  useEffect(() => {
    if (!participantData?.data?.data) return;
    const allRowSelection: any = {};
    participantData?.data?.data?.forEach((row: any) => {
      allRowSelection[row?.id] = allSelected;
    });
    setRowSelection(allRowSelection);
  }, [allSelected, participantData?.data?.data]);

  useEffect(() => {
    const tempCount = Object.values(rowSelection).filter(
      (value) => value === true
    ).length;
    setSelectedTableRows(tempCount);
    setSelectedRowObjects(rowSelection);
    tempCount == 0 && setBulkActionSelectedValue("Bulk Actions");
  }, [rowSelection]);

  const handleSelectAll = (val: any) => {
    setAllSelected(val);
  };

  const rowCount = Object.values(rowSelection).filter(
    (value) => value === true
  ).length;

  const [open, setOpen] = useState(false);
  const [disableBulkOptions, setEnableBulkOptions] = useState(true);
  const [bulkActions, setBulkAction] = useState("");
  const attendanceOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  const paymentStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

  const handleUpdateAttendanceStatus = async (attendance_status_id: number) => {
    const participantIds: number[] = Object.keys(selectedRowObjects)
      .filter((key: any) => selectedRowObjects[key] === true)
      .map(Number);

    const { error } = await supabase
      .from("participant_registration")
      .update({ participant_attendence_status_id: attendance_status_id })
      .in("id", participantIds);

    if (!error) {
      setDisplayTransactionStatusBulkActionError(true);
      setbulkActionsSuccessIcon(true);
      setBulkActionsErrorTitle(
        `${participantIds?.length} Records Successfully Updated`
      );
      setBulkActionsErrorMessage(
        `The updates have been saved. Attendance status for participants with pending transfer request cannot be changed.`
      );
    }
  };

  const handleBulkUpdateTransactionStatus = async (
    transaction_status_id: number
  ) => {
    const programID: number | undefined = router?.query?.id
      ? parseInt(router.query.id as string)
      : undefined;

    const participantIds: number[] = Object.keys(selectedRowObjects)
      .filter((key: any) => selectedRowObjects[key] === true)
      .map(Number);

    const transactionPendingStatusID = paymentStatusOptions.find(
      (record: any) => record.value == "Pending"
    )?.id;

    const { data: selectedTransactionStatusValues } = await supabase
      .from("participant_payment_history")
      .select("transaction_status_id")
      .match({ program_id: programID })
      .in("participant_id", participantIds);

    const selectTransactionStatusIds = selectedTransactionStatusValues?.map(
      (record) => record?.transaction_status_id
    );

    const allValuesSame = (arr: any): boolean =>
      arr.every((val: any) => val === transactionPendingStatusID);

    if (selectTransactionStatusIds?.length) {
      if (allValuesSame(selectTransactionStatusIds)) {
        const { error } = await supabase
          .from("participant_payment_history")
          .update({ transaction_status_id: transaction_status_id })
          .match({
            program_id: programID,
            transaction_status_id: transactionPendingStatusID,
          })
          .in("participant_id", participantIds);

        if (!error) {
          setDisplayTransactionStatusBulkActionError(true);
          setbulkActionsSuccessIcon(true);
          setBulkActionsErrorTitle("Bulk Transaction Status Update");
          setBulkActionsErrorMessage(
            `${participantIds?.length} Records Successfully Updated`
          );
        }
      } else {
        setDisplayTransactionStatusBulkActionError(true);
        setbulkActionsSuccessIcon(false);
        setBulkActionsErrorTitle("ERROR: Bulk Transaction Status Update");
        setBulkActionsErrorMessage(`Bulk update can only be done for payments with “Pending” status.
        Please select records whose transaction status value is only
        “Pending”. To update the payments with status other than
        “Pending”, please visit the Registration details for that
        participant.`);
      }
    } else {
      setDisplayTransactionStatusBulkActionError(true);
      setbulkActionsSuccessIcon(false);
      setBulkActionsErrorTitle("ERROR: Bulk Transaction Status Update");
      setBulkActionsErrorMessage(
        "No transaction history found for the selected participant(s)"
      );
    }
  };
  const [bulkActionSelectedValue, setBulkActionSelectedValue] =
    useState("Bulk Actions");

  return (
    <div className="flex flex-col justify-between relative h-screen">
      <div className="top-0 sticky z-[50] bg-white shadow-md w-full">
        <ParticipantsListMainHeader />
      </div>
      <span>
        {/* Popup to display error/success message for bulk actions update */}
        <AlertDialog open={displayTransactionStatusBulkActionError}>
          <AlertDialogContent>
            <div className="flex justify-end">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setDisplayTransactionStatusBulkActionError(false);
                }}
              >
                <CrossIcon fill="#333333" />
              </div>
            </div>
            <div className="w-full flex flex-col text-center items-center gap-4">
              {bulkActionsSuccessIcon && <Tick />}
              <div className="font-bold text-[20px]">
                {bulkActionsErrorTitle}
              </div>
              <div className="w-full px-4">{bulkActionsErrorMessage}</div>
              <div>
                <Button
                  onClick={() => {
                    setDisplayTransactionStatusBulkActionError(false);
                    setBulkActionsErrorTitle("");
                    setBulkActionsErrorMessage("");
                    setbulkActionsSuccessIcon(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </span>
      <div className="flex flex-col gap-4 px-10 py-2">
        <Form onSubmit={() => {}} defaultValues={[]}>
          <HeaderSection />
        </Form>
        {/* Bulk actions section */}
        <div className="flex gap-10 justify-end w-full">
          {/* Bulk Actions Dropdown */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="flex flex-row justify-between w-auto h-10 gap-2"
                  disabled={selectedTableRows > 0 ? false : true}
                >
                  {bulkActionSelectedValue}
                  <CountComponent count={selectedTableRows} />
                  <DropDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto scrollbar text-[#333333]">
                  {/* TODO (Not in MVP Scope): Print Registration Form */}
                  {/* <DropdownMenuItem
                    onClick={() => {
                      setEnableBulkOptions(true);
                    }}
                  >
                    Print Registration Form
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => {
                      setBulkActionSelectedValue("Update Attendance Status");
                      setEnableBulkOptions(false);
                      setBulkAction("attendance");
                    }}
                  >
                    Update Attendance Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setBulkActionSelectedValue("Update Transaction Status");
                      setEnableBulkOptions(false);
                      setBulkAction("transaction");
                    }}
                  >
                    Update Transaction Status
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Bulk actions options dropdown */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="flex flex-row justify-between w-[152px] h-10"
                  disabled={selectedTableRows > 0 ? disableBulkOptions : true}
                >
                  Select Status
                  <DropDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]">
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto scrollbar text-[#333333] w-full">
                  {bulkActions == "attendance"
                    ? attendanceOptions?.map((record: any) => (
                        <DropdownMenuItem
                          key={record.id}
                          onClick={() =>
                            handleUpdateAttendanceStatus(record.id)
                          }
                        >
                          {record.value}
                        </DropdownMenuItem>
                      ))
                    : paymentStatusOptions?.map((record: any) => (
                        <DropdownMenuItem
                          key={record.id}
                          onClick={() =>
                            handleBulkUpdateTransactionStatus(record.id)
                          }
                        >
                          {record.value}
                        </DropdownMenuItem>
                      ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="w-full">
          <BaseTable
            current={current}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            checkboxSelection={true}
            setCurrent={setCurrent}
            pageCount={pageCount}
            total={participantData?.data?.total || 0}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pagination={true}
            tableStyles={{
              table: "",
              rowStyles: "",
            }}
            columns={columns}
            data={participantData?.data?.data || []}
            columnPinning={true}
            columnSelector={true}
          />
        </div>
      </div>
      <div className="bottom-0 sticky absolute flex flex-row px-8 py-2 justify-between m-0 z-[100] bg-[white] left-0 items-center h-[67px] w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
            />
            <div>Select All</div>
            <div className="font-semibold">
              {participantData?.data?.total || 0}
            </div>
          </div>
          <div>|</div>
          <div className="flex flex-row gap-2">
            Selected: {allSelected ? participantData?.data?.total : rowCount}{" "}
            Out of{" "}
            <div className="font-semibold">
              {participantData?.data?.total || 0}
            </div>{" "}
          </div>
        </div>
        <div>
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex flex-row gap-2 text-[#7677F4] border border-[#7677F4] rounded-xl font-bold"
                disabled={!allSelected}
              >
                Export <ChevronDownIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full focus:outline-none font-sans font-medium">
              <DropdownMenuItem
                onClick={handleExportExcel}
                className="p-1 focus:outline-none cursor-pointer"
              >
                Excel
              </DropdownMenuItem>
              {/*TODO  */}
              <DropdownMenuItem className="p-1  focus:outline-none cursor-pointer">
                Csv
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default index;

const HeaderSection = () => {
  const {
    ParticpantFiltersData,
    setParticpantFiltersData,
    selectedTableRows,
    selectedRowObjects,
    setAdvanceFilterCount,
  } = ParticipantStore();
  const [open, setOpen] = useState(false);
  const { watch, setValue } = useFormContext();
  const formData = watch();
  const router = useRouter();

  const {
    field: { value: Searchvalue, onChange: onSearch },
  } = useController({
    name: "participant_code",
  });

  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Regex to allow only alphabets and numbers

    onSearch({ target: { value: sanitizedValue } });
  };

  const {
    field: { value: RegistrationDate, onChange: RegistrationDateChange },
  } = useController({
    name: "registration_date",
  });

  const {
    field: { value: transactionStatus, onChange: onSelectChange },
  } = useController({
    name: "transaction_status",
  });

  const transactionStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

  const transactionStatusValues = transactionStatusOptions?.map(
    (record: any) => {
      return {
        label: record?.value,
        value: record?.id,
      };
    }
  );

  const handleClearAll = () => {
    setValue("participant_code", "");
    setValue("registration_date", { from: "", to: "" });
    setValue("transaction_status", []);

    setValue("advanceFilter.full_name", "");
    setValue("advanceFilter.email", "");
    setValue("advanceFilter.mobile", "");
    setValue("advanceFilter.transaction_type", []);
    setValue("advanceFilter.payment_method", []);
    setValue("advanceFilter.fee_level", []);
    setValue("advanceFilter.attendance_status", "");
    setValue("advanceFilter.health_consent_status", {
      completed: false,
      pending: false,
    });
    setValue("advanceFilter.program_agreement_status", {
      completed: false,
      pending: false,
    });

    setAdvanceFilterCount(0);
  };

  return (
    <div className="flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4 flex-wrap gap-y-4">
      {/* Advance Filter Seciton */}
      <div>
        {" "}
        <ParticipantsAdvanceFilter />
      </div>
      {/* Search Section */}
      <div className="flex flex-row items-center border-2 px-3 rounded-lg">
        <div>
          <SearchIcon className="text-[#7677F4]" />
        </div>
        <div>
          <Input
            value={Searchvalue}
            onChange={handleSearchChange}
            type="text"
            className=" border-0 outline-none"
            placeholder="Search by Registration ID"
          ></Input>
        </div>
      </div>
      {/* Registration Date Filter Section */}
      <div>
        {" "}
        <Popover open={open}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2 border-2 px-3 py-5 rounded-lg"
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
                      <div
                        onClick={() => {
                          RegistrationDateChange(undefined);
                        }}
                      ></div>
                    </>
                  ) : (
                    format(RegistrationDate.from, "MM/dd/yyyy")
                  )
                ) : (
                  <span className="font-thin">Search by Registration Date</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl justify-center p-8">
            <DateRangePickerComponent
              setOpen={setOpen}
              value={RegistrationDate}
              onSelect={RegistrationDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* Transaction Status Section */}
      <div>
        <MultiSelect
          value={transactionStatus}
          placeholder="Transaction Status"
          data={transactionStatusValues}
          onBottomReached={() => {}}
          onSearch={() => {}}
          onChange={onSelectChange}
          searchBar={false}
        />
      </div>
      {/* Clear, Apply Filters Section */}
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row gap-2 items-center">
          <div
            onClick={handleClearAll}
            className=" cursor-pointer flex gap-2 items-center text-sm font-semibold text-[#7677F4]"
          >
            <ClearAll />
            <div>Clear All</div>
          </div>
        </div>
        <Button
          className="h-9 w-18 rounded-xl"
          onClick={() => {
            setParticpantFiltersData(formData);
          }}
        >
          Apply
        </Button>
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
          onClick={() => onSelect({ from: "", to: "" })}
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

const handleExportExcel = async () => {
  const supabase = supabaseClient();
  try {
    const excelColumns = [
      {
        column_name: "Registration ID",
        path: ["participant_code"],
      },
      {
        column_name: "Registration Date",
        path: ["created_at"],
      },
      {
        column_name: "Name",
        path: ["contact_id", "full_name"],
      },
      {
        column_name: "NIF",
        path: ["contact_id", "nif"],
      },
      {
        column_name: "Date of Birth",
        path: ["contact_id", "date_of_birth"],
      },
      {
        column_name: "Phone",
        path: ["contact_id", "mobile"],
      },
      {
        column_name: "Email",
        path: ["contact_id", "email"],
      },
      {
        column_name: "Fee Level",
        path: ["price_category_id", "fee_level_id", "value"],
      },
      {
        column_name: "Amount",
        path: ["price_category_id", "total"],
      },
      {
        column_name: "Transaction Type",
        path: ["participant_payment_history[0]", "transaction_type_id"],
      },
      {
        column_name: "Transaction ID",
        path: ["participant_payment_history[0]", "payment_transaction_id"],
      },
      {
        column_name: "Payment Method",
        path: ["participant_payment_history[0]", "payment_method_id", "value"],
      },
      {
        column_name: "Transaction Status",
        path: ["payment_status_id", "value"],
      },
      {
        column_name: "Attendance Status",
        path: ["participant_attendence_status_id", "value"],
      },
      {
        column_name: "Program Agreement Version",
        path: ["legal_agreement_version"],
      },
      {
        column_name: "Program Agreement Status",
        path: ["program_agreement_status"],
      },
      {
        column_name: "Program Agreement Date",
        path: ["program_agreement_date"],
      },
      {
        column_name: "Health Declaration Status",
        path: ["is_health_declaration_checked"],
      },
      {
        column_name: "Health Declaration Consent Date",
        path: ["health_declaration_consent_date"],
      },
    ];

    const params = new URLSearchParams({
      table_name: "participant_registration",
      select:
        ", contact_id!inner(full_name, date_of_birth, nif, email, country_id, mobile, mobile_country_code), price_category_id!inner(fee_level_id(value), total), participant_attendence_status_id(*), payment_status_id(*), participant_payment_history(*, transaction_type_id(*), payment_method))",
      columns: JSON.stringify(excelColumns),
    });

    //invoking the export_to_file function
    const { data, error } = await supabase.functions.invoke(
      ` export_to_file?${params}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
        },
      }
    );

    if (error) {
      console.error("Error invoking export_to_file function:", error);
      return;
    }

    if (data?.fileUrl?.data?.publicUrl) {
      //getting file name from the url
      const fileUrl = data.fileUrl.data.publicUrl;
      const fileName = fileUrl.split("/").pop();

      // passing the file name to download
      const result = await supabase.storage
        .from("export_to_excel")
        .download(fileName);

      if (result.error) {
        console.error("Error downloading file:", result.error);
        return; // Exit the function early if there's an error
      }

      if (result.data) {
        // Create a Blob object from the downloaded data
        const blob = new Blob([result.data]);

        // Create a URL for the Blob object
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName; // Specify the filename for the download
        document.body.appendChild(link);

        // Trigger the download by simulating a click event on the anchor element
        link.click();

        // Clean up by revoking the URL
        URL.revokeObjectURL(url);
      } else {
        console.error("No data returned when downloading file");
      }
    } else {
      console.error("File URL not found in the response.");
    }
  } catch (error) {
    console.error("Error handling export:", error);
  }
};
