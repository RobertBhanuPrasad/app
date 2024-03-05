import EditIcon from "@public/assets/EditIcon";
import { CrudFilter, useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import countryCodes from "src/data/CountryCodes";
import { Button } from "src/ui/button";
import CustomSelect from "src/ui/custom-select";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Input } from "src/ui/input";
import { DataItem, MultiSelect } from "src/ui/multi-select";

export default function NewCourseStep2() {
  const data = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
    { label: "C", value: "c" },
    { label: "D", value: "d" },
  ];

  const [courseType, setCourseType] = useState();
  const { watch } = useFormContext();

  const formData = watch();

  const teachers = [];
  return (
    <div className="pt-2 w-[1016px] ">
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        <CourseTypeDropDown />
        {formData?.courseTypeSettings?.has_alias_name === true && (
          <CourseNameDropDown />
        )}
        <TeachersDropDown />

        <AssistantTeachersDropDown />

        <LanguageDropDown />

        {/* Allow only for super Admin */}
        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Display language translation option for participants *
            </div>
          </div>
        </div>

        <LanguageTranslationDropDown />

        {/* Allow only for super Admin */}
        <div className="w-80">
          <div className="w-[254px] text-base leading-5 text-[#323232]">
            Registration is mandatory for this course
          </div>
        </div>

        <MaximumCapacity />

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Program Visibility
            </div>
          </div>
        </div>

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Is geo restriction applicable for registrations
            </div>
          </div>
        </div>

        <AllowedCountriesDropDown />
      </div>

      <div className="flex gap-x-7 text-sm text-[#323232]">
        <div className="flex flex-row justify-between w-80">
          <div>Course Description *</div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-row gap-1 justify-center items-center">
                <div>
                  <EditIcon />
                </div>
                <div className="text-[#7677F4]">Manage</div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <div>hello</div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-row justify-between w-80">
          <div>Course Notes *</div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-row gap-1 justify-center items-center">
                <div>
                  <EditIcon />
                </div>
                <div className="text-[#7677F4]">Manage</div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <div>hello</div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-row justify-between w-80">
          <div>Email Notes *</div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-row gap-1 justify-center items-center">
                <div>
                  <EditIcon />
                </div>
                <div className="text-[#7677F4]">Manage</div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <div>hello</div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

const CourseTypeDropDown = () => {
  const { watch } = useFormContext();

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

  return (
    <div className="w-80 h-20">
      <div className="flex gap-1 flex-col">
        <div className="flex flex-row text-xs font-normal text-[#333333]">
          Course Type <div className="text-[#7677F4]"> *</div>
        </div>
        <CustomSelect
          value={value}
          placeholder="Select course type"
          data={options}
          onBottomReached={() => {}}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={(val) => {
            getCourseTypeSettings(val);
            onChange(val);
          }}
        />
      </div>
    </div>
  );
};

const CourseNameDropDown = () => {
  const { options, onSearch } = useSelect({
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
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "courseName",
  });

  return (
    <div className="w-80 h-20">
      <div className="flex gap-1 flex-col">
        <div className="flex flex-row text-xs font-normal text-[#333333]">
          Course Name <div className="text-[#7677F4]">*</div>
        </div>
        <CustomSelect
          value={value}
          placeholder="Select course name"
          data={options}
          onBottomReached={() => {}}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={(val) => {
            onChange(val);
          }}
        />
      </div>
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

  const { queryResult } = useSelect({
    resource: "program_type_teachers",
    meta: { select: "*,user_id(contact_id(first_name,last_name))" },
    filters: filter,
  });

  const teachers: DataItem[] = queryResult.data?.data?.map((val) => {
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
    <div className="w-80 h-20">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333] flex flex-row">
          Teacher <div className="text-[#7677F4]">*</div>
        </div>
        <MultiSelect
          value={value}
          placeholder="Enter Teacher Name"
          data={teachers}
          onBottomReached={() => {}}
          onSearch={() => {}}
          onChange={onChange}
        />
      </div>
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

  const { queryResult } = useSelect({
    resource: "program_type_teachers",
    meta: { select: "*,user_id(contact_id(first_name,last_name))" },
    filters: filter,
  });

  const teachers: DataItem[] = queryResult.data?.data?.map((val) => {
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
    <div className="w-80 h-20">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">
          Assistant Teacher
        </div>
        <MultiSelect
          value={value}
          placeholder="Enter Teacher Name"
          data={teachers}
          onBottomReached={() => {}}
          onSearch={() => {}}
          onChange={onChange}
        />
      </div>
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
    <div className="w-80 h-20">
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
    <div className="w-80 h-20">
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
    <div className="w-80 h-20">
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
    <div className="w-80">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">Max Capacity</div>
        <Input
          placeholder="Enter no. of attendees"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
        />
      </div>
    </div>
  );
};
