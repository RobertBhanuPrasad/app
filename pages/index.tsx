import { Button } from "src/ui/button";

import { ArrowBigDown, Check, ChevronsUpDown } from "lucide-react"
import { Command } from "src/ui/command";
import { cn } from "src/lib/utils";
import { useState } from "react";
import CrossIcon from "@public/assets/CrossIcon";
import { useMVPSelect } from "src/utility/useMVPSelect";
import { MVPSelect, MVPSelectContent, MVPSelectEmpty, MVPSelectInput, MVPSelectItem, MVPSelectItems, MVPSelectList, MVPSelectTrigger } from "src/ui/MVPSelect";
import Arrow from "@public/assets/Arrow";
import DropDownArrow from "@public/assets/DropDownArrow";
 


export default function Index() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [pageSize, setPageSize] = useState(10)

 
 const { options } = useMVPSelect({
  resource: "city",
  optionLabel: "name",
  optionValue: "id",
  defaultValue: value,
  pagination: {
    mode: "server",
    pageSize: pageSize,
  },
});
console.log(options,"options are")


const handleOnBottomReached = () => {
  setPageSize((previousLimit: number) => previousLimit + 10);
};

const handleSelectedValue = (val: any)=>{
  setOpen(false)
  setValue(val as string)
}

const handleClick = (val) => {
  setOpen(val)
}
  return (
    <div >
      {/* <Button>Hello</Button> */}
      <MVPSelect open={open} onChange={handleClick}>
        <MVPSelectTrigger value={value} setValue={setValue}  placeholder="Select city"/>
      <MVPSelectContent >  
     
          <MVPSelectInput placeholder="Search framework..." />
          <MVPSelectList>
            <MVPSelectEmpty/>
            {options &&
            
            <MVPSelectItems onLoadedData={handleOnBottomReached}>
              {options.map((cityData:any) => {
                return(
                <MVPSelectItem
                  key={cityData.id}
                  value={cityData.id}
                  onChange={handleSelectedValue}
                >
                
                  {cityData.label}
                </MVPSelectItem>
              )})}
            </MVPSelectItems>
}
          </MVPSelectList>  
      </MVPSelectContent>
    </MVPSelect>
    </div>
  );
}

Index.noLayout = false;