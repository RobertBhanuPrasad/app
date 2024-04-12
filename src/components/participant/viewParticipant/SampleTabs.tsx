import { useEffect, useRef, useState } from 'react'
import ViewParticipantCourseInformation from './ViewParticipantCourseInformation'
import ViewParticipantCustomerDeviceDetails from './ViewParticipantCustomerDeviceDetails'
import ViewParticipantEmailDeliveryLogs from './ViewParticipantEmailDeliveryLogs'
import ViewParticipantTransactionDetails from './ViewParticipantTransactionDetails'
import ViewParticipantUtmParameters from './ViewParticipantUtmParameters'

function SampleTabs() {
  const tabs = [
    {
      id: 0,
      label: 'Course Information ',
      content: <ViewParticipantCourseInformation participantId={12} />
    },
    { id: 1, label: 'Transaction Details', content: <ViewParticipantTransactionDetails participantId={12} /> },
    { id: 2, label: 'Email Delivery Logs', content: <ViewParticipantEmailDeliveryLogs participantId={12} /> },
    { id: 3, label: 'Customer Device Details', content: <ViewParticipantCustomerDeviceDetails participantId={12} /> },
    { id: 4, label: 'UTM Parameters', content: <ViewParticipantUtmParameters participantId={12} /> }
  ]

  const [activeTab, setActiveTab] = useState(0)
  const tabRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveTab(parseInt(entry.target.dataset.tabIndex))
          }
        })
      },
      { threshold: 0.5 }
    )

    tabRefs.current.forEach(ref => {
      observer.observe(ref)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToTab = tabIndex => {
    const tabElement = tabRefs.current[tabIndex]
    tabElement.scrollIntoView({ behavior: 'smooth', block: 'start' }) // Scroll to the start of the tab
  }

  return (
    <div className="sticky top-0 z-50 bg-white ">
      <div className="h-[700px] overflow-y-auto">
        <div className="flex sticky top-0 gap-4 py-2 bg-white overflow-x-auto ">
          {/* Ensure horizontal overflow */}
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`px-4 py-2 border-b-2 text-[16px] font-[600] ${
                activeTab === index ? 'border-[#7677F4] text-[#7677F4]' : 'border-transparent'
              } focus:outline-none`}
              onClick={() => {
                setActiveTab(index)
                scrollToTab(index)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full border-b"></div>

        <div className="py-4">
          {/* Ensure vertical overflow */}
          {tabs.map((tab, index) => (
            <div key={tab.id} id={`tab-${tab.id}`} ref={el => (tabRefs.current[index] = el)} data-tab-index={index}>
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SampleTabs
