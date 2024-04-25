import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useGetIdentity, useList, useOne, useSelect } from "@refinedev/core";
import _ from "lodash";
import React, { useState } from "react";
import { useController, useFormContext, useFormState } from "react-hook-form";
import {
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
} from "src/constants/CourseConstants";
import { PROGRAM_ORGANIZER_TYPE, USER_ROLE } from "src/constants/OptionLabels";
import {
  I_AM_CO_TEACHING,
  I_AM_ORGANIZER,
  I_AM_TEACHING,
  PROGRAM_ORGANIZER,
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
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

import { useTranslation } from 'next-i18next';


function NewCourseStep1() {

  return (
    <div>
      <RadioCards />
      <div className="mt-8 flex flex-row gap-7 ">
        <div className="flex gap-1 flex-col">
          <OrganizationDropDown />
        </div>
        <div className="flex gap-1 flex-col">
          <ProgramOrganizerDropDown />
        </div>
      </div>
      <RegistrationGateway />
    </div>
  );
}

export default NewCourseStep1;

const RegistrationGateway = () => {
  const {t} = useTranslation("common")
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
      <div className="text-[14px] font-normal">
      {t('registration_via_3rd_party_gateway')}
      </div>
      <Switch
        id="registration"
        className="!w-[57px] !h-[24px]"
        onCheckedChange={onChange}
        checked={registrationSieUrl}
      />
      {value && (
        <div className="flex gap-1 flex-col -mt-7 ml-8">
          <div className="text-xs font-normal text-[#333333]">
            Please input the site's URL *
          </div>
          <div className="w-[320px] h-[40px] rounded-[1px] text-[#999999] font-normal">
            <Input
              placeholder="Enter URL"
              value={registrationSieUrl}
              onChange={RegistrationUrlOnchange}
              className="placeholder:text-[#999999]"
              error={error ? true : false}
            />
            {error && (
              <span className="text-[#FF6D6D] text-[12px]">
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
  const {
    field: { value, onChange },
    fieldState: { error: radioError },
  } = useController({
    name: NewCourseStep1FormNames?.program_created_by,
  });
  const iAmTeachingId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_TEACHING
  )?.id;
  const iAmCoTeachingId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_CO_TEACHING
  )?.id;
  const iAmOrganizerId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_ORGANIZER
  )?.id;
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
  const handleOnChange = (val: string) => {
    onChange(parseInt(val));
    //If the selected option is I am organizing then no need to fill teacher dropdown else need to prefill teacher drop down with login user
    if (parseInt(val) != iAmOrganizerId) {
      //If teachers does not exist prefill with login user
      if (!teachers) {
        teachersOnChange([loginInTeacherData]);
      }
      //If already teacher are exist then check weather login user is present in teacher drop down or not. If not prefill with login user
      else if (
        !teachers.some((obj: any) => _.isEqual(obj, loginInTeacherData))
      ) {
        teachersOnChange([loginInTeacherData, ...teachers]);
      }
    }
  };
  const {t} = useTranslation("course/view_course")
  return (
    <RadioGroup value={JSON.stringify(value)} onValueChange={handleOnChange}>
      <div className="flex items-center flex-row gap-7">
        {hasTeacherRole && (
          <Label
            htmlFor={JSON.stringify(iAmTeachingId)}
            className={`text-[#999999] font-normal ${
              value === iAmTeachingId ? "text-[#7677F4]" : ""
            }`}
          >
            <Card
              className={` p-2 w-80 h-[106px] flex flex-row ${
                value === iAmTeachingId
                  ? "border-[#7677F4] shadow-md shadow-[#7677F450]  "
                  : ""
              }`}
            >
              <div>
                <RadioGroupCheckItem
                  value={JSON.stringify(iAmTeachingId)}
                  id={JSON.stringify(iAmTeachingId)}
                  className={
                    value === iAmTeachingId
                      ? "!bg-[#7677F4] !border-none "
                      : "!border-[#D6D7D8] !shadow-none "
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
                <Teacher
                  color={` ${value === iAmTeachingId ? "#7677F4" : "#999999"}`}
                />
                I am teaching this course
              </div>
            </Card>
          </Label>
        )}
        {hasTeacherRole && (
          <Label
            htmlFor={JSON.stringify(iAmCoTeachingId)}
            className={`text-[#999999] font-normal ${
              value === iAmCoTeachingId ? "text-[#7677F4]" : ""
            }`}
          >
            <Card
              className={` p-2 gap-2 w-80 h-[106px] flex flex-row ${
                value === iAmCoTeachingId
                  ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                  : ""
              }`}
            >
              <RadioGroupCheckItem
                value={JSON.stringify(iAmCoTeachingId)}
                id={JSON.stringify(iAmCoTeachingId)}
                className={
                  value === iAmCoTeachingId
                    ? "!bg-[#7677F4] !border-none "
                    : "!border-[#D6D7D8] !shadow-none "
                }
              />
              <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
                <Coteacher
                  color={` ${
                    value === iAmCoTeachingId ? "#7677F4" : "#999999"
                  }`}
                />
                I am co-teaching this course
              </div>
            </Card>
          </Label>
        )}
        <Label
          htmlFor={JSON.stringify(iAmOrganizerId)}
          className={`text-[#999999] font-normal ${
            value === iAmOrganizerId ? "text-[#7677F4]" : ""
          }`}
        >
          <Card
            className={`p-2 gap-2 w-80 h-[106px] flex flex-row ${
              value === iAmOrganizerId
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                : ""
            }`}
          >
            <RadioGroupCheckItem
              value={JSON.stringify(iAmOrganizerId)}
              id={JSON.stringify(iAmOrganizerId)}
              className={
                value === iAmOrganizerId
                  ? "!bg-[#7677F4] !border-none "
                  : "!border-[#D6D7D8] !shadow-none "
              }
            />
            <div className="flex flex-col items-center gap-[14px]  w-full justify-center">
              <Organizer
                color={` ${value === iAmOrganizerId ? "#7677F4" : "#999999"}`}
              />
              <div className="w-[240px] text-wrap text-center justify-center">
                I am organizing this course for another teacher
              </div>
            </div>
          </Card>
        </Label>
      </div>
      {radioError && (
        <span className="text-[#FF6D6D] text-[14px]">
          {radioError?.message}
        </span>
      )}
    </RadioGroup>
  );
};

const OrganizationDropDown = () => {
  const {t} = useTranslation("common")
  const [pageSize, setPageSize] = useState<number>(1);

  const [searchValue, setSearchValue] = useState<string>("");

  const { options, onSearch, queryResult } = useSelect({
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

  const handleSearch = (val: { target: { value: string } }) => {
    onSearch(val.target.value);
    setSearchValue(val.target.value);
  };

  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize) {
      setPageSize((previousLimit: number) => previousLimit + 10);
    }
  };

  return (
    <div className="w-80 h-20">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">{t("organization")}*</div>
        <Select
          value={value}
          onValueChange={(value: any) => {
            onChange(value);
          }}
        >
          <SelectTrigger
            className="w-[320px]"
            error={organizationError ? true : false}
          >
            <SelectValue placeholder="Select Organization" />
          </SelectTrigger>
          <SelectContent>
            <Input value={searchValue} onChange={handleSearch} />
            <SelectItems onBottomReached={handleOnBottomReached}>
              {options?.map((option, index) => {
                return (
                  <div>
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
          <span className="text-[#FF6D6D] text-[12px]">
            {organizationError?.message}
          </span>
        )}
      </div>
    </div>
  );
};

const ProgramOrganizerDropDown = () => {
  const {t} = useTranslation("common")
  const { data: loginUserData }: any = useGetIdentity();

  const [pageSize, setPageSize] = useState(10);

  const {
    field: { value, onChange },
    fieldState: { error: programOrganizerError },
  } = useController({
    name: NewCourseStep1FormNames?.organizer_ids,
  });

  //Finding program Organizer role id
  const programOrganizationId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    PROGRAM_ORGANIZER
  )?.id;

  const { options, queryResult, onSearch } = useSelect({
    resource: "users",
    meta: {
      select: "*,contact_id!inner(full_name),user_roles!inner(role_id)",
    },
    optionLabel: "contact_id.full_name",
    optionValue: "id",
    filters: [
      //Fetch the users with Program Organizer role
      {
        field: "user_roles.role_id",
        operator: "eq",
        value: programOrganizationId,
      },
    ],
    defaultValue: value,
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
      setPageSize((previousLimit: number) => previousLimit + 10);
  };

  return (
    <div className="w-80 flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        {t("program_organizer")}
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Program organizer Name"
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={onChange}
        getOptionProps={(option: number) => {
          if (option === loginUserData?.userData?.id) {
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
        <span className="text-[#FF6D6D] text-[12px]">
          {programOrganizerError?.message}
        </span>
      )}
    </div>
  );
};
