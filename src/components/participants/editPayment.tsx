import { Button } from "src/ui/button";
import EditPaymentForm from "./editPaymentForm";

import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
export default function EditPayment() {
    const methods = useForm({
        refineCoreProps: {
            action: "edit", // or clone
            // resource: "categories",
            // id: 1, // <BASE_URL_FROM_DATA_PROVIDER>/categories/1
        },
    });
    const {
        refineCore: { onFinish },
        handleSubmit,
    } = methods;
    const onSubmit = (formData: any) => {
        console.log(formData);
        // Call onFinish with the form data if needed
        onFinish(formData);
    };

    // const {
    //     refineCore: { onFinish },
    //     handleSubmit
    // } = methods;
    // const onSubmit = (formData: any) => {
    //     console.log(formData);
    //     // Call onFinish with the form data if needed
    //     onFinish(formData);
    // };
    return (
        <div>
            <FormProvider {...methods}>
                <form autoComplete="off">
                    <div>
                        <Popover>
                            <PopoverTrigger>
                                <Button>EditPayment</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[637px]">
                                <div>
                                    <EditPaymentForm />
                                    <div className="flex justify-center">
                                        <div>
                                            <Button className="border rounded-xl border-[#7677F4] bg-[white] w-[87px] h-[46px] text-[#7677F4] font-semibold">
                                                Cancel
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] "
                                                onClick={handleSubmit(onSubmit)}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
