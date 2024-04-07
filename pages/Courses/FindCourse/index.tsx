import { BaseTable } from "@components/course/findCourse/BaseTable";
import ClearAll from "@public/assets/ClearAll";
import FilterIcon from "@public/assets/FilterIcon";
import SearchIcon from "@public/assets/Search";
import { useList, useSelect } from "@refinedev/core";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import Filters from "@components/course/findCourse/Filters";
import { Sheet, SheetContent, SheetTrigger } from "src/ui/sheet";
import Form from "@components/Formfield";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { Input } from "src/ui/input";
import { Checkbox } from "src/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { format } from "date-fns";
import { columns } from "./Columns";
import { useTable } from "@refinedev/core";
import { useController, useFormContext } from "react-hook-form";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CalenderIcon from "@public/assets/CalenderIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { supabaseClient } from "src/utility/supabaseClient";

function index() {
  const { AllFilterData } = newCourseStore();

  const filters: any = { permanent: [] };

  if (AllFilterData?.newAdvanceFilterData?.course_name) {
    filters.permanent.push({
      field: "program_alias_name_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.course_name,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.course_type) {
    filters.permanent.push({
      field: "program_type_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.course_type,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.state) {
    filters.permanent.push({
      field: "state_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.state,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.city) {
    filters.permanent.push({
      field: "city_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.city,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.center) {
    filters.permanent.push({
      field: "center_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.center,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.course_teacher) {
    filters.permanent.push({
      field: "program_teachers.user_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.course_teacher,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.program_organiser) {
    filters.permanent.push({
      field: "program_organizers.user_id",
      operator: "in",
      value: AllFilterData?.newAdvanceFilterData?.program_organiser,
    });
  }
  if (AllFilterData?.newAdvanceFilterData?.visibility) {
    filters.permanent.push({
      field: "visibility_id",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.visibility,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.is_residential_course) {
    filters.permanent.push({
      field: "is_residential_program",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.is_residential_course,
    });
  }

  if (AllFilterData?.newAdvanceFilterData?.course_status) {
    filters.permanent.push({
      field: "status_id",
      operator: "in",
      value: AllFilterData?.newAdvanceFilterData?.course_status,
    });
  }
  if (AllFilterData?.course_id) {
    filters.permanent.push({
      field: "program_code",
      operator: "contains",
      value: AllFilterData?.course_id,
    });
  }
  if (AllFilterData?.newAdvanceFilterData?.is_course_fee) {
    filters.permanent.push({
      field: "program_fee_level_settings.is_custom_fee",
      operator: "eq",
      value: AllFilterData?.newAdvanceFilterData?.is_course_fee,
    });
  }
  if (AllFilterData?.course_date) {
    filters.permanent?.push(
      {
        field: "program_schedules.start_time",
        operator: "gte",
        value:
          AllFilterData.course_date.from &&
          new Date(AllFilterData.course_date.from?.setHours(0, 0, 0, 0))
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      },
      {
        field: "program_schedules.start_time",
        operator: "lt",
        value:
          AllFilterData.course_date.to &&
          new Date(AllFilterData.course_date.to?.setHours(0, 0, 0, 0))
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      }
    );
  }

  const [rowSelection, setRowSelection] = React.useState({});

  const {
    tableQueryResult: programData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
  } = useTable({
    resource: "program",
    meta: {
      select:
        "*,program_types(name) , state(name) , city(name) , center(name) ,program_teachers!inner(users!inner(user_name)) , program_organizers!inner(users!inner(user_name)) , program_type_alias_names(alias_name) , visibility_id(id,value), participant_registration(*) , program_schedules!inner(*) , program_fee_level_settings!inner(is_custom_fee) , status_id(id,value) ,program_accounting_status_id(id,value)",
    },
    filters: filters,
  });

  const [allSelected, setAllSelected] = useState();

  //Whenever the selectall is changed then all cloumns check state need to be changed and whenever the program data is changed then those rows also need to checked or unchecked based on select all state
  useEffect(() => {
    if (!programData?.data?.data) return;
    const allRowSelection: any = {};
    programData?.data?.data?.forEach((row: any) => {
      allRowSelection[row?.id] = allSelected;
    });
    setRowSelection(allRowSelection);
  }, [allSelected, programData?.data?.data]);

  const handleSelectAll = (val: any) => {
    setAllSelected(val);
  };

  //function to handle exportexcel
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
        table_name: "program",
        select:
          "*,program_types(name) , state(name) , city(name) , center(name) ,program_teachers!inner(users!inner(user_name)) , program_organizers!inner(users!inner(user_name)) , program_type_alias_names(alias_name) , visibility_id(id,value), participant_registration(*) , program_schedules!inner(*) , program_fee_level_settings!inner(is_custom_fee)",
        columns: JSON.stringify(excelColumns),
      });

      //invoking the export_to_file function
      const { data, error } = await supabaseClient.functions.invoke(
        `export_to_file?${params}`,
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
      <div className="mx-8 flex flex-col gap-4">
        <HeaderSection />
        <div className="w-full">
          <BaseTable
            current={current}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            checkboxSelection={true}
            setCurrent={setCurrent}
            pageCount={pageCount}
            total={programData?.data?.total || 0}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pagination={true}
            tableStyles={{
              table: "",
              rowStyles: "!important border-none",
            }}
            columns={columns}
            data={programData?.data?.data || []}
            columnPinning={true}
          />
        </div>
      </div>
      <div className="bottom-0 sticky absolute flex flex-row px-8 justify-between m-0 z-[100] bg-[white] left-0 items-center h-[67px] w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
          />
          <div>Select All</div>
          <div className="font-semibold">{programData?.data?.total || 0}</div>
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
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false);

  const { newAdvanceFilterData, setNewAdvanceFilterData, AllFilterData } =
    newCourseStore();

  const count =
    (newAdvanceFilterData &&
      Object.keys(newAdvanceFilterData).filter(
        (key) => newAdvanceFilterData[key] !== undefined
      ).length) ||
    0;

  return (
    <div className="w-full flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md px-8 py-4">
      <div className="flex-[0.25]">
        <Sheet open={advanceFilterOpen}>
          <SheetTrigger className="p-0">
            <Button
              onClick={() => {
                setAdvanceFilterOpen(true);
              }}
              className="flex flex-row gap-2 !rounded-xl"
              variant="outline"
            >
              All Filters
              <FilterIcon />
              {count > 0 && <CountComponent count={count} />}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[446px] rounded-l-xl">
            <Form onSubmit={() => {}} defaultValues={newAdvanceFilterData}>
              <Filters
                setAdvanceFilterOpen={setAdvanceFilterOpen}
                setNewAdvanceFilterData={setNewAdvanceFilterData}
              />
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-[1.75]">
        <Form onSubmit={() => {}} defaultValues={AllFilterData}>
          <BasicFilters />
        </Form>
      </div>
    </div>
  );
};

export const DateRangePickerComponent = ({ setOpen, value, onSelect }: any) => {
  return (
    <div className="relative ml-[-12px] mt-[-12px]">
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
          onClick={() =>
            onSelect({
              from: new Date(),
              to: new Date(),
            })
          }
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

export const CountComponent = ({ count }: any) => {
  return (
    <div className="flex justify-center items-center w-5 h-5 !rounded-full bg-[#7677F4]/10">
      <div className="text-xs text-[#7677F4]">{count}</div>
    </div>
  );
};

export const CourseTypeComponent = () => {
  const [pageSize, setPageSize] = useState(10);
  const { newAdvanceFilterData, setNewAdvanceFilterData } = newCourseStore();
  const { options, onSearch } = useSelect({
    resource: "program_types",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value: any) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],

    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };

  const {
    field: { value, onChange },
  } = useController({
    name: "course_type",
  });

  return (
    <Select
      value={value ? value : newAdvanceFilterData?.course_type}
      onValueChange={(val: any) => {
        onChange(val);
        setNewAdvanceFilterData({
          ...newAdvanceFilterData,
          course_type: val,
        });
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select Course Type" />
      </SelectTrigger>
      <SelectContent>
        <Input onChange={(val) => onSearch(val.target.value)} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options.map((option: any, index: number) => (
            <>
              <SelectItem
                key={option.value}
                value={option.value}
                className="h-[44px]"
              >
                {option.label}
              </SelectItem>
              {index < options?.length - 1 && (
                <hr className="border-[#D6D7D8]" />
              )}
            </>
          ))}
        </SelectItems>
      </SelectContent>
    </Select>
  );
};

export const BasicFilters = () => {
  const { getValues, setValue } = useFormContext();
  const formData = getValues();

  const {
    field: { value, onChange },
  } = useController({
    name: "course_id",
  });

  const {
    field: { value: courseDate, onChange: courseDateOnChange },
  } = useController({
    name: "course_date",
  });

  const { newAdvanceFilterData, setAllFilterData, setNewAdvanceFilterData } =
    newCourseStore();

  const [open, setOpen] = useState(false);

  const handleClearAll = () => {
    //Clearing out allfilter data and advance filter data
    setNewAdvanceFilterData(undefined);
    setAllFilterData(undefined);
    setValue("course_id", "");
    setValue("course_date", "");
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row justify-center items-center border border-[1px] px-2 rounded-xl">
        <SearchIcon />
        <Input
          value={value}
          onChange={onChange}
          type="text"
          className="border-none focus:outline-none"
          placeholder={`Search by Course ID`}
        />
      </div>
      <div>
        {" "}
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
              variant="outline"
            >
              <CalenderIcon color="#666666" />
              {courseDate?.from ? (
                courseDate?.to ? (
                  <>
                    {format(courseDate.from, "MM/dd/yyyy")} -{" "}
                    {format(courseDate.to, "MM/dd/yyyy")}
                    <div
                      onClick={() => {
                        courseDateOnChange(undefined);
                      }}
                    ></div>
                  </>
                ) : (
                  format(courseDate.from, "MM/dd/yyyy")
                )
              ) : (
                <div className="flex gap-2 font-normal">
                  Select the Date Range
                </div>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
            <DateRangePickerComponent
              setOpen={setOpen}
              value={courseDate}
              onSelect={courseDateOnChange}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <CourseTypeComponent />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div
          onClick={handleClearAll}
          className="flex flex-row gap-2 items-center text-sm font-semibold text-[#7677F4]"
        >
          <ClearAll />
          <div>Clear All</div>
        </div>
        <Button
          onClick={() => {
            //Here when i click on overall apply moving advancefilter data to final variable
            setAllFilterData({
              ...formData,
              newAdvanceFilterData: newAdvanceFilterData,
            });
          }}
          className="h-9 w-18 rounded-xl"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
