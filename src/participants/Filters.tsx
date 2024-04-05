import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAllIcon from "@public/assets/ClearAllIcon";
import CrossIcon from "@public/assets/CrossIcon";
import { useSelect } from "@refinedev/core";
import { format } from "date-fns";
import { DateRangePickerComponent } from "pages/Courses/FindCourse";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/ui/accordion";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Input } from "src/ui/input";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Separator } from "src/ui/separator";

const Filters = () => {
  const { getValues } = useFormContext();

  const formData = getValues();

  console.log("hey form data", formData);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Filter By</p>
        <CrossIcon width={16} height={16} fill="#333333" />
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
          ]}
        >
          {/* Course Name Accordion */}
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-0 font-semibold pr-3">
              Course Name
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseName />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Status Accordion */}
          <AccordionItem value="item-2" className="border-none ">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex justify-ceneter">
                <div>Course Status</div>
                <div>2</div>
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
              Course Accounting Status
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseAccordingStatus />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Accounting Closure Date  Accordion */}
          <AccordionItem value="item-4" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Course Accounting Closure Date
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseAccountingClosureDate />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Visibility Accordion */}
          <AccordionItem value="item-5" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Course Visibility
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <Visibility />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* State Accordion */}
          <AccordionItem value="item-6" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              State
            </AccordionTrigger>
            <AccordionContent>
              <State />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* City Accordion */}
          <AccordionItem value="item-7" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              City
            </AccordionTrigger>
            <AccordionContent>
              <City />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Center Accordion */}
          <AccordionItem value="item-8" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Center
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <Center />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Residential Course Accordion */}
          <AccordionItem value="item-9" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Residential Course
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <ResidentialCourse />
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Program Organizer Accordion */}
          <AccordionItem value="item-10" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Program Organizer
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Organizer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* {centerData.map((level) => (
                          <SelectItem value={level}>{level}</SelectItem>
                        ))} */}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Teacher Name Accordion */}
          <AccordionItem value="item-11" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Teacher Name
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectGroup>
                        {centerData.map((level) => (
                          <SelectItem value={level}>{level}</SelectItem>
                        ))}
                      </SelectGroup> */}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Fees Accordion */}
          <AccordionItem value="item-12" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Course Fees
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
        <div className="flex gap-1 items-center cursor-pointer">
          <ClearAllIcon />
          <p className="text-primary"> Clear All</p>
        </div>
        <Button>Apply</Button>
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
  const { options, onSearch } = useSelect({
    resource: "program_type_alias_names",
    optionLabel: "alias_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
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
        <SelectItems onBottomReached={() => {}}>
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
  const { options, onSearch } = useSelect({
    resource: "state",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
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
        <SelectItems onBottomReached={() => {}}>
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
  const { options, onSearch } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
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
        <SelectItems onBottomReached={() => {}}>
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
  const { options, onSearch } = useSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
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
        <SelectItems onBottomReached={() => {}}>
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
  const courseStatusData = [
    "Active",
    "Canceled",
    "Full",
    "Completed",
    "Pending Review",
    "Declined",
  ];

  const {
    field: { value = [], onChange },
  } = useController({
    name: "course_status",
  });

  const toggleCourseStatus = (index: number) => {
    const updatedValue = value.includes(index)
      ? value.filter((val: number) => val !== index)
      : [...value, index];
    onChange(updatedValue);
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {courseStatusData.map((status, index) => (
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
          {value?.from ? (
            value?.to ? (
              <>
                {format(value.from, "dd MMM, yyyy")} -{" "}
                {format(value.to, "dd MMM, yyyy")}
              </>
            ) : (
              format(value.from, "dd MMM, yyyy")
            )
          ) : (
            <div className="flex gap-2 font-normal">
              <CalenderIcon />
              Select the Date Range
            </div>
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
  return (
    <div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="Public"
            selectedRadioValue={value}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="Private"
            selectedRadioValue={value}
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
    name: "residential_course",
  });

  return (
    <div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="Yes"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="No"
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
    name: "course_fee",
  });

  return (
    <div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="Default fee"
            selectedRadioValue={value}
            label="Default fee"
            className="p-2 h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="Custom Fee"
            selectedRadioValue={value}
            label="Custom Fee"
            className="p-2 h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};
