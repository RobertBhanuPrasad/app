import { BaseTable } from "@components/course/findCourse/BaseTable";
import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { columns } from "./columns";
import { useTable } from "@refinedev/core";
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
import { ParticipantsAdvanceFilter } from "./ParticipantsListAdvanceFilters";

function index() {
  return (
    <div className="flex flex-col gap-4">
      <HeaderSection />
      <TableSection />
    </div>
  );
}

export default index;

const HeaderSection = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>();
  const transactionStatusOptions = [
    "Confirmed",
    "Pending",
    "Failed",
    "Not Received",
  ];

  return (
    <div className="flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4">
      <div>
        {" "}
        <ParticipantsAdvanceFilter />
      </div>
      <div className="flex flex-row items-center border-2 px-3 rounded-lg">
        <div>
          <SearchIcon className="text-[#7677F4]" />
        </div>
        <div>
          <Input
            className=" border-0 outline-none"
            placeholder="Search by Registration ID"
          ></Input>
        </div>
      </div>
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
                <CalenderIcon />
              </div>
              <div>
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
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
              value={date}
              onSelect={setDate}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="flex flex-row justify-between w-[192px] h-10"
            >
              Transaction Status
              <DropDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-4 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              {transactionStatusOptions.map((value) => (
                <DropdownMenuItem>{value}</DropdownMenuItem>
              ))}
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
            >
              Records Selected
              <DropDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-4 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              {transactionStatusOptions.map((value) => (
                <DropdownMenuItem>{value}</DropdownMenuItem>
              ))}
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
            >
              Select Status
              <DropDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-4 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              {transactionStatusOptions.map((value) => (
                <DropdownMenuItem>{value}</DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row gap-2 items-center text-sm font-semibold text-[#7677F4]">
          <ClearAll />
          <div>Clear All</div>
        </div>
        <Button className="h-9 w-18 rounded-xl">Apply</Button>
      </div>
    </div>
  );
};
const TableSection = () => {
  const {
    tableQueryResult: programData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
  } = useTable({
    resource: "participant_registration",
    meta: {
      select: "*, contact_id(*), price_category_id(fee_level_id(value))",
    },
  });

  const testData = [
    {
      id: "ALTABC4512458",
      registration_date: "2024-04-06T12:38:42.587328+00:00",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "2024-07-24T12:38:42.587328+00:00",
      contact_id: {
        full_name: "a",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
    {
      id: "ALTABC4512458",
      registration_date: "17 Oct, 2020",
      contact_id: {
        full_name: "Eleanor Pena",
        date_of_birth: "Jan. 22, 1994",
        mobile: 6842018413,
        email: "nathan.roberts@example.com",
        nif: 458484254,
      },
      price_category_id: {
        fee_level_id: {
          value: "Regular",
        },
        amount: 5000,
      },
      payment_status: {
        transaction_type: "Sale",
        transaction_id: "102656693ac3ca6e0cdafbfe89ab99",
        payment_method: "Credit/Debit Card stripe",
        balance: 300,
        transaction_status: "Confirmed",
      },
      participant_attendence_status_id: {
        value: "Confirmed",
      },
      legal_agreement_version: 3.1,
      program_agreement_status: "Completed",
      health_declaration_status: "Completed",
      program_agreement_date: "24th Mar, 2022",
      health_declaration_date: "25th Mar, 2022",
    },
  ];

  console.log("hey table data", programData);
  const [rowSelection, setRowSelection] = React.useState({});

  return (
    <div>
      <BaseTable
        current={current}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        checkboxSelection={true}
        setCurrent={setCurrent}
        pageCount={pageCount}
        // total={programData?.data?.total || 0}
        total={testData.length || 0}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pagination={true}
        tableStyles={{
          table: "",
          rowStyles: "",
        }}
        columns={columns as ColumnDef<any>[]}
        // data={programData?.data?.data || []}
        data={testData || []}
        columnPinning={true}
      />
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
