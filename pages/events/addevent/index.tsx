import Form from '@components/Formfield'
import NewCourseReviewPage from '@components/course/newCourse/NewCoursePreviewPage'
import { NewEventStep1 } from '@components/events/NewEventsStep1'
import { NewEventStep2 } from '@components/events/NewEventsStep2'
import { NewEventStep3 } from '@components/events/NewEventsStep3'
import { NewEventStep4 } from '@components/events/NewEventsStep4'
import { NewEventStep5 } from '@components/events/NewEventsStep5'
import Car from '@public/assets/Car'
import Error from '@public/assets/Error'
import Group from '@public/assets/Group'
import Info from '@public/assets/Info'
import Fees from "@public/assets/Fees";
import Profile from '@public/assets/Profile'
import Success from '@public/assets/Success'
import Venue from '@public/assets/Venue'
import { useGetIdentity } from '@refinedev/core'
import { useRouter } from 'next/router'
import { ItabsNextButtonClickStatus } from 'pages/courses/add'
import { useState } from 'react'
import {
  EVENTS_ACCOMMODATION_STEP_NUMBER,
  EVENTS_BASIC_DETAILS_STEP_NUMBER,
  EVENTS_CONTACT_INFO_STEP_NUMBER,
  EVENTS_DETAILS_STEP_NUMBER,
  EVENTS_FEE_STEP_NUMBER,
  EVENTS_TIME_AND_VENUE_STEP_NUMBER,
  NEXT_BUTTON_CLICKED,
  NEXT_BUTTON_NOT_CLICKED,
  VALID
} from 'src/constants/CourseConstants'
import { Button } from 'src/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/ui/tabs'
import { newEventStore } from 'src/zustandStore/NewEventStore'
import NewEventStep6 from '@components/events/NewEventsStep6'
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

const index = () => {
  const { data: loginUserData }: any = useGetIdentity()

  const {
    query: { section }
  } = useRouter()

  console.log('router is ', section)
  if (!loginUserData?.userData) {
    return (
      <section className="flex justify-center align-center pt-[15%]">
        {' '}
        <div>Loading...</div>
      </section>
    )
  }

  if (section === 'preview_page') {
    return <NewCourseReviewPage />
  } else {
    return <NewEvents />
  }
}
export default index

export const NewEvents = () => {
  const onSubmit = (formData: any) => {
    // console.log(formData);
  }
  let defaultValues: any = {}
  return (
    <div className="mx-auto min-w-[1000px] w-full max-w-[1640px] px-8 pb-8">
      <div>
        <Form onSubmit={onSubmit} defaultValues={defaultValues} schema={undefined}>
          <NewEventTabs />
        </Form>
      </div>
    </div>
  )
}

const NewEventTabs = () => {
  const { currentEventStep, setCurrentEventStep } = newEventStore()
  const [tabsNextButtonClickStatus, setTabsNextButtonClickStatus] = useState<ItabsNextButtonClickStatus>(
    new Array(6).fill(NEXT_BUTTON_NOT_CLICKED)
  )

  const eventStepTitles = [
    {
      value: EVENTS_BASIC_DETAILS_STEP_NUMBER,
      label: 'Basic Details',
      icon: (color: string) => <Profile color={color} />,
      component: <NewEventStep1 />
    },
    {
      value: EVENTS_DETAILS_STEP_NUMBER,
      label: 'Event Details',
      icon: (color: string) => <Group color={color} />,
      component: <NewEventStep2 />
    },
    {
      value: EVENTS_TIME_AND_VENUE_STEP_NUMBER,
      label: 'Time and Venue',
      icon: (color: string) => <Venue color={color} />,
      component: <NewEventStep3 />
    },
    {
      value: EVENTS_FEE_STEP_NUMBER,
      label: 'Fees',
      icon: (color: string) => <Fees color={color} />,
      component: <NewEventStep4 />
    },
    {
      value: EVENTS_ACCOMMODATION_STEP_NUMBER,
      label: 'Accomdation',
      icon: (color: string) => <Car color={color} />,
      component: <NewEventStep5 />
    },
    {
      value: EVENTS_CONTACT_INFO_STEP_NUMBER,
      label: 'Contact Info',
      icon: (color: string) => <Info color={color} />,
      component: <NewEventStep6 />
    }
  ]
  const contentStylings =
    'inline-flex w-full !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background'
  const handleClickPrevious = () => {
    setCurrentEventStep(currentEventStep - 1)
  }

  const handleClickNext = () => {
    // Simply move to the next step
    setCurrentEventStep( currentEventStep + 1);
  };

  return (
    <div>
      <div className="flex gap-20 items-center">
        <p className="font-semibold text-3xl">New Event </p>

      </div>
      <div className="bg-[white] mt-4 shadow-2xl rounded-[24px]">
        <Tabs value={JSON.stringify(currentEventStep)}>
          <div className="flex flex-row overflow-x-hidden">
            <TabsList className="h-[517px] bg-[#7677F41B] min-w-[238px] rounded-l-[24px] shadow-md py-10">
              <div className="flex flex-col  h-full gap-4 ">
                {eventStepTitles.map((tab, index) => {
                  console.log(tab, index, 'tab, index')
                  return (
                    <TabsTrigger
                      key={index}
                      value={JSON.stringify(tab.value)}
                      className="!h-12  items-center text-base w-[230px] text-[#999999] !font-normal data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      {currentEventStep === tab.value && <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-3"></div>}
                      <div className={`flex flex-row gap-[10px] ml-[14px] items-center `}>
                        {tabsNextButtonClickStatus[index] === NEXT_BUTTON_NOT_CLICKED ? (
                          tab.icon(currentEventStep - 1 === index ? '#7677F4' : '#999999')
                        ) : VALID ? (
                          <Success />
                        ) : (
                          <Error />
                        )}

                        <span
                          className={
                            currentEventStep - 1 === index || tabsNextButtonClickStatus[index] === NEXT_BUTTON_CLICKED
                              ? 'text-[#7677F4] font-semibold'
                              : 'text-[#999999]'
                          }
                        >
                          {tab.label}
                        </span>
                      </div>
                    </TabsTrigger>
                  )
                })}
              </div>
            </TabsList>

            <div className="bg-[white] w-full rounded-[24px] p-6 overflow-auto h-[517px] flex flex-col justify-between">
              <div>
                {eventStepTitles?.map((step, index) => {
                  if (index + 1 === currentEventStep)
                    return (
                      <TabsContent value={JSON.stringify(index + 1)} className={contentStylings} key={index}>
                        {step.component}
                      </TabsContent>
                    )
                  else {
                    return <></>
                  }
                })}
              </div>
              <div className="flex justify-center gap-4 w-full mb-2 mt-6">
                {currentEventStep > 1 && (
                  <Button onClick = {handleClickPrevious} className="border border-[#7677F4] bg-[white] w-[118px] h-[46px] text-[16px] leading-[22px] text-[#7677F4] font-bold rounded-[12px]"
                  >
                    Previous
                  </Button>
                )}
                {currentEventStep < eventStepTitles.length && (
                  <Button onClick={handleClickNext} className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] font-bold text-[16px] leading-[22px]">
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}







/**
 * Function to fetch server-side props.
 * This function checks the authentication status using the auth provider and
 * fetches translations for the current locale.
 * If the user is not authenticated, it redirects them to the specified destination.
 * @param context The context object containing information about the request.
 * @returns Server-side props including translated props or redirection information.
 */
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
    "course.new_course",
    "new_strings",
    "course.participants",
    "course.view_course",
    "course.find_course",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};