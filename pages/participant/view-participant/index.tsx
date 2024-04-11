import ViewParticipantCourseInformation from '@components/participant/viewParticipant/ViewParticipantCourseInformation'
import ViewParticipantCustomerDeviceDetails from '@components/participant/viewParticipant/ViewParticipantCustomerDeviceDetails'
import ViewParticipantEmailDeliveryLogs from '@components/participant/viewParticipant/ViewParticipantEmailDeliveryLogs'
import ViewParticipantInformation from '@components/participant/viewParticipant/ViewParticipantInformation'
import ViewParticipantTransactionDetails from '@components/participant/viewParticipant/ViewParticipantTransactionDetails'
import ViewParticipantUtmParameters from '@components/participant/viewParticipant/ViewParticipantUtmParameters'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { authProvider } from 'src/authProvider'
import {
  COURSE_ACCOUNTING_FORM_TAB,
  REVENUE_SUMMARY_TAB,
  VIEW_CUSTOMER_DEVICE_DETAILS,
  VIEW_PARTICIPANT_COURSE_INFORMATION,
  VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS,
  VIEW_PARTICIPANT_TRANSACTION_DETAILS,
  VIEW_PARTICIPANT_UTM_PARAMETERS
} from 'src/constants/Tabs'
import TabbedSection from 'src/ui/tab-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/ui/tabs'

function index() {
  const { t } = useTranslation('common')
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

  return (
    <div className="flex">
      <div>
        <ViewParticipantInformation />
      </div>
      <div className="w-full p-[20px]">
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
            <ViewParticipantCourseInformation />
          </TabsContent>
          <TabsContent value={VIEW_PARTICIPANT_TRANSACTION_DETAILS}>
            <ViewParticipantTransactionDetails />
          </TabsContent>
          <TabsContent value={VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS}><ViewParticipantEmailDeliveryLogs/></TabsContent>
          <TabsContent value={VIEW_CUSTOMER_DEVICE_DETAILS}><ViewParticipantCustomerDeviceDetails/></TabsContent>
          <TabsContent value={VIEW_PARTICIPANT_UTM_PARAMETERS}><ViewParticipantUtmParameters/></TabsContent>
        </Tabs>
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
