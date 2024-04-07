import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAllIcon from "@public/assets/ClearAllIcon";
import CrossIcon from "@public/assets/CrossIcon";
import { useSelect } from "@refinedev/core";
import { format } from "date-fns";
import {
  CountComponent,
  CourseTypeComponent,
  DateRangePickerComponent,
} from "pages/Courses/FindCourse";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { PROGRAM_STATUS, VISIBILITY } from "src/constants/OptionLabels";
import { PRIVATE, PUBLIC } from "src/constants/OptionValueOrder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/ui/accordion";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Input } from "src/ui/input";
import { MultiSelect } from "src/ui/multi-select";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Separator } from "src/ui/separator";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";

const Filters = ({
  setNewAdvanceFilterData,
  setAdvanceFilterOpen,
  setAllFilterData,
}: any) => {
  const { getValues, reset } = useFormContext();

  const formData = getValues();

  console.log("hey form data", formData);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Filter By</p>
        <div
          onClick={() => {
            setAdvanceFilterOpen(false);
          }}
        >
          <CrossIcon width={16} height={16} fill="#333333" />
        </div>
      </div>
      <Separator />
      <div className="max-h-[75vh] overflow-y-auto scrollbar">
        <Accordion
          type="multiple"
          defaultValue={[
            "item-1",
            "item-2",
            "item-3",
            "item-4",
            "item-5",
            "item-6",
            "item-7",
            "item-8",
            "item-9",
            "item-10",
            "item-11",
            "item-12",
            "item-13",
            "item-14",
          ]}
        >
          {/* Course Name Accordion */}
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-base font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Name</div>
                {formData?.course_name && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseName />
            </AccordionContent>
          </AccordionItem>
          <Separator />
          <AccordionItem value="item-14" className="border-none">
            <AccordionTrigger className="text-base font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Type</div>
                {formData?.course_type && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseTypeComponent />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Status Accordion */}
          <AccordionItem value="item-2" className="border-none ">
            <AccordionTrigger className="text-base font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Status</div>
                {formData?.course_status && (
                  <CountComponent count={formData?.course_status?.length} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseStatus />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Accounting Status Accordion */}
          <AccordionItem value="item-3" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Accounting Status</div>
                {formData?.course_accounting_status && (
                  <CountComponent
                    count={formData?.course_Accounting_status?.length}
                  />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseAccordingStatus />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Accounting Closure Date  Accordion */}
          <AccordionItem value="item-4" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Accounting Closure Date</div>
                {formData?.course_accounting_closure_date && (
                  <CountComponent count={1} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseAccountingClosureDate />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Visibility Accordion */}
          <AccordionItem value="item-5" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div> Course Visibility</div>
                {formData?.visibility && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <Visibility />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* State Accordion */}
          <AccordionItem value="item-6" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>State</div>
                {formData?.state && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <State />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* City Accordion */}
          <AccordionItem value="item-7" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>City</div>
                {formData?.city && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <City />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Center Accordion */}
          <AccordionItem value="item-8" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Center</div>
                {formData?.center && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <Center />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Residential Course Accordion */}
          <AccordionItem value="item-9" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Residential Course</div>
                {formData?.is_residential_course && (
                  <CountComponent count={1} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <ResidentialCourse />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Program Organizer Accordion */}
          <AccordionItem value="item-10" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Program_organiser</div>
                {formData?.Program_organiser && (
                  <CountComponent count={formData?.Program_organiser?.length} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <ProgramOrganiser />
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Teacher Name Accordion */}
          <AccordionItem value="item-11" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Teacher Name</div>
                {formData?.course_teacher && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <TeacherDropdown />
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Fees Accordion */}
          <AccordionItem value="item-12" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Fees</div>
                {formData?.is_course_fee && <CountComponent count={1} />}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseFees />
            </AccordionContent>
          </AccordionItem>

          <Separator />

          {/* Reconciliation Status Accordion */}
          <AccordionItem value="item-13" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Reconciliation Status
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3"></AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex left-0 items-center  gap-4 absolute bottom-0 h-[67px] w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] justify-end pr-6">
        <div
          onClick={() => {
            reset();
            setNewAdvanceFilterData(undefined);
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <ClearAllIcon />
          <p className="text-primary"> Clear All</p>
        </div>
        <Button
          onClick={() => {
            setNewAdvanceFilterData(formData);
            setAdvanceFilterOpen(false);
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default Filters;

export const CourseName = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "course_name",
  });

  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch } = useSelect({
    resource: "program_type_alias_names",
    optionLabel: "alias_name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select Course Name" />
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

export const State = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "state",
  });

  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch } = useSelect({
    resource: "state",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select State " />
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

export const City = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "city",
  });

  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select City " />
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

export const Center = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "center",
  });
  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch } = useSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select Center " />
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

export const CourseStatus = () => {
  let courseStatusData =
    getOptionValuesByOptionLabel(PROGRAM_STATUS)?.[0]?.option_values;

  const {
    field: { value = [], onChange },
  } = useController({
    name: "course_status",
  });

  const toggleCourseStatus = (id: number) => {
    const updatedValue = value.includes(id)
      ? value.filter((val: number) => val !== id)
      : [...value, id];
    onChange(updatedValue);
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {courseStatusData?.map((status: any, index: number) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              value?.includes(status?.id)
                ? "bg-primary text-white"
                : "bg-white border border-[#D6D7D8]"
            }`}
            variant="outline"
            onClick={() => toggleCourseStatus(status?.id)}
          >
            {status?.value}
          </Button>
        </div>
      ))}
    </div>
  );
};

export const CourseAccordingStatus = () => {
  const courseAccountingStatusData = [
    "Not Submitted",
    "Rejected",
    "Closed",
    "Pending Review",
  ];

  const {
    field: { value = [], onChange },
  } = useController({
    name: "course_accounting_status",
  });

  const toggleCourseStatus = (index: number) => {
    const updatedValue = value.includes(index)
      ? value.filter((val: number) => val !== index)
      : [...value, index];
    onChange(updatedValue);
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {courseAccountingStatusData.map((status, index) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              value?.includes(index)
                ? "bg-primary text-white"
                : "bg-white border border-[#D6D7D8]"
            }`}
            variant="outline"
            onClick={() => toggleCourseStatus(index)}
          >
            {status}
          </Button>
        </div>
      ))}
    </div>
  );
};

export const CourseAccountingClosureDate = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "course_accounting_closure_date",
  });
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open}>
      <p>Date Range</p>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="w-full gap-2 justify-start mt-2"
          variant="outline"
        >
          <CalenderIcon color="#666666" />

          {value?.from ? (
            value?.to ? (
              <>
                {format(value.from, "MM/dd/yyyy")} -{" "}
                {format(value.to, "MM/dd/yyyy")}
              </>
            ) : (
              format(value.from, "MM/dd/yyyy")
            )
          ) : (
            <div className="flex gap-2 font-normal">Select the Date Range</div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
        <DateRangePickerComponent
          setOpen={setOpen}
          value={value}
          onSelect={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export const Visibility = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "visibility",
  });

  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;

  const privateVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PRIVATE
  )?.id;

  console.log("heyy ids", value);

  return (
    <div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(val: string) => {
          onChange(parseInt(val));
        }}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value={JSON.stringify(publicVisibilityId)}
            selectedRadioValue={JSON.stringify(value)}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value={JSON.stringify(privateVisibilityId)}
            selectedRadioValue={JSON.stringify(value)}
            label="Private"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const ResidentialCourse = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "is_residential_course",
  });

  return (
    <div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="TRUE"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="FALSE"
            selectedRadioValue={value}
            label="No"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const CourseFees = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "is_course_fee",
  });

  return (
    <div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="FALSE"
            selectedRadioValue={value}
            label="Default"
            className="p-2 h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="TRUE"
            selectedRadioValue={value}
            label="Custom"
            className="p-2 h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const ProgramOrganiser = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "program_organiser",
  });

  const [pageSize, setPageSize] = useState(20);

  const { queryResult, onSearch } = useSelect({
    resource: "users",
    meta: {
      select:
        "*,contact_id!inner(first_name,last_name),user_roles!inner(role_id)",
    },
    defaultValue: value,
    onSearch: (value) => [
      {
        field: "contact_id.first_name",
        operator: "contains",
        value,
      },
      {
        field: "contact_id.last_name",
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
    setPageSize((previousLimit: number) => previousLimit + 20);
  };

  const options: any =
    queryResult?.data?.data?.map((item) => {
      return {
        label: item?.contact_id?.first_name + " " + item?.contact_id?.last_name,
        value: item.id,
      };
    }) ?? [];

  return (
    <MultiSelect
      value={value}
      placeholder="Select Program Organiser"
      data={options}
      onBottomReached={handleOnBottomReached}
      onSearch={(val: string) => {
        onSearch(val);
      }}
      onChange={onChange}
    />
  );
};

export const TeacherDropdown = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "course_teacher",
  });

  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch, queryResult } = useSelect({
    resource: "users",
    meta: {
      select:
        "*,program_type_teachers!inner(program_type_id),contact_id!inner(first_name,last_name))",
    },
    onSearch: (value) => [
      {
        field: "contact_id.full_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });

  const teachers: any = queryResult.data?.data?.map((val) => {
    return {
      label: val?.contact_id?.first_name + " " + val?.contact_id?.last_name,
      value: val?.id,
    };
  });

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };

  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select Teacher" />
      </SelectTrigger>
      <SelectContent>
        <Input onChange={(val) => onSearch(val.target.value)} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {teachers?.map((option: any, index: number) => (
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
