import { DataTable } from '@components/DataTable'
import EditIcon from '@public/assets/EditIcon'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { PROGRAM_ORGANIZER_TYPE } from 'src/constants/OptionLabels'
import { Button } from 'src/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from 'src/ui/dialog'
import { getOptionValueObjectById } from 'src/utility/GetOptionValuesByOptionLabel'
import { OrganizationDropDown, ProgramOrganizerDropDown, RadioCards, RegistrationGateway } from './NewCourseStep1'
import {
  AllowedCountriesDropDown,
  AssistantTeachersDropDown,
  CourseNameDropDown,
  CourseTypeDropDown,
  GeoRestriction,
  LanguageDropDown,
  LanguageTranslationDropDown,
  MaximumCapacity,
  TeachersDropDown,
  Visibility
} from './NewCourseStep2'
import { OnlineProgram, Schedules } from './NewCourseStep3'
import CourseTable from './NewCourseStep4'
import { AccommodationFeeMode, ResidentialCourse, columns } from './NewCourseStep5'
import NewCourseStep6 from './NewCourseStep6'

export default function NewCourseReviewPage() {
  const { append, remove } = useFieldArray({
    name: 'accommodation'
  })
  const { t } = useTranslation('common')
  const { getValues } = useFormContext()
  const [openBasicDetails, setOpenBasicDetails] = useState(false)
  const [openCourseDetails, setOpenCourseDetails] = useState(false)
  const [openVenueDetails, setOpenVenueDetails] = useState(false)
  const [openAccomidationDetails, setOpenAccomidationDetails] = useState(false)
  const [openContactDetails, setOpenContactDetails] = useState(false)
  const [openFeesDetails, setOpenFeesDetails] = useState(false)

  const formData = getValues()
  const programOrganizedBy = getOptionValueObjectById(PROGRAM_ORGANIZER_TYPE, formData?.programOrganizedBy)
  const organization = getOptionValueObjectById(PROGRAM_ORGANIZER_TYPE, formData?.organization)
  console.log('form Data is', getValues())

  return (
    <div className="w-full text-base max-h-fit">
      {/* Basic Details */}
      <section className="w-full pb-8 text-base border-b">
        {/* title section */}
        <div className="flex items-center gap-2 ">
          <p className="text-accent-primary">Basic Details</p>
          <Dialog open={openBasicDetails}>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">
                <div onClick={() => setOpenBasicDetails(true)} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[1070px]">
              <div>
                <RadioCards />
                <div className="mt-8 flex flex-row gap-7 ">
                  <div className="flex gap-1 flex-col">
                    <OrganizationDropDown />
                  </div>
                  <div className="flex gap-1 flex-col">
                    <ProgramOrganizerDropDown />
                  </div>
                </div>
                <RegistrationGateway />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
                <Button onClick={() => setOpenBasicDetails(false)} className="w-[100px]">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* body */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Creator</p>
            <p className="font-semibold truncate text-accent-secondary">{programOrganizedBy?.value}</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Organization</p>
            <p className="font-semibold truncate text-accent-secondary">Name of the organization</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Program Organizer</p>
            <p className="font-semibold truncate text-accent-secondary">Jenny Wilson</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Is geo restriction applicable for registrations</p>
            <p className="font-semibold truncate text-accent-secondary">Yes</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Registration via 3rd party gateway</p>
            <p className="font-semibold truncate text-accent-secondary">No</p>
          </div>
        </div>
      </section>
      {/* Course Details */}
      <section className="w-full py-8 text-base border-b">
        {/* title section */}
        <div className="flex items-center gap-2 ">
          <p className="text-accent-primary">Course Details</p>
          <Dialog open={openCourseDetails}>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">
                <div onClick={() => setOpenCourseDetails(true)} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[1070px]">
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                <div className="w-80 h-20">
                  <CourseTypeDropDown />
                </div>

                <div className="w-80 h-20">
                  <CourseNameDropDown />
                </div>

                <div className="w-80 h-20">
                  <TeachersDropDown />
                </div>
                <div className="w-80 h-20">
                  <AssistantTeachersDropDown />
                </div>

                <div className="w-80 h-20">
                  <Visibility />
                </div>

                <div className="w-80 h-20">
                  <GeoRestriction />
                </div>
                <div className="w-80 h-20">
                  <GeoRestriction />
                </div>
                <div className="w-80 h-20">
                  <LanguageDropDown />
                </div>
                <div className="w-80 h-20">
                  <LanguageTranslationDropDown />
                </div>
                <div className="w-80 h-20">
                  <AllowedCountriesDropDown />
                </div>
                <div className="w-80 h-20">
                  <MaximumCapacity />
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
                <Button onClick={() => setOpenCourseDetails(false)} className="w-[100px]">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* body */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Course Type</p>
            <p className="font-semibold truncate text-accent-secondary">Shailendra Kamble</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Teacher</p>
            <p className="font-semibold truncate text-accent-secondary">Cameron Williamson</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Language(s) course is taught in</p>
            <p className="font-semibold truncate text-accent-secondary">English</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Available language(s) for translation</p>
            <p className="font-semibold truncate text-accent-secondary">French</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Max Capacity</p>
            <p className="font-semibold truncate text-accent-secondary">850</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Program Visibility</p>
            <p className="font-semibold truncate text-accent-secondary">Public</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Online zoom URL</p>
            <p className="font-semibold truncate text-accent-secondary">https://artofliving.zoom.us/j/97973938580</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Country(s) from where registrations are allowed</p>
            <p className="font-semibold truncate text-accent-secondary">India, Germany</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Is geo restriction applicable for registrations</p>
            <p className="font-semibold truncate text-accent-secondary">Yes</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Course Description</p>
            <p className="font-semibold truncate text-accent-secondary">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma
            </p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Course Notes</p>
            <p className="font-semibold truncate text-accent-secondary">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma
            </p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Email Notes</p>
            <p className="font-semibold truncate text-accent-secondary">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma
            </p>
          </div>
        </div>
      </section>
      {/* Time and Venue */}
      <section className="w-full py-8 text-base border-b">
        {/* title section */}
        <div className="flex items-center gap-2 ">
          <p className="text-accent-primary">Time and Venue</p>
          <Dialog open={openVenueDetails}>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">
                <div
                  onClick={() => {
                    setOpenVenueDetails(true)
                  }}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[1200px]">
              <div>
                <div>
                  {formData?.courseTypeSettings?.is_online_program ? <OnlineProgram /> : <div>Render Venue</div>}
                </div>
                <Schedules />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
                <Button
                  onClick={() => {
                    setOpenVenueDetails(false)
                  }}
                  className="w-[100px]"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* body */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Venue Address</p>
            <p className="font-semibold truncate text-accent-secondary">
              2118 Thornridge Cir. Syracuse, Connecticut, Kentucky 35624
            </p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Time Format</p>
            <p className="font-semibold truncate text-accent-secondary">12 Hours</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Sessions</p>
            <p className="font-semibold truncate text-accent-secondary">
              08 Feb, 2024 |09:00 am to 12:00 pm 08 Feb, 2024 |03:00 pm to 06:00 pm 09 Feb, 2024 |09:00 am to 12:00 pm
              09 Feb, 2024 |09:00 am to 12:00 pm
            </p>
          </div>
        </div>
      </section>
      {/* Fees Information */}
      <section className="w-full py-8 text-base border-b">
        {/* title section */}
        <div className="flex items-center gap-2 ">
          <p className="text-accent-primary">Fees Information</p>
          <Dialog open={openFeesDetails}>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">
                <div onClick={() => setOpenFeesDetails(true)} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[1070px]">
              <div>
                <CourseTable />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
                <Button onClick={() => setOpenFeesDetails(false)} className="w-[100px]">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* body */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Regular</p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Student </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Repeater </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Senior </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Early Bird Regular </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Early Bird Student </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Early Bird Repeater </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Early Bird Senior </p>
            <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Early bird cut-off period</p>
            <p className="font-semibold truncate text-accent-secondary">16 Feb, 2024 (15 Days)</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Disable Pay Later Label123?</p>
            <p className="font-semibold truncate text-accent-secondary">Yes</p>
          </div>
        </div>
      </section>
      {/* Accommodation Information */}
      <section className="w-full py-8 text-base border-b">
        {/* title section */}
        <div className="flex items-center gap-2 ">
          <p className="text-accent-primary">Accommodation Information</p>
          <Dialog open={openAccomidationDetails}>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">
                {' '}
                <div
                  onClick={() => {
                    setOpenAccomidationDetails(true)
                  }}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[1122px]">
              <div className="flex flex-col gap-8">
                <ResidentialCourse />
                <DataTable
                  tableStyles="w-[1072px]"
                  columns={columns(append, remove, formData?.accommodation)}
                  data={formData?.accommodation || []}
                />
                <AccommodationFeeMode />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
                <Button
                  onClick={() => {
                    setOpenAccomidationDetails(false)
                  }}
                  className="w-[100px]"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* body */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Single Accomodation</p>
            <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">2 Person Sharing (Men)</p>
            <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">3 Person Sharing (Men)</p>
            <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Accommodation fee payment mode</p>
            <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
          </div>
        </div>
      </section>
      {/* Contact Info */}
      <section className="w-full py-8 text-base ">
        {/* title section */}
        <div className="flex items-center gap-2 ">
          <p className="text-accent-primary">Contact Info</p>
          <Dialog open={openContactDetails}>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">
                {' '}
                <div
                  onClick={() => {
                    setOpenContactDetails(true)
                  }}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[1000px]">
              <NewCourseStep6 />
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
                <Button
                  onClick={() => {
                    setOpenContactDetails(false)
                  }}
                  className="w-[100px]"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* body */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light ">Contact Email</p>
            <p className="font-semibold truncate text-accent-secondary">course123@aol.com</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Contact Phone</p>
            <p className="font-semibold truncate text-accent-secondary">+91 5248745985</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">Contact Name</p>
            <p className="font-semibold truncate text-accent-secondary">Cameron Williamson</p>
          </div>
          <div className=" min-w-72">
            <p className="text-sm font-normal text-accent-light">BCC registration confirmation email</p>
            <p className="font-semibold truncate text-accent-secondary">course123@aol.com</p>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center ">
        <Button>Continue</Button>
      </div>
    </div>
  )
}
