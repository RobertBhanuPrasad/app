import { IsEditCourse } from "@components/course/newCourse/EditCourseUtil"
import { usePathname } from "next/navigation"
import { useController, useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectItems, SelectTrigger, SelectValue } from "src/ui/select"
import { useMVPSelect } from "src/utility/useMVPSelect"

export const NewEventStep2 = () => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        <div>
          <EventTypeDropDown/>
        </div>
        {}
      </div>
    </div>
  )
}

const EventTypeDropDown = () => {

  /**
   * This variable holds the path of the url
   */
  const pathname = usePathname()

  /**
   * Checking whether the url contains the edit or not
   */
  const isEditCourse = IsEditCourse(pathname)
  
  const { watch } = useFormContext()
  const formData =  watch()
  console.log("formData", formData)



    const {
      field: { value, onChange },
      fieldState: { error }
    } = useController({
      name: "programTypeId"
    })
    // const {
    //   field: { value, onChange },
    // } = useController({
    //   name: "teacher"
    // })

    // const {options, queryResult} = useMVPSelect({
    //   resource: ""
    // })
  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Event Type <span className="text-[#7677F4]">*</span>
      </div>
      <Select
        value={value}
        onValueChange={(val)=>{
          onChange(val)
        }}
        disabled={isEditCourse}
      >
        <SelectTrigger className="w-[320px]">
          <SelectValue placeholder="Select Event Type"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
            <SelectItem value="dje">
              Event Type
            </SelectItem>
          </SelectItems>
        </SelectContent>
      </Select>
      {error && (
        <span className="text-[#FF6D6D] text-xs font-semibold">
          {error?.message}
        </span>
      )}
    </div>
  )
}