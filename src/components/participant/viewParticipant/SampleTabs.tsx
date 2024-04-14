import { useEffect, useRef, useState } from 'react'
import ViewParticipantCourseInformation from './ViewParticipantCourseInformation'
import ViewParticipantCustomerDeviceDetails from './ViewParticipantCustomerDeviceDetails'
import ViewParticipantEmailDeliveryLogs from './ViewParticipantEmailDeliveryLogs'
import ViewParticipantTransactionDetails from './ViewParticipantTransactionDetails'
import ViewParticipantUtmParameters from './ViewParticipantUtmParameters'

function SampleTabs({tabs}) {


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
      <div className="h-[800px] overflow-y-auto">
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

        <div className="py-4 px-4">
          {/* Ensure vertical overflow */}
          {tabs.map((tab, index) => (
            <div
              className="mb-[20px]"
              key={tab.id}
              id={`tab-${tab.id}`}
              ref={el => (tabRefs.current[index] = el)}
              data-tab-index={index}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SampleTabs
