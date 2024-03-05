import Globe from "@public/assets/Globe";
import Important from "@public/assets/Important";
import LockIcon from "@public/assets/Lock";
import { CrudFilter, useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import countryCodes from "src/data/CountryCodes";
import CustomSelect from "src/ui/custom-select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { Input } from "src/ui/input";
import { DataItem, MultiSelect } from "src/ui/multi-select";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import { Switch } from "src/ui/switch";

export default function NewCourseStep2() {
  const { watch } = useFormContext();

  const formData = watch();
  console.log(formData, "formData");
  return (
    <div className="pt-2 w-auto ">
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        <div className="w-80 h-20">
          <CourseTypeDropDown />
        </div>
        {formData?.courseTypeSettings?.has_alias_name === true && (
          <div className="w-80 h-20">
            <CourseNameDropDown />
          </div>
        )}

        <div className="w-80 h-20">
          <TeachersDropDown />
        </div>

        <div className="w-80 h-20">
          <AssistantTeachersDropDown />
        </div>

        <div className="w-80 h-20">
          <LanguageDropDown />
        </div>

        {/* Allow only for super Admin */}
        <div className="w-80 h-20">
          <DisplayLanguage />
        </div>

        {formData?.displayLanguage == "true" && (
          <div className="w-80 h-20">
            <LanguageTranslationDropDown />
          </div>
        )}

        {/* Allow only for super Admin */}
        <div className="w-80 h-20 flex items-center">
          <RegistrationGateway />
        </div>

        <div className="w-80 h-20">
          <MaximumCapacity />
        </div>

        <div className="w-80 h-20">
          <Visibility />
        </div>

        <div className="w-80 h-20">
          <GeoRestriction />
        </div>

        {formData?.isGeoRestriction == "true" && (
          <div className="w-80 h-20">
            <AllowedCountriesDropDown />
          </div>
        )}
      </div>
      <div className="flex gap-x-7 text-[14px] font-normal text-[#323232]">
        <div className="w-80 h-10 flex flex-row gap-1 items-center">
          Course Description *
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Course Description text is managed by National Admin. If the
                National Admin has allowed Organizers / Teachers to edit Course
                description then only this field will be editable. If you want
                to change the course description and this field is not editable
                kindly contact your National Admin.
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="w-80 h-10 flex flex-row gap-1 items-center">
          Course Notes *
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Text entered in the 'Course Notes' field will be shown only on
                the Art of Living Website course details page.
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="w-80 h-10 flex flex-row gap-1 items-center">
          Course Description *
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Text entered in the 'Email Notes' field will be included in the
                registration confirmation email only irrespective of the
                transaction status (Email notes will not be shown on the Art of
                Living Website)
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}

const CourseTypeDropDown = () => {
  const { watch } = useFormContext();

  const [currentPage, setCurrentPage] = useState(1);

  const formData = watch();

  let filter: Array<CrudFilter> = [
    {
      field: "organization_id",
      operator: "eq",
      value: 1,
    },
    {
      field: "program_category_id",
      operator: "eq",
      value: "17",
    },
  ];

  if (formData?.teachers?.length > 0) {
    const programTypes = formData?.teachers?.map((val: any) => {
      return val?.value?.program_type_id;
    });

    filter.push({
      field: "id",
      operator: "in",
      value: programTypes,
    });
  }

  const { options, onSearch, queryResult } = useSelect({
    resource: "program_types",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    filters: filter,
    pagination: {
      current: currentPage,
      mode: "server",
    },
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "courseType",
  });

  const {
    field: { onChange: setCourseTypeSettings },
  } = useController({
    name: "courseTypeSettings",
  });

  const getCourseTypeSettings = async (val: any) => {
    const courseSettings = queryResult?.data?.data.filter(
      (data) => data.id == val.value
    );

    setCourseTypeSettings(courseSettings?.[0]);
  };

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && options?.total >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Course Type <div className="text-[#7677F4]"> *</div>
      </div>
      <CustomSelect
        value={value}
        placeholder="Select course type"
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={(val) => {
          getCourseTypeSettings(val);
          onChange(val);
        }}
      />
    </div>
  );
};

const RegistrationGateway = () => {
  const [checkedValue, setCheckedValue] = useState();
  return (
<div className="flex flex-row items-center gap-[19px]">
      <div className="text-[14px] text-[#323232] w-[244px] font-normal text-wrap">
        Registration is mandatory for this course
      </div>
      <Switch
        id="registration"
        className="!w-[57px] !h-[24px]"
        onCheckedChange={(value: any) => {
          setCheckedValue(value);
        }}
      />
    </div>
  );
};

const CourseNameDropDown = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { options, onSearch} = useSelect({
    resource: "program_type_alias_names",
    optionLabel: "alias_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "alias_name",
        operator: "contains",
        value,
      },
    ],
    filters: [
      {
        field: "program_type_id",
        operator: "eq",
        value: 1,
      },
    ],
    pagination: {
      current: currentPage,
      mode: "server",
    },
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "courseName",
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && options?.total >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Course Name <div className="text-[#7677F4]">*</div>
      </div>
      <CustomSelect
        value={value}
        placeholder="Select course name"
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={(val) => {
          onChange(val);
        }}
      />
    </div>
  );
};

const TeachersDropDown = () => {
  const { watch } = useFormContext();
  const formData = watch();

  let filter: Array<CrudFilter> = [];

  if (formData?.courseType?.value) {
    filter.push({
      field: "program_type_id",
      operator: "eq",
      value: formData?.courseType?.value,
    });
  }

  const { queryResult, onSearch } = useSelect({
    resource: "program_type_teachers",
    meta: { select: "*,user_id!inner(contact_id!inner(first_name,last_name))" },
    filters: filter,
    onSearch: (value) => [
      {
        field: "user_id.contact_id.full_name",
        operator: "contains",
        value,
      },
    ],
  });

  const teachers: any = queryResult.data?.data?.map((val) => {
    return {
      label:
        val?.user_id?.contact_id?.first_name +
        " " +
        val?.user_id.contact_id.last_name,
      value: val,
    };
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "teachers",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row">
        Teacher <div className="text-[#7677F4]">*</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Teacher Name"
        data={teachers}
        onBottomReached={() => {}}
        onSearch={onSearch}
        onChange={onChange}
      />
    </div>
  );
};

const AssistantTeachersDropDown = () => {
  const { watch } = useFormContext();
  const formData = watch();

  let filter: Array<CrudFilter> = [
    {
      field: "certification_level_id",
      operator: "eq",
      value: "38",
    },
  ];

  if (formData?.courseType?.value) {
    filter.push({
      field: "program_type_id",
      operator: "eq",
      value: formData?.courseType?.value,
    });
  }

  const { queryResult, onSearch } = useSelect({
    resource: "program_type_teachers",
    meta: { select: "*,user_id(contact_id(first_name,last_name))" },
    filters: filter,
    onSearch: (value) => [
      {
        field: "user_id.contact_id.full_name",
        operator: "contains",
        value,
      },
    ],
  });

  const teachers:any = queryResult.data?.data?.map((val) => {
    return {
      label:
        val?.user_id?.contact_id?.first_name +
        " " +
        val?.user_id.contact_id.last_name,
      value: val,
    };
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "teachers",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Assistant Teacher
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Teacher Name"
        data={teachers}
        onBottomReached={() => {}}
        onSearch={onSearch}
        onChange={onChange}
      />
    </div>
  );
};

const Visibility = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "visibility",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Program Visibility <div className="text-[#7677F4]"> *</div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px]">
              <div className="flex flex-row gap-1 items-center">
                <Globe />
                Public
              </div>
              <div>
                There are a lot of things you can do in space, and space
                essentially is unlimited resources.
              </div>
              <div className="my-2">
                <hr></hr>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <LockIcon />
                Private
              </div>
              <div>
                There are a lot of things you can do in space, and space
                essentially is unlimited resources.
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <RadioGroup defaultValue="public" onValueChange={onChange} value={value}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="public"
            selectedRadioValue={value}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px] "
          />
          <RadioButtonCard
            value="private"
            selectedRadioValue={value}
            label="Private"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

const DisplayLanguage = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "displayLanguage",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Display language translation option for participants *
      </div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={value}
            label="No"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

const GeoRestriction = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "isGeoRestriction",
  });
  const {
    formState: { errors },
  } = useFormContext();
  console.log(value, "value izzz");
  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Is geo restriction applicable for registrations
        <div className="text-[#7677F4]">*</div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Text entered in the 'Email Notes' field will be included in the
              registration confirmation email only irrespective of the
              transaction status (Email notes will not be shown on the Art of
              Living Website)
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={value}
            label="No"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};
const LanguageDropDown = () => {
  const { options, onSearch } = useSelect({
    resource: "organization_languages",
    optionLabel: "language_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "language_name",
        operator: "contains",
        value,
      },
    ],
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "languages",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className=" flex flex-row text-xs font-normal text-[#333333]">
        Language(s) course is taught in
        <div className="text-[#7677F4]"> *</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Select Language"
        data={options}
        onBottomReached={() => {}}
        onSearch={onSearch}
        onChange={onChange}
      />
    </div>
  );
};

const LanguageTranslationDropDown = () => {
  const { options, onSearch } = useSelect({
    resource: "organization_languages",
    optionLabel: "language_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "language_name",
        operator: "contains",
        value,
      },
    ],
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "translationLanguages",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Available language(s) for translation
      </div>
      <MultiSelect
        value={value}
        placeholder="Select translation languages"
        data={options}
        onBottomReached={() => {}}
        onSearch={onSearch}
        onChange={onChange}
      />
    </div>
  );
};

const AllowedCountriesDropDown = () => {
  const { watch } = useFormContext();

  const formData = watch();

  const countryArray: DataItem[] = Object.entries(countryCodes).map(
    ([countryCode, countryName]) => ({
      label: countryName,
      value: countryCode,
    })
  );

  const allowedCountries = formData?.courseTypeSettings?.allowed_countries;

  const allowedCountriesData = countryArray?.filter((val) =>
    allowedCountries?.includes(val?.value)
  );

  const {
    field: { value, onChange },
  } = useController({
    name: "allowedCountries",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Country(s) from where registrations are allowed
        <div className="text-[#7677F4]">*</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Countries"
        data={allowedCountriesData}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={onChange}
      />
    </div>
  );
};

const MaximumCapacity = () => {
  const { watch } = useFormContext();

  const formData = watch();

  const maxAttendees = formData?.courseTypeSettings?.maximum_capacity;

  useEffect(() => {
    onChange(formData?.courseTypeSettings?.max_capacity);
  }, [formData?.courseTypeSettings?.max_capacity]);

  const {
    field: { value = maxAttendees, onChange },
  } = useController({ name: "maxCapacity" });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">Max Capacity</div>
      <Input
        placeholder="Enter no. of attendees"
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        className="rounded-[12px] text-[14px] font-normal placeholder:text-[#999999]"
      />
    </div>
  );
};
