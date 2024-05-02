import CalenderIcon from '@public/assets/CalenderIcon'
import Important from '@public/assets/Important'
import LocationIcon from '@public/assets/LocationIcon'
import ParticipantsIcon from '@public/assets/ParticipantsIcon'
import { useGetIdentity, useList, useOne, useUpdate } from '@refinedev/core'
import _ from 'lodash'
import { Circle } from 'lucide-react'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { authProvider } from 'src/authProvider'
import { COURSE_ACCOUNTING_STATUS, PROGRAM_STATUS, TIME_FORMAT } from 'src/constants/OptionLabels'
import { ACTIVE, CANCELED, CLOSED, DECLINED, REJECTED, TIME_FORMAT_12_HOURS } from 'src/constants/OptionValueOrder'
import { HoverCard, HoverCardContent, HoverCardTrigger } from 'src/ui/hover-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/ui/tabs'
import { formatDate, formatDateString } from 'src/utility/DateFunctions'
import { getOptionValueObjectByOptionOrder } from 'src/utility/GetOptionValuesByOptionLabel'

import { handleCourseDefaultValues } from '@components/course/newCourse/EditCourseUtil'
import NewCourseReviewPage from '@components/course/newCourse/NewCoursePreviewPage'

import ViewCourseAccountingFormTab from '@components/course/viewCourse/ViewCourseAccountingFormTab'
import CourseDetailsTab from '@components/course/viewCourse/courseDetailsTab'
import ParticipantsTab from '@components/course/viewCourse/participantsTab'
import {
  DisplayOptions,
  handleTabsBasedOnStatus,
  isApproved,
  isCourseAccountingFormApprovalNeeded,
  isViewCourseAccountingTabDisplay
} from '@components/courseBusinessLogic'
import CopyIcon from '@public/assets/CopyIcon'
import Cross from '@public/assets/Cross'
import CurrencyIcon from '@public/assets/CurrencyIcon'
import Exclamation from '@public/assets/Exclamation'
import FaceBookIcon from '@public/assets/FaceBookIcon'
import Instagram from '@public/assets/Instagram'
import LinkedInIcon from '@public/assets/LinkedInIcon'
import ShareIcon from '@public/assets/ShareIcon'
import Tick from '@public/assets/Tick.png'
import TwitterIcon from '@public/assets/TwitterIcon'
import WhatsappIcon from '@public/assets/WhatsappIcon'
import { useSearchParams } from 'next/navigation'
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
  VIEW_COURSE_ACCOUNTING_FORM_TAB
} from 'src/constants/CourseConstants'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from 'src/ui/alert-dialog'
import { Button } from 'src/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from 'src/ui/dialog'
import { Select, SelectContent, SelectItem, SelectItems, SelectTrigger, SelectValue } from 'src/ui/select'
import { Separator } from 'src/ui/separator'
import { Textarea } from 'src/ui/textarea'
import { supabaseClient } from 'src/utility/supabaseClient'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'
import CourseAccountingFormTab from '../../../src/components/course/viewCourse/SubmitCourseAccountingFormTab'
import { optionValue } from 'src/common/translations'

function index() {
  const { viewPreviewPage } = newCourseStore()

  if (viewPreviewPage) {
    return <NewCourseReviewPage />
  } else {
    return <ViewDetails />
  }
}

function ViewDetails() {
  const router = useRouter()

  const searchParam = useSearchParams()

  const params = new URLSearchParams(searchParam)

  const Id: number | undefined = router?.query?.id ? parseInt(router.query.id as string) : undefined

  const { data: courseData } = useOne({
    resource: 'program',
    id: Id,
    meta: {
      select:
        '*,created_by_user_id(contact_id(full_name)),program_type_id(name,is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules(*),last_modified_by_user_id(contact_id(full_name))'
    }
  })

  const [participantData, setParticipantData] = useState<any>()

  const fetchData = async () => {
    try {
      const { data, error } = await supabaseClient.functions.invoke('get_program_participant_summary', {
        method: 'POST',
        body: {
          program_id: Id
        }
      })
      setParticipantData(data)
    } catch (error) {
      console.error('Error fetching fee data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalRevenue = participantData?.income

  const startDate = formatDate(courseData?.data?.program_schedules[0]?.start_time)

  const endDate = formatDate(
    courseData?.data?.program_schedules[courseData?.data?.program_schedules?.length - 1]?.end_time
  )

  const countryName = 'India'

  const { t } = useTranslation('common')

  const tabTriggers: any = [
    {
      value: COURSE_DETAILS_TAB,
      label: t('pages.Tabs.CourseDetailsTab'),
      disabled: false,
      tab_query_name: 'course_details'
    },
    {
      value: PARTICIPANTS_TAB,
      label: t('pages.Tabs.participantTab'),
      disabled: false,
      tab_query_name: 'participants'
    },
    {
      value: REVENUE_SUMMARY_TAB,
      label: t('pages.Tabs.revenueSummaryTab'),
      disabled: false,
      tab_query_name: 'revenue_summary'
    }
  ]

  /**
   * variable to check whether we have to show course accounting form tab or
   * we have to view course accounting form tab
   * based on course status and course accounting status
   */
  const isViewCourseAccountingTabToDisplay = isViewCourseAccountingTabDisplay(
    courseData?.data?.status_id?.id,
    courseData?.data?.program_accounting_status_id
  )

  // Check if the tab should be enabled and append the object accordingly
  if (isViewCourseAccountingTabToDisplay) {
    tabTriggers.push({
      value: VIEW_COURSE_ACCOUNTING_FORM_TAB,
      label: 'View Course Accounting Form',
      disabled: true,
      tab_query_name: 'view_course_accounting_form'
    })
  } else {
    tabTriggers.push({
      value: COURSE_ACCOUNTING_FORM_TAB,
      label: t('pages.Tabs.courseAccountingFormTab'),
      disabled: true,
      tab_query_name: 'course_accounting_form'
    })
  }

  const { data: loginUserData }: any = useGetIdentity()

  const { data: countryConfigData } = useList({
    resource: 'country_config'
  })

  /**
   * When we change the tab, we need to retrieve the corresponding tab data to update the query name.
   */
  const getTabDataByTabTrigger = (val: string) => {
    const tabData = tabTriggers.find((tab: any) => {
      return JSON.stringify(tab.value) === val
    })
    return tabData
  }

  /**
   * This function is primarily used for removing a state variable.
   * It displays the tab corresponding to the query name.
   * If the query name is not present, it displays the first tab.
   */
  const getTabQueryName = () => {
    if (searchParam.get('tab') !== null) {
      const tabData = tabTriggers.find((tab: any) => {
        return tab.tab_query_name === searchParam.get('tab')
      })

      if (tabData) {
        return JSON.stringify(tabData.value)
      }
    }
    return '1'
  }

  return (
    <div className="flex flex-col">
      <div className="mx-8">
        <div className="flex flex-row justify-between">
          <div className="text-[32px] font-semibold">
            {courseData?.data?.program_alias_name_id
              ? optionValue(courseData?.data?.program_alias_name_id?.alias_name)
              : optionValue(courseData?.data?.program_type_id?.name)}
          </div>
          <div className="flex items-center gap-4">
            <DisplayingCourseStatus statusId={courseData?.data?.status_id?.value} />
            <ShareButton />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center mt-3">
          <CalenderIcon color="#7677F4" />
          {startDate} to {endDate}
          <div>
            <ParticipantsIcon />
          </div>
          <div
            onClick={() => {
              router.push(`/${router.asPath}/participant/list`)
            }}
            className="cursor-pointer"
          >
            {participantData?.participantCount}
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                {participantData?.participantCount} Participants with: Transaction status = Confirmed / Pending
                Attendance status = Confirmed / Pending / Dropout Total participants records:
                {participantData?.totalParticipantCount}
              </div>
            </HoverCardContent>
          </HoverCard>
          <div>
            <CurrencyIcon />
          </div>
          <div
            onClick={() => {
              router.push('/')
            }}
            className="cursor-pointer"
          >
            {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Revenue from confirmed pending transaction participants revenue:
                {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex flex-row gap-2 items-center mt-3">
          <LocationIcon />
          {courseData?.data?.venue_id?.address},{courseData?.data?.venue_id?.city_id?.name},
          {courseData?.data?.venue_id?.state_id?.name}, {countryName},{courseData?.data?.venue_id?.postal_code}
        </div>

        <div className="flex flex-row items-center gap-2 w-full justify-end ">
          Announced by: {courseData?.data?.created_by_user_id?.contact_id?.full_name}
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent className="min-w-[300px] min-h-[104px] !w-full">
              <div className="!rounded-[15px] font-normal flex flex-col">
                <p>Approved by:</p>
                <p>
                  {courseData?.data?.approved_by_user_id && courseData?.data?.program_approved_date
                    ? `${courseData?.data?.approved_by_user_id?.contact_id?.full_name} (${formatDateString(
                        new Date(courseData?.data?.program_approved_date)
                      )})`
                    : '-'}
                </p>
                <Separator className="my-2" />
                <p>Last Modified by:</p>
                <p>
                  {courseData?.data?.last_modified_by_user_id && courseData?.data?.modified_at
                    ? `${courseData?.data?.last_modified_by_user_id?.contact_id?.full_name} (${formatDateString(
                        new Date(courseData?.data?.modified_at)
                      )})`
                    : '-'}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="w-full mt-6">
        <Tabs
          onValueChange={(val: string) => {
            // to store the tab Data
            const tabData = getTabDataByTabTrigger(val)
            //change the queryname according to tabData
            params.set('tab', tabData?.tab_query_name)
            router.replace(`/courses/${Id}?${params.toString()}`)
          }}
          value={getTabQueryName()}
        >
          <TabsList className="flex flex-row gap-10  bg-white !rounded-none  w-full border-b h-12 px-8">
            {tabTriggers.map((trigger: any, index: number) => (
              <TabsTrigger
                key={index}
                value={JSON.stringify(trigger.value)}
                className={` data-[state=active]:text-[#7677F4] data-[state=active]:border-[#7677F4] h-full data-[state=active]:border-b !pb-2 items-end  text-sm font-medium  !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999] rounded-none  `}
                disabled={handleTabsBasedOnStatus(courseData?.data?.status_id?.id, trigger.value)}
              >
                <div className="flex flex-col gap-1">
                  {trigger.label}
                  {/* <div
                    className={`${
                      getTabQueryName() === JSON.stringify(trigger.value)
                        ? 'bg-[#7677F4] rounded w-full h-[2px]'
                        : 'w-full h-[2px]'
                    }`}
                  ></div> */}
                </div>
              </TabsTrigger>
            ))}
            <div className="ml-auto flex gap-4">
              {isApproved(
                courseData?.data?.program_type_id?.is_approval_required,
                courseData?.data?.status_id?.id,
                loginUserData?.userData?.user_roles[0]?.role_id?.id
              ) && <PendingApprovalDropDown courseId={Id} />}

              <SuccessModalOpen />
              <RejectedModalOpen />

              {isCourseAccountingFormApprovalNeeded(
                courseData?.data?.program_accounting_status_id,
                loginUserData?.userData?.user_roles[0]?.role_id?.id
              ) && <PendingCourseAccountingFormApprovalDropDown courseId={Id as number} />}

              <ViewCourseAccountingSuccessModalOpen />
              <ViewCourseAccountingRejectedModalOpen courseId={Id as number} />

              <ActionsDropDown courseData={courseData?.data} />
            </div>
          </TabsList>
          <div className="px-8 bg-white">
            <TabsContent value={JSON.stringify(COURSE_DETAILS_TAB)} className="overflow-scroll">
              <CourseDetailsTab />
            </TabsContent>
            <TabsContent value={JSON.stringify(PARTICIPANTS_TAB)} className="overflow-scroll">
              <ParticipantsTab />
            </TabsContent>
            <TabsContent value={JSON.stringify(REVENUE_SUMMARY_TAB)} className="overflow-scroll">
              Place Revenue Summary tab here
            </TabsContent>
            <TabsContent value={JSON.stringify(COURSE_ACCOUNTING_FORM_TAB)} className="overflow-scroll">
              <CourseAccountingFormTab />
            </TabsContent>
            <TabsContent value={JSON.stringify(VIEW_COURSE_ACCOUNTING_FORM_TAB)} className="overflow-scroll">
              <ViewCourseAccountingFormTab programId={Id as number} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default index

const PendingApprovalDropDown = ({ courseId }: any) => {
  const today = new Date()
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, ACTIVE)?.id

  const courseDeclinedStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, DECLINED)?.id
  const options = [
    {
      label: 'Approve Course',
      value: 1
    },
    {
      label: 'Reject Course',
      value: 2
    }
  ]
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectionFeedback, setRejectionFeedback] = useState(false)

  const { data: loginUserData }: any = useGetIdentity()

  const { mutate } = useUpdate()
  const approveCourse = async () => {
    await mutate({
      resource: 'program',
      values: {
        status_id: courseActiveStatusId,
        approved_by_user_id: loginUserData?.userData?.id,
        program_approved_date: today
      },
      id: courseId
    })
    setViewSuccessModal(true)
  }

  const { setViewSuccessModal, setViewRejectedModal } = newCourseStore()

  const rejectCourse = async () => {
    await mutate({
      resource: 'program',
      values: {
        status_id: courseDeclinedStatusId,
        program_rejection_feedback: rejectionFeedback
      },
      id: courseId
    })
    setViewRejectedModal(true)
  }

  return (
    <div>
      <Select
        onValueChange={val => {
          if (val == 1) {
            setApproveModalOpen(true)
          } else {
            setRejectModalOpen(true)
          }
        }}
      >
        <SelectTrigger className="w-[192px] border text-[#333333] font-semibold !border-[#999999]">
          <SelectValue placeholder="Pending Approval" />
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
            {options?.map((option: any, index: number) => (
              <>
                <SelectItem key={option.value} value={option.value} className="h-[44px]">
                  {option.label}
                </SelectItem>
              </>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
          <DialogHeader>
            <div className="flex items-center w-full justify-center">
              <Exclamation />
            </div>
            <DialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
              Are you sure you want to approve this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-center items-center gap-5">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#7677F4] border border-[#7677F4] w-[71px] h-[46px]"
                  onClick={() => {
                    setApproveModalOpen(false)
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                  onClick={() => {
                    approveCourse()
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="flex flex-col items-center h-[331px] w-[414px] !p-6 ">
          <DialogHeader className="text-center">
            <div className="flex items-center w-full justify-center">
              <Cross />{' '}
            </div>
            <DialogTitle className="text-gray-500 text-sm font-normal pt-2">
              {' '}
              Describe your rejection reason
              <span className="text-blue-500">(optional)</span>
            </DialogTitle>
            <DialogDescription>
              <Textarea
                placeholder="Comment"
                className="border-[#E1E1E1]  h-[132px] w-[366px]"
                onChange={(e: any) => {
                  setRejectionFeedback(e.target.value)
                }}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center items-center">
            <div className="flex flex-row gap-5 items-center">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#7677F4] w-[71px] h-[46px] border border-[#7677F4] rounded-[12px] "
                  onClick={() => {
                    setRejectModalOpen(false)
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  className="bg-[#7677F4] text-[white] w-[98px] h-[46px] rounded-[12px]"
                  onClick={rejectCourse}
                >
                  Reject
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const RejectedModalOpen = () => {
  const { viewRejectedModal, setViewRejectedModal } = newCourseStore()

  return (
    <Dialog open={viewRejectedModal}>
      <DialogContent className="w-[414px] h-[279px]">
        <DialogHeader className="text-center">
          <div className="flex items-center w-full justify-center">
            <Cross />{' '}
          </div>
          <DialogTitle className="font-bold text-center">Course Rejected</DialogTitle>
          <DialogDescription className="text-center">The Course got rejected successfully</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full items-center justify-center">
            <Button
              className=" bg-[#7677F4] w-[91px] h-[46px] rounded-[12px] text-[white]"
              onClick={() => setViewRejectedModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const SuccessModalOpen = () => {
  const { viewSuccessModal, setViewSuccessModal } = newCourseStore()

  return (
    <Dialog open={viewSuccessModal}>
      <DialogTrigger></DialogTrigger>
      <DialogContent className="w-[414px] h-[301px]">
        <div className="flex flex-col  items-center">
          <div className="flex justify-center">
            <Image src={Tick} alt="tick" />
          </div>
          <div className="font-semibold text-center mt-2">Course approved Successfully</div>
          <div className="text-center my-4">Thank you for contribution in the course approval process.</div>
          <Button
            onClick={() => {
              setViewSuccessModal(false)
              // setApproveModalOpen(false);
            }}
            className="w-[91px] h-[46px] rounded-[12px]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const ActionsDropDown = ({ courseData }: any) => {
  const { data: loginUserData }: any = useGetIdentity()

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(TIME_FORMAT, TIME_FORMAT_12_HOURS)?.id as number

  const router = useRouter()
  const [cancelCourseModalOpen, setCancelCourseModalOpen] = useState(false)
  const [cancelSuccessModalOpen, setCancelSuccessModalOpen] = useState(false)

  const { setNewCourseData, setViewPreviewPage } = newCourseStore()
  const options = DisplayOptions(
    courseData?.status_id?.id,
    courseData?.program_accounting_status_id,
    loginUserData?.userData?.user_roles[0]?.role_id?.id
  )

  /**
   * handle the Edit Course
   * Retrieves default values for the course with the given ID,
   * sets the retrieved values as the new course data, and
   * switches the view to the preview page.
   */

  const courseId = courseData?.id
  const handleEditCourse = async () => {
    if (courseId) {
      router.push(`/courses/${courseId}/edit`)
    }
  }

  /**
   * Handles creating a new course.
   * Retrieves default values for the course with the given ID,
   * sets the retrieved values as the new course data, and
   * switches the view to the new course page.
   */
  const handleCopyCourse = async () => {
    if (courseId) {
      let defaultValues = await handleCourseDefaultValues(courseId, timeFormat12HoursId)

      // we have to delete schedules when user click on copy course and other we need to prefill

      defaultValues = _.omit(defaultValues, ['id', 'schedules'])
      setNewCourseData(defaultValues)
      router.push({ pathname: '/courses/add', query: { action: 'Copy' } })
    }
  }

  const courseCanceledStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, CANCELED)?.id

  const { mutate } = useUpdate()

  const cancelCourse = () => {
    setCancelCourseModalOpen(false)
    mutate({
      resource: 'program',
      values: {
        status_id: courseCanceledStatusId
      },
      id: courseId
    })
    setCancelSuccessModalOpen(true)
  }

  return (
    <div>
      <Select
        onValueChange={val => {
          switch (val) {
            case 1: {
              // TODO - navigate to view participants page
              router.push(`/courses/${courseId}/participants/list`)
              break
            }
            case 2: {
              // TODO - navigate to register participants page
              // router.push('/courses/add')
              break
            }
            case 3: {
              handleEditCourse()
              break
            }
            case 4: {
              handleCopyCourse()
              break
            }
            case 5: {
              setCancelCourseModalOpen(true)
              break
            }
            case 6: {
              // TODO - navigate to course accounting form
              router.push(`/courses/${courseId}?tab=course_accounting_form`)
              break
            }
            default: {
              router.push('/')
            }
          }
        }}
      >
        <SelectTrigger className="w-[192px] border text-[#333333] font-semibold !border-[#999999]">
          <SelectValue placeholder="Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
            {options?.map((option: any, index: number) => (
              <>
                <SelectItem key={option.value} value={option.value} className="h-[40px]">
                  {option.label}
                </SelectItem>
              </>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>

      <Dialog open={cancelCourseModalOpen} onOpenChange={setCancelCourseModalOpen}>
        <DialogContent className="flex flex-col h-[248px] w-[425px]">
          <DialogHeader>
            <div className="flex items-center w-full justify-center">
              <Exclamation />
            </div>
            <DialogDescription className="font-bold text-black text-lg items-center text-center">
              Are you sure you want to cancel this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-center items-center gap-5">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-blue-500 w-[71px] h-[46px]"
                  onClick={() => {
                    setCancelCourseModalOpen(false)
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                  onClick={() => {
                    cancelCourse()
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={cancelSuccessModalOpen}>
        <DialogContent className="w-[414px] h-[279px]">
          <div className="text-center">
            <div className="flex justify-center">
              <Cross />
            </div>
            <div className="font-bold text-center my-5">Course canceled Successfully</div>
          </div>

          <div className="w-full flex items-center justify-center">
            <Button
              className=" bg-[#7677F4] w-[91px] h-[46px] text-white"
              onClick={() => {
                setCancelCourseModalOpen(false)
                setCancelSuccessModalOpen(false)
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const DisplayingCourseStatus = ({ statusId }: any) => {
  let statusText
  let statusColor
  let color
  switch (statusId) {
    case 'Active':
      statusText = 'Active'
      statusColor = 'text-[#15AF53] bg-[#15AF530D]'
      color = '#15AF53'
      break
    case 'Pending Review':
      statusText = 'Pending Review'
      statusColor = 'text-[#FFB900] bg-[#FFB9000D]'
      color = '#FFB900'
      break
    case 'Canceled':
      statusText = 'Cancelled'
      statusColor = 'text-[#FF5630] bg-[#FF56300D]'
      color = '#FF5630'
      break
    case 'Declined':
      statusText = 'Declined'
      statusColor = 'text-[#FF5630] bg-[#FF56300D]'
      color = '#FF5630'
      break
    case 'Completed':
      statusText = 'Completed'
      statusColor = 'text-[#36B37E] bg-[#36B37E0D]'
      color = '#36B37E'
      break
    case 'Full':
      statusText = 'Full'
      statusColor = 'text-[#15AF53] bg-[#15AF530D]'
      color = '#15AF53'
      break
  }

  return (
    <div className={`h-[24px] rounded-[15px]  font-semibold flex flex-row items-center gap-[5px] px-2  ${statusColor}`}>
      <div>
        <Circle fill={color} size={4} />
      </div>
      <div>{statusText}</div>
    </div>
  )
}

const ShareButton = () => {
  const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false)
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false)

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleCopyDetailsPageLink = () => {
    copyText(CX_BASE_URL)
    setCopiedDetailsPageLink(true)

    setTimeout(() => {
      setCopiedDetailsPageLink(false)
    }, 1000)
  }

  const handleCopyRegistrationLink = () => {
    copyText(RX_BASE_URL)
    setCopiedRegistrationLink(true)

    setTimeout(() => {
      setCopiedRegistrationLink(false)
    }, 1000)
  }
  const CX_BASE_URL: string = process.env.NEXT_PUBLIC_CX_BASE_URL as string
  const RX_BASE_URL: string = process.env.NEXT_PUBLIC_RX_BASE_URL as string

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="border border-primary text-primary w-[93px] bg-[white] rounded-[12px] flex gap-2 ">
          Share <ShareIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[414px] h-[310px] !rounded-[24px] !p-6 ">
        <div className="flex items-center gap-5 flex-col">
          <div className="text-[24px] font-semibold items-center">Share in Social</div>
          <div className="flex flex-row gap-6 ">
            <WhatsappIcon />
            <FaceBookIcon />
            <TwitterIcon />
            <Instagram />
            <LinkedInIcon />
          </div>
          <div className="text-[14px] font-normal text-[#666666]">Or</div>
          <div className="relative w-full">
            <p className="absolute text-xs bg-white text-accent-secondary -top-[10px] left-4 ">Registration link</p>
            <div className="flex justify-between gap-2 px-3 py-1 border rounded-2xl min-w-72">
              <div className="text-[14px] font-semibold">{RX_BASE_URL}</div>
              <div
                onClick={() => {
                  handleCopyRegistrationLink()
                }}
                className="relative mt-1 cursor-pointer"
              >
                <CopyIcon />
                {copiedRegistrationLink ? (
                  <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                    copied
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <p className="absolute text-xs bg-white text-accent-secondary -top-[10px] left-4 ">Details Page link</p>
            <div className="flex justify-between gap-2 px-3 py-1 border rounded-2xl min-w-72">
              <div className="text-[14px] font-semibold">{CX_BASE_URL}</div>
              <div
                onClick={() => {
                  handleCopyDetailsPageLink()
                }}
                className="relative mt-1 cursor-pointer"
              >
                <CopyIcon />
                {copiedDetailsPageLink ? (
                  <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                    copied
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const getServerSideProps: GetServerSideProps<{}> = async context => {
  const { authenticated, redirectTo } = await authProvider.check(context)

  const translateProps = await serverSideTranslations(context.locale ?? 'en', ['common'])

  if (!authenticated) {
    return {
      props: {
        ...translateProps
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(context.req.url || '/')}`,
        permanent: false
      }
    }
  }

  return {
    props: {
      ...translateProps
    }
  }
}

/**
 * Component for managing the dropdown to approve or reject a pending course accounting form
 * here user go to approve the course accounting form or reject the course accounting form
 */
const PendingCourseAccountingFormApprovalDropDown = ({ courseId }: { courseId: number }) => {
  const accountingClosedStatusId = getOptionValueObjectByOptionOrder(COURSE_ACCOUNTING_STATUS, CLOSED)?.id

  const options = [
    {
      label: 'Approve',
      value: 1
    },
    {
      label: 'Reject',
      value: 2
    }
  ]

  // Initialize state for whether the approve modal is open or not
  const [approveModalOpen, setApproveModalOpen] = useState(false)

  /**
   * Initialize state for the selected approval  or reject
   * here why we have to use this variable because when we select approve or reject option
   * we have to open models like approve modal or reject modal based on selected options
   * in that modal we have no button if we click on no button then we have to clear the value at reset to the initial state.
   */
  const [selectApprovalOrReject, setSelectApprovalOrReject] = useState(null)
  const {
    setViewCourseAccountingSuccessModal,
    setViewCourseAccountingRejectedDescriptionModal,
    setViewCourseAccountingRejectedModal,
    viewCourseAccountingRejectedModal
  } = newCourseStore()

  const { data: loginUserData }: any = useGetIdentity()

  /**
   * Function to approve a course for accounting
   * Make an asynchronous call to update the program resource
   * Set the accounting status ID to indicate the course is closed for accounting
   * Set the ID of the user who approved the course
   * Specify the ID of the course to be approved
   * Set state to display a success modal
   * Close the approve modal
   */
  const approveCourseAccountingForm = async () => {
    await supabaseClient
      .from('program')
      .update({ program_accounting_status_id: accountingClosedStatusId })
      .eq('id', courseId)

    await supabaseClient.from('program_accounting_activity').insert({
      caf_status_id: accountingClosedStatusId,
      user_id: loginUserData?.userData?.id
    })

    setViewCourseAccountingSuccessModal(true)
    setApproveModalOpen(false)
  }

  /**
   * Function to reject a course
   * Set state to display a rejected modal
   * Close the reject modal
   */
  const rejectCourse = async () => {
    setViewCourseAccountingRejectedDescriptionModal(true)
  }

  return (
    <div>
      <Select
        onValueChange={(val: any) => {
          setSelectApprovalOrReject(val)
          if (val == 1) {
            setApproveModalOpen(true)
          } else {
            setViewCourseAccountingRejectedModal(true)
          }
        }}
        value={selectApprovalOrReject}
      >
        <SelectTrigger className="w-[192px] border text-[#333333] font-semibold !border-[#999999]">
          <SelectValue placeholder="Pending CAF Approval" />
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
            {options?.map((option: any, index: number) => (
              <>
                <SelectItem key={option.value} value={option.value} className="h-[44px]">
                  {option.label}
                </SelectItem>
              </>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      <AlertDialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <AlertDialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
          <AlertDialogHeader>
            <div className="flex items-center w-full justify-center">
              <Exclamation />
            </div>
            <AlertDialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
              Are you sure you want to approve this Accounting Form
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="w-full flex justify-center items-center gap-5">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#7677F4] border border-[#7677F4] w-[71px] h-[46px]"
                  onClick={() => {
                    setApproveModalOpen(false)
                    setSelectApprovalOrReject(null)
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                  onClick={() => {
                    approveCourseAccountingForm()
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={viewCourseAccountingRejectedModal} onOpenChange={setViewCourseAccountingRejectedModal}>
        <AlertDialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
          <AlertDialogHeader>
            <div className="flex items-center w-full justify-center">
              <Cross />
            </div>
            <AlertDialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
              Are you sure you want to reject this Accounting Form
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="w-full flex justify-center items-center gap-5">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#7677F4] border border-[#7677F4] w-[71px] h-[46px]"
                  onClick={() => {
                    setViewCourseAccountingRejectedModal(false)
                    setSelectApprovalOrReject(null)
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                  onClick={rejectCourse}
                >
                  Yes
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/**
 * Component to display a success modal when the accounting form for a course is approved
 */
const ViewCourseAccountingSuccessModalOpen = () => {
  const { viewCourseAccountingSuccessModal, setViewCourseAccountingSuccessModal } = newCourseStore()

  return (
    <AlertDialog open={viewCourseAccountingSuccessModal}>
      <AlertDialogContent className="w-[414px] h-[301px]">
        <div className="flex flex-col  items-center">
          <div className="flex justify-center">
            <Image src={Tick} alt="tick" />
          </div>
          <div className="font-semibold text-center mt-2">Accounting Form Approved Successfully</div>
          <div className="text-center my-4">Thank you for contribution in the course approval process.</div>
          <Button
            onClick={() => {
              setViewCourseAccountingSuccessModal(false)
            }}
            className="w-[91px] h-[46px] rounded-[12px]"
          >
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Component to display a reject modal when the accounting form for a course is rejected
 */
const ViewCourseAccountingRejectedModalOpen = ({ courseId }: { courseId: number }) => {
  const {
    viewCourseAccountingRejectedDescriptionModal,
    setViewCourseAccountingRejectedDescriptionModal,
    setViewCourseAccountingRejectedModal
  } = newCourseStore()

  const [rejectionFeedback, setRejectionFeedback] = useState(false)

  const { data: loginUserData }: any = useGetIdentity()

  const accountingRejectedStatusId = getOptionValueObjectByOptionOrder(COURSE_ACCOUNTING_STATUS, REJECTED)?.id

  /**
   * Function to reject a course's accounting form
   * Makes an asynchronous call to mutate the program resource
   * Sets the status ID to indicate the accounting form is rejected
   * Provides rejection feedback if available
   * Specifies the ID of the course to be rejected
   * Closes the modal for viewing the rejected accounting form
   */
  const rejectCourse = async () => {
    // Make an asynchronous call to update the program resource
    await supabaseClient
      .from('program')
      .update({ program_accounting_status_id: accountingRejectedStatusId })
      .eq('id', courseId)

    await supabaseClient.from('program_accounting_activity').insert({
      caf_status_id: accountingRejectedStatusId,
      user_id: loginUserData?.userData?.id,
      comment: rejectionFeedback
    })

    // Close the modal for viewing the rejected accounting form
    setViewCourseAccountingRejectedDescriptionModal(false)
    setViewCourseAccountingRejectedModal(false)
  }

  return (
    <AlertDialog open={viewCourseAccountingRejectedDescriptionModal}>
      <AlertDialogContent className="flex flex-col items-center h-[331px] w-[414px] !p-6">
        <AlertDialogHeader className="text-center">
          <div className="flex items-center w-full justify-center">
            <Cross />{' '}
          </div>
          <AlertDialogTitle className="text-gray-500 text-sm font-normal pt-2">
            {' '}
            Describe your rejection reason
            <span className="text-blue-500">(optional)</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              placeholder="Comment"
              className="border-[#E1E1E1]  h-[132px] w-[366px]"
              onChange={(e: any) => {
                setRejectionFeedback(e.target.value)
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center items-center">
          <div className="flex flex-row gap-5 items-center">
            <div>
              <Button
                type="button"
                variant="outline"
                className="text-[#7677F4] w-[71px] h-[46px] border border-[#7677F4] rounded-[12px] "
                onClick={() => {
                  setViewCourseAccountingRejectedDescriptionModal(false)
                }}
              >
                No
              </Button>
            </div>
            <div>
              <Button
                type="button"
                className="bg-[#7677F4] text-[white] w-[98px] h-[46px] rounded-[12px]"
                onClick={rejectCourse}
              >
                Reject
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
