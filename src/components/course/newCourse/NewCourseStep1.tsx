import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useGetIdentity} from "@refinedev/core";
import _ from "lodash";
import { usePathname } from "next/navigation";
import React, {  useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
} from "src/constants/CourseConstants";
import {
  NATIONAL_ADMIN,
  SUPER_ADMIN,
  TEACHER,
} from "src/constants/OptionValueOrder";
import { Card } from "src/ui/card";
import { Input } from "src/ui/input";
import { Label } from "src/ui/label";
import { MultiSelect } from "src/ui/multi-select";
import { RadioGroup, RadioGroupCheckItem } from "src/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Switch } from "src/ui/switch";
import { IsEditCourse } from "./EditCourseUtil";

import { useTranslation } from "next-i18next";
import { Text } from "src/ui/TextTags";
import { useRouter } from "next/router";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { useMVPSelect } from "src/utility/useMVPSelect";
import { optionLabelValueStore } from "src/zustandStore/OptionLabelValueStore";

function NewCourseStep1() {
  const { data: loginUserData }: any = useGetIdentity();

  // Checking weather login user is super admin or not
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  // Checking weather login user is National admin or not
  const hasNationalAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) =>
      val.role_id?.order == NATIONAL_ADMIN
  );
  return (
    <div className="w-full" >
      <RadioCards />
      <div className="mt-8 flex flex-row gap-7 ">
        <div className="flex gap-1 flex-col">
          <OrganizationDropDown />
        </div>
        <div className="flex gap-1 flex-col">
          <ProgramOrganizerDropDown />
        </div>
      </div>
      {/* 'Registration via 3rd Party' field should be visible only to Super Admin and National Admin */}
      {(hasSuperAdminRole || hasNationalAdminRole) && (
        <div>
          <RegistrationGateway />
        </div>
      )}
    </div>
  );
}

export default NewCourseStep1;

const RegistrationGateway = () => {
  const { t } = useTranslation(["common", "new_strings"]);
  const {
    field: { value = false, onChange },
  } = useController({
    name: NewCourseStep1FormNames?.is_registration_via_3rd_party,
  });

  const {
    field: { value: registrationSieUrl, onChange: RegistrationUrlOnchange },
    fieldState: { error },
  } = useController({
    name: NewCourseStep1FormNames?.registration_via_3rd_party_url,
  });

  return (
    <div className="flex flex-row gap-6 mt-[60px]">
      <div className="text-sm font-normal">
        {t("registration_via_3rd_party_gateway")}
      </div>
      <Switch
        id="registration"
        className="!w-[57px] !h-[24px]"
        onCheckedChange={onChange}
        checked={value}
      />
      {value && (
        <div className="flex gap-1 flex-col -mt-7 ml-8">
          <div className="flex flex-row gap-1 items-center">
            <Text className="text-xs font-normal text-[#333333]">
              {t("new_strings:please_input_the_site_url")}
            </Text>{" "}
            <Text className="text-[#7677F4]">*</Text>
          </div>
          <div className="w-[320px] h-[40px] rounded-[1px] text-[#999999] font-normal">
            <Input
              placeholder={t("new_strings:enter_url")}
              value={registrationSieUrl}
              onChange={RegistrationUrlOnchange}
              className="placeholder:text-[#999999] rounded-[12px] text-[14px] text-[#333333]"
              error={error ? true : false}
            />
            {error && (
              <span className="text-[#FF6D6D] text-xs font-semibold">
                {error?.message}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const RadioCards = () => {
  const { clearErrors, watch,setValue } = useFormContext();

  const {optionLabelValue}=optionLabelValueStore()

  const { t } = useTranslation(["course.new_course", "new_strings"]);

  const { setProgramCreatedById } = newCourseStore();
  const {
    field: { value, onChange },
    fieldState: { error: radioError },
  } = useController({
    name: NewCourseStep1FormNames?.program_created_by,
  });

  const iAmTeachingType = optionLabelValue?.program_manage_type.I_AM_TEACHING as string 
  const iAmCoTeachingType = optionLabelValue?.program_manage_type.I_AM_CO_TEACHING as string 
  const iAmOrganizerType = optionLabelValue?.program_manage_type.I_AM_ORGANIZING as string 
    const { data: loginUserData }: any = useGetIdentity();
  const user_roles: any[] = loginUserData?.userData?.user_roles;
  const hasTeacherRole =
    user_roles && user_roles.some((role) => role.role_id.order === TEACHER);

  const loginInTeacherData = loginUserData?.userData?.id;

  const {
    field: { value: teachers, onChange: teachersOnChange },
  } = useController({
    name: NewCourseStep2FormNames?.teacher_ids,
  });

  const router = useRouter();



  const handleOnChange = (val: string) => {
    onChange(val);
    //If the selected option is I am organizing then no need to fill teacher dropdown else need to prefill teacher drop down with login user
    if (val == iAmTeachingType) {
      //Requirement: Need to show only one teacher(login user) in teacher drop-down if I am teaching is selected.
      teachersOnChange([loginInTeacherData]);
      setTimeout(() => {
        clearErrors("teacher_ids");
      }, 10);
    }

    //Requirement: Need to prefill teacher drop-down if user select I am co-teaching.
    if (val == iAmCoTeachingType) {
      //If teachers are not present just prefill with login user
      if (teachers == undefined) {
        teachersOnChange([loginInTeacherData]);
      }
      //If already teacher are exist then check weather login user is present in teacher drop down or not. If not prefill with login user
      else if (
        !teachers?.some((obj: any) => _.isEqual(obj, loginInTeacherData))
      ) {
        teachersOnChange([loginInTeacherData, ...teachers]);
        setTimeout(() => {
          clearErrors("teacher_ids");
        }, 10);
      }
    }
    // Check if the selected value is equal to the organizer's ID
    if (val === iAmOrganizerType) {
      // If there are already teachers selected
      if (teachers) {
        // Remove the logged-in teacher's ID from the list of selected teachers
        teachersOnChange(_.without(teachers, loginInTeacherData));
        // Set a timeout to clear errors for the 'teacher_ids' field after 10 milliseconds
        setTimeout(() => {
          clearErrors("teacher_ids");
        }, 10);
      }
    }

    // If I am changing the program created by then we are removing the course type course type id and the course alias name 
    // Because if we chanage the created by and then the course type is not present for that created type then 
    if(!IsEditCourse(router?.pathname)){
      setValue("program_type_id", "");
    setValue("program_type", "");
    setValue("program_alias_name_id", "");

    setTimeout(()=>{
      clearErrors(['program_type_id','program_type','program_alias_name_id'])
    },10)
    }
    // we are storing the program created by in the zustand variable to use it in the validatios
    setProgramCreatedById(val);
  };

  /**
   * @constant programOrganizerTypeData is the data from the option_values
   * @description this const is used to store the data from the option_values which option_label_id is Program Organizer Type
   */

  /**
   * @constant iAmTeachingCourse
   * @description this const stores the data of the order 1 which is i am teaching the course
   */
  const iAmTeachingCourse = t("enum:I_AM_TEACHING")

  /**
   * @constant iAmCoTeachingCourse
   * @description this const stores the data of the order 2 which is i am co-teaching the course
   */
  const iAmCoTeachingCourse = t("enum:I_AM_CO_TEACHING")

  /**
   * @constant iAmOrganisingCourse
   * @description this const stores the data of the order 3 which is i am organizing the course
   */
  const iAmOrganisingCourse =   t("enum:I_AM_ORGANIZING")

  return (
    <RadioGroup value={value} onValueChange={handleOnChange} className="w-full" >
      <div className="flex items-center flex-row gap-7 w-full">
        {hasTeacherRole && (
          //Added cursor not allowed to all cards if this is disabled
          <Label
            htmlFor={iAmTeachingType}
            className={`text-[#999999] font-normal  min-w-[288px] w-full max-w-[320px]
            
            ${
              value === iAmTeachingType ? "text-[#7677F4]" : ""
            }`}
          >
            <Card
              className={` p-2  h-[106px] flex flex-row ${
                value === iAmTeachingType
                  ? "border-[#7677F4] shadow-md shadow-[#7677F450] text-[#7677F4] "
                  : ""
              }`}
            >
              <div>
                <RadioGroupCheckItem
                  value={iAmTeachingType}
                  id={iAmTeachingType}
                  className={
                    value === iAmTeachingType
                      ? "!bg-[#7677F4] !border-none "
                      : "!border-[#D6D7D8] !shadow-none "
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
                <Teacher
                  color={` ${value === iAmTeachingType ? "#7677F4" : "#999999"}`}
                />

                {iAmTeachingCourse}
              </div>
            </Card>
          </Label>
        )}
        {hasTeacherRole && (
          <Label
            htmlFor={JSON.stringify(iAmCoTeachingType)}
            className={`text-[#999999] font-normal  min-w-[288px] w-full max-w-[320px]
            
            ${
              value === iAmCoTeachingType ? "text-[#7677F4]" : ""
            } `}
          >
            <Card
              className={` p-2 gap-2 h-[106px] flex flex-row ${
                value === iAmCoTeachingType
                  ? "border-[#7677F4] shadow-md shadow-[#7677F450] text-[#7677F4]"
                  : ""
              }`}
            >
              <RadioGroupCheckItem
                value={iAmCoTeachingType}
                id={JSON.stringify(iAmCoTeachingType)}
                className={
                  value === iAmCoTeachingType
                    ? "!bg-[#7677F4] !border-none "
                    : "!border-[#D6D7D8] !shadow-none "
                }
              />
              <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
                <Coteacher
                  color={` ${
                    value === iAmCoTeachingType ? "#7677F4" : "#999999"
                  }`}
                />
                {iAmCoTeachingCourse}
              </div>
            </Card>
          </Label>
        )}
        <Label
          htmlFor={JSON.stringify(iAmOrganizerType)}
          className={`text-[#999999] font-normal  min-w-[288px] w-full max-w-[320px]
          
          ${
            value === iAmOrganizerType ? "text-[#7677F4]" : ""
          }`}
        >
          <Card
            className={`p-2 gap-2 h-[106px] flex flex-row  ${
              value === iAmOrganizerType
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] text-[#7677F4]"
                : ""
            }`}
          >
            <RadioGroupCheckItem
              value={iAmOrganizerType}
              id={JSON.stringify(iAmOrganizerType)}
              className={
                value === iAmOrganizerType
                  ? "!bg-[#7677F4] !border-none "
                  : "!border-[#D6D7D8] !shadow-none "
              }
            />
            <div className="flex flex-col items-center gap-[14px]  w-full justify-center">
              <Organizer
                color={` ${value === iAmOrganizerType ? "#7677F4" : "#999999"}`}
              />
              <div className="w-[240px] text-wrap text-center justify-center text-sm">
                {iAmOrganisingCourse}
              </div>
            </div>
          </Card>
        </Label>
      </div>
      {radioError && (
        <span className="text-[#FF6D6D] text-xs font-semibold">
          {radioError?.message}
        </span>
      )}
    </RadioGroup>
  );
};

const OrganizationDropDown = () => {
  const {optionLabelValue}=optionLabelValueStore()
  /**
   * This variable holds the path of the url
   */
  const pathname = usePathname();

  const { clearErrors, watch } = useFormContext();

  const formData = watch();
  /**
   * Checking whether the url contains the edit or not
   */
  const isEditCourse = IsEditCourse(pathname);

  const [pageSize, setPageSize] = useState<number>(1);

  const [searchValue, setSearchValue] = useState<string>("");

  const { setValue } = useFormContext();

  const { options, onSearch, queryResult } = useMVPSelect({
    resource: "organizations",
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

  const {
    field: { value, onChange },
    fieldState: { error: organizationError },
  } = useController({
    name: NewCourseStep1FormNames?.organization_id,
  });

  const {
    field: { onChange: teachersOnChange },
  } = useController({
    name: NewCourseStep2FormNames?.teacher_ids,
  });

  const iAmOrganizer = optionLabelValue?.program_manage_type?.I_AM_ORGANIZING


  const { data: loginUserData }: any = useGetIdentity();

  const loginInTeacherData = loginUserData?.userData?.id;

  const handleClearDependencyValues = () => {
    setValue("program_type_id", "");
    setValue("program_type", "");
    setValue("program_alias_name_id", "");
    setValue("teacher_ids", []);

    //Handling teachers drop down
    if (formData?.program_created_by != iAmOrganizer) {
      //Requirement: If teacher or co-teacher is selected Need to prefill login user in teacher dropdown
      teachersOnChange([loginInTeacherData]);
      setTimeout(() => {
        clearErrors("teacher_ids");
      }, 10);
    }
    setValue("assistant_teacher_ids", []);
    setValue("language_ids", []);
    setValue("translation_language_ids", []);
    setValue("max_capacity", "");
    setValue("online_url", "");
    setValue("existingVenue", undefined);
    setValue("newVenue", undefined);
    setValue("is_existing_venue", "");
    setValue("state_id", "");
    setValue("city_id", "");
    setValue("center_id", "");
    setValue("is_residential_program", undefined);

    //Requirement: Fee is fetch based on program_type,location and course start date.So when ever organization is changed need to remove existing fee levels.
    setValue("program_fee",undefined );
    setValue("product_fee_settings",undefined );
    setValue("is_early_bird_enabled", undefined);
    setValue("early_bird_cut_off_period", undefined);

    // we have to clear errors after we modify the values
    setTimeout(() => {
      clearErrors([
        "program_type_id",
        "program_alias_name_id",
        "teacher_ids",
        "assistant_teacher_ids",
        "language_ids",
        "translation_language_ids",
        "max_capacity",
        "online_url",
        "existingVenue",
        "isExistingVenue",
        "is_existing_venue",
        "newVenue",
        "program_fee",
        "is_early_bird_enabled",
        "early_bird_cut_off_period",
        "state_id",
        "city_id",
        "center_id",
        "is_residential_program",
      ]);
    }, 10);
  };

  const handleSearch = (val: { target: { value: string } }) => {
    onSearch(val.target.value);
    setSearchValue(val.target.value);
  };

  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize) {
      setPageSize((previousLimit: number) => previousLimit + 10);
    }
  };
  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);

  return (
    <div className="h-20">
      <div className="flex gap-1 flex-col">
        <div className="flex flex-row gap-1 items-center">
          <Text className="text-xs font-normal text-[#333333]">
            {t("organization")}
          </Text>{" "}
          <Text className="text-[#7677F4]">*</Text>
        </div>
        <Select
          value={value}
          onValueChange={(value: any) => {
            onChange(value);
            handleClearDependencyValues();
          }}
          //disabling the organization dropdown when it is edit
          disabled={isEditCourse}
        >
          <SelectTrigger
            className="w-[320px]"
            error={organizationError ? true : false}
          >
            <SelectValue
              placeholder={t(
                "course.new_course:basic_details_tab.organization_placeholder"
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <Input value={searchValue} onChange={handleSearch} />
            <SelectItems onBottomReached={handleOnBottomReached}>
              {options?.map((option : any, index : any) => {
                return (
                  <div key={index}>
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
                  </div>
                );
              })}
            </SelectItems>
          </SelectContent>
        </Select>

        {organizationError && (
          <span className="text-[#FF6D6D] text-xs font-semibold">
            {organizationError?.message}
          </span>
        )}
      </div>
    </div>
  );
};

const ProgramOrganizerDropDown = () => {
  const { data: loginUserData }: any = useGetIdentity();

  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  const {
    field: { value, onChange },
    fieldState: { error: programOrganizerError },
  } = useController({
    name: NewCourseStep1FormNames?.organizer_ids,
  });

  const { options, queryResult, onSearch } = useMVPSelect({
    resource: "users",
    meta: {
      select: "*,user_roles!inner(role_id)",
    }, 
    optionLabel: "full_name",
    optionValue: "id",
    filters: [
      //Fetch the users with Program Organizer role
      {
        field: "user_roles.role_id",
        operator: "eq",
        //TODO need to change after completion of role managment
        value: 43,
      },
    ],
    defaultValue: value,
    onSearch: (value) => [
      {
        field: "full_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });


  const { watch } = useFormContext();

  const { created_by_user_id } = watch();

  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize)
      setPageSize((previousLimit: number) => previousLimit + 10);
  };
  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);

  return (
    <div className="w-80 flex gap-1 flex-col">
      <div className="flex flex-row gap-1 items-center">
        <Text className="text-xs font-normal text-[#333333]">
          {t("program_organizer")}
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <MultiSelect
        value={value}
        placeholder={t(
          "course.new_course:basic_details_tab.program_organizer_placeholder"
        )}
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={onChange}
        getOptionProps={(option: number) => {
          //Here this if condition is says that
          // "option === loginUserData?.userData?.id" this conditon is for if login user wants to creates a new course we disable the primary organizer
          // "option === created_by_user_id" this conditon is for if any login user wants to edit course than also we are disabling the program orgnizer
          // If the course is copying then we need to disable the organizer who is logged in only
          if (
            option === loginUserData?.userData?.id ||
            (option === created_by_user_id && IsEditCourse(router?.pathname))
          ) {
            return {
              disable: true,
            };
          } else {
            return {
              disable: false,
            };
          }
        }}
        error={programOrganizerError}
      />
      {programOrganizerError && (
        <span className="text-[#FF6D6D] text-xs font-semibold">
          {programOrganizerError?.message}
        </span>
      )}
    </div>
  );
};
