import SampleTabs from '@components/participant/viewParticipant/ScrollableTabs'
import ViewParticipantCourseInformation from '@components/participant/viewParticipant/ViewParticipantCourseInformation'
import ViewParticipantCustomerDeviceDetails from '@components/participant/viewParticipant/ViewParticipantCustomerDeviceDetails'
import ViewParticipantEmailDeliveryLogs from '@components/participant/viewParticipant/ViewParticipantEmailDeliveryLogs'
import ViewParticipantInformation from '@components/participant/viewParticipant/ViewParticipantInformation'
import ViewParticipantTransactionDetails from '@components/participant/viewParticipant/ViewParticipantTransactionDetails'
import ViewParticipantUtmParameters from '@components/participant/viewParticipant/ViewParticipantUtmParameters'
import { ParticipantsListMainHeader } from '@components/participants/ParticipantsListMainHeader'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { authProvider } from 'src/authProvider'
import { VIEW_CUSTOMER_DEVICE_DETAILS, VIEW_PARTICIPANT_COURSE_INFORMATION, VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS, VIEW_PARTICIPANT_TRANSACTION_DETAILS, VIEW_PARTICIPANT_UTM_PARAMETERS } from 'src/constants/Tabs'

function index() {
  const router = useRouter()
  const [activeTabValue, setActiveTabValue] = useState<string>()

  const Id: number | undefined = router?.query?.participantId
    ? parseInt(router.query.participantId as string)
    : undefined

  const tabs = [
    {
      id: 0,
      label: 'Course Information ',
      content: (
        <div>
          <ViewParticipantCourseInformation participantId={Id} activeTabValue={activeTabValue} />
        </div>
      ),
      value: VIEW_PARTICIPANT_COURSE_INFORMATION
    },
    {
      id: 1,
      label: 'Transaction Details',
      content: (
        <div>
          {' '}
          <ViewParticipantTransactionDetails participantId={Id} activeTabValue={activeTabValue} />
        </div>
      ),
      value: VIEW_PARTICIPANT_TRANSACTION_DETAILS
    },
    {
      id: 2,
      label: 'Email Delivery Logs',
      content: <ViewParticipantEmailDeliveryLogs participantId={Id} activeTabValue={activeTabValue} />,
      value: VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS
    },
    {
      id: 3,
      label: 'Customer Device Details',
      content: <ViewParticipantCustomerDeviceDetails participantId={Id} activeTabValue={activeTabValue} />,
      value: VIEW_CUSTOMER_DEVICE_DETAILS
    },
    {
      id: 4,
      label: 'UTM Parameters',
      content: <ViewParticipantUtmParameters participantId={Id} activeTabValue={activeTabValue} />,
      value: VIEW_PARTICIPANT_UTM_PARAMETERS
    }
  ]
  return (
    <div>
      <div className="top-0 sticky z-[50] bg-white shadow-xl w-full">
        <ParticipantsListMainHeader />
      </div>
      <div className="flex p-[20px]">
        <div>
          <ViewParticipantInformation participantId={Id} />
        </div>
        <div className="sticky w-full p-[20px]">
          <SampleTabs
            tabs={tabs}
            onTabChange={value => {
              setActiveTabValue(value)
            }}
          />
        </div>
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
