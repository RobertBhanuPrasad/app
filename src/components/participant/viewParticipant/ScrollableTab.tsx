import { useEffect } from "react";
import { Element, Link, scroller } from "react-scroll";
interface Tab {
    id: string;
    label: string;
    header: JSX.Element;
    content: JSX.Element;
}
interface ScrollablePageProps {
    tabs: Tab[];
    onActiveTabChange: (activeTabId: string) => void;
}
const ScrollablePage = ({ tabs, onActiveTabChange }: ScrollablePageProps) => {
    

    useEffect(() => {
        // Scroll to the default section (first tab) when the component mounts
        if (tabs && tabs.length > 0) {
            scroller.scrollTo(tabs[0].id, {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                offset: -180, // Adjust based on your needs
            });
            onActiveTabChange(tabs[0].id);
        }
    }, []);

    return (
        <div className="flex flex-col items-center w-full ">
            <div className="flex justify-start w-full h-10 p-1 sticky top-[160px] z-1000 bg-white border-b-2 ">
                {tabs?.map((tab: Tab, id) => (
                    <div key={id}>
                        <Link
                            className="p-2.5 mx-[10px] font-semibold text-base cursor-pointer"
                            activeClass="active"
                            to={tab.id}
                            spy={true}
                            smooth={true}
                            duration={500}
                            offset={-180}
                            activeStyle={{
                                borderBottom: "2px solid #7677F4",
                                color: "#7677F4",
                            }}
                            onSetActive={() => onActiveTabChange(tab.id)}
                        >
                            {tab.label}
                        </Link>
                    </div>
                ))}
            </div>

            <div className="w-full py-5">
                {tabs?.map((tab: Tab, index: number) => (
                    <div key={index}>
                        <Element
                            name={tab?.id}
                            className={`px-5 py-7`}
                        >
                            <div>{tab?.header}</div>
                            <div>{tab?.content}</div>
                        </Element>
                    </div>
                ))}
                <div className="h-[500px]"></div>
            </div>
        </div>
    );
};

export default ScrollablePage;
