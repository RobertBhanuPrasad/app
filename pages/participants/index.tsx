import EditPayment from "@components/participants/editPayment";
import ViewDonationDetails from "@components/participants/viewDonationDetails";
import { useSelect } from "@refinedev/core";

export default function index() {
    // TODO:
    let filter = [{ field: "participant_id", operator: "eq", value: 1 }];
    let sorter = [{ field: "created_at", order: "desc" }];
    const selectQuery: any = {
        resource: "participant_payment_history",
        meta: {
            select: "currency_code,payment_date,error_message,response_message,send_payment_confirmation,total_amount,payment_method_id!inner(id,value),transaction_type_id!inner(id,value),transaction_status_id!inner(id,value),payment_transaction_id,participant_id!inner(id,contact_id!inner(id,full_name,date_of_birth,street_address,postal_code,country_id!inner(name),state_id!inner(name),city_id!inner(name),mobile,email,identification_num,identification_type_id!inner(id,name)),organisation_id!inner(id,name),donation_type,donation_date)",
        },
        filters: filter,
        sorters: sorter,
    };

    const { queryResult } = useSelect(selectQuery);
    const particpantData = queryResult?.data?.data[0];
    return (
        <div>
            index
            <ViewDonationDetails data={particpantData} />
            <EditPayment data={particpantData} />
        </div>
    );
}
