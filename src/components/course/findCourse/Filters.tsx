import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAllIcon from "@public/assets/ClearAllIcon";
import CrossIcon from "@public/assets/CrossIcon";
import { useSelect } from "@refinedev/core";
import { format } from "date-fns";
import {
  CountComponent,
  CourseTypeComponent,
  DateRangePickerComponent,
} from "pages/courses/list";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { translatedText } from "src/common/translations";
import {
  COURSE_ACCOUNTING_STATUS,
  PROGRAM_STATUS,
  VISIBILITY,
} from "src/constants/OptionLabels";
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
import { newCourseStore } from "src/zustandStore/NewCourseStore";

const Filters = ({
  setAdvanceFilterOpen,
  hasAliasNameFalse,
  setCurrent,
}: any) => {
  console.log(hasAliasNameFalse, "FalseAliasNamefilter");

  const { watch, setValue } = useFormContext();

  const formData = watch();

  const { setAllFilterData } = newCourseStore();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Filter By</p>
        <div
          onClick={() => {
            setAdvanceFilterOpen(false);
          }}
        >
          <div className="cursor-pointer">
          <CrossIcon width={16} height={16} fill="#333333" />
          </div>
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
          {!hasAliasNameFalse && (
            <>
              <AccordionItem value="item-14" className="border-none">
                <AccordionTrigger className="text-base font-semibold pr-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div>Course Type</div>
                    {formData?.temporaryadvancefilter.course_type && (
                      <CountComponent count={1} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-3">
                  <CourseTypeComponent name="temporaryadvancefilter.course_type" />
                </AccordionContent>
              </AccordionItem>
              <Separator />
            </>
          )}
          {/* Course Name Accordion */}
          {!hasAliasNameFalse && (
            <>
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-base font-semibold pr-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div>Course Name</div>
                    {formData?.temporaryadvancefilter.course_name && (
                      <CountComponent count={1} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-3">
                  <CourseName />
                </AccordionContent>
              </AccordionItem>
              <Separator />
            </>
          )}
          {/* Course Status Accordion */}
          <AccordionItem value="item-2" className="border-none ">
            <AccordionTrigger className="text-base font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>Course Status</div>
                {formData?.temporaryadvancefilter.course_status?.length > 0 && (
                  <CountComponent
                    count={
                      formData?.temporaryadvancefilter.course_status?.length
                    }
                  />
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
                {formData?.temporaryadvancefilter.course_accounting_status
                  ?.length > 0 && (
                  <CountComponent
                    count={
                      formData?.temporaryadvancefilter.course_accounting_status
                        ?.length
                    }
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
                {formData?.temporaryadvancefilter
                  .course_accounting_closure_date && (
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
                {formData?.temporaryadvancefilter.visibility && (
                  <CountComponent count={1} />
                )}
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
                {formData?.temporaryadvancefilter.state && (
                  <CountComponent count={1} />
                )}
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
                {formData?.temporaryadvancefilter.city && (
                  <CountComponent count={1} />
                )}
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
                {formData?.temporaryadvancefilter.center && (
                  <CountComponent count={1} />
                )}
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
                {formData?.temporaryadvancefilter.is_residential_course && (
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
                <div>Program Organiser</div>
                {formData?.temporaryadvancefilter.program_organiser?.length >
                  0 && (
                  <CountComponent
                    count={
                      formData?.temporaryadvancefilter.program_organiser?.length
                    }
                  />
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
                {formData?.temporaryadvancefilter.course_teacher && (
                  <CountComponent count={1} />
                )}
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
                {formData?.temporaryadvancefilter.is_course_fee && (
                  <CountComponent count={1} />
                )}
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
            setValue("temporaryadvancefilter.course_name", "");
            setValue("temporaryadvancefilter.course_type", "");
            setValue("temporaryadvancefilter.course_status", []);
            setValue("temporaryadvancefilter.course_accounting_status", []);
            setValue(
              "temporaryadvancefilter.course_accounting_closure_date",
              ""
            );
            setValue("temporaryadvancefilter.state", "");
            setValue("temporaryadvancefilter.city", "");
            setValue("temporaryadvancefilter.center", "");
            setValue("temporaryadvancefilter.visibility", "");
            setValue("temporaryadvancefilter.is_residential_course", "");
            setValue("temporaryadvancefilter.is_course_fee", "");
            setValue("temporaryadvancefilter.course_teacher", "");
            setValue("temporaryadvancefilter.program_organiser", []);
            //we need to empty the course type in basic filters also because the filter applies when we clear all in advance filter
            setValue("course_type", "");
            setAllFilterData({ advanceFilter: {} });
            setValue("advanceFilter", {}); //clearing all the advancefilter form Data
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <ClearAllIcon />
          <p className="text-primary hover:text-[#5E5FC3]">Clear All</p>
        </div>
        <Button
        className="hover:bg-[#5E5FC3]"
          onClick={() => {
            const temporaryData = { ...formData };

            setValue("advanceFilter", temporaryData?.temporaryadvancefilter);
            setValue(
              "course_type",
              temporaryData?.temporaryadvancefilter.course_type
            );
            setAllFilterData({
              ...formData,
              advanceFilter: temporaryData?.temporaryadvancefilter,
            });
            setAdvanceFilterOpen(false);
            //whenever we apply filters we will be navigated to page 1
            setCurrent(1);
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
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.course_name",
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
        field: "alias_name",
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
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
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

export const State = () => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.state",
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
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
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
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.city",
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
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
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
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.center",
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
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
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
  const { getValues } = useFormContext();

  let courseStatusData =
    getOptionValuesByOptionLabel(PROGRAM_STATUS)?.[0]?.option_values;

  const {
    field: { value: temporaryValue = [], onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.course_status",
  });

  const formData = getValues();

  console.log("heyy value", temporaryValue, formData);

  const toggleCourseStatus = (id: number) => {
    const updatedValue = temporaryValue?.includes(id)
      ? temporaryValue?.filter((val: number) => val !== id)
      : [...temporaryValue, id];
    temporaryOnChange(updatedValue);
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {courseStatusData?.map((status: any, index: number) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              temporaryValue?.includes(status?.id)
                ? "bg-primary text-white  hover:bg-[#5E5FC3]"
                : "bg-white border border-[#D6D7D8] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
            }`}
            variant="outline"
            onClick={() => toggleCourseStatus(status?.id)}
          >
            {translatedText(status?.name)}
          </Button>
        </div>
      ))}
    </div>
  );
};

export const CourseAccordingStatus = () => {
  const courseAccountingStatusData = getOptionValuesByOptionLabel(
    COURSE_ACCOUNTING_STATUS
  )?.[0]?.option_values;

  const {
    field: { value: temporaryValue = [], onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.course_accounting_status",
  });

  const toggleCourseStatus = (id: number) => {
    const updatedValue = temporaryValue?.includes(id)
      ? temporaryValue?.filter((val: number) => val !== id)
      : [...temporaryValue, id];
    temporaryOnChange(updatedValue);
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {courseAccountingStatusData?.map((status: any, index: any) => (
        <div key={index}>
          <Button
            className={`rounded-full h-[28px] text-sm font-normal ${
              temporaryValue?.includes(status?.id)
                ? "bg-primary text-white hover:bg-[#5E5FC3]"
                : "bg-white border border-[#D6D7D8] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
            }`}
            variant="outline"
            onClick={() => toggleCourseStatus(status?.id)}
          >
            {translatedText(status?.name)}
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
    name: "temporaryadvancefilter.course_accounting_closure_date",
  });
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open}>
      <p>Date Range</p>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="w-full gap-2 justify-start mt-2 hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
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
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.visibility",
  });

  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;

  const privateVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PRIVATE
  )?.id;

  return (
    <div>
      <RadioGroup
        value={JSON.stringify(temporaryValue)}
        onValueChange={(val: string) => {
          temporaryOnChange(parseInt(val));
        }}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value={JSON.stringify(publicVisibilityId)}
            selectedRadioValue={JSON.stringify(temporaryValue)}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
          <RadioButtonCard
            value={JSON.stringify(privateVisibilityId)}
            selectedRadioValue={JSON.stringify(temporaryValue)}
            label="Private"
            className="w-[112px] h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const ResidentialCourse = () => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.is_residential_course",
  });

  return (
    <div>
      <RadioGroup value={temporaryValue} onValueChange={temporaryOnChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="TRUE"
            selectedRadioValue={temporaryValue}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
          <RadioButtonCard
            value="FALSE"
            selectedRadioValue={temporaryValue}
            label="No"
            className="w-[112px] h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const CourseFees = () => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.is_course_fee",
  });

  return (
    <div>
      <RadioGroup value={temporaryValue} onValueChange={temporaryOnChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="TRUE"
            selectedRadioValue={temporaryValue}
            label="Default"
            className="p-2 h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
          <RadioButtonCard
            value="FALSE"
            selectedRadioValue={temporaryValue}
            label="Custom"
            className="p-2 h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const ProgramOrganiser = () => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.program_organiser",
  });

  const [pageSize, setPageSize] = useState(20);

  const { options, queryResult, onSearch } = useSelect({
    resource: "users",
    meta: {
      select: "*,contact_id!inner(full_name),user_roles!inner(role_id)",
    },
    optionLabel: "contact_id.full_name",
    optionValue: "id",
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
  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize)
      setPageSize((previousLimit: number) => previousLimit + 20);
  };

  return (
    <MultiSelect
      value={temporaryValue}
      placeholder="Select Program Organiser"
      data={options}
      onBottomReached={handleOnBottomReached}
      onSearch={(val: string) => {
        onSearch(val);
      }}
      onChange={temporaryOnChange}
      variant="basic"
      selectBoxStyles={{header: 'border-[1px] rounded-[12px] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]'}}
    />
  );
};

export const TeacherDropdown = () => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.course_teacher",
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
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80 hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
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
