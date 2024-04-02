import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useGetIdentity, useList, useSelect } from "@refinedev/core";
import _ from "lodash";
import React, { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { PROGRAM_ORGANIZER_TYPE } from "src/constants/OptionLabels";
import {
  I_AM_CO_TEACHING,
  I_AM_ORGANIZER,
  I_AM_TEACHING,
} from "src/constants/OptionValueOrder";
import { Card } from "src/ui/card";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { Label } from "src/ui/label";
import { MultiSelect } from "src/ui/multi-select";
import { RadioGroup, RadioGroupCheckItem } from "src/ui/radio-group";
import { Switch } from "src/ui/switch";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

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

export const RegistrationGateway = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "registration_via_third_party",
  });

  const {
    field: { value: registrationSieUrl, onChange: RegistrationUrlOnchange },
  } = useController({
    name: "site_url",
  });

  return (
    <div className="flex flex-row gap-6 mt-[60px]">
      <div className="text-[14px] font-normal">
        Registration via 3rd party gateway
      </div>
      <Switch
        id="registration"
        className="!w-[57px] !h-[24px]"
        onCheckedChange={onChange}
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const RadioCards = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "programOrganizedBy",
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
    user_roles && user_roles.some((role) => role.role_id.value === "Teacher");

  const loginInTeacherData = {
    value: {
      id: loginUserData?.userData?.id,
      contact_id: {
        first_name: loginUserData?.userData?.contact_id?.first_name,
        last_name: loginUserData?.userData?.contact_id?.last_name,
      },
      created_at: loginUserData?.userData?.created_at,
      program_type_teachers: loginUserData?.userData?.program_type_teachers,
      user_identifier: loginUserData?.userData?.user_identifier,
      user_name: loginUserData?.userData?.user_name,
    },
    label:
      loginUserData?.userData?.contact_id?.first_name +
      " " +
      loginUserData?.userData?.contact_id?.last_name,
  };

  const {
    field: { value: teachers, onChange: teachersOnChange },
  } = useController({
    name: "teachers",
  });

  const handleOnChange = (val: string) => {
    onChange(val);

    //If the selected option is I am organizing then no need to fill teacher dropdown else need to prefill teacher drop down with login user
    if (val != iAmOrganizerId) {
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

  return (
    <RadioGroup value={value} onValueChange={handleOnChange}>
      <div className="flex items-center flex-row gap-7">
        {hasTeacherRole && (
          <Card
            className={` p-2 w-80 h-[106px] flex flex-row ${
              value === iAmTeachingId
                ? "border-[#7677F4] shadow-md shadow-[#7677F450]  "
                : ""
            }`}
          >
            <div>
              <RadioGroupCheckItem
                value={iAmTeachingId}
                id={iAmTeachingId}
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
              <Label
                htmlFor={iAmTeachingId}
                className={`text-[#999999] font-normal ${
                  value === iAmTeachingId ? "text-[#7677F4]" : ""
                }`}
              >
                I am teaching this course
              </Label>
            </div>
          </Card>
        )}
        {hasTeacherRole && (
          <Card
            className={` p-2 gap-2 w-80 h-[106px] flex flex-row ${
              value === iAmCoTeachingId
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                : ""
            }`}
          >
            <RadioGroupCheckItem
              value={iAmCoTeachingId}
              id={iAmCoTeachingId}
              className={
                value === iAmCoTeachingId
                  ? "!bg-[#7677F4] !border-none "
                  : "!border-[#D6D7D8] !shadow-none "
              }
            />
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Coteacher
                color={` ${value === iAmCoTeachingId ? "#7677F4" : "#999999"}`}
              />
              <Label
                htmlFor={iAmCoTeachingId}
                className={`text-[#999999] font-normal ${
                  value === iAmCoTeachingId ? "text-[#7677F4]" : ""
                }`}
              >
                I am co-teaching this course
              </Label>
            </div>
          </Card>
        )}

        <Card
          className={`p-2 gap-2 w-80 h-[106px] flex flex-row ${
            value === iAmOrganizerId
              ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
              : ""
          }`}
        >
          <RadioGroupCheckItem
            value={iAmOrganizerId}
            id={iAmOrganizerId}
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
            <Label
              htmlFor={iAmOrganizerId}
              className={`text-[#999999] font-normal ${
                value === iAmOrganizerId ? "text-[#7677F4]" : ""
              }`}
            >
              <div className="w-[240px] text-wrap text-center justify-center">
                I am organizing this course for another teacher
              </div>
            </Label>
          </div>
        </Card>
      </div>
    </RadioGroup>
  );
};

export const OrganizationDropDown = () => {
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
    name: "organization",
  });

  const {
    field: { onChange: organizationDetailsOnChange },
  } = useController({
    name: "organizationDetails",
  });

  const {
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-80 h-20">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">Organization *</div>

        <CustomSelect
          error={organizationError}
          value={value}
          placeholder="Select Organization"
          data={options}
          onBottomReached={() => {}}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={(val) => {
            onChange(val);
            resetField("organization");
            setValue("organization", val);
            organizationDetailsOnChange(
              queryResult?.data?.data?.filter(
                //Need to change val?.value to val in future.
                (value) => value?.id == val?.value
              )?.[0]
            );
          }}
        />

        {errors.organization && (
          <span className="text-[#FF6D6D] text-[12px]">
            Select Organizer Name.
          </span>
        )}
      </div>
    </div>
  );
};

export const ProgramOrganizerDropDown = () => {
  const { data: loginUserData }: any = useGetIdentity();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    field: { value, onChange },
  } = useController({
    name: "programOrganizers",
  });

  const { queryResult, onSearch } = useSelect({
    resource: "users",
    meta: {
      select:
        "*,contact_id!inner(first_name,last_name),user_roles!inner(role_id)",
    },
    filters: [
      {
        field: "user_roles.role_id",
        operator: "eq",
        value: 43,
      },
    ],
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
      current: currentPage,
      mode: "server",
    },
  });
  const handleOnBottomReached = () => {
    if (
      queryResult?.data?.data &&
      queryResult?.data?.data?.length >= currentPage * 10
    )
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const options: any =
    queryResult?.data?.data?.map((item) => {
      return {
        label: item?.contact_id?.first_name + " " + item?.contact_id?.last_name,
        value: item.id,
      };
    }) ?? [];

  //If logged user is not present in data then append the value and send it to data
  const isUserPresentInData = options?.find(
    (obj: { val: number }) => obj?.val == loginUserData?.userData?.id
  );

  const filteredOptions = isUserPresentInData
    ? options
    : [
        ...options,
        {
          label: loginUserData?.userData?.contact_id?.full_name,
          value: loginUserData?.userData?.id,
        },
      ];

  return (
    <div className="w-80 flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Program Organizer *
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Program organizer Name"
        data={filteredOptions}
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
      />
    </div>
  );
};
