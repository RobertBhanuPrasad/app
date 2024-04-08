import EditPayment from "@components/participants/editPayment";
import ViewDonationDetails from "@components/participants/viewDonationDetails";
import { CrudFilter, useSelect } from "@refinedev/core";
import { useStepsForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";

export default function index() {
    let filter: Array<CrudFilter> = [
        { field: "participant_id", operator: "eq", value: 1 },
        { field: "program_id", operator: "eq", value: 1 },
    ];
    const selectQuery: any = {
        resource: "participant_payment_history",
        optionaLabel: "view_donation_details",
        optionLabel: "id",
        meta: {
            select: "*,payment_method_id!inner(value),transaction_type_id!inner(value),transaction_status_id!inner(value),participant_id!inner(contact_id(*,country_id!inner(name),state_id!inner(name),city_id!inner(name)))",
        },
        filters: filter,
    };

    const methods = useStepsForm({
        refineCoreProps: {
            action: "create",
            resource: "event",
        },
    });
    const { options, queryResult } = useSelect(selectQuery);
    console.log(queryResult, "queryResult");
    return (
        <div>
            index
            <FormProvider {...methods}>
                <form autoComplete="off">
                    <ViewDonationDetails data={queryResult} />
                    <EditPayment methods={methods} />
                </form>
            </FormProvider>
        </div>
    );
}
