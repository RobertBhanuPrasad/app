import FaqIcon from '@public/assets/FaqIcon'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { useEffect } from 'react'
import { useFieldArray, useFormContext, useController, FormProvider, useForm } from 'react-hook-form'

import { Input } from 'src/ui/input'
import Delete from '@public/assets/Delete'
import CustomSelect from 'src/ui/custom-select'
import { useSelect } from '@refinedev/core'
import Add from '@public/assets/Add'
import { RadioButtonCard } from 'src/ui/radioButtonCard'
import { RadioGroup } from 'src/ui/radio-group'
import { DataTable } from '@components/DataTable'
import { Button } from 'src/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from 'src/ui/sheet'
import { Separator } from 'src/ui/separator'

const Revenue = () => {
  const methods = useForm()
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Revenue</p>
        <Sheet>
          <SheetTrigger>
            <div className="flex items-center gap-2 text-primary">
              <FaqIcon />
              <p className="text-base font-semibold">Questions & Instruction</p>
            </div>
          </SheetTrigger>
          <SheetContent className="w-[556px] h-full overflow-scroll">
            <SheetHeader>
              <SheetTitle>Questions & Instruction</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="flex flex-col gap-4  py-5">
              <p className="font-semibold text-lg">
                For questions regarding the Art of Living course accounting policy
              </p>
              <p className="font-normal text-base">Contact japan.helpdesk@artofliving.org</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 py-5">
              <p className="font-semibold text-lg">How to fill out the course accounting form</p>
              <p className="font-normal text-base">Contact japan.helpdesk@artofliving.org</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 py-5">
              <p className="font-semibold text-lg">Instructions:</p>
              <p className="font-normal text-base">
                All course paper work must be sent in to the Art of living Foundation's
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 py-5">
              <p className="font-semibold text-lg">
                For questions regarding the Art of Living course accounting policy{' '}
              </p>
              <p className="font-normal text-base">Contact japan.helpdesk@artofliving.org</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 py-5">
              <p className="font-semibold text-lg">
                For questions regarding the Art of Living course accounting policy{' '}
              </p>
              <p className="font-normal text-base">Contact japan.helpdesk@artofliving.org</p>
            </div>
            <Separator />
            <div className="pt-5 flex justify-center">
              <Button className="text-base font-bold">Close</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        <Accordion type="single" className="w-full border rounded-xl px-6 mt-6" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mt-6 mb-3 py-0">Course Information</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-8 mt-4">
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course ID</p>
                    <p className="font-semibold text-base text-accent-darkGrey">ALTABC740</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Teacher Address</p>
                    <p className="font-semibold text-base text-accent-darkGrey">
                      No.58, 6th cross, 8th main Bangalore KA India 657467
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Venue</p>
                    <p className="font-semibold text-base text-accent-darkGrey">
                      Test Address Aidrie, ALTA 12345 Canada
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Expenses</p>
                    <p className="font-semibold text-base text-accent-darkGrey">EUR 60.00</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Type</p>
                    <p className="font-semibold text-base text-accent-darkGrey">ART Excel</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Status</p>
                    <p className="font-semibold text-base text-accent-darkGrey">Active</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Center</p>
                    <p className="font-semibold text-base text-accent-darkGrey">Calgary</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Net Revenue</p>
                    <p className="font-semibold text-base text-accent-darkGrey">EUR 540.00</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Dates</p>
                    <p className="font-semibold text-base text-accent-darkGrey">19 Feb 2024 to 21 Feb 2024</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Accounting Status</p>
                    <p className="font-semibold text-base text-accent-darkGrey">Not Submitted</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Contact Details</p>
                    <p className="font-semibold text-base text-accent-darkGrey">
                      Automation Tester | User_79251_55428@yopmail.com |9956744783
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Teacher(s)</p>
                    <p className="font-semibold text-base text-accent-darkGrey">Test D7.5</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Announced By</p>
                    <p className="font-semibold text-base text-accent-darkGrey">National Admin Test Venue</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-accent-lightGrey">Course Revenue</p>
                    <p className="font-semibold text-base text-accent-darkGrey">EUR 600.00</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="mt-8">
        <p className="text-2xl font-semibold">Deposit of Offline Revenue</p>
        <div className="mt-4">
          <FormProvider {...methods}>
            <CourseTable />
          </FormProvider>
        </div>
        <div className="mt-8 flex justify-center gap-4 pb-7">
          <Button variant="outline" className="text-base font-bold py-3 px-6 text-primary border-primary">
            Previous
          </Button>
          <Button className="text-base font-bold py-3 px-6">Next</Button>
        </div>
      </div>
    </div>
  )
}

export default Revenue

function CourseTable() {
  // Hook to manage dynamically added fields in the form
  const { append, remove } = useFieldArray({
    name: 'deposit'
  })

  // const formData = useWatch({ name: "accommodation" });

  const { watch } = useFormContext()

  const formData = watch()

  // Effect to add initial data if no fees are present
  useEffect(() => {
    if (!formData?.deposit || formData?.deposit.length <= 0) {
      append({
        id: '',
        depositDate: '',
        accomodationType: undefined
      })
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <DataTable columns={columns(append, remove, formData?.deposit)} data={formData?.deposit || []} />
    </div>
  )
}

// Setting a property on the CourseTable function to indicate it has a layout
CourseTable.noLayout = false

// Definition of columns for the DataTable
const columns = (append: any, remove: any, formData: any) => [
  // Column for id
  {
    id: 'id',
    header: () => <div>#</div>,
    cell: ({ row }: any) => {
      return <div className="font-semibold text-sm">{row.index + 1}</div>
    }
  },

  // Column for deposit date
  {
    id: 'depositDate',
    header: () => <div className="font-semibold text-sm">Deposit date</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange }
      } = useController({
        name: `deposit[${row.index}].depositDate`
      })

      return (
        <div>
          {/* Input field for depositDate */}
          <Input
            value={value}
            onChange={val => {
              onChange(val?.target?.value)
            }}
            className="rounded-xl"
          />
        </div>
      )
    }
  },

  // Column for deposit amount
  {
    id: 'depositAmount',
    header: () => <div className="font-semibold text-sm">Deposit amount (EUR)</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange }
      } = useController({
        name: `deposit[${row.index}].depositAmount`
      })

      return (
        <div>
          {/* Input field for depositAmount */}
          <Input
            value={value}
            onChange={val => {
              onChange(val?.target?.value)
            }}
            className="rounded-xl"
          />
        </div>
      )
    }
  },

  // Column for notes
  {
    id: 'notes',
    header: () => <div className="font-semibold text-sm">Notes</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange }
      } = useController({
        name: `deposit[${row.index}].notes`
      })

      return (
        <div>
          {/* Input field for notes */}
          <Input
            value={value}
            onChange={val => {
              onChange(val?.target?.value)
            }}
            className="rounded-xl"
          />
        </div>
      )
    }
  },

  // Column for Actions
  {
    id: 'Actions',
    header: () => <div className="font-semibold text-sm">Actions</div>,
    cell: ({ row }: any) => {
      const isLastRow = row.index === formData?.length - 1
      const isFirstRow = row.index === 0

      // Function to add a new row
      const handleAddRow = () => {
        append({
          accomodationFee: '',
          accomodationSpots: '',
          accomodationType: undefined
        })
      }

      // Function to delete a row
      const handleDeleteRow = (index: number) => {
        remove(index)
      }
      return (
        <div className="w-[150px] flex gap-4">
          {/* Button to add a new row */}
          {isLastRow && (
            <div
              onClick={handleAddRow}
              className="flex flex-row gap-1 justify-center items-center cursor-pointer text-[#7677F4] font-semibold text-sm"
            >
              <Add />
              Add
            </div>
          )}
          {/* Button to delete a row */}

          <div
            onClick={() => handleDeleteRow(row.index)}
            className="flex flex-row gap-1 justify-center items-center text-[#7677F4] cursor-pointer font-semibold text-sm"
          >
            <Delete />
            <div>Delete</div>
          </div>
        </div>
      )
    }
  }
]
