import { useState } from "react";
import { Button } from "src/ui/button";
import EditPaymentForm from "./editPaymentForm";

import { useSelect, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog } from "src/ui/dialog";
export default function EditPayment({setEditPayment}) {
    let filter = [{ field: "participant_id", operator: "eq", value: 1 }];
    let sorter = [{ field: "created_at", order: "desc" }];
    const selectQuery: any = {
        resource: "participant_payment_history",
        meta: {
            select: "currency_code,payment_date,error_message,response_message,send_payment_confirmation,total_amount,payment_method_id!inner(id,value),transaction_type_id!inner(id,value),transaction_status_id!inner(id,value),payment_transaction_id,participant_id!inner(id,contact_id!inner(id,first_name,date_of_birth,street_address,postal_code,country_id!inner(name),state_id!inner(name),city_id!inner(name),mobile,email,identification_num,identification_type_id!inner(id,name)),organisation_id!inner(id,name),donation_type,donation_date)",
        },
        filters: filter,
        sorters: sorter,
    };
    const { queryResult } = useSelect(selectQuery);
    const data = queryResult?.data?.data[0];
   
    const methods = useForm({
        refineCoreProps: {
            action: "edit"
        },
    });
    const { mutate } = useUpdate();
    const onSubmit = (formData: any) => {
        // Call onFinish with the form data if needed
        onFinish(formData);
       mutate({
        resource:"participant_payment_history",
        values:{
            send_payment_confirmation:formData?.emailConfirmation,
            payment_date:formData?.paymentDate,
            payment_method_id:formData?.paymentMethod,
            transaction_status_id:formData?.transaction
        },
        // TODO: replace with participant_paymente_history id
        id:2
       })
       setEditPayment(false)
    
    };
    const {
        refineCore: { onFinish },
        handleSubmit,
    } = methods;
    return (
        <div>
            {/* <div >{trigger}</div>
            <div>
<<<<<<< HEAD
                <Dialog open={editPayment} onOpenChange={setEditPayment}>
                    <DialogContent> */}
                    <FormProvider {...methods}>
                                <form autoComplete="off">
                                    <div>
                                        <EditPaymentForm
                                            // setEditPayment={setEditPayment}
                                            paymentData={data}
                                        />
                                        <div className="flex justify-center gap-6">
                                            <div>
                                                <Button className="border rounded-xl border-[#7677F4] bg-[white] w-[87px] h-[46px] text-[#7677F4] font-semibold">
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div>
                                                <Button
                                                    className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] "
                                                    onClick={handleSubmit(
                                                        onSubmit
                                                    )}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        
                    </div>

        // </div>
    );
}
