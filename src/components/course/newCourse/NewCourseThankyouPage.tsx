'use client'
import { getCourseStatusColorBasedOnStatusId } from '@components/courseBusinessLogic'
import InstagramIcon from '@public/images/InstagramIcon.png'
import ThankyouGif from '@public/images/ThankYou.png'
import WhatsappIcon from '@public/images/WhatsappIcon.png'
import facebookIcon from '@public/images/facebookIcon.png'
import linkedInIcon from '@public/images/linkedInIcon.png'
import twitterIcon from '@public/images/twitterIcon.png'
import { CopyIcon } from '@radix-ui/react-icons'
import { useOne } from '@refinedev/core'
import { Circle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { translatedText } from 'src/common/translations'
import { PROGRAM_STATUS, VISIBILITY } from 'src/constants/OptionLabels'
import { ACTIVE, PUBLIC } from 'src/constants/OptionValueOrder'
import { Button } from 'src/ui/button'
import { formatDateTime } from 'src/utility/DateFunctions'
import { getOptionValueObjectByOptionOrder } from 'src/utility/GetOptionValuesByOptionLabel'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'
import { useTranslation } from 'next-i18next';

const NewCourseThankyouPage = () => {
  const {t} = useTranslation(['common', "course.new_course", "new_strings"])
  const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false)
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false)
  const { programId,setNewCourseData } = newCourseStore()

  const router = useRouter()

  const copyText = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
 
/**
 * useEffect to reset the new course data when the component mounts.
 * This effect ensures that the new course data is set to null initially.
 * It runs only once upon component mount due to the empty dependency array.
 * Because when user click new course from thank you page then we don't need to getting default values that is why here we have to set newCourseData as null
 */
useEffect(() => {
  /**
   * Reset the new course data to null when the component mounts.
   * This ensures that any existing new course data is cleared.
   */
  setNewCourseData(null);
}, []);
 
 
  const handleCopyDetailsPageLink = (textToCopy: string) => {
    copyText(textToCopy)
    setCopiedDetailsPageLink(true)

    setTimeout(() => {
      setCopiedDetailsPageLink(false)
    }, 1000)
  }

  const handleCopyRegistrationLink = (textToCopy: string) => {
    copyText(textToCopy)
    setCopiedRegistrationLink(true)

    setTimeout(() => {
      setCopiedRegistrationLink(false)
    }, 1000)
  }
  const { data, isLoading: isThankyouPageDataIsLoading } = useOne({
    resource: 'program',
    id: programId,
    meta: {
      select:
        'online_url,visibility_id(*),program_code,program_type_id,status_id,time_zone_id,program_type_id(*),venue_id(*,center_id(name),state_id(name),city_id(name)),program_teachers(users(contact_id!inner(full_name))),program_schedules(start_time,end_time),status_id(id,name),registration_link,details_page_link'
    }
  })

  // Formatting teacher string
  const teachers = data?.data?.program_teachers
    ?.map((teacher: any) => {
      return teacher?.users?.contact_id?.full_name
    })
    .join(',')

  // Formatting the venue details

  let venue=""

  if(data?.data?.venue_id?.address){
    venue=venue+data?.data?.venue_id?.address+", "

  }
  if(data?.data?.venue_id?.name){
    venue=data?.data?.venue_id?.name+", "
  }

  if(data?.data?.venue_id?.city_id?.name){
    venue=venue+data?.data?.venue_id?.city_id?.name+", "

  }
  if(data?.data?.venue_id?.state_id?.name){
    venue=venue+data?.data?.venue_id?.state_id?.name

  }
  if(data?.data?.venue_id?.postal_code){
    venue=venue+", "+data?.data?.venue_id?.postal_code

  }

  const statusColorCode = getCourseStatusColorBasedOnStatusId(data?.data?.status_id?.id)?.colorCode
  const statusStyles = getCourseStatusColorBasedOnStatusId(data?.data?.status_id?.id)?.styles
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, ACTIVE)?.id
  // getting public visibility id to check whether the particular course is public or private.
  const publicVisibilityId = getOptionValueObjectByOptionOrder(VISIBILITY, PUBLIC)?.id

  return (
    <div>
      {isThankyouPageDataIsLoading ? (
        <div className="flex items-center justify-center h-16 bg-white shadow-md rounded-3xl">
          <div className='loader'></div>
        </div>
      ) : (
        <div className="relative pb-8 m-4 bg-white shadow-md rounded-3xl">
          {/* header : top buttons */}
          <div className="absolute flex items-center gap-4 right-6 top-4 rid-cols-2">
            <Button className={`width-[135px] rounded-[25px]  h-[25px] gap-2 ${statusStyles}`}>
              <Circle color={statusColorCode} fill={statusColorCode} size={5} className="text-[#FFB900]" />
              {translatedText(data?.data?.status_id?.name)}
            </Button>
          
              <Button variant="outline" className="text-indigo-600 border-indigo-600 " onClick={() => {router.replace('/courses/list')}}>
              {t("course.new_course:congratulations_page.go_to_course_listing")}
              </Button>
          
          </div>
          <Image src={ThankyouGif} alt="My Image" width={148} height={148} className="mx-auto" />
          <div className="mx-auto text-center max-w-fit ">
            <p className="text-2xl font-semibold text-accent-primary">{t("course.new_course:congratulations_page.congratulations")}</p>
            <p className="text-accent-secondary">{t("course.new_course:congratulations_page.you_have_successfully")}</p>
          </div>
          {/* body: Course details view section */}
          <div className="flex h-auto px-4 py-4 m-5 text-base border-2 border-indigo-600 border-dashed rounded-2xl bg-indigo-50">
            <div className="flex-[1] p-4 border-r border-light">
              <p className=" text-accent-secondary">{t("course_id")}</p>
                <p className="font-bold cursor-pointer text-accent-primary text-indigo-600 underline" onClick={()=>{router.replace(`/courses/${programId}`)}}>{data?.data?.program_code}
                </p>
            </div>
            <div className="flex-[1.5] p-4 border-r border-light">
              <p className="text-accent-secondary">{t("new_strings:course_name")}</p>
              <p className="font-bold text-accent-primary">{translatedText(data?.data?.program_type_id?.name)}</p>
            </div>
            <div className="flex-[1.5] p-4 border-r border-light">
              <p className="text-accent-secondary">{t("teachers")}</p>
              <p className="font-bold text-accent-primary">{teachers ? teachers : '-'}</p>
            </div>
            {/* // TODO need to do when the form filed is clear */}
            {/* If it is an online course in the venue section we have to show online text that can be hyperlinked which will take the user to the meeting url on click  */}
            {data?.data?.program_type_id?.is_online_program === true ? 
            (  <div className="flex-[2.5] p-4 border-r border-light">
              <p className="text-accent-secondary">{t("course.new_course:congratulations_page.venue")}</p>
              <p className="font-bold text-accent-primary">
                {data?.data?.online_url ? (
                  <a href={data?.data?.online_url} className="text-indigo-600 hover:text-indigo-800" target='_blank'>{t("new_strings:online")}</a>
                  ) : ( "-")}
             </p>
              </div>) :
            (
              // for offline we have to show the venue details 
            <div className="flex-[2.5] p-4 border-r border-light">
              <p className="text-accent-secondary">{t("course.new_course:congratulations_page.venue")}</p>
              <p className="font-bold text-accent-primary">{venue ? venue : '-'}</p>
            </div>
            )
          }
            <div className="flex-[2.5] p-4 ">
              <p className="text-accent-secondary">{t("course.new_course:congratulations_page.course_date")} (UTC 05:00)</p>
              {data?.data?.program_schedules?.map((data: any) => {
                return (
                  <p className="font-semibold truncate text-accent-secondary">
                    {formatDateTime(data?.start_time, data?.end_time)}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Thank you page footer  */}
          {data?.data?.status_id?.id === courseActiveStatusId && (
            <section>
              {/* TODO  : for now may-13 release it has to be hidden */}
              {/* <div className="">
                {/* <p className="mx-auto text-accent-secondary max-w-fit">{t("course.new_course:congratulations_page.share_in_social")}</p> */}
                {/* Social media icons */}
                {/* <div className="flex items-center justify-center gap-4 my-4">
                  <Image src={WhatsappIcon} alt="whats app icon"></Image>
                  <Image src={facebookIcon} alt="facebook icon"></Image>
                  <Image src={twitterIcon} alt="twitter icon"></Image>
                  <Image src={InstagramIcon} alt="Instagram icon"></Image>
                  <Image src={linkedInIcon} alt="Linked in icon"></Image>
                </div> */}
              {/* </div> */} 
              {/* <p className="mx-auto text-accent-secondary max-w-fit">{t("or")}</p> */}
              {/* Hyper links section */}
              {/* We have to display the links only when the course is active */}
              <div className="flex items-center justify-center gap-4 mt-4 ">
                <div className="relative">
                  <p className="absolute text-xs bg-white text-accent-secondary -top-[10px] left-4 ">
                    {t("registration_link")}
                  </p>
                  <div className="flex justify-between gap-2 p-3 border rounded-2xl min-w-72">
                    <h4 id="textToCopy" className="">
                      {data?.data?.registration_link}
                    </h4>
                    <div
                      onClick={() => {
                        handleCopyDetailsPageLink(data?.data?.registration_link)
                      }}
                      className="relative mt-1 cursor-pointer"
                    >
                      <CopyIcon />
                      {copiedDetailsPageLink ? (
                        <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                          {t("new_strings:copied")}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
                {/* TODO  for now scope this cx url is to be hidden */}
                {/* we are writing this conditions beacuse if the course is public then only we have to show the details page link */}
                {/* for the MVP-904 */}
                {/* {data?.data?.visibility_id?.id == publicVisibilityId && (
                  <div className="relative ">
                    <p className="absolute text-xs bg-white text-accent-secondary -top-[10px] left-4 ">
                      {t("details_page_link")}
                    </p>

                    <div className="flex justify-between gap-2 p-3 border rounded-2xl min-w-72">
                      <h4 id="textToCopy1" className="">
                        {data?.data?.details_page_link}
                      </h4>
                      <div
                        onClick={() => {
                          handleCopyRegistrationLink(data?.data?.details_page_link)
                        }}
                        className="relative mt-1 cursor-pointer"
                      >
                        <CopyIcon />
                        {copiedRegistrationLink ? (
                          <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                             {t("new_strings:copied")}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
export default NewCourseThankyouPage
