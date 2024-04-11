import { BaseTable } from "@components/course/findCourse/BaseTable";
import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { columns } from "../../../src/components/participants/columns";
import { CrudFilters, useTable } from "@refinedev/core";
import { Input } from "src/ui/input";
import { SearchIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import DropDown from "@public/assets/DropDown";
import { format } from "date-fns";
import { ParticipantsAdvanceFilter } from "../../../src/components/participants/ParticipantsListAdvanceFilters";
import { supabaseClient } from "src/utility/supabaseClient";
import { useController, useFormContext } from "react-hook-form";
import Form from "@components/Formfield";
import { ParticipantStore } from "src/zustandStore/ParticipantStore";
import { Checkbox } from "src/ui/checkbox";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
} from "src/constants/OptionLabels";
import { MultiSelect } from "src/ui/multi-select";
import { CountComponent } from "pages/Courses/FindCourse";
import { useParams } from "next/navigation";

function index() {
  const { program_id } = useParams();
  const { ParticpantFiltersData, setSelectedTableRows } = ParticipantStore();
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
    permanent: [{ field: "program_id", operator: "eq", value: program_id }],
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

  // if (ParticpantFiltersData?.advanceFilter?.transaction_type?.length) {
  //   filters.permanent.push({
  //     field: "payment_status_id",
  //     operator: "in",
  //     value: ParticpantFiltersData?.advanceFilter?.transaction_type,
  //   });
  // }

  //  if (ParticpantFiltersData?.advanceFilter?.payment_method?.length) {
  //   filters.permanent.push({
  //     field: "payment_status_id",
  //     operator: "in",
  //     value: ParticpantFiltersData?.advanceFilter?.payment_method,
  //   });
  // }

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

  if (
    ParticpantFiltersData?.advanceFilter?.health_consent_status?.completed ===
    true
  ) {
    filters.permanent.push({
      field: "is_health_declaration_checked",
      operator: "eq",
      value:
        ParticpantFiltersData?.advanceFilter?.health_consent_status?.completed,
    });
  }

  if (
    ParticpantFiltersData?.advanceFilter?.health_consent_status?.pending ===
    true
  ) {
    filters.permanent.push({
      field: "is_health_declaration_checked",
      operator: "eq",
      value:
        !ParticpantFiltersData?.advanceFilter?.health_consent_status?.pending,
    });
  }

  if (
    ParticpantFiltersData?.advanceFilter?.program_agreement_status?.pending ===
    true
  ) {
    filters.permanent.push({
      field: "is_program_agreement_checked",
      operator: "eq",
      value:
        !ParticpantFiltersData?.advanceFilter?.program_agreement_status
          ?.pending,
    });
  }

  if (
    ParticpantFiltersData?.advanceFilter?.program_agreement_status
      ?.completed === true
  ) {
    filters.permanent.push({
      field: "is_health_declaration_checked",
      operator: "eq",
      value:
        ParticpantFiltersData?.advanceFilter?.program_agreement_status
          ?.completed,
    });
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
        "*, contact_id!inner(full_name, date_of_birth, nif, email, country_id, mobile, mobile_country_code), price_category_id(fee_level_id!inner(value), total), participant_attendence_status_id(*), payment_status_id!inner(*), participant_payment_history!inner(*, transaction_type_id(*), payment_method_id(*)))",
    },
    filters: filters,
  });

  console.log("hey table data", participantData);
  console.log(
    "Filters",
    ParticpantFiltersData?.advanceFilter?.program_agreement_status
  );
  console.log("Filters", filters);
  const [rowSelection, setRowSelection] = React.useState({});
  const [allSelected, setAllSelected] = useState();

  useEffect(() => {
    if (!participantData?.data?.data) return;
    const allRowSelection: any = {};
    participantData?.data?.data?.forEach((row: any) => {
      allRowSelection[row?.id] = allSelected;
    });
    setRowSelection(allRowSelection);
  }, [allSelected, participantData?.data?.data, setSelectedTableRows]);

  useEffect(() => {
    const tempCount = Object.values(rowSelection).filter(
      (value) => value === true
    ).length;
    setSelectedTableRows(tempCount);
  }, [rowSelection]);

  const handleSelectAll = (val: any) => {
    setAllSelected(val);
  };

  const rowCount = Object.values(rowSelection).filter(
    (value) => value === true
  ).length;

  const handleExportExcel = async () => {
    try {
      const excelColumns = [
        {
          column_name: "Course ID",
          path: ["program_code"],
        },
        {
          column_name: "Course Type Name",
          path: ["program_types", "name"],
        },
        {
          column_name: "Course Name",
          path: ["program_type_alias_names", "alias_name"],
        },
        {
          column_name: "Course Status",
          path: ["status_id", "value"],
        },
        {
          column_name: "Start Date",
          path: ["program_schedules", "start_time"],
        },
        {
          column_name: "State",
          path: ["state", "name"],
        },
        {
          column_name: "City",
          path: ["city", "name"],
        },
        {
          column_name: "Center",
          path: ["center", "name"],
        },
        {
          column_name: "Attendes",
          path: ["participant_registration", "length"],
        },
        {
          column_name: "Visibility",
          path: ["visibility_id", "value"],
        },
        {
          column_name: "Course Accounting Status",
          path: ["program_accounting_status_id", "value"],
        },
      ];

      const params = new URLSearchParams({
        table_name: "participant_registration",
        select:
          ",program_types(name) , state(name) , city(name) , center(name) ,program_teachers!inner(users!inner(user_name)) , program_organizers!inner(users!inner(user_name)) , program_type_alias_names(alias_name) , visibility_id(id,value), participant_registration() , program_schedules!inner(*) , program_fee_level_settings!inner(is_custom_fee)",
        columns: JSON.stringify(excelColumns),
      });

      //invoking the export_to_file function
      const { data, error } = await supabaseClient.functions.invoke(
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
        const result = await supabaseClient.storage
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

  return (
    <div className="flex flex-col justify-between relative h-screen">
      <div className="flex flex-col gap-4 p-10">
        <Form onSubmit={() => {}} defaultValues={[]}>
          <HeaderSection />
        </Form>
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
          />
        </div>
      </div>
      <div className="bottom-0 sticky absolute flex flex-row px-8 justify-between m-0 z-[100] bg-[white] left-0 items-center h-[67px] w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
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
                className="flex flex-row gap-2 text-[#7677F4] border border-[#7677F4] rounded-xl"
                disabled={!allSelected}
              >
                Export <ChevronDownIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="!w-[106px] focus:outline-none">
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
  const { ParticpantFiltersData, setParticpantFiltersData, selectedTableRows } =
    ParticipantStore();
  const [open, setOpen] = useState(false);

  console.log("COUNT", selectedTableRows);

  const { watch, setValue } = useFormContext();
  const formData = watch();

  const {
    field: { value: Searchvalue, onChange: onSearch },
  } = useController({
    name: "participant_code",
  });

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
    setValue("registration_date", "");
    setValue("transaction_status", []);
  };

  const [disableBulkOptions, setEnableBulkOptions] = useState(true);
  const [bulkActions, setBulkAction] = useState("");
  const attendanceOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  const paymentStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

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
            onChange={onSearch}
            type="text"
            className=" border-0 outline-none"
            placeholder="Search by Registration ID"
          ></Input>
        </div>
      </div>
      {/* Registration Date Filter Section */}
      <div>
        {" "}
        <Dialog open={open}>
          <DialogTrigger asChild>
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
      {/* Transaction Status Section */}
      <div>
        <MultiSelect
          value={transactionStatus}
          placeholder="Transaction Status"
          data={transactionStatusValues}
          onBottomReached={() => {}}
          onSearch={() => {}}
          onChange={onSelectChange}
        />
      </div>
      {/* Bulk actions Section */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="flex flex-row justify-between w-[192px] h-10"
              disabled={selectedTableRows > 0 ? false : true}
            >
              Records Selected
              <CountComponent count={selectedTableRows} />
              <DropDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-4 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              <DropdownMenuItem
                onClick={() => {
                  setEnableBulkOptions(true);
                }}
              >
                Print Registration Form
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEnableBulkOptions(false);

                  setBulkAction("attendance");
                }}
              >
                Update Attendance Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
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
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="flex flex-row justify-between w-[192px] h-10"
              disabled={disableBulkOptions}
            >
              Select Status
              <DropDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-4 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              {bulkActions == "attendance"
                ? attendanceOptions?.map((record: any) => (
                    <DropdownMenuItem key={record.id}>
                      {record.value}
                    </DropdownMenuItem>
                  ))
                : paymentStatusOptions?.map((record: any) => (
                    <DropdownMenuItem key={record.id}>
                      {record.value}
                    </DropdownMenuItem>
                  ))}
              {/* <DropdownMenuItem>Pending</DropdownMenuItem> */}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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
