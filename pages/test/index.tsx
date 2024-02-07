"use client";

import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "src/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Switch } from "src/ui/switch";

export default function DataTable() {
  const [selectvalue, setSelectValue] = useState(false);

  return (
    <div className="m-20 flex flex-row gap-10">
      <Switch id="registration" />
      <Select
        onValueChange={(e: any) => {
          e && setSelectValue(true);
        }}
      >
        <SelectTrigger isValueSelected={selectvalue} className="w-[180px]">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"one"}>One</SelectItem>
          <SelectItem value={"two"}>Two</SelectItem>
        </SelectContent>
      </Select>

      <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>
          The React Framework  created and maintained by @vercel.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
