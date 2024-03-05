import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useGetIdentity, useSelect } from "@refinedev/core";
import React, { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Card } from "src/ui/card";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { Label } from "src/ui/label";
import { DataItem, MultiSelect } from "src/ui/multi-select";
import { RadioGroup, RadioGroupCheckItem } from "src/ui/radio-group";
import { Switch } from "src/ui/switch";

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

const RadioCards = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "teaching_type",
  });

  const { watch } = useFormContext();

  const formData = watch();

  const user_roles: any[] = formData?.loginUserData[0]?.user_roles;

  const hasTeacherRole =
    user_roles && user_roles.some((role) => role.role_id.value === "Teacher");

  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="flex items-center flex-row gap-7">
        {hasTeacherRole && (
          <Card
            className={` p-2 w-80 h-[106px] flex flex-row ${
              value === "option-one"
                ? "border-[#7677F4] shadow-md shadow-[#7677F450]  "
                : ""
            }`}
          >
            <div>
              <RadioGroupCheckItem
                value="option-one"
                id="option-one"
                className={
                  value === "option-one"
                    ? "!bg-[#7677F4] !border-none "
                    : "!border-[#D6D7D8] !shadow-none "
                }
              />
            </div>
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Teacher
                color={` ${value === "option-one" ? "#7677F4" : "#999999"}`}
              />
              <Label
                htmlFor="option-one"
                className={`text-[#999999] font-normal ${
                  value === "option-one" ? "text-[#7677F4]" : ""
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
              value === "option-two"
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                : ""
            }`}
          >
            <RadioGroupCheckItem
              value="option-two"
              id="option-two"
              className={
                value === "option-two"
                  ? "!bg-[#7677F4] !border-none "
                  : "!border-[#D6D7D8] !shadow-none "
              }
            />
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Coteacher
                color={` ${value === "option-two" ? "#7677F4" : "#999999"}`}
              />
              <Label
                htmlFor="option-two"
                className={`text-[#999999] font-normal ${
                  value === "option-two" ? "text-[#7677F4]" : ""
                }`}
              >
                I am co-teaching this course
              </Label>
            </div>
          </Card>
        )}

        <Card
          className={`p-2 gap-2 w-80 h-[106px] flex flex-row ${
            value === "option-three"
              ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
              : ""
          }`}
        >
          <RadioGroupCheckItem
            value="option-three"
            id="option-three"
            className={
              value === "option-three"
                ? "!bg-[#7677F4] !border-none "
                : "!border-[#D6D7D8] !shadow-none "
            }
          />
          <div className="flex flex-col items-center gap-[14px]  w-full justify-center">
            <Organizer
              color={` ${value === "option-three" ? "#7677F4" : "#999999"}`}
            />
            <Label
              htmlFor="option-three"
              className={`text-[#999999] font-normal ${
                value === "option-three" ? "text-[#7677F4]" : ""
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

const OrganizationDropDown = () => {
  const { options, onSearch } = useSelect({
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

const ProgramOrganizerDropDown = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { watch } = useFormContext();

  const formData = watch();

  const loginUserData = {
    value: formData?.loginUserData[0]?.id,
    label:
      formData?.loginUserData[0]?.contact_id?.first_name +
      " " +
      formData?.loginUserData[0]?.contact_id?.last_name,
  };

  const {
    field: { value = [loginUserData], onChange },
  } = useController({
    name: "program_organizer_ids",
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

  const options: DataItem[] = queryResult?.data?.data?.map((item) => {
    return {
      label: item?.contact_id?.first_name + " " + item?.contact_id?.last_name,
      value: item.id,
    };
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Program Organizer *
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
        getOptionProps={(option: { value: number }) => {
          if (option.value === loginUserData?.value) {
            return {
              noIcon: true,
            };
          } else {
            return {
              noIcon: false,
            };
          }
        }}
      />
    </div>
  );
};
