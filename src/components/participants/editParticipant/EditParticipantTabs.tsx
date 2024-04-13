import SampleTabs from "@components/participant/viewParticipant/SampleTabs";
import ViewParticipantTransactionDetails from "@components/participant/viewParticipant/ViewParticipantTransactionDetails";
import ViewParticipantUtmParameters from "@components/participant/viewParticipant/ViewParticipantUtmParameters";
import { useSelect, useUpdate } from "@refinedev/core";
import { useFormContext } from "react-hook-form";
import { Button } from "src/ui/button";
import AccomodationDetails from "./AccomodationDetails";
import CourseFee from "./CourseFee";
import ParticipantInformation from "./ParticipantInformation";
import PaymentDetails from "./PaymentDetails";
import { useRouter } from "next/router";

export default function EditParticipantTabs() {
    const{id}=useRouter()
    const { watch } = useFormContext();
    const formData = watch();

    // Getting data from api

    // participant_payment_history contains numerous records of same participant, getting the latest history record
    // TODO:replace value with participant_id
    let filter = [{ field: "participant_id", operator: "eq", value: 2 }];
    let sorter = [{ field: "created_at", order: "desc" }];
    const selectQuery: any = {
        resource: "participant_payment_history",
        meta: {
            select: "id,participant_id!inner(contact_id!inner(full_name),memo,created_at,roommate_preferences_1,roommate_preferences_2,roommate_preferences_3,accommodation_snore,roommate_snore,total_amount,participant_code,participant_attendence_status_id,discount_code),transaction_fee_level_id!inner(value),expense_fee,currency_code,accommodation_type_id,accommodation_fee",
        },
        filters: filter,
        sorters: sorter,
    };
    const { queryResult } = useSelect(selectQuery);
    const participantData = queryResult?.data?.data[0];

    const { mutate } = useUpdate();
    const onFormSubmission = (formData: any) => {
        console.log(formData,"formData")
        mutate({
            resource: "participant_registration",
            values: {
                memo: formData?.participantMemo,
                roommate_snore: formData?.roommatesnore,
                discount_code: formData?.special_code,
                participant_attendence_status_id: formData?.attendanceStatus,
            },
            // TODO: need to update it with participant_registration id
            id: 1,
        });
        mutate({
            resource: "participant_payment_history",
            values: {
                accommodation_type_id: formData?.accommodationType,
            },
            // TODO: need to update it with participant_payment_history id
            id: 2,
        });
    };

    // TODO: need to integrated with efficient tabs component
    // Rendering tabs content through tabs variable
    const tabs = [
        {
            id: 0,
            label: "Participants Information ",
            content: (
                <div>
                    {" "}
                    <ParticipantInformation data={participantData} />
                </div>
            ),
        },
        {
            id: 1,
            label: "Course Fees",
            content: (
                <div>
                    {" "}
                    <CourseFee data={participantData} />
                </div>
            ),
        },
        {
            id: 2,
            label: "Accomodation Details",
            content: (
                <div>
                    <AccomodationDetails data={participantData} />{" "}
                </div>
            ),
        },
        {
            id: 3,
            label: "Payment Details",
            content: (
                <div>
                    {" "}
                    <PaymentDetails participantData={participantData} />
                </div>
            ),
        },
        {
            id: 4,
            label: "Transaction Details",
            content: (
                <div>
                    <ViewParticipantTransactionDetails participantId={id} />
                </div>
            ),
        },

        {
            id: 5,
            label: "UTM Parameters",
            content: (
                <div>
                    <ViewParticipantUtmParameters participantId={id} />
                </div>
            ),
        },
    ];

    return (
        <div onClick={(e) => e.preventDefault()}>
            <SampleTabs tabs={tabs} />
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
