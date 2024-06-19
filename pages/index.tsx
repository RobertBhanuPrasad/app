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
  return (
    <div className="text-3xl">
      {/* <Button>Hello</Button> */}
      <MVPSelect open={open} onOpenChange={setOpen}>
      <MVPSelectTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? value
            : "Select framework..."}
            {value 
            ? <button onClick={()=>{
              setValue("")
            }}><CrossIcon height={10}/></button>
            : <DropDownArrow/>
           
          }
        </Button>
      </MVPSelectTrigger>
      <MVPSelectContent className="w-[200px] p-0">  
     
          <MVPSelectInput placeholder="Search framework..." />
          <MVPSelectList>
            <MVPSelectEmpty>No framework found.</MVPSelectEmpty>
            {options &&
            
            <MVPSelectItems onLoadedData={handleOnBottomReached}>
              {options.map((cityData:any) => {
                return(
                <MVPSelectItem
                  key={cityData.id}
                  value={cityData.id}
                  onSelect={(currentValue) => {
                    console.log(currentValue,"current")
                    setValue(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cityData.label ? "opacity-100" : "opacity-0"
                    )}
                  />
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