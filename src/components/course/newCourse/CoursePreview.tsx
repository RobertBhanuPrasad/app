import { DataTable } from '@components/DataTable'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from 'src/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from 'src/ui/dialog'
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
import { AccommodationFeeMode, ResidentialCourse, columns } from './NewCourseStep5'
import NewCourseStep6 from './NewCourseStep6'

export default function Task3() {
  const { watch } = useFormContext()

  const formData = watch()
  const { append, remove } = useFieldArray({
    name: 'accommodation'
  })
  return (
    <main className="w-[1254px] h-[1300px] border m-20 ">
      <section className="w-[1254px] h-[144px] gap-4 ">
        <div className="flex">
          <h1 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-900">
            basic Details
          </h1>
          <br />
          <br></br>

          <Dialog>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">hiiii</div>
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
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Creater</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              I am teaching this course
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Organization
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Name of the organization{' '}
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Program Organizer
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              {' '}
              Jenny Wilson
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              is geo restriction applicable for registrations
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">Yes</h2>
          </div>
        </div>{' '}
        <br />
        <div>
          <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
            Registration via 3rd party gateway
          </h3>
          <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600"> No</h2>
        </div>
      </section>
      <br />
      <hr></hr>
      <br />
      {/* <EditModal
        isOpen={isEditModalOpen}
        closeModal={closeEditModal}
        userDetails={userDetails}
        updateUserDetails={updateUserDetails}
      /> */}
      {/* ------------------------------------------------------ */}
      <section className="w-full max-w-[1254px] h-[281px] gap-4">
        <div className="flex">
          <h1 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-900">
            Course Details
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">hiiii</div>
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
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <br />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Course Type
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Shellendra Kamble
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Teacher</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Cameron Williamson
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              language(s) Course is taught in{' '}
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              English
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Available language(s) for transiation
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">French</h2>
          </div>
        </div>{' '}
        <br></br>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Max Capacity
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">850</h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Program Visibility
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">Public</h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Online zoom URL
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Http://artofliving.zoom.us/
              <br />
              j/97973938580
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Country(s) from where registrations are allowed
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Insia, Germany
            </h2>
          </div>
        </div>
        <br />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              is geo restriction applicable for registrations
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">Yes</h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Course Description
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Nemo enim ipsam voluptatem quia coluptas sit aspernatur aut odit aut...
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Course Notes
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Nemo enim ipsam voluptatem quia coluptas sit aspernatur aut odit aut...
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Available language(s) for transiation
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">French</h2>
          </div>
        </div>
      </section>
      <hr />
      <br />
      [10:06 AM] {/* ------------------------------------------------------------------------------- */}
      <section className="w-full max-w-[1254px] h-[177px] gap-4">
        <div className="flex">
          <h1 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-900">
            Time and Venue
          </h1>
          <br />
          <br />
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">three</div>
            </DialogTrigger>
            <DialogContent className="w-auto">
              <div>
                <div>
                  {formData?.courseTypeSettings?.is_online_program ? <OnlineProgram /> : <div>Render Venue</div>}
                </div>
                <Schedules />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Venue Address
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              2118 Thornridge Cir.Syracuse,connecticut,Kentucky 35624
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Time Formate{' '}
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              12 Hours
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Time Zone</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              UTC -04:00, Canada
            </h2>
          </div>

          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Sessions</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              08 Feb, 2024 |09:00 am to 12:00 pm
            </h2>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              08 Feb, 2024 |03:00 am to 6:00 pm
            </h2>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              09 Feb, 2024 |09:00 am to 12:00 pm
            </h2>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              09 Feb, 2024 |09:00 am to 12:00 pm
            </h2>
          </div>
        </div>{' '}
        <br></br>
      </section>
      <hr></hr>
      <br />
      {/* {/* {/* ------------------------------------------------------------------------------- */}
      <section className="w-[1254px] h-[224px] gap-4">
        <div className="flex">
          <h1 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-900">
            Fees Information
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">hiiii</div>
            </DialogTrigger>
            <DialogContent className="w-[636px] h-[365px]">
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <br />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Regular</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 160.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Student</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 140.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Repeater</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 120.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">Senior</h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 100.00
            </h2>
          </div>
        </div>{' '}
        <br />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Early Bird Regular
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 140.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Early Bird Student
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 120.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Early Bird Repeater
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 100.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Early Bird Senior
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 80.00
            </h2>
          </div>
        </div>
        <br />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Early Bird Cut-off period
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              16 Feb,2024(15 Days)
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Disable Pay Later Label123?
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">Yes</h2>
          </div>
        </div>
      </section>
      <hr />
      <br />
      {/* ------------------------------------------------------------------ */}
      <section className="w-[1254px] h-[102px] gap-4">
        <div className="flex">
          <br />
          <br />
          <h1 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-900">
            Accommodation Information
          </h1>
          <br />
          <br />
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">accc</div>
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
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Single Accomodation
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 100.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              2 Person Sharing (Men){' '}
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 80.00
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              3 Person Sharing (Men)
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              MYR 60.00
            </h2>
          </div>

          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Accommodation fee payment mode
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Pay Online
            </h2>
          </div>
        </div>
      </section>
      <hr></hr>
      <br />
      [10:06 AM] {/* ----------------------------------------------------------------------------------- */}
      <section className="w-[1254px] h-[102px] gap-4">
        <div className="flex">
          <h1 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-900">
            Contact Info
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-16 h-18 ml-4 text-blue-600 ">hiiii</div>
            </DialogTrigger>
            <DialogContent className="w-[1000px] h-[365px]">
              <NewCourseStep6 />
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <br />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Contact Email
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              course123@aol.com
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Contact Phone{' '}
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              +91 5248745985
            </h2>
          </div>
          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              Contact Name
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              Cameron Williamson
            </h2>
          </div>

          <div>
            <h3 className="font-open-sans text-sm font-normal leading-[19.07px] text-left text-gray-500">
              BCC registration confirmation email
            </h3>
            <h2 className="font-open-sans text-base font-semibold leading-[21.79px] text-left text-gray-600">
              course123@aol.com
            </h2>
          </div>
        </div>{' '}
        <br></br>
      </section>
      <hr></hr>
      <br />
      <center>
        <Button className="mt-[50px] bg-indigo-500 w-[121px] h-[46px] p-[12px 24px] gap-2 rounded-tl-[12px]">
          Continue
        </Button>
      </center>
    </main>
  )
}
