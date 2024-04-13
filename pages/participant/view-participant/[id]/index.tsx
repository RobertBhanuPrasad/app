import SampleTabs from '@components/participant/viewParticipant/SampleTabs'
import ViewParticipantCourseInformation from '@components/participant/viewParticipant/ViewParticipantCourseInformation'
import ViewParticipantCustomerDeviceDetails from '@components/participant/viewParticipant/ViewParticipantCustomerDeviceDetails'
import ViewParticipantEmailDeliveryLogs from '@components/participant/viewParticipant/ViewParticipantEmailDeliveryLogs'
import ViewParticipantInformation from '@components/participant/viewParticipant/ViewParticipantInformation'
import ViewParticipantTransactionDetails from '@components/participant/viewParticipant/ViewParticipantTransactionDetails'
import ViewParticipantUtmParameters from '@components/participant/viewParticipant/ViewParticipantUtmParameters'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { authProvider } from 'src/authProvider'
import {
  VIEW_CUSTOMER_DEVICE_DETAILS,
  VIEW_PARTICIPANT_COURSE_INFORMATION,
  VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS,
  VIEW_PARTICIPANT_TRANSACTION_DETAILS,
  VIEW_PARTICIPANT_UTM_PARAMETERS
} from 'src/constants/Tabs'

function index() {
  const router = useRouter()

  const Id: number | undefined = router?.query?.id ? parseInt(router.query.id as string) : undefined

  const [selectedValue, setSelectedValue] = useState()
  const tabTriggers: any = [
    {
      value: VIEW_PARTICIPANT_COURSE_INFORMATION,
      label: 'Course Information',
      disabled: false
    },
    {
      value: VIEW_PARTICIPANT_TRANSACTION_DETAILS,
      label: 'Transaction Details',
      disabled: false
    },
    {
      value: VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS,
      label: 'Email Delivery Logs',
      disabled: false
    },
    {
      value: VIEW_CUSTOMER_DEVICE_DETAILS,
      label: 'Customer Device Details',
      disabled: false
    },
    {
      value: VIEW_PARTICIPANT_UTM_PARAMETERS,
      label: 'UTM Parameters',
      disabled: false
    }
  ]
  const tabs = [
    {
      id: 0,
      label: 'Course Information ',
      content: (
        <div>
          {' '}
          <ViewParticipantCourseInformation participantId={12} />
        </div>
      )
    },
    {
      id: 1,
      label: 'Transaction Details',
      content: (
        <div>
          {' '}
          <ViewParticipantTransactionDetails participantId={12} />
        </div>
      )
    },
    { id: 2, label: 'Email Delivery Logs', content: <ViewParticipantEmailDeliveryLogs participantId={12} /> },
    { id: 3, label: 'Customer Device Details', content: <ViewParticipantCustomerDeviceDetails participantId={12} /> },
    { id: 4, label: 'UTM Parameters', content: <ViewParticipantUtmParameters participantId={12} /> }
  ]
  return (
    <div className="flex p-[20px]">
      <div>
        <ViewParticipantInformation participantId={Id} />
      </div>
      {/* <div className="w-full p-[20px]">
        <Tabs
          onValueChange={(val: any) => {
            setSelectedValue(val)
          }}
        >
          <TabsList className="flex flex-row gap-10 !flex-start !justify-start !bg-[white] !rounded-none">
            {tabTriggers.map((trigger: any, index: any) => (
              <TabsTrigger
                key={index}
                value={trigger.value}
                className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
                disabled={trigger.disabled}
              >
                <div className="flex flex-col gap-1">
                  {trigger.label}
                  <div
                    className={`${
                      selectedValue === trigger.value ? 'bg-[#7677F4] rounded w-full h-[2px]' : 'w-full h-[2px]'
                    }`}
                  />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="w-full border-b -mt-2"></div>
          <TabsContent value={VIEW_PARTICIPANT_COURSE_INFORMATION}>
            <ViewParticipantCourseInformation participantId = {Id} />
          </TabsContent>
          <TabsContent value={VIEW_PARTICIPANT_TRANSACTION_DETAILS}>
            <ViewParticipantTransactionDetails participantId = {Id}  />
          </TabsContent>
          <TabsContent value={VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS}>
            <ViewParticipantEmailDeliveryLogs participantId = {Id} />
          </TabsContent>
          <TabsContent value={VIEW_CUSTOMER_DEVICE_DETAILS}>
            <ViewParticipantCustomerDeviceDetails participantId = {Id} />
          </TabsContent>
          <TabsContent value={VIEW_PARTICIPANT_UTM_PARAMETERS}>
            <ViewParticipantUtmParameters participantId = {Id} />
          </TabsContent>
        </Tabs>
      </div> */}
      <div className="sticky w-full p-[20px]">
        {' '}
        <SampleTabs tabs={tabs}/>
      </div>
    </div>
  )
}

export default index

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
