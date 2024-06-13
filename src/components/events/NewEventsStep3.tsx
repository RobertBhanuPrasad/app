import { AddOrEditVenue } from '@components/course/newCourse/NewCourseStep3'
import Delete from '@public/assets/Delete'
import EditIcon from '@public/assets/EditIcon'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from 'src/ui/dialog'
import { Label } from 'src/ui/label'
import { RadioGroup, RadioGroupCircleItem } from 'src/ui/radio-group'

export const NewEventStep3 = () => {
  return <div className="space-y-8 w-full">
    <EventVenue/>
  </div>
}

const EventVenue = () => {
  const [openAddNewVenue, setOpenAddNewVenue] = useState(false);
  const handleOpenEditNewVenue = () => {
    
    setOpenAddNewVenue(true);
  };

  const handleAddNewVenue = () => {
    setOpenAddNewVenue(false)
  }

  const handleOpenAddNewVenue = () => {
    // we are making the state varaible to false for not showing the warning message so that after
    // closing the dialog it will not show the data
    
    setOpenAddNewVenue(true);
  };

  return (
    <div>
      <RadioGroup className="flex flex-row gap-7">
        <Label className="flex-[1]">
          <div className='rounded-[16px] h-[118px] relative flex py-[24px] px-6 flex-col'>
          <div className="text-[#7677F4] text-[16px] font-semibold flex flex-row gap-[12px]">
                <RadioGroupCircleItem
                  value={"existing-venue"}
                  id="existing-venue"
                  className=" !bg-[#7677F4] border !border-[#D6D7D8] border-[1.5px]"
                />
              
              {/* If we not selected the existing venue then it is not in the position moving to the left so if we not selected then we are adjusting it with the ml */}
              <div>
              existing-venue
              </div>
            </div>

          </div>
          
        </Label>

        <Label  className="flex-[1]">
            <div
              className="h-[118px]  rounded-[16px] border break-all border-[#7677F4] px-4 py-6 "
               
            >
              <Dialog open={openAddNewVenue} onOpenChange={setOpenAddNewVenue}>
            <DialogTrigger onClick={handleOpenAddNewVenue} className="flex-[1]">
              <div className="h-[118px] rounded-[16px] text-base border flex items-center justify-center text-[#7677F4]">
                + add new venue
              </div>
            </DialogTrigger>
            <DialogContent className="!w-[636px] !h-[430px] pt-6 px-[25px] !rounded-[24px]">
              <AddOrEditVenue
                handleSubmit={handleAddNewVenue}
              />
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
    <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666] h-full overflow-y-scroll">
   
  </div>
  );
};
