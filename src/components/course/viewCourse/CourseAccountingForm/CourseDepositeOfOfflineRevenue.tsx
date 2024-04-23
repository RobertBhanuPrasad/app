import Add from '@public/assets/Add'
import Delete from '@public/assets/Delete'
import { useEffect } from 'react'
import { useController, useFieldArray, useFormContext } from 'react-hook-form'
import { DateField } from 'src/ui/DateField'
import { MainHeader } from 'src/ui/TextTags'
import { Input } from 'src/ui/input'
import { TableHeader } from 'src/ui/table'

function DepositeOfOfflineRevenue() {
  const { fields, append, remove } = useFieldArray({
    name: 'program_offline_revenue'
  })
  const { watch } = useFormContext()

  // formData is a constant we can store the form data which is getting from the watch() from useFormContext
  const formData = watch()
  useEffect(() => {
    // If there is no data for the program_expenses in form then we will append fields with undefined
    if (!formData?.program_offline_revenue || formData?.program_offline_revenue.length <= 0) {
      append(undefined)
    }
  }, [])
  console.log(formData, 'program_offline_revenue')

  return (
    <div>
      <MainHeader className="pt-5 text-[18px] pb-2" children="Deposit of Offline Revenue" />
      <div className="rounded-[12px] border border-[#D6D7D8] ">
        <div className="flex h-[48px] px-[25px] py-[15px] bg-[#7677F41A] ">
          <TableHeader className="w-[88px] text-[14px] ">#</TableHeader>
          <TableHeader className="w-[288px] text-[14px]">Date</TableHeader>
          <TableHeader className="w-[288px] text-[14px]">Amount</TableHeader>
          <TableHeader className="w-[388px] text-[14px]">Notes</TableHeader>
          <TableHeader className="w-[288px] text-[14px]">Action</TableHeader>
        </div>
        <div className="space-y-[12px] my-[8px]">
          {fields.map((field: any, index: number) => (
            <div key={field.id} className="flex items-center w-full h-auto ">
              <div className="w-[88px] px-[22px] text-[14px] ">{index + 1}</div>
              <div className="w-[288px] pl-5">
                <DepositeDate index={index} />
              </div>
              <div className="w-[288px] pl-4">
                <Amount index={index} />
              </div>
              <div className="w-[388px] pl-3">
                <Notes index={index} />
              </div>
              <div className="w-[180px] px-[12px]">
                <Action index={index} remove={remove} append={append} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default DepositeOfOfflineRevenue

const Amount = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({
    name: `program_offline_revenue[${index}].amount`
  })

  return (
    <div className="w-full">
      {/* Input field for fees */}
      <Input
        value={value}
        onChange={val => {
          onChange(val?.target?.value)
        }}
        error={error ? true : false}
        className="w-[150px]"
      />
      {error && <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>}
    </div>
  )
}

const Action = ({ index, append, remove }: { index: number; append: any; remove: any }) => {
  console.log('hit')

  const { watch } = useFormContext()
  const formData = watch().program_offline_revenue || []
  const isLastRow = index === formData?.length - 1
  const isFirstRow = index === 0

  /**
   * @function handleAddRow
   * @description This function is used to add a row
   */
  const handleAddRow = () => {
    append({})
  }

  /**
   * @function handleDeleteRow
   * @description this function is used to delete a row
   * @param index
   */
  const handleDeleteRow = (index: number) => {
    remove(index)
  }
  return (
    <div className="w-[150px] flex gap-4 ">
      {/* Button to add a new row */}
      {isLastRow && (
        <div
          onClick={handleAddRow}
          className="flex flex-row gap-1 justify-center items-center cursor-pointer text-[#7677F4]"
        >
          <Add />
          <div className="text-[14px]">Add</div>
        </div>
      )}
      {/* Button to delete a row */}
      {!isFirstRow && (
        <div
          onClick={() => {
            handleDeleteRow(index)
          }}
          className="flex flex-row gap-1 justify-center items-center text-[#7677F4] cursor-pointer"
        >
          <Delete />
          <div className="text-[14px]">Delete</div>
        </div>
      )}
    </div>
  )
}

const DepositeDate = ({ index }: { index: number }) => {
  const {
    field: { value = new Date(), onChange },
    fieldState: { error }
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_offline_revenue.${index}.date`
  })
  return (
    <div>
      <DateField value={value as Date} onChange={onChange} placeholder=" " className="!w-[256px]" />
    </div>
  )
}

const Notes = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error }
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_offline_revenue.${index}.notes`
  })
  return (
    <div>
      <Input value={value as string} onChange={onChange} error={error ? true : false} className="w-[350px]" />
    </div>
  )
}
