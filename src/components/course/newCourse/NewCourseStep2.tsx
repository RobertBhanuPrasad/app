import { CrudFilter, useList, useMany, useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { DataItem, MultiSelect } from "src/ui/multi-select";
import { supabaseClient } from "src/utility";

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

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Language(s) course is taught in *
            </div>
            <CustomSelect
              value={courseType}
              placeholder="Select Language"
              data={data}
              onBottomReached={() => {}}
              onSearch={() => {}}
              onChange={(val) => {
                console.log(val, "Value is multi select");
              }}
            />
          </div>
        </div>
        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Display language translation option for participants *
            </div>
          </div>
        </div>

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Available language(s) for translation
            </div>
            <CustomSelect
              value={courseType}
              placeholder="Select translation languages"
              data={data}
              onBottomReached={() => {}}
              onSearch={() => {}}
              onChange={(val) => {
                console.log(val, "Value is multi select");
              }}
            />
          </div>
        </div>

        <div className="w-80">
          <div className="w-[254px] text-base leading-5 text-[#323232]">
            Registration is mandatory for this course
          </div>
        </div>

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Max Capacity
            </div>
            <Input placeholder="Enter no. of attendees" />
          </div>
        </div>

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

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Country(s) from where registrations are allowed *
            </div>
            <MultiSelect
              value={teachers}
              placeholder="Enter Teacher Name"
              data={data}
              onBottomReached={() => {}}
              onSearch={() => {}}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-x-7 text-sm text-[#323232]">
        <div className="w-80">Course Description *</div>
        <div className="w-80">Course Notes *</div>
        <div className="w-80">Course Description *</div>
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
          Course Name <div className="text-[#7677F4]"> *</div>
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
          Teacher <div className="text-[#7677F4]"> *</div>
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
          Assistant Teacher *
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
