import { useEffect } from "react";
import { Element, Link, scroller } from "react-scroll";
interface Tab {
    id: string;
    label: string;
    content: JSX.Element;
}
interface ScrollablePageProps {
    tabs: Tab[];
    onActiveTabChange: (activeTabId: string) => void;
}
const ScrollablePage = ({ tabs, onActiveTabChange }: ScrollablePageProps) => {
    // const styles = {
    //     pageContainer: {
    //         display: "flex",
    //         flexDirection: "column" as "column",
    //         alignItems: "center",
    //         width: "100%",
    //     },
    //     tabs: {
    //         display: "flex",
    //         justifyContent: "left",
    //         width: "100%",
    //         height: "20%",
    //         padding: "10px 0px",
    //         position: "sticky" as "sticky",
    //         top: 170,
    //         zIndex: 1000,
    //         backgroundColor: "white",
    //     },
    //     tab: {
    //         padding: "10px 10px",
    //         fontWeight: "600",
    //         fontSize: "16px",
    //         borderBottom: "transparent",
    //         margin: "0 10px",
    //         cursor: "pointer",
    //     },
    //     activeTab: {
    //         borderBottom: "2px solid #7677F4",
    //         color: "#7677F4",
    //     },
    //     sections: {
    //         width: "100%",
    //         padding: "60px 20px",
    //     },
    //     section: {
    //         padding: "0 20px",
    //         borderBottom: "1px solid #ddd",
    //     },
    // };

    useEffect(() => {
        // Scroll to the default section (first tab) when the component mounts
        if (tabs && tabs.length > 0) {
            scroller.scrollTo(tabs[0].id, {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                offset: -220, // Adjust based on your needs
            });
            onActiveTabChange(tabs[0].id);
        }
    }, []);
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex justify-start w-full h-20 p-2.5 sticky top-[170px] z-1000 bg-white">
                {tabs?.map((tab: Tab, id) => (
                    <div key={id}>
                        <Link
                            className="p-2.5 mx-[10px] font-semibold text-base cursor-pointer"
                            activeClass="active"
                            to={tab.id}
                            spy={true}
                            smooth={true}
                            duration={500}
                            offset={-220}
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

            <div className="w-full p-5">
                {tabs?.map((tab: Tab) => (
                    <div>
                        <Element name={tab?.id} className="px-5 border-b border-gray-300">
                            <div>{tab?.content}</div>
                        </Element>
                    </div>
                ))}
                <div className="h-[900px]"></div>
            </div>
        </div>
    );
};

export default ScrollablePage;
