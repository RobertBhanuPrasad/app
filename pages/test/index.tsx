"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/ui/select";
import { Switch } from "src/ui/switch";


export default function DataTable(){
 
  const [selectvalue , setSelectValue] = useState(false)

  return (
    <div className="m-20">
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
    </div>
  );
}
