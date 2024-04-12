import { useState } from "react";
import { Button } from "src/ui/button";
import EditPaymentForm from "./editPaymentForm";

import { useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
export default function EditPayment({ data }) {
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
    const [editPayment, setEditPayment] = useState(true);
    return (
        <div>
            <div>
                <Popover>
                    <PopoverTrigger>
                        <Button onClick={() => setEditPayment(true)}>
                            EditPayment
                        </Button>
                    </PopoverTrigger>
                    {editPayment && (
                        <PopoverContent className="w-[637px]">
                            <FormProvider {...methods}>
                                <form autoComplete="off">
                                    <div>
                                        <EditPaymentForm
                                            setEditPayment={setEditPayment}
                                            paymentData={data}
                                        />
                                        <div className="flex justify-center gap-6">
                                            <div>
                                                <Button onClick={() => setEditPayment(false)} className="border rounded-xl border-[#7677F4] bg-[white] w-[87px] h-[46px] text-[#7677F4] font-semibold">
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
                        </PopoverContent>
                    )}
                </Popover>
            </div>
        </div>
    );
}
