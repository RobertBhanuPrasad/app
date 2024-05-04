import SampleTabs from "@components/participant/viewParticipant/ScrollableTabs";
import ViewParticipantCourseInformation from "@components/participant/viewParticipant/ViewParticipantCourseInformation";
import ViewParticipantCustomerDeviceDetails from "@components/participant/viewParticipant/ViewParticipantCustomerDeviceDetails";
import ViewParticipantEmailDeliveryLogs from "@components/participant/viewParticipant/ViewParticipantEmailDeliveryLogs";
import ViewParticipantInformation from "@components/participant/viewParticipant/ViewParticipantInformation";
import ViewParticipantTransactionDetails from "@components/participant/viewParticipant/ViewParticipantTransactionDetails";
import ViewParticipantUtmParameters from "@components/participant/viewParticipant/ViewParticipantUtmParameters";
import { ParticipantsListMainHeader } from "@components/participants/ParticipantsListMainHeader";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { authProvider } from "src/authProvider";
import {
    VIEW_CUSTOMER_DEVICE_DETAILS,
    VIEW_PARTICIPANT_COURSE_INFORMATION,
    VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS,
    VIEW_PARTICIPANT_TRANSACTION_DETAILS,
    VIEW_PARTICIPANT_UTM_PARAMETERS,
} from "src/constants/Tabs";
import { useTranslation } from 'next-i18next';

function index() {
    const router = useRouter();
    const {t} = useTranslation(["course.participants"])
    const Id: number | undefined = router?.query?.participantId
        ? parseInt(router.query.participantId as string)
        : undefined;

    const tabTriggers: any = [
        {
            value: VIEW_PARTICIPANT_COURSE_INFORMATION,
            label: t('course.participants:view_participant.course_information_tab.course_information'),
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
            label: "Customer Device Details",
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
            id: 0,
            label: t('course.participants:view_participant.course_information_tab.course_information'),
            content: (
                <div>
                    <ViewParticipantCourseInformation participantId={Id} />
                </div>
            ),
        },
        {
            id: 1,
            label: "Transaction Details",
            content: (
                <div>
                    {" "}
                    <ViewParticipantTransactionDetails participantId={Id} />
                </div>
            ),
        },
        {
            id: 2,
            label: "Email Delivery Logs",
            content: <ViewParticipantEmailDeliveryLogs participantId={Id} />,
        },
        {
            id: 3,
            label: "Customer Device Details",
            content: (
                <ViewParticipantCustomerDeviceDetails participantId={Id} />
            ),
        },
        {
            id: 4,
            label: "UTM Parameters",
            content: <ViewParticipantUtmParameters participantId={Id} />,
        },
    ];
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
                    <SampleTabs tabs={tabs} />
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
        ["common", "course.participants", "course.view_course", "new_strings"]
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
