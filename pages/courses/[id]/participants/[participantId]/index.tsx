import ScrollablePage from "@components/participant/viewParticipant/ScrollableTab";
import ViewParticipantCourseInformation from "@components/participant/viewParticipant/ViewParticipantCourseInformation";
import ViewParticipantCustomerDeviceDetails from "@components/participant/viewParticipant/ViewParticipantCustomerDeviceDetails";
import ViewParticipantEmailDeliveryLogs from "@components/participant/viewParticipant/ViewParticipantEmailDeliveryLogs";
import ViewParticipantInformation from "@components/participant/viewParticipant/ViewParticipantInformation";
import ViewParticipantTransactionDetails from "@components/participant/viewParticipant/ViewParticipantTransactionDetails";
import ViewParticipantUtmParameters from "@components/participant/viewParticipant/ViewParticipantUtmParameters";
import { ParticipantsListMainHeader } from "@components/participants/ParticipantsListMainHeader";
import TransactionActivity from "@components/participants/TransactionActivityPopover";
import TransactionActivityIcon from "@public/assets/TransactionActivityIcon";
import { useTable } from "@refinedev/core";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useState } from "react";
import { authProvider } from "src/authProvider";
import {
    VIEW_CUSTOMER_DEVICE_DETAILS,
    VIEW_PARTICIPANT_COURSE_INFORMATION,
    VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS,
    VIEW_PARTICIPANT_TRANSACTION_DETAILS,
    VIEW_PARTICIPANT_UTM_PARAMETERS,
} from "src/constants/Tabs";

function index() {
    const { t } = useTranslation("course.participants");
    const router = useRouter();
    const [activeTabId, setActiveTabId] = useState<string>("");
    const Id: number | undefined = router?.query?.participantId
        ? parseInt(router.query.participantId as string)
        : undefined;
    let {
        tableQueryResult: participantTransactionDetailsData, // Table data result
        pageCount, // Number of pages
        pageSize, // Number of items per page
        setPageSize, // Function to set page size
        current, // Current page number
        setCurrent, // Function to set current page number
    } = useTable({
        resource: "participant_payment_history", // Resource name for fetching data
        meta: {
            select: "*,transaction_type_id(*),payment_method_id(*),transaction_fee_level_id(*),transaction_status_id(*),accommodation_type_id(*,accommodation_type_id(*))", // Selecting specific fields
        },
        filters: {
            permanent: [
                {
                    field: "participant_id",
                    operator: "eq",
                    value: Id,
                },
            ],
        },
    });
    const tabTriggers: any = [
        {
            value: VIEW_PARTICIPANT_COURSE_INFORMATION,
            label: t(
                "course.participants:view_participant.course_information_tab.course_information"
            ),
            disabled: false,
        },
        {
            value: VIEW_PARTICIPANT_TRANSACTION_DETAILS,
            label: "Transaction Details",
            disabled: false,
        },
        {
            value: VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS,
            label: "Email Delivery Logs",
            disabled: false,
        },
        {
            value: VIEW_CUSTOMER_DEVICE_DETAILS,
            label: t(
                "course.participants:view_participant.customer_device_details"
            ),
            disabled: false,
        },
        {
            value: VIEW_PARTICIPANT_UTM_PARAMETERS,
            label: "UTM Parameters",
            disabled: false,
        },
    ];
    const tabs = [
        {
            id: "section1",
            label: t(
                "course.participants:view_participant.course_information_tab.course_information"
            ),
            content: (
                <div>
                    <ViewParticipantCourseInformation participantId={Id} />
                </div>
            ),
            header: (
                <p
                    className={`font-semibold text-[18px] pt-[25px] ${
                        activeTabId == "section1" && "text-[#7677F4]"
                    }`}
                >
                    {t(
                        "course.participants:view_participant.course_information_tab.course_information"
                    )}
                </p>
            ),
        },
        {
            id: "section2",
            label: t(
                "course.participants:view_participant.transaction_details"
            ),
            content: (
                <div>
                    <ViewParticipantTransactionDetails participantId={Id} />
                </div>
            ),
            header: (
                <div className="flex">
                    
                    <p
                        className={`text-[18px] font-[600] pr-[10px] !m-[0] !py-[0] !h-[0] ${
                            activeTabId == "section5" && "text-[#7677F4]"
                        }`}
                    >
                        {t(
                            "course.participants:view_participant.transaction_details"
                        )}
                    </p>
                    <div className="cursor-pointer ">
                        <div className="text-left ">
                            <TransactionActivity
                                transactionHistory={
                                    participantTransactionDetailsData?.data
                                        ?.data
                                }
                                renderHeader={<TransactionActivityIcon />}
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "section3",
            label: "Email Delivery Logs",
            content:(<div>
                <ViewParticipantEmailDeliveryLogs participantId={Id} />
                </div> ),
            header: (
                <p
                    className={` font-semibold text-[18px] pt-[25px] ${
                        activeTabId == "section3" && "text-[#7677F4]"
                    }`}
                >
                    Email Delivery Logs
                </p>
            ),
        },
        {
            id: "section4",
            label: t(
                "course.participants:view_participant.customer_device_details"
            ),
            content: (
                (<div>
                    <ViewParticipantCustomerDeviceDetails participantId={Id} />
                    </div>)
            ),
            header: (
                <p
                    className={`font-semibold text-[18px] pt-[25px] ${
                        activeTabId == "section4" && "text-[#7677F4]"
                    }`}
                >
                    {t(
                        "course.participants:view_participant.customer_device_details"
                    )}
                </p>
            ),
        },
        {
            id: "section5",
            label: "UTM Parameters",
            content: (<div>
                <ViewParticipantUtmParameters participantId={Id} />
                </div>),
            header: (
                <p
                    className={`font-semibold text-[18px] pt-[25px] ${
                        activeTabId == "section5" && "text-[#7677F4]"
                    }`}
                >
                    UTM Parameters
                </p>
            ),
        },
    ];
    const handleActiveTabChange = (tabId: string) => {
        setActiveTabId(tabId);
        console.log("active tab id", activeTabId);
    };
    return (
        <div>
            <div className="top-[94px] sticky z-10 bg-white shadow-md w-full">
                <ParticipantsListMainHeader />
            </div>
            <div className="flex p-[20px] w-full">
                <div className="w-[18%] min-w-[318px] pl-[10px] ">
                    <ViewParticipantInformation participantId={Id} />
                </div>

                <div className="w-[82%]">
                    <ScrollablePage
                        tabs={tabs}
                        onActiveTabChange={handleActiveTabChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default index;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const { authenticated, redirectTo } = await authProvider.check(context);

    const translateProps = await serverSideTranslations(
        context.locale ?? "en",
        [
            "common",
            "course.participants",
            "new_strings",
            "course.find_course",
            "course.view_course",
        ]
    );

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
