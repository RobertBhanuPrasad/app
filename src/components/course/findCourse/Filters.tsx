import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAllIcon from "@public/assets/ClearAllIcon";
import CrossIcon from "@public/assets/CrossIcon";
import { CrudFilter, useList, useSelect } from "@refinedev/core";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";
import { CountComponent, DateRangePickerComponent } from "pages/courses/list";
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
  SelectInput,
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
import useGetCountryCode from "src/utility/useGetCountryCode";
import { useMVPSelect } from "src/utility/useMVPSelect";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

// Entity implies City,Center,State,...
export type Entity = {
  name: string;
  id: number;
};

// Preferences are a collection of different entities which need to be saved in db
export type Preferences = {
  state: Entity[];
  city: Entity[];
  center: Entity[];
};

// emptyPreferences to use where needed
export const emptyPreferences: Preferences = {
  state: [],
  city: [],
  center: [],
};

// All Entity-Specific Components like <State>, <Center>, <City> need these props
interface EntityProps {
  // setSelectedEntity is to set the selected entity in suggested-chips
  setSelectedEntity: React.Dispatch<React.SetStateAction<number>>;
  // setNewPreferences is for updating the parent newPreferences state variable which will be used to update DB on Filter Sheet close
  setNewPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

interface FiltersProps {
  setAdvanceFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasAliasNameFalse: boolean;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  // preferences is to show the loaded preferences from DB
  preferences: Preferences;
  // setNewPreferences is for updating the chosen preferences
  setNewPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

const ITEM_CHOSEN_FROM_DROPDOWN = -2,
  NOTHING_CHOSEN_YET = -1;

const Filters = ({
  setAdvanceFilterOpen,
  hasAliasNameFalse,
  setCurrent,
  preferences,
  setNewPreferences,
}: FiltersProps) => {
  console.log(hasAliasNameFalse, "FalseAliasNamefilter");

  const { watch, setValue } = useFormContext();
  const formData = watch();

  // selectedEntities are present to decide if any suggested-chip is chosen
  const [selectedState, setSelectedState] = useState(
    formData?.temporaryadvancefilter?.state
      ? ITEM_CHOSEN_FROM_DROPDOWN
      : NOTHING_CHOSEN_YET
  );
  const [selectedCenter, setSelectedCenter] = useState(
    formData?.temporaryadvancefilter?.center
      ? ITEM_CHOSEN_FROM_DROPDOWN
      : NOTHING_CHOSEN_YET
  );
  const [selectedCity, setSelectedCity] = useState(
    formData?.temporaryadvancefilter?.city
      ? ITEM_CHOSEN_FROM_DROPDOWN
      : NOTHING_CHOSEN_YET
  );

  const { setAllFilterData, AllFilterData } = newCourseStore();
  const { t } = useTranslation(["common", "course.find_course", "new_strings"]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">
          {t("course.find_course:filter_by")}
        </p>
        <div
          onClick={() => {
            setAdvanceFilterOpen(false);
          }}
          className="cursor-pointer"
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
          {/* TODO  : for now may-13 release it has to be hidden */}
          {/* Course Type Accordion */}
          {/* {!hasAliasNameFalse && (
            <>
              <AccordionItem value="item-14" className="border-none">
                <AccordionTrigger className="text-base font-semibold pr-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div>{t("course_type")}</div>
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
          )} */}

          {/* TODO  : for now may-13 release it has to be hidden */}
          {/* Course Name Accordion */}
          {/* {!hasAliasNameFalse && (
            <>
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-base font-semibold pr-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div>{t("new_strings:course_name")}</div>
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
          )} */}
          {/* Course Status Accordion */}
          <AccordionItem value="item-2" className="border-none ">
            <AccordionTrigger className="text-lg font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("course.find_course:course_status")}</div>
                {formData?.temporaryadvancefilter?.course_status?.length >
                  0 && (
                  <CountComponent
                    count={
                      formData?.temporaryadvancefilter?.course_status?.length
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

          {/* TODO  : for now may-13 release it has to be hidden */}
          {/* Course Accounting Status Accordion */}
          {/* <AccordionItem value="item-3" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("course_accounting_status")}</div>
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
          <Separator /> */}

          {/* TODO  : for now may-13 release it has to be hidden */}
          {/* Course Accounting Closure Date  Accordion */}
          {/* <AccordionItem value="item-4" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>
                  {t("course.find_course:course_accounting_closure_date")}{" "}
                </div>
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
          <Separator /> */}

          {/* Course Visibility Accordion */}
          <AccordionItem value="item-5" className="border-none">
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div> {t("course.find_course:course_visibility")}</div>
                {formData?.temporaryadvancefilter?.visibility && (
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
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("course.find_course:state")}</div>
                {formData?.temporaryadvancefilter?.state && (
                  <CountComponent count={1} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <State
                setSelectedEntity={setSelectedState}
                setNewPreferences={setNewPreferences}
              />
              {/* suggestion chips fetched from DB are displayed here */}
              {/* if item is already chosen from dropdown, don't display suggestions */}
              {selectedState !== ITEM_CHOSEN_FROM_DROPDOWN &&
                preferences.state.map(({ id, name }) => (
                  <Button
                    className={`rounded-full h-[28px] text-sm font-normal mt-2 mr-2 ${
                      selectedState === id
                        ? "bg-primary text-white  hover:bg-[#5E5FC3]"
                        : "bg-white border border-[#D6D7D8] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
                    }`}
                    variant="outline"
                    onClick={() => {
                      setSelectedState(id);
                      // update the form field to choose the same item in dropdown
                      setValue("temporaryadvancefilter.state", id);
                      // update the newPreferences to send to db later
                      setNewPreferences((oldPreferences) => ({
                        ...oldPreferences,
                        state: [{ id, name }],
                      }));
                    }}
                  >
                    {name}
                  </Button>
                ))}
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* City Accordion */}
          <AccordionItem value="item-7" className="border-none">
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("city")}</div>
                {formData?.temporaryadvancefilter?.city && (
                  <CountComponent count={1} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <City
                setSelectedEntity={setSelectedCity}
                setNewPreferences={setNewPreferences}
              />
              {/* suggestion chips fetched from DB are displayed here */}
              {/* if item is already chosen from dropdown, don't display suggestions */}
              {selectedCity !== ITEM_CHOSEN_FROM_DROPDOWN &&
                preferences.city.map(({ id, name }) => (
                  <Button
                    className={`rounded-full h-[28px] text-sm font-normal mt-2 mr-2 ${
                      selectedCity === id
                        ? "bg-primary text-white  hover:bg-[#5E5FC3]"
                        : "bg-white border border-[#D6D7D8] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
                    }`}
                    variant="outline"
                    onClick={() => {
                      setSelectedCity(id);
                      // update the form field to choose the same item in dropdown
                      setValue("temporaryadvancefilter.city", id);
                      // update the newPreferences to send to db later
                      setNewPreferences((oldPreferences) => ({
                        ...oldPreferences,
                        city: [{ id, name }],
                      }));
                    }}
                  >
                    {name}
                  </Button>
                ))}
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Center Accordion */}
          <AccordionItem value="item-8" className="border-none">
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("course.find_course:center")}</div>
                {formData?.temporaryadvancefilter?.center && (
                  <CountComponent count={1} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <Center
                setSelectedEntity={setSelectedCenter}
                setNewPreferences={setNewPreferences}
              />
              {/* suggestion chips fetched from DB are displayed here */}
              {/* if item is already chosen from dropdown, don't display suggestions */}
              {selectedCenter !== ITEM_CHOSEN_FROM_DROPDOWN &&
                preferences.center.map(({ id, name }) => (
                  <Button
                    className={`rounded-full h-[28px] text-sm font-normal mt-2 mr-2 ${
                      selectedCenter === id
                        ? "bg-primary text-white  hover:bg-[#5E5FC3]"
                        : "bg-white border border-[#D6D7D8] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
                    }`}
                    variant="outline"
                    onClick={() => {
                      setSelectedCenter(id);
                      // update the form field to choose the same item in dropdown
                      setValue("temporaryadvancefilter.center", id);
                      // update the newPreferences to send to db later
                      setNewPreferences((oldPreferences) => ({
                        ...oldPreferences,
                        center: [{ id, name }],
                      }));
                    }}
                  >
                    {name}
                  </Button>
                ))}
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Residential Course Accordion */}
          <AccordionItem value="item-9" className=" border-none">
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("residential_course")}</div>
                {formData?.temporaryadvancefilter?.is_residential_course && (
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
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("program_organizer")}</div>
                {formData?.temporaryadvancefilter?.program_organiser?.length >
                  0 && (
                  <CountComponent
                    count={
                      formData?.temporaryadvancefilter?.program_organiser
                        ?.length
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
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("course.find_course:teacher_name")}</div>
                {formData?.temporaryadvancefilter?.course_teacher && (
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
            <AccordionTrigger className="text-lg pb-4 pt-5 font-semibold pr-3">
              <div className="flex flex-row gap-2 items-center">
                <div>{t("new_strings:course_fees")}</div>
                {formData?.temporaryadvancefilter?.is_course_fee && (
                  <CountComponent count={1} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <CourseFees />
            </AccordionContent>
          </AccordionItem>

          <Separator />

          {/* TODO  : for now may-13 release it has to be hidden */}
          {/* Reconciliation Status Accordion */}
          {/* <AccordionItem value="item-13" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              {t("course.find_course:reconciliation_status")}
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3"></AccordionContent>
          </AccordionItem> */}
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
            setSelectedState(-1);
            setValue("temporaryadvancefilter.city", "");
            setSelectedCity(-1);
            setValue("temporaryadvancefilter.center", "");
            setSelectedCenter(-1);
            setValue("temporaryadvancefilter.visibility", "");
            setValue("temporaryadvancefilter.is_residential_course", "");
            setValue("temporaryadvancefilter.is_course_fee", "");
            setValue("temporaryadvancefilter.course_teacher", "");
            setValue("temporaryadvancefilter.program_organiser", []);
            //Here we need to clear only the advance filter data
            setAllFilterData({
              ...AllFilterData,
              advanceFilter: {},
            });
            setValue("advanceFilter", {}); //clearing all the advancefilter form Data
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <ClearAllIcon />
          <p className="text-primary hover:text-[#5E5FC3] text-sm font-semibold">{t("clear_all")}</p>
        </div>
        <Button
          className="hover:bg-[#5E5FC3]"
          onClick={() => {
            const temporaryData = { ...formData };

            setValue("advanceFilter", temporaryData?.temporaryadvancefilter);
            setAllFilterData({
              ...formData,
              advanceFilter: temporaryData?.temporaryadvancefilter,
            });
            setAdvanceFilterOpen(false);
            //whenever we apply filters we will be navigated to page 1
            setCurrent(1);
          }}
        >
          {t("apply_button")}
        </Button>
      </div>
    </div>
  );
};

export default Filters;

export const CourseName = () => {
  const { watch } = useFormContext();
  const formdata = watch();

  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.course_name",
  });

  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch } = useMVPSelect({
    resource: "program_type_alias_names",
    optionLabel: "alias_name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value : any) => [
      {
        field: "alias_name",
        operator: "contains",
        value,
      },
    ],
    // requirement: we need to show the course_alias_name to the selected course type only in the course_type dropdown
    // for the MVP-1195
    filters: [
      {
        field: "program_type_id",
        operator: "eq",
        value: formdata?.temporaryadvancefilter?.course_type,
      },
    ],
  });
  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  const { t } = useTranslation("new_strings");
  return (
    <Select
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
        <SelectValue placeholder={t("select_course_name")} />
      </SelectTrigger>
      <SelectContent>
        <Input onChange={(val) => onSearch(val.target.value)} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options?.map((option: any, index: number) => (
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

export const State = ({
  setSelectedEntity,
  setNewPreferences,
}: EntityProps) => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.state",
  });

  const [pageSize, setPageSize] = useState(10);
  
  /**
   * Getting country code from route using useGetCountryCode function
   */
  const countryCode = useGetCountryCode();

  /**
   * Getting country data based on country code
   */
  const { data } = useList<any>({
    resource: "country",
    filters: [
      {
        field: "abbr",
        operator: "contains",
        value: countryCode,
      },
    ],
  });

  
  let filter: Array<CrudFilter> = [];

  //If the country code is public then dont make the filter for country
  if (countryCode !== "public") {
    filter.push({
      field: "country_id",
      operator: "eq",
      value: data?.data?.[0]?.id,
    });
  }

  const { options, onSearch } = useMVPSelect({
    resource: "state",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    filters:filter,
    onSearch: (value : any) => [
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
  const { t } = useTranslation("common");
  return (
    <Select
      value={temporaryValue}
      onValueChange={(val: any) => {
        // updated to make corresponding suggestion-chips disappear
        setSelectedEntity(ITEM_CHOSEN_FROM_DROPDOWN);
        // update newPreferences to send to db later
        setNewPreferences((oldPreferences) => ({
          ...oldPreferences,
          state: [{ id: val, name: "dummyname" }],
        }));
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
        <SelectValue placeholder={t("select_state")} />
      </SelectTrigger>
      <SelectContent>
        <Input onChange={(val) => onSearch(val.target.value)} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options?.map((option: any, index: number) => (
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

export const City = ({ setSelectedEntity, setNewPreferences }: EntityProps) => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.city",
  });

  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // track whether the city drop down is clicked or not
  const [citySelectClicked, setCitySelectClicked] = useState(false)

  const { watch } = useFormContext();

  const formData = watch();
  
  // fetch all the cities from the city table 
  const { options, onSearch } = useMVPSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value : any) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    defaultValue : temporaryValue
  });
  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  const { t } = useTranslation("common");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  return (
    <Select
      value={temporaryValue}
      onValueChange={(val: any) => {
        // updated to make corresponding suggestion-chips disappear
        setSelectedEntity(ITEM_CHOSEN_FROM_DROPDOWN);
        // update newPreferences to send to db later
        setNewPreferences((oldPreferences) => ({
          ...oldPreferences,
          city: [{ id: val, name: "dummyname" }],
        }));
        temporaryOnChange(val);
      }}
      onOpenChange={()=>setCitySelectClicked(true)}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
        <SelectValue placeholder={t("city_placeholder")} />
      </SelectTrigger>
      <SelectContent>
      <SelectInput value={searchTerm} onChange={handleSearchChange} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options?.map((option: any, index: number) => (
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

export const Center = ({
  setSelectedEntity,
  setNewPreferences,
}: EntityProps) => {
  const {
    field: { value: temporaryValue, onChange: temporaryOnChange },
  } = useController({
    name: "temporaryadvancefilter.center",
  });
  const [pageSize, setPageSize] = useState(10);

  // track whether the center drop down is clicked or not
  const [centerSelectClicked, setCenterSelectClicked] = useState(false)

  const { watch } = useFormContext();
  const formData = watch();

  //fetch all the centers from the center table
  const { options, onSearch } = useMVPSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    onSearch: (value : any) => [
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
  const { t } = useTranslation("new_strings");
  return (
    <Select
      value={temporaryValue}
      onValueChange={(val: any) => {
        // updated to make corresponding suggestion-chips disappear
        setSelectedEntity(ITEM_CHOSEN_FROM_DROPDOWN);
        // update newPreferences to send to db later
        setNewPreferences((oldPreferences) => ({
          ...oldPreferences,
          center: [{ id: val, name: "dummyname" }],
        }));
        temporaryOnChange(val);
      }}
      onOpenChange={()=>setCenterSelectClicked(true)}
    >
      <SelectTrigger className="w-80  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
        <SelectValue placeholder={t("select_center")} />
      </SelectTrigger>
      <SelectContent>
        <Input onChange={(val) => onSearch(val.target.value)} />
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options?.map((option: any, index: number) => (
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
  const { t } = useTranslation(["course.find_course", "new_strings"]);
  return (
    <Dialog open={open}>
      <p>{t("date_range")}</p>
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
            <div className="flex gap-2 font-normal">
              {t("new_strings:select_the_date_range")}
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

  const { t } = useTranslation("common");

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
            label={t("public")}
            className="w-[112px] h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
          <RadioButtonCard
            value={JSON.stringify(privateVisibilityId)}
            selectedRadioValue={JSON.stringify(temporaryValue)}
            label={t("private")}
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
  const { t } = useTranslation("common");
  return (
    <div>
      <RadioGroup value={temporaryValue} onValueChange={temporaryOnChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="TRUE"
            selectedRadioValue={temporaryValue}
            label={t("yes")}
            className="w-[112px] h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
          <RadioButtonCard
            value="FALSE"
            selectedRadioValue={temporaryValue}
            label={t("no_button")}
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
  const { t } = useTranslation("new_strings");
  return (
    <div>
      <RadioGroup value={temporaryValue} onValueChange={temporaryOnChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="TRUE"
            selectedRadioValue={temporaryValue}
            label={t("default")}
            className="p-2 h-[40px] rounded-[12px]  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
          />
          <RadioButtonCard
            value="FALSE"
            selectedRadioValue={temporaryValue}
            label={t("custom")}
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

  const { options, queryResult, onSearch } = useMVPSelect({
    resource: "users",
    meta: {
      select: "*,contact_id!inner(full_name),user_roles!inner(role_id)",
    },
    optionLabel: "contact_id.full_name",
    optionValue: "id",
    onSearch: (value : any) => [
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
  const { t } = useTranslation("new_strings");
  return (
    <MultiSelect
      value={temporaryValue}
      placeholder={t("select_program_organizer")}
      data={options}
      onBottomReached={handleOnBottomReached}
      onSearch={(val: string) => {
        onSearch(val);
      }}
      onChange={temporaryOnChange}
      variant="basic"
      selectBoxStyles={{
        header:
          "border-[1px] rounded-[12px] hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]",
      }}
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

  const { options, onSearch, queryResult } = useMVPSelect({
    resource: "users",
    meta: {
      select:
        "*,program_type_teachers!inner(program_type_id),contact_id!inner(first_name,last_name))",
    },
    onSearch: (value : any) => [
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
  const { t } = useTranslation("new_strings");
  return (
    <Select
      value={temporaryValue}
      onValueChange={(val: any) => {
        temporaryOnChange(val);
      }}
    >
      <SelectTrigger className="w-80 hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]">
        <SelectValue placeholder={t("select_teacher")} />
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
