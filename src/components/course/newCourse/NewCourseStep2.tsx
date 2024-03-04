import { useSelect } from "@refinedev/core";
import { useState } from "react";
import { useController } from "react-hook-form";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { MultiSelect } from "src/ui/multi-select";

export default function NewCourseStep2() {
  const [teachers, setTeachers] = useState();
  const data = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
    { label: "C", value: "c" },
    { label: "D", value: "d" },
  ];

  const [courseType, setCourseType] = useState();

  return (
    <div className="pt-2 w-[1016px]">
      <div className="flex flex-wrap gap-x-7 gap-y-8">
        <CourseTypeDropDown />
        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">Teacher *</div>
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

        <div className="w-80">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-normal text-[#333333]">
              Assistant Teacher *
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
  const [courseType, setCourseType] = useState();
  const { options, onSearch } = useSelect({
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
  });

  const { field:{value,onChange} } = useController({
    name: 'courseType'
  });

  return (
    <div className="w-80">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">Course Type *</div>
        <CustomSelect
          value={value}
          placeholder="Select course type"
          data={options}
          onBottomReached={() => {}}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={(val) => {
            onChange(val)
          }}
        />
      </div>
    </div>
  );
};
