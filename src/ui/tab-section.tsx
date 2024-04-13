import { useEffect, useRef, useState } from 'react'
// import './styles.css'; // Define your CSS styles for tabs

const TabbedSection = () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'] // Define your tab labels
  const [activeTab, setActiveTab] = useState(0)
  const tabsRef = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const tabElements = tabsRef.current.map(ref => ref?.current)

      for (let i = 0; i < tabElements.length; i++) {
        const tabElement = tabElements[i]
        if (tabElement.offsetTop <= scrollPosition && tabElement.offsetTop + tabElement.clientHeight > scrollPosition) {
          setActiveTab(i)
          break
        }
      }
    }

    window?.addEventListener('scroll', handleScroll)
    return () => window?.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTabClick = index => {
    setActiveTab(index)
    tabsRef?.current[index]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="h-[1080px]">
      <div className="tabs flex sticky">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab  ${index === activeTab ? 'active border-b-2 border-[blue]' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="tab-contents">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-content ${index === activeTab ? 'active' : ''}`}
            ref={tabsRef?.current[index]}
          >
            {/* Render your tab content here */}
            <div className=" scrollable-content overflow-y-auto h-[450px]">
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p> <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>
              <p>{`This is content for ${tab}`}</p>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabbedSection
