import Form from "@components/Formfield";
import EditPayment from "@components/participants/editPayment";
import ViewDonationDetails from "@components/participants/viewDonationDetails";
import { useSelect } from "@refinedev/core";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import { Button } from "src/ui/button";

export default function index() {
    // participant_payment_history contains numerous records of same particpant, getting the latest history record
    // TODO:replace value with participant_id
    const { id } = useRouter();
    let filter = [{ field: "participant_id", operator: "eq", value: id }];
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
    // TODO: implement useMany or useList insted
    // const { data } = useMany({
    //     resource: "participant_payment_history",
    //     ids:[2],
    //     meta: { select: "*" },
    //     // ids: _.map(newCourseData?.program_fee_level_settings, "fee_level_id"),
    // });
    // const{data:particpantDataUseMany}=useMany({
    //     resource:"participant_payment_history",
    //     meta:{
    //         select: "currency_code,payment_date,error_message,response_message,send_payment_confirmation,total_amount,payment_method_id!inner(id,value),transaction_type_id!inner(id,value),transaction_status_id!inner(id,value),payment_transaction_id,participant_id!inner(id,contact_id!inner(id,full_name,date_of_birth,street_address,postal_code,country_id!inner(name),state_id!inner(name),city_id!inner(name),mobile,email,identification_num,identification_type_id!inner(id,name)),organisation_id!inner(id,name),donation_type,donation_date)",
    //     },
    // //     queryOptions:{
    // //         participant_id:id
    // //     }
    // })
    // console.log(data)

    return (
        <div>
            <ViewDonationDetails data={particpantData} />
            <Form onSubmit={()=>{}} defaultValues={undefined}>
                <div>
                    <EditPayment paymentData={particpantData} />
                    
                </div>
            </Form>
        </div>
    );
}
