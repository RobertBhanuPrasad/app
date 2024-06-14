import { AddOrEditVenue } from '@components/course/newCourse/NewCourseStep3'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from 'src/ui/dialog'
import { Label } from 'src/ui/label'
import { RadioGroup, RadioGroupCircleItem } from 'src/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/ui/select'

export const NewEventStep3 = () => {
  return (
    <div className="space-y-8 w-full">
      <div>
        <EventVenue />
      </div>
      <EventSchedules />
    </div>
  )
}

const EventSchedules = () => {
  return (
    <div className="flex flex-col gap-5">
      <EventSchedulesHeader />
      <EventRepeat />
    </div>
  )
}

const repeatNames = () => [
  {
    value: 1,
    label: 'Never Repeate'
    
  },
  {
    value: 2,
    label: 'Daily'
    
  },
  {
    value: 3,
    label: 'Weekley'
    
  },
  {
    value: 4,
    label: 'Monthly'
    
  }
]
const EventRepeat = () => {
  const names = repeatNames();
  return (
    <div className="flex flex-col gap-2 text-[#333333] ">
      Repeat
      <div className="w-[257px]">
        <Select value={undefined} onValueChange={() => {}}>
          <SelectTrigger className="w-[257px]">
            <SelectValue placeholder={'Never Repeat'} />
          </SelectTrigger>
          <SelectContent>
          
          {names.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const EventSchedulesHeader = () => {
  return (
    <div className="h-9 flex">
      <div className="text-base text-[#333333] flex items-center">Event Date and Time</div>
      <div className="flex gap-4 w-[434px] ml-auto">
        <div className="w-[161px]">
          <Select value={undefined} onValueChange={() => {}}>
            <SelectTrigger className="w-[161px]" error={undefined}>
              <SelectValue placeholder={'SelectFormate'} />
            </SelectTrigger>
            <SelectContent className="w-[161px]">happy</SelectContent>
          </Select>
        </div>
        <div className="w-[257px]">
          <Select value={undefined} onValueChange={() => {}}>
            <SelectTrigger className="w-[257px]">
              <SelectValue placeholder={'Select Time Zone'} />
            </SelectTrigger>
            <SelectContent>time zone</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

const EventVenue = () => {
  const [openAddNewVenue, setOpenAddNewVenue] = useState(false)
  const handleOpenEditNewVenue = () => {
    setOpenAddNewVenue(true)
  }

  const handleAddNewVenue = () => {
    setOpenAddNewVenue(false)
  }

  const handleOpenAddNewVenue = () => {
    // we are making the state varaible to false for not showing the warning message so that after
    // closing the dialog it will not show the data

    setOpenAddNewVenue(true)
  }

  return (
    <div>
      <RadioGroup className="flex flex-row gap-7">
        <Label className="flex-[1]">
          <div className="rounded-[16px] h-[118px] relative flex py-[24px] px-6 flex-col">
            <div className="text-[#7677F4] text-[16px] font-semibold flex flex-row gap-[12px]">
              <RadioGroupCircleItem
                value={'existing-venue'}
                id="existing-venue"
                className=" !bg-[#7677F4] border !border-[#D6D7D8] border-[1.5px]"
              />

              {/* If we not selected the existing venue then it is not in the position moving to the left so if we not selected then we are adjusting it with the ml */}
              <div>existing-venue</div>
            </div>
          </div>
        </Label>

        <Label className="flex-[1]">
          <div>
            <Dialog open={openAddNewVenue} onOpenChange={setOpenAddNewVenue}>
              <DialogTrigger onClick={handleOpenAddNewVenue} className="flex-[1]">
                <div className="h-[118px] w-[400px] text-[#7677F4] text-[15px]  rounded-[16px] border break-all border-[#7677F4] px-4 py-6 ">
                  + add new venue
                </div>
              </DialogTrigger>
              <DialogContent className="!w-[636px] !h-[430px] pt-6 px-[25px] !rounded-[24px]">
                <AddOrEditVenue handleSubmit={handleAddNewVenue} />
              </DialogContent>
            </Dialog>
          </div>
        </Label>
      </RadioGroup>
    </div>
  )
}

export const NewVenueEventDetails = () => {
  return (
    <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666] h-full overflow-y-scroll"></div>
  )
}
