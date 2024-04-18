import ScrollableTabs from "@components/participant/viewParticipant/ScrollableTabs";
import ViewParticipantTransactionDetails from "@components/participant/viewParticipant/ViewParticipantTransactionDetails";
import ViewParticipantUtmParameters from "@components/participant/viewParticipant/ViewParticipantUtmParameters";
import { useUpdate } from "@refinedev/core";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import { Button } from "src/ui/button";
import AccomodationDetails from "./AccomodationDetails";
import CourseFee from "./CourseFee";
import ParticipantInformation from "./ParticipantInformation";
import PaymentDetails from "./PaymentDetails";

export default function EditParticipantTabs() {
    const { watch, getValues } = useFormContext();
    const formData = watch();
    const accommodationData = getValues();
    const { query } = useRouter();

    // participant_payment_history contains numerous records of same participant, getting the latest history record

    const Id: number | undefined = query?.id
        ? parseInt(query.id as string)
        : undefined;

    const { mutate } = useUpdate();
    const onFormSubmission = (formData: any) => {
        mutate({
            resource: "participant_registration",
            values: {
                memo: formData?.participantMemo,
                roommate_snore: formData?.roommatesnore,
                discount_code: formData?.special_code,
                participant_attendence_status_id: formData?.attendanceStatus,
            },
            // TODO: integrate with participant_registration id
            id: formData?.participant_id,
        });
        mutate({
            resource: "participant_payment_history",
            values: {
                accommodation_type_id: formData?.accommodationType,
            },
            // TODO: integrate with participant_payment_history id
            id: Number(Id),
        });
    };

    // TODO: need to integrated with efficient tabs component
    // Rendering tabs content through tabs variable
    let tabs = [
        {
            id: 0,
            label: "Participants Information",
            content: (
                <div>
                    <ParticipantInformation />
                </div>
            ),
        },
        {
            id: 1,
            label: "Course Fees",
            content: (
                <div>
                    <CourseFee />
                </div>
            ),
        },
        {
            id: 2,
            label: "Accommodation Details",
            content: (
                <div>
                    <AccomodationDetails />
                </div>
            ),
        },
        {
            id: 3,
            label: "Payment Details",
            content: (
                <div>
                    <PaymentDetails />
                </div>
            ),
        },
        {
            id: 4,
            label: "Transaction Details",
            content: (
                <div>
                    <ViewParticipantTransactionDetails participantId={Id} />
                </div>
            ),
        },
        {
            id: 5,
            label: "UTM Parameters",
            content: (
                <div>
                    <ViewParticipantUtmParameters participantId={Id} />
                </div>
            ),
        },
    ];
    // Check if accommodation should be rendered
    if (accommodationData?.program_id?.program_type_id?.is_online_program) {
        tabs = tabs.filter((tab) => tab.label !== "Accommodation Details");
    }

    return (
        <div onClick={(e) => e.preventDefault()}>
            <ScrollableTabs tabs={tabs} />
            <div className="flex justify-center gap-4">
                <div>
                    <Button className="border border-[#7677F4] bg-[white] w-[101px] h-[46px] text-[#7677F4] font-semibold rounded-[12px]">
                        Cancel
                    </Button>
                </div>
                <div>
                    <Button
                        className="bg-[#7677F4] w-[86px] h-[46px] rounded-[12px] "
                        onClick={() => {
                            onFormSubmission(formData);
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
