import Form from "@components/Formfield";
import EditParticipantTabs from "@components/participants/editParticipant/EditParticipantTabs";
// import { Form } from "react-hook-form";
export default function index() {
    // const [selectedValue, setSelectedValue] = useState(
    //     "Participants Information"
    // );
    // // participant_payment_history contains numerous records of same particpant, getting the latest history record
    // // TODO:replace value with participant_id
    // let filter = [{ field: "participant_id", operator: "eq", value: 2 }];
    // let sorter = [{ field: "created_at", order: "desc" }];
    // const selectQuery: any = {
    //     resource: "participant_payment_history",
    //     meta: {
    //         select: "id,participant_id!inner(contact_id!inner(full_name),memo,created_at,roommate_preferences_1,roommate_preferences_2,roommate_preferences_3,accommodation_snore,roommate_snore,total_amount,participant_code,participant_attendence_status_id,discount_code),transaction_fee_level_id!inner(value),expense_fee,currency_code,accommodation_type_id,accommodation_fee",
    //     },
    //     filters: filter,
    //     sorters: sorter,
    // };
    // const { queryResult } = useSelect(selectQuery);
    // const participantData = queryResult?.data?.data[0];
    // const [selectedTab, setSelectedTab] = useState("Participants Information");

    // // TODO: need to integrated with efficient tabs component

    // const { mutate } = useUpdate();
    // const onSubmit = (formData: any) => {
    //     mutate({
    //         resource: "participant_registration",
    //         values: {
    //             memo: formData?.participantMemo,
    //             roommate_snore: formData?.roommatesnore,
    //             discount_code: formData?.special_code,
    //             participant_attendence_status_id: formData?.attendanceStatus,
    //         },
    //         // TODO: need to update it with participant_registration id
    //         id: 1,
    //     });
    //     mutate({
    //         resource: "participant_payment_history",
    //         values: {
    //             accommodation_type_id: formData?.accommodationType,
    //         },
    //         // TODO: need to update it with participant_payment_history id
    //         id: 2,
    //     });
    // };

    return (
        <div>
            <div>
                <Form defaultValues={undefined}>
                    <EditParticipantTabs />
                </Form>
            </div>
        </div>
    );
}
