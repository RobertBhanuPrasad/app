import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useSelect } from "@refinedev/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Card } from "src/ui/card";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { Label } from "src/ui/label";
import { MultiSelect } from "src/ui/multi-select";
import { RadioGroup, RadioGroupCheckItem } from "src/ui/radio-group";
import { Switch } from "src/ui/switch";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";


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
    name: "programOrganizedBy",
  });

  const { watch } = useFormContext();

  const formData = watch();

  const user_roles: any[] = formData?.loginUserData?.user_roles;

  const hasTeacherRole =
    user_roles && user_roles.some((role) => role.role_id.value === "Teacher");

  const [programOrganizedBy, setProgramOrganizedBy]: any[] = useState();

  const fetchProgramOrganizedBy = async () => {
    const programOrganizedBy = (await getOptionValuesByOptionLabel(
      "PROGRAM_ORGANIZER_TYPE"
    )) as any[];
    setProgramOrganizedBy(programOrganizedBy);
  };

  useEffect(() => {
    fetchProgramOrganizedBy();
  }, []);

  const loginInTeacherData = {
    value: {
      id: formData?.loginUserData?.id,
      contact_id: {
        first_name: formData?.loginUserData?.contact_id?.first_name,
        last_name: formData?.loginUserData?.contact_id?.last_name,
      },
      created_at: formData?.loginUserData?.created_at,
      program_type_teachers: formData?.loginUserData?.program_type_teachers,
      user_identifier: formData?.loginUserData?.user_identifier,
      user_name: formData?.loginUserData?.user_name,
    },
    label:
      formData?.loginUserData?.contact_id?.first_name +
      " " +
      formData?.loginUserData?.contact_id?.last_name,
  };

  const {
    field: { value: teachers, onChange: teachersOnChange },
  } = useController({
    name: "teachers",
  });

  const handleOnChange = (val: string) => {
    onChange(val);
    if (val != "48") {
      if (!teachers) {
        teachersOnChange([loginInTeacherData]);
      } else if (
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
              value === programOrganizedBy?.[0]?.id
                ? "border-[#7677F4] shadow-md shadow-[#7677F450]  "
                : ""
            }`}
          >
            <div>
              <RadioGroupCheckItem
                value={programOrganizedBy?.[0]?.id}
                id={programOrganizedBy?.[0]?.id}
                className={
                  value === programOrganizedBy?.[0]?.id
                    ? "!bg-[#7677F4] !border-none "
                    : "!border-[#D6D7D8] !shadow-none "
                }
              />
            </div>
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Teacher
                color={` ${
                  value === programOrganizedBy?.[0]?.id ? "#7677F4" : "#999999"
                }`}
              />
              <Label
                htmlFor={programOrganizedBy?.[0]?.id}
                className={`text-[#999999] font-normal ${
                  value === programOrganizedBy?.[0]?.id ? "text-[#7677F4]" : ""
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
              value === programOrganizedBy?.[1]?.id
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                : ""
            }`}
          >
            <RadioGroupCheckItem
              value={programOrganizedBy?.[1]?.id}
              id={programOrganizedBy?.[1]?.id}
              className={
                value === programOrganizedBy?.[1]?.id
                  ? "!bg-[#7677F4] !border-none "
                  : "!border-[#D6D7D8] !shadow-none "
              }
            />
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Coteacher
                color={` ${
                  value === programOrganizedBy?.[1]?.id ? "#7677F4" : "#999999"
                }`}
              />
              <Label
                htmlFor={programOrganizedBy?.[1]?.id}
                className={`text-[#999999] font-normal ${
                  value === programOrganizedBy?.[1]?.id ? "text-[#7677F4]" : ""
                }`}
              >
                I am co-teaching this course
              </Label>
            </div>
          </Card>
        )}

        <Card
          className={`p-2 gap-2 w-80 h-[106px] flex flex-row ${
            value === programOrganizedBy?.[2]?.id
              ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
              : ""
          }`}
        >
          <RadioGroupCheckItem
            value={programOrganizedBy?.[2]?.id}
            id={programOrganizedBy?.[2]?.id}
            className={
              value === programOrganizedBy?.[2]?.id
                ? "!bg-[#7677F4] !border-none "
                : "!border-[#D6D7D8] !shadow-none "
            }
          />
          <div className="flex flex-col items-center gap-[14px]  w-full justify-center">
            <Organizer
              color={` ${
                value === programOrganizedBy?.[2]?.id ? "#7677F4" : "#999999"
              }`}
            />
            <Label
              htmlFor={programOrganizedBy?.[2]?.id}
              className={`text-[#999999] font-normal ${
                value === programOrganizedBy?.[2]?.id ? "text-[#7677F4]" : ""
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
  const { watch } = useFormContext();

  const formData = watch();

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

  const options: any = queryResult?.data?.data?.map((item) => {
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
          if (option.value === formData?.loginUserData?.id) {
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
