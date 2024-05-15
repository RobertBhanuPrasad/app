import { useEffect, useRef, useState } from "react";

interface Tab {
  id: number;
  label: string;
  content: JSX.Element;
}

function ScrollableTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const tabIndex = parseInt(target.dataset.tabIndex || "0");
            setActiveTab(tabIndex);
          }
        });
      },
      { threshold: 0.5 }
    );

    tabRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToTab = (tabIndex: number) => {
    const tabElement = tabRefs.current[tabIndex];
    tabElement?.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the start of the tab
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="h-[800px] overflow-y-auto">
        <div className="flex sticky z-50 top-0 gap-4 py-2 bg-white overflow-x-auto">
          {/* Ensure horizontal overflow */}
          {tabs.map((tab, index: number) => (
            <button
              key={tab.id}
              className={`px-4 py-2 border-b-2 text-[16px] font-[600] ${
                activeTab === index
                  ? "border-[#7677F4] text-[#7677F4]"
                  : "border-transparent"
              } focus:outline-none`}
              onClick={() => {
                setActiveTab(index);
                scrollToTab(index);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full border-b"></div>

        <div className="py-4 px-4">
          {/* Ensure vertical overflow */}
          {tabs.map((tab, index: number) => (
            <div
              className="mb-[20px]"
              key={tab.id}
              id={`tab-${tab.id}`}
              ref={(el) => (tabRefs.current[index] = el as any)}
              data-tab-index={index}
            >
              {tab.content}
            </div>
          ))}
        </div>
        </div>
        </div>
    );
}

export default ScrollableTabs;
