import CalenderIcon from '@public/assets/CalenderIcon'
import ClearAllIcon from '@public/assets/ClearAllIcon'
import CrossIcon from '@public/assets/CrossIcon'
import { useSelect } from '@refinedev/core'
import { DateRangePickerComponent } from 'pages/Courses/FindCourse'
import { useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/ui/accordion'
import { Button } from 'src/ui/button'
import CustomSelect from 'src/ui/custom-select'
import { Dialog, DialogContent, DialogTrigger } from 'src/ui/dialog'
import { Input } from 'src/ui/input'
import { Label } from 'src/ui/label'
import { RadioGroup, RadioGroupItem } from 'src/ui/radio-group'
import { ScrollArea } from 'src/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'src/ui/select'
import { Separator } from 'src/ui/separator'

const Filters = () => {
  const [open, setOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [courseStatusTab, setCourseStatusTab] = useState<number[]>([])
  const [accountingStatusTab, setAccountingStatusTab] = useState<number[]>([])
  const [centerTab, setCenterTab] = useState<number[]>([])
  const [cityTab, setCityTab] = useState<number[]>([])
  const [stateTab, setStateTab] = useState<number[]>([])
  const [residentialTab, setResidentialTab] = useState<number[]>([])
  const [courseFeeTab, setCourseFeeTab] = useState<number[]>([])
  const [checked, setChecked] = useState(0)
  const [selectItem, setSelectItem] = useState()

  // Function to handle Course Status Tab click
  const handleCourseStatusTabClick = (tab: any) => {
    if (!courseStatusTab.includes(tab)) setCourseStatusTab([...courseStatusTab, tab])
    else {
      setCourseStatusTab(courseStatusTab.filter(t => t !== tab))
    }
  }

  // Function to handle Residential Tab click
  const handleResidentialTabClick = (tab: any) => {
    if (!residentialTab.includes(tab)) setResidentialTab([...residentialTab, tab])
    else {
      setResidentialTab(residentialTab.filter(t => t !== tab))
    }
  }

  // Function to handle Course Accounting Status Tab click
  const handleAccountingStatusTabClick = (tab: any) => {
    if (!accountingStatusTab.includes(tab)) setAccountingStatusTab([...accountingStatusTab, tab])
    else {
      setAccountingStatusTab(accountingStatusTab.filter(t => t !== tab))
    }
  }

  // Function to handle Active Center Tab click
  const handleCenterTabClick = (tab: any) => {
    if (!centerTab.includes(tab)) setCenterTab([...centerTab, tab])
    else {
      setCenterTab(centerTab.filter(t => t !== tab))
    }
  }

  // Function to handle Active State Tab click
  const handleStateTabClick = (tab: any) => {
    if (!stateTab.includes(tab)) setStateTab([...stateTab, tab])
    else {
      setStateTab(stateTab.filter(t => t !== tab))
    }
  }

  // Function to handle Active City Tab click
  const handleCityTabClick = (tab: any) => {
    if (!cityTab.includes(tab)) setCityTab([...cityTab, tab])
    else {
      setCityTab(cityTab.filter(t => t !== tab))
    }
  }

  // Function to handle Course Fee Tab click
  const handleCourseFeeTabClick = (tab: any) => {
    if (!courseFeeTab.includes(tab)) setCourseFeeTab([...courseFeeTab, tab])
    else {
      setCourseFeeTab(courseFeeTab.filter(t => t !== tab))
    }
  }

  {
    /*Course Status Data*/
  }
  const courseStatusData = ['Active', 'Canceled', 'Full', 'Completed', 'Pending Review', 'Declined']

  {
    /*Course Accounting Status Data*/
  }
  const courseAccountingStatusData = ['Not Submitted', 'Rejected', 'Closed', 'Pending Review']

  {
    /*State Data*/
  }
  const stateData = [
    {
      value: 1,
      key: 'State 1'
    },
    {
      value: 1,
      key: 'State 2'
    },
    {
      value: 2,
      key: 'State 3'
    }
  ]

  {
    /*City Data*/
  }
  const cityData = ['City 1', 'City 2', 'City 3']

  {
    /*Center Data*/
  }
  const centerData = ['Center 1', 'Center 2', 'Center 3']

  {
    /* Course Fees Data*/
  }
  const courseFeesData = ['is default', 'Custom']

  {
    /*Course Visibility Data*/
  }
  const courseVisibilityData = ['Public', 'Private']

  {
    /*Residential Course Data*/
  }
  const residentialCourseData = ['Yes', 'No']

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Filter By</p>
        <CrossIcon width={16} height={16} fill="#333333" />
      </div>
      <Separator />
      <ScrollArea className="h-[75vh] relative">
        <Accordion
          type="multiple"
          defaultValue={[
            'item-1',
            'item-2',
            'item-3',
            'item-4',
            'item-5',
            'item-6',
            'item-7',
            'item-8',
            'item-9',
            'item-10',
            'item-11',
            'item-12',
            'item-13'
          ]}
        >
          {/* Course Name Accordion */}
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-0 font-semibold pr-3">Course Name</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-normal">Name</Label>
                  <Input placeholder="Sumit Test" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-normal">Email</Label>
                  <Input placeholder="sumiittest@gmail.com" type="email" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-normal">Phone</Label>
                  <Input placeholder="+916789376838" type="number" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Status Accordion */}
          <AccordionItem value="item-2" className="border-none ">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Course Status</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div className="flex gap-2 flex-wrap">
                {courseStatusData.map((status, index) => (
                  <div key={index}>
                    <Button
                      className={`rounded-full text-sm font-normal ${
                        courseStatusTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                      }`}
                      variant="outline"
                      onClick={() => {
                        handleCourseStatusTabClick(index)
                        setIsClicked(!isClicked)
                      }}
                    >
                      {status}
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Accounting Status Accordion */}
          <AccordionItem value="item-3" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Course Accounting Status
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div className="flex gap-2 flex-wrap">
                {courseAccountingStatusData.map((status, index) => (
                  <Button
                    className={`rounded-full text-sm font-normal ${
                      accountingStatusTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    variant="outline"
                    onClick={() => {
                      handleAccountingStatusTabClick(index)
                      setIsClicked(!isClicked)
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Accounting Closure Date  Accordion */}
          <AccordionItem value="item-4" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Course Accounting Closure Date
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <Dialog open={open}>
                <p>Date Range</p>
                <DialogTrigger asChild>
                  <Button onClick={() => setOpen(true)} className="w-full  gap-2 justify-start mt-2" variant="outline">
                    <div>
                      <CalenderIcon />
                    </div>
                    <p className="text-sm font-normal">Select the Date Range</p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
                  <DateRangePickerComponent setOpen={setOpen} />
                </DialogContent>
              </Dialog>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* Course Visibility Accordion */}
          <AccordionItem value="item-5" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Course Visibility</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <RadioGroup defaultValue="Public">
                <div className="flex gap-2">
                  {courseVisibilityData.map((type, index) => (
                    <Button
                      className={`rounded-lg flex gap-2 ${checked === index && 'text-primary'}`}
                      variant="outline"
                      onClick={() => {
                        setChecked(index)
                      }}
                    >
                      <RadioGroupItem value={type} />
                      <p className={`text-sm font-normal`}>{type}</p>
                    </Button>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* State Accordion */}
          <AccordionItem value="item-6" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">State</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {stateData.map(level => (
                        <SelectItem value={level.key}>{level.key}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-2">
                {stateData.map((type, index) => (
                  <Button
                    className={`rounded-full text-sm font-normal ${
                      stateTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    variant="outline"
                    onClick={() => {
                      handleStateTabClick(index)
                      setIsClicked(!isClicked)
                    }}
                  >
                    {type.key}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator />

          {/* City Accordion */}
          <AccordionItem value="item-7" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">City</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cityData.map(level => (
                        <SelectItem value={level}>{level}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-2">
                {cityData.map((type, index) => (
                  <Button
                    className={`rounded-full text-sm font-normal ${
                      cityTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    variant="outline"
                    onClick={() => {
                      handleCityTabClick(index)
                      setIsClicked(!isClicked)
                    }}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Center Accordion */}
          <AccordionItem value="item-8" className="border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Center</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {centerData.map(level => (
                        <SelectItem value={level}>{level}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-2">
                {centerData.map((type, index) => (
                  <Button
                    className={`rounded-full text-sm font-normal ${
                      centerTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    variant="outline"
                    onClick={() => {
                      handleCenterTabClick(index)
                      setIsClicked(!isClicked)
                    }}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Residential Course Accordion */}
          <AccordionItem value="item-9" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Residential Course</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div className="flex gap-2 flex-wrap">
                {residentialCourseData.map((type, index) => (
                  <Button
                    className={`rounded-full text-sm font-normal ${
                      residentialTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    variant="outline"
                    onClick={() => {
                      handleResidentialTabClick(index)
                      setIsClicked(!isClicked)
                    }}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Program Organizer Accordion */}
          <AccordionItem value="item-10" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Program Organizer</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Organizer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {centerData.map(level => (
                        <SelectItem value={level}>{level}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Teacher Name Accordion */}
          <AccordionItem value="item-11" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Teacher Name</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {centerData.map(level => (
                        <SelectItem value={level}>{level}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Course Fees Accordion */}
          <AccordionItem value="item-12" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">Course Fees</AccordionTrigger>
            <AccordionContent className="pb-5 pr-3">
              <div className="flex gap-2 flex-wrap">
                {courseFeesData.map((status, index) => (
                  <Button
                    className={`rounded-full text-sm font-normal ${
                      courseFeeTab.includes(index) ? 'bg-primary text-white' : 'bg-white'
                    }`}
                    variant="outline"
                    onClick={() => {
                      handleCourseFeeTabClick(index)
                      setIsClicked(!isClicked)
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Reconciliation Status Accordion */}
          <AccordionItem value="item-13" className=" border-none">
            <AccordionTrigger className="text-base pb-4 pt-5 font-semibold pr-3">
              Reconciliation Status
            </AccordionTrigger>
            <AccordionContent className="pb-5 pr-3"></AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
      <div className="flex left-0 items-center  gap-4 absolute bottom-0 h-[67px] w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] justify-end pr-6">
        <div className="flex gap-1 items-center cursor-pointer">
          <ClearAllIcon />
          <p className="text-primary"> Clear All</p>
        </div>
        <Button>Apply</Button>
      </div>
    </div>
  )
}

export default Filters
