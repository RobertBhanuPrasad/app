import Form from "@components/Formfield";
import { BaseTable } from "@components/course/findCourse/BaseTable";
import Filters, {
  Preferences,
  emptyPreferences,
} from "@components/course/findCourse/Filters";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import { hasAliasNameFalse } from "@components/courseBusinessLogic";
import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import CrossIcon from "@public/assets/CrossIcon";
import FilterIcon from "@public/assets/FilterIcon";
import SearchIcon from "@public/assets/Search";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useList, useSelect, useTable } from "@refinedev/core";
import { format } from "date-fns";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { authProvider } from "src/authProvider";
import { translatedText } from "src/common/translations";
import { column } from "src/components/course/findCourse/Columns";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import { Dialog, DialogContent } from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { Input } from "src/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "src/ui/sheet";
import { SupabaseClient, supabaseClient } from "src/utility/supabaseClient";
import useGetCountryCode from "src/utility/useGetCountryCode";
import useGetLanguageCode from "src/utility/useGetLanguageCode";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

function index() {
  interface ExcelColumn {
    column_name: string;
    path: string[];
  }

  const { viewPreviewPage, AllFilterData } = newCourseStore();

  const languageCode = useGetLanguageCode();
  const countryCode = useGetCountryCode();

  console.log("viewPreviewPage", viewPreviewPage);
  // If user click on edit course in menu option we have to open review page instead of table

  /**
   *This holds the all the filters when we select any filters
   */
  const filters: any = { permanent: [] };

  //If we select course_name then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.course_name) {
    filters.permanent.push({
      field: "program_alias_name_id",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.course_name,
    });
  }

  //If we select course_type then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.course_type || AllFilterData?.course_type) {
    filters.permanent.push({
      field: "program_type_id",
      operator: "eq",
      //here if the course_type from advance filter has value then it will be applied otherwise if there is value in basic filters then it will apply
      value: AllFilterData?.advanceFilter?.course_type
        ? AllFilterData?.advanceFilter?.course_type
        : AllFilterData?.course_type,
    });
  }

  //If we select state then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.state) {
    filters.permanent.push({
      field: "state_id",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.state,
    });
  }

  //If we select city then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.city) {
    filters.permanent.push({
      field: "city_id",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.city,
    });
  }

  //If we select center then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.center) {
    filters.permanent.push({
      field: "center_id",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.center,
    });
  }

  //If we select teacher then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.course_teacher) {
    filters.permanent.push({
      field: "program_teachers.user_id",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.course_teacher,
    });
  }

  //If we select program_organiser then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.program_organiser?.length > 0) {
    filters.permanent.push({
      field: "program_organizers.user_id",
      operator: "in",
      value: AllFilterData?.advanceFilter?.program_organiser,
    });
  }

  //If we select visibility then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.visibility) {
    filters.permanent.push({
      field: "visibility_id",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.visibility,
    });
  }

  //If we select visibility then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.is_residential_course) {
    filters.permanent.push({
      field: "is_residential_program",
      operator: "eq",
      value: AllFilterData?.advanceFilter?.is_residential_course,
    });
  }

  //If we select course_status then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.course_status?.length > 0) {
    filters.permanent.push({
      field: "status_id",
      operator: "in",
      value: AllFilterData?.advanceFilter?.course_status,
    });
  }

  //If we serach for particular course then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.course_id) {
    filters.permanent.push({
      field: "program_code",
      operator: "contains",
      value: AllFilterData?.course_id,
    });
  }

  //If we select course fee then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.is_course_fee) {
    //If the course_fee is true means it is default else it is custom fee
    if (AllFilterData?.advanceFilter?.is_course_fee == "TRUE") {
      //If the program_fee_setting_id is not null then it has default fee if it is null then we have our custom fee here we check if any id is present or not by value greater than 0
      filters.permanent.push({
        field: "program_fee_settings_id",
        operator: "gt",
        value: 0,
      });
    } else {
      filters.permanent.push({
        field: "program_fee_settings_id",
        operator: "null",
        value: true,
      });
    }
  }

  //If we select date range for course then we have to write filter to fetch the courses based on the range , we will push to filters
  if (AllFilterData?.course_date) {
    //Here the date picker uses the GMT time so , iam adding  1 day that is next day for from and to of course date
    filters.permanent?.push(
      {
        field: "start_date",
        operator: "gte",
        value:
          AllFilterData.course_date.from &&
          new Date(
            new Date(
              AllFilterData.course_date.from?.setUTCHours(0, 0, 0, 0)
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            .toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      },
      {
        field: "start_date",
        operator: "lte",
        value:
          AllFilterData.course_date.to &&
          new Date(
            new Date(
              AllFilterData.course_date.to?.setUTCHours(23, 59, 0, 0)
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + "+00",
      }
    );
  }

  //If we select course_accounting_status then we need to write a filter to the data query , here if it presents we will push to filters array
  if (AllFilterData?.advanceFilter?.course_accounting_status?.length > 0) {
    filters.permanent.push({
      field: "program_accounting_status_id",
      operator: "in",
      value: AllFilterData?.advanceFilter?.course_accounting_status,
    });
  }

  /**
   * This holds the records of which rows are selected
   */
  const [rowSelection, setRowSelection] = React.useState({});

  /**
   * Here we are maintaining 2 querys one is for filtering and one is for showing the data in the table and this is the filter query
   */
  const {
    tableQueryResult: FilterProgramData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
    setFilters,
  } = useTable({
    resource: "program",
    meta: {
      select:
        "*,program_types(name) , state(name) , city(name) , center(name) ,program_teachers!inner(users(contact_id(full_name))) , program_organizers!inner(users(contact_id(full_name))) , program_type_alias_names(alias_name) , visibility_id(id,name),program_schedules!inner(*), program_fee_level_settings(is_custom_fee) , status_id(id,name) ,program_accounting_status_id(id,name)",
    },
    filters: filters,
    sorters: {
      permanent: [
        // Sorting the program data based on their created date in descending order so that new created program wil be displayed on top
        { field: "created_at", order: "desc" },
      ],
    },
  });

  /**
   *This variable holds the filtered ids of the query
   */
  const filteredIds =
    FilterProgramData?.data?.data.map((item) => item.id) || [];

  /**
   *This is the query to get data to show in the table
   */
  const { tableQueryResult: programData, setPageSize: displayDataSetPageSize } =
    useTable({
      resource: "program",
      //restricting the hook to get the params from URL
      syncWithLocation: false,
      meta: {
        select:
          "*,program_types(name) , state(name) , city(name) , center(name) ,program_teachers!inner(users(contact_id(full_name))) , program_organizers!inner(users(contact_id(full_name))) , program_type_alias_names(alias_name) , visibility_id(id,name),program_schedules!inner(*), program_fee_level_settings(is_custom_fee) , status_id(id,name) ,program_accounting_status_id(id,name)",
      },
      pagination: {
        pageSize: pageSize,
      },
      filters: {
        permanent: [
          {
            field: "id",
            operator: "in",
            value: filteredIds,
          },
        ],
      },
      sorters: {
        permanent: [
          // Sorting the program data based on their created date in descending order so that new created program wil be displayed on top
          { field: "created_at", order: "desc" },
        ],
      },
    });

  //whenever the filters data is changed then we need to set the filters using setFilters from use table hook
  //Because when we move to another route and comeback Filters are not setting properly that why we have written this
  useEffect(() => {
    setFilters(filters.permanent, "replace");
  }, [AllFilterData]);

  /**
   * The variable holds whether all rows are selected or not
   */
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const [loading, setIsLoading] = useState(false);

  //Whenever the selectall is changed then all cloumns check state need to be changed and whenever the program data is changed then those rows also need to checked or unchecked based on select all state
  useEffect(() => {
    if (!programData?.data?.data) return;
    const allRowSelection: any = {};
    //If allSelected is true then only i need check rows when i navigate to other pages
    if (allSelected) {
      programData?.data?.data?.forEach((row: any) => {
        allRowSelection[row?.id] = allSelected;
      });
      setRowSelection(allRowSelection);
    }
  }, [allSelected, programData?.data?.data]);

  /**
   *Here whenever i check select all then i need to check and unchekc all row selection also
   */
  const handleSelectAll = (val: boolean) => {
    const allRowSelection: any = {};

    programData?.data?.data?.forEach((row: any) => {
      allRowSelection[row?.id] = val;
    });
    setRowSelection(allRowSelection);

    setAllSelected(val);
  };

  /**
   *Here whenever the row is unchecked then selected row length will be 0 then i need to uncheck select all also
   */
  const rowSelectionOnChange = (row: any) => {
    const selectedRow = row();
    setRowSelection(row);
    if (Object.values(selectedRow).length === 0) {
      setAllSelected(false);
    }
  };

  /**
   * This function is to handle export excel
   */

  const handleExportExcel = async (selectOption: string) => {
    setIsLoading(true);
    try {
      /**
       * This holds the column_name and path of all columns of table
       */
      const excelColumns: ExcelColumn[] = [
        {
          column_name: t("course_id"),
          path: ["program_code"],
        },
        {
          column_name: t("new_strings:course_type_name"),
          path: ["program_types", "name", languageCode],
        },
        {
          column_name: t("course.find_course:course_status"),
          path: ["status_id", "name", languageCode],
        },
        {
          column_name: t("course.find_course:start_date"),
          path: ["start_date"],
        },
        {
          column_name: t("course.find_course:state"),
          path: ["state", "name"],
        },
        {
          column_name: t("city"),
          path: ["city", "name"],
        },
        {
          column_name: t("course.find_course:center"),
          path: ["center", "name"],
        },
        {
          column_name: t("course.find_course:teacher(s)"),
          path: ["program_teachers", "users", "contact_id", "full_name"],
        },
        {
          column_name: t("program_organizer"),
          path: ["program_organizers", "users", "contact_id", "full_name"],
        },
        {
          column_name: t("course.find_course:attendees"),
          path: ["participant_count"],
        },
        {
          column_name: t("new_strings:visibility"),
          path: ["visibility_id", "name", languageCode],
        },
        // {
        //   column_name: t("course_accounting_status"),
        //   path: ["program_accounting_status_id", "name"],
        // },
        {
          column_name: t("new_strings:revenue"),
          path: ["revenue"],
        },
      ];

      /**
       * This holds the params need to send for export excel function like table name , select query , columns
       */
      const params = new URLSearchParams({
        table_name: "program",
        select:
          "id,created_at,program_code,program_types(name),status_id(name),start_date,state(name),city(name),center(name),program_teachers!inner(users(contact_id(full_name))), program_organizers!inner(users(contact_id(full_name))),visibility_id(id,name),program_accounting_status_id(id,name),participant_count,revenue",
        columns: JSON.stringify(excelColumns),
        filters: JSON.stringify(filters?.permanent),
        sorters: JSON.stringify([
          { field: "created_at", order: { ascending: false } },
        ]),
        file_type: selectOption,
      });

      const supabase = supabaseClient();

      //invoking the export_to_file function
      const { data, error } = await supabase.functions.invoke(
        `export_to_file?${params}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
            "country-code": countryCode,
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
        setIsLoading(false);

        console.log("filename", fileName);
        // passing the file name to download
        const result = await supabase.storage
          .from("export_to_file")
          .download(fileName);

        console.log("result is", result);

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

  /**
   * The variable holds the count of rows
   */
  const rowCount: number = Object.values(rowSelection).filter(
    (value) => value === true
  ).length;

  console.log("heyy row count", allSelected === false);

  if (viewPreviewPage) {
    return <NewCourseReviewPage />;
  }

  // we are writing this to check if the any course 'has alias_name' as false we making the state variable as false
  // so that the course_type and course_name is not visible in advance filter and for the columns course_name should be visible if and only if course_alias_name is true
  // for the ticket MVP-1054
  const { data } = useList<any>({
    resource: "program_types",
    filters: [
      {
        field: "has_alias_name",
        operator: "eq",
        value: true,
      },
    ],
  });
  const { t } = useTranslation([
    "common",
    "course.find_course",
    "new_strings",
    "course.view_course",
    "course.participants",
  ]);
  return (
    <div className="flex flex-col justify-between relative">
      <p className="font-semibold text-2xl ml-8">
        {t("new_strings:find_courses")}
      </p>
      <div className="mx-8 flex flex-col mt-4 bg-[white]">
        <HeaderSection
          hasAliasNameFalse={hasAliasNameFalse(data)}
          setCurrent={setCurrent}
        />

        {programData?.isLoading ? (
          <section className="flex justify-center align-center pt-[10%]">
            <div className="loader"></div>
          </section>
        ) : (
          <div className="w-full mb-[76px]">
            <BaseTable
              current={current}
              rowSelection={rowSelection}
              setRowSelection={rowSelectionOnChange}
              checkboxSelection={true}
              setCurrent={setCurrent}
              pageCount={pageCount}
              total={FilterProgramData?.data?.total || 0}
              pageSize={pageSize}
              //Here we have to set the page size of the query we use to display data in table and for query we apply filters
              setPageSize={(number) => {
                setPageSize(number);
                displayDataSetPageSize(number);
              }}
              pagination={true}
              tableStyles={{
                table: "",
                rowStyles: "!important border-none",
              }}
              noRecordsPlaceholder={t("new_strings:there_are_no_courses")}
              columns={column(hasAliasNameFalse(data), t)}
              data={programData?.data?.data || []}
              columnPinning={true}
              columnSelector={true}
            />
          </div>
        )}
      </div>
      <div className="bottom-0 fixed flex flex-row px-8 py-1 h-[52px] justify-between m-0 bg-[white] left-0 items-center w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
            />
            <div>{t("course.find_course:select_all")}</div>
            <div className="font-semibold">
              {FilterProgramData?.data?.total || 0}
            </div>
          </div>
          <div>|</div>
          <div className="flex flex-row gap-2">
            {t("course.find_course:selected")}{" "}
            {allSelected ? FilterProgramData?.data?.total : rowCount}{" "}
            {t("course.find_course:out_of")}{" "}
            <div className="font-semibold">
              {FilterProgramData?.data?.total || 0}
            </div>{" "}
          </div>
        </div>
        <div>
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex flex-row gap-2 text-[#7677F4] border border-[#7677F4] rounded-xl h-[36px] w-[106px]"
                //if select all is false or row count less than equal to 0 then it should be true
                disabled={allSelected === false || rowCount <= 0}
              >
                {loading ? (
                  <div className="loader !w-[25px]"></div>
                ) : (
                  t("course.find_course:export")
                )}
                <ChevronDownIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="!w-[106px] focus:outline-none">
              <DropdownMenuItem
                onClick={() => {
                  handleExportExcel("excel");
                }}
                className="p-1 focus:outline-none cursor-pointer"
              >
                {t("new_strings:excel")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="p-1  focus:outline-none cursor-pointer"
                onClick={() => {
                  handleExportExcel("CSV");
                }}
              >
                {t("new_strings:csv")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default index;

const HeaderSection = ({ hasAliasNameFalse, setCurrent }: any) => {
  const { AllFilterData, newAdvanceFilterData } = newCourseStore();

  return (
    <Form onSubmit={() => {}} defaultValues={AllFilterData}>
      <div className="w-full flex flex-row justify-between items-center rounded-3xl bg-[#FFFFFF] shadow-md mb-[24px] px-8 py-4 gap-x-[2%]">
        <div className="flex-[0.25]">
          <AdvanceFilter
            hasAliasNameFalse={hasAliasNameFalse}
            setCurrent={setCurrent}
          />
        </div>
        <div className="flex-[1.75]">
          <BasicFilters setCurrent={setCurrent} />
        </div>
      </div>
    </Form>
  );
};

export const DateRangePickerComponent = ({ setOpen, value, onSelect }: any) => {
  const { t } = useTranslation(["common", "new_strings"]);
  return (
    <div className="relative ml-[-12px] mt-[-8px]">
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
              from: undefined,
              to: undefined,
            })
          }
          className="border rounded-xl border-[#7677F4] bg-[white] w-[94px] h-10 text-[#7677F4] font-semibold hover:text-[#5E5FC3] hover:border-solid hover:border hover:border-[1px] hover:border-[#5E5FC3]"
        >
          {t("new_strings:reset_button")}
        </Button>
        <Button
          onClick={() => setOpen(false)}
          className=" w-[94px] h-10 rounded-xl hover:bg-[#5E5FC3]"
        >
          {t("apply_button")}
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

export const CourseTypeComponent = ({ name }: any) => {
  const {
    field: { value, onChange },
  } = useController({
    name: name,
  });
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.course_name",
  });

  const [pageSize, setPageSize] = useState(10);
  const { options, onSearch } = useSelect({
    resource: "program_types",
    optionLabel: "name",
    optionValue: "id",
    //If there is a value which is selected in basic filters it need to be prefilled defaultly
    defaultValue: value && value,
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

  const { t } = useTranslation("common");
  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
        // we are making the course name value empty string  if the course type is changed so that it will show the placeholder in course name  if we change the value in course type downdown
        temporaryOnChange("");
      }}
    >
      <SelectTrigger
        className={`w-full hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]`}
      >
        <SelectValue placeholder={t("select_course_type")} />
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
                {translatedText(option.label)}
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

export const BasicFilters: React.FC<{
  setCurrent: (number: number) => void;
}> = ({ setCurrent }) => {
  const { watch, setValue } = useFormContext();
  const formData = watch();

  const {
    field: { value, onChange },
  } = useController({
    name: "course_id",
  });
  const handleKeyPress = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const {
    field: { value: courseDate, onChange: courseDateOnChange },
  } = useController({
    name: "course_date",
  });

  const { setAllFilterData }: any = newCourseStore();

  const [open, setOpen] = useState(false);

  const handleClearAll = () => {
    setValue("course_id", "");
    setValue("course_date", "");
    setValue("course_type", "");
    setValue("temporaryadvancefilter.course_type", "");
    setValue("temporaryadvancefilter", "");
    setValue("advanceFilter", "");
    setAllFilterData({}); //when clicked on clear button all the data will be reset
  };
  const { t } = useTranslation([
    "common",
    "course.find_course",
    "new_strings",
    "course.participants",
  ]);
  return (
    <div className="flex gap-x-[2%] flex-row items-center justify-between">
      <div className="flex min-w-48 w-[50%] flex-row justify-center items-center border border-[1px] px-2 rounded-xl hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
        <SearchIcon />
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          type="text"
          className="border-none focus:outline-none"
          placeholder={t("course.find_course:search_by_course_id")}
        />
      </div>
      <>
        {" "}
        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            className="w-[50%] h-[40px] flex flex-row items-center justify-start gap-2 rounded-xl hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
            variant="outline"
            onClick={() => {
              setOpen(true);
            }}
          >
            <div>
              <CalenderIcon color="#666666" />
            </div>
            {/* here if there is courseDate.from then only we need to format other wise we can show placeholder */}
            {courseDate && courseDate.from ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-row gap-2 text-[14px]">
                  {/* If the course from date and to date is present then only format and show the from date and to date */}
                  <Text className="font-semibold">
                    {courseDate.from && format(courseDate.from, "MM/dd/yyyy")}
                  </Text>{" "}
                  {courseDate.to && <span>-</span>}{" "}
                  <Text className="font-semibold">
                    {courseDate.to && format(courseDate.to, "MM/dd/yyyy")}
                  </Text>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    //when we click on cross icon we need to clear the date
                    courseDateOnChange(undefined);
                  }}
                  id="cross-icon"
                  className="ml-auto"
                >
                  <CrossIcon fill="#7677F4" height={10} width={10} />
                </div>
              </div>
            ) : (
              <div className="flex gap-2 font-normal text-[#999999]">
                {t("new_strings:select_the_date_range")}
              </div>
            )}
          </Button>
          <DialogContent
            closeIcon={true}
            className="!w-[850px] !h-[470px] bg-[#FFFFFF] !rounded-3xl"
          >
            <DateRangePickerComponent
              setOpen={setOpen}
              value={courseDate}
              onSelect={courseDateOnChange}
            />
          </DialogContent>
        </Dialog>
      </>
      <div className="min-w-[150px] w-[50%]">
        <CourseTypeComponent name="course_type" />
      </div>
      <div className="flex flex-row w-[50%] gap-x-[8px] items-center justify-end">
        <div
          onClick={handleClearAll}
          className="flex min-w-[90px] flex-row gap-2 items-center text-sm font-semibold text-[#7677F4] cursor-pointer"
        >
          <ClearAll />
          <div className="hover:text-[#5E5FC3]">{t("clear_all")}</div>
        </div>
        <Button
          onClick={() => {
            setAllFilterData(formData);
            //whenever we apply filters we will be navigated to page 1
            setCurrent(1);
          }}
          className="h-9 w-18 rounded-xl hover:bg-[#5E5FC3]"
        >
          {t("apply_button")}
        </Button>
      </div>
    </div>
  );
};

const AdvanceFilter = ({ hasAliasNameFalse, setCurrent }: any) => {
  const { setValue, watch } = useFormContext();
  const formData = watch();
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false);
  // preferences : fetched user preferences from db
  // newPreferences : latest user preferences to send to db
  const [preferences, setPreferences] = useState<Preferences>(emptyPreferences);
  const [newPreferences, setNewPreferences] =
    useState<Preferences>(emptyPreferences);
  const supabase = supabaseClient();

  useEffect(() => {
    // whenever the filter sheet is opened, need to do following:
    if (advanceFilterOpen) {
      //  1) set newPreferences as empty [from opened session]
      setNewPreferences(emptyPreferences);
      //  2) load and set the preferences from db
      loadPreferences(supabase).then((loadedPreferences) =>
        setPreferences(loadedPreferences)
      );
    } else {
      // whenever the filter is closed, need to send the newPreferences to db
      savePreferences(supabase, newPreferences);
    }
  }, [advanceFilterOpen]);
  /**
   *This holds the applied filters count in advance filter
   */
  const count =
    (formData?.advanceFilter &&
      Object.keys(formData.advanceFilter).filter((key) =>
        Array.isArray(formData.advanceFilter[key])
          ? formData.advanceFilter[key].length > 0
          : formData.advanceFilter[key] !== undefined &&
            formData.advanceFilter[key] !== ""
      ).length) ||
    0;
  const { t } = useTranslation("course.find_course");
  return (
    <Sheet open={advanceFilterOpen} onOpenChange={setAdvanceFilterOpen}>
      <SheetTrigger className="p-0">
        <Button
          onClick={() => {
            setAdvanceFilterOpen(true);
            setValue("temporaryadvancefilter", formData.advanceFilter);
          }}
          className="flex flex-row gap-2 !rounded-xl hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          variant="outline"
        >
          <FilterIcon />
          {t("course.find_course:all_filters")}
          {count > 0 && <CountComponent count={count} />}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[446px] rounded-l-xl">
        <Filters
          setAdvanceFilterOpen={setAdvanceFilterOpen}
          hasAliasNameFalse={hasAliasNameFalse}
          setCurrent={setCurrent}
          preferences={preferences}
          setNewPreferences={setNewPreferences}
        />
        {/* loaded preferences are sent for displaying and setNewPreferences is sent as a callback to update the latest choices */}
      </SheetContent>
    </Sheet>
  );
};

/*
  loadPreferences
  ================
  fetch the latest user preferences from db
  at present, only fetching at max. top 3 states, cities and centers
*/
const loadPreferences = async (
  supabase: SupabaseClient
): Promise<Preferences> => {
  // accessToken is needed because the /preferences edge function only allows reading our own preferences
  const accessToken = (await supabase.auth.getSession()).data.session
    ?.access_token;

  const { data, error } = await supabase.functions.invoke("preferences", {
    method: "POST",
    body: {
      operation: "get",
      items: [
        { key: "state", maxCount: 3 },
        { key: "city", maxCount: 3 },
        { key: "center", maxCount: 3 },
      ],
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error) {
    console.log("Could not fetch preferences for this user");
  }

  // fetches entity-names for ids (state,city,center...) from db
  const getEntities = async (key: string) => {
    // if something went wrong or data was not available, return []
    if (error || !data[key] || data[key].length === 0) {
      return [];
    }

    // sorting is important to ensure the order because supabase returns in ascending order of ids
    return (
      (
        await supabase.from(key).select("id,name").in("id", data[key])
      ).data?.sort(
        (a, b) => data[key].indexOf(a.id) - data[key].indexOf(b.id)
      ) || []
    );
  };

  return {
    state: await getEntities("state"),
    city: await getEntities("city"),
    center: await getEntities("center"),
  };
};

/*
  savePreferences
  ===============
  - updates the db with latest preferences
  - called whenever the filter sheet is closed
*/
const savePreferences = async (
  supabase: SupabaseClient,
  preferences: Preferences
) => {
  const items = [];
  let key: keyof Preferences;

  // load items to update if there has been any selection
  for (key in preferences) {
    if (preferences[key].length > 0) {
      items.push({ key, value: preferences[key][0].id });
    }
  }

  // if there is nothing to update, return
  if (items.length === 0) return;

  // accessToken is needed because the /preferences edge function only allows updating our own preferences
  const accessToken = (await supabase.auth.getSession()).data.session
    ?.access_token;
  const { error } = await supabase.functions.invoke("preferences", {
    method: "POST",
    body: {
      operation: "set",
      items,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error) {
    console.log("Could not save preferences for this user");
  }
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);
  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
    "course.new_course",
    "course.view_course",
    "new_strings",
    "course.find_course",
    "course.participants",
  ]);
  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...translateProps,
    },
  };
};
