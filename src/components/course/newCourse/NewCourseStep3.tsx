import { useSelect } from "@refinedev/core";
import { useState } from "react";
import CustomSelect from "src/ui/custom-select";

function NewCourseStep3() {
  return (
    <div>
      <Schedules />
    </div>
  );
}

export default NewCourseStep3;

const Schedules = () => {
  const [value, onChange] = useState<any>();

  const options: any[] = [];
  return (
    <div className="flex flex-col gap-4">
      <div className="h-9 flex justify-between">
        <div>Event Date and Time</div>
        <div>
          <CustomSelect
            value={value}
            placeholder="Select course type"
            data={options}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              onChange(val);
            }}
          />
        </div>
      </div>
      <div>Child</div>
    </div>
  );
};
