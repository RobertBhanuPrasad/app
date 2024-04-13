import { useState } from "react";
import { Button } from "src/ui/button";

import CalenderIcon from "@public/assets/CalenderIcon";
import SimpleCross from "@public/assets/SimpleCross";
import { useList, useSelect, useUpdate } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController, useFormContext } from "react-hook-form";
import { Calendar } from "src/ui/calendar";
import { Checkbox } from "src/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectItems,
    SelectTrigger,
    SelectValue,
} from "src/ui/select";
import { Textarea } from "src/ui/textarea";
import { formatDateString } from "src/utility/DateFunctions";
export default function EditPayment({ paymentData }) {
    const { id } = useRouter();
    const { mutate } = useUpdate();
    const [editPayment, setEditPayment] = useState(true);
    const { watch } = useFormContext();
    const formData = watch();

    const onFormSubmission = (data: any) => {
        console.log(data,"form submitted")
        mutate({
            resource: "participant_payment_history",
            values: {
                send_payment_confirmation: formData?.emailConfirmation,
                payment_date: formData?.paymentDate,
                payment_method_id: formData?.paymentMethod,
                transaction_status_id: formData?.transaction,
            },
            // TODO: replace with participant_paymente_history id
            id: id,
        });
        setEditPayment(false);
    };

    // Form fileds useControllers
    const [open, setOpen] = useState(false);
    const {
        field: { value: transaction, onChange: transactionOnchange },
    } = useController({
        name: "transaction",
        defaultValue: paymentData?.transaction_status_id?.id,
    });
    const {
        field: { value: paymentDate, onChange: paymentDateOnchange },
    } = useController({
        name: "paymentDate",
        defaultValue: paymentData?.payment_date
            ? paymentData?.payment_date
            : "",
    });
    const {
        field: { value: payment, onChange: paymentMethodOnchange },
    } = useController({
        name: "paymentMethod",
        defaultValue: paymentData?.payment_method_id?.id,
    });
    const {
        field: { value: emailConfirmation, onChange: emailConfirmatiOnchange },
    } = useController({
        name: "emailConfirmation",
        defaultValue: paymentData?.send_payment_confirmation,
    });

    // Getting option label for transaction status
    const { data: transaction_data } = useList<any>({
        resource: "option_labels",
        filters: [
            {
                field: "name",
                operator: "eq",
                value: "Transaction Status",
            },
        ],
    });
    // Getting option values for transaction status
    const { options: transactionStatus } = useSelect({
        resource: "option_values",
        optionLabel: "value",
        optionValue: "id",
        filters: [
            {
                field: "option_label_id",
                operator: "eq",
                value: transaction_data?.data[0]?.id,
            },
        ],
    });

    // Getting option label for payment method
    const { data: payment_data } = useList<any>({
        resource: "option_labels",
        filters: [
            {
                field: "name",
                operator: "eq",
                value: "Payment Method",
            },
        ],
    });

    // Getting option values for payment method
    const { options: payment_method } = useSelect({
        resource: "option_values",
        optionLabel: "value",
        optionValue: "id",
        filters: [
            {
                field: "option_label_id",
                operator: "eq",
                value: payment_data?.data[0]?.id,
            },
        ],
    });

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
                            <div>
                                <div>
                                    <div>
                                        <div className="flex justify-end ">
                                            <div
                                                onClick={() =>
                                                    setEditPayment(false)
                                                }
                                                className="cursor-pointer"
                                            >
                                                <SimpleCross />
                                            </div>
                                        </div>
                                        <div className="flex justify-center text-[24px] font-semibold ">
                                            Edit Payment
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex-1">
                                                <div className="py-[5px]">
                                                    <div className="py-[5px] ">
                                                        Participant Name
                                                    </div>
                                                    <div>
                                                        <Textarea
                                                            value={
                                                                paymentData
                                                                    ?.participant_id
                                                                    ?.contact_id
                                                                    ?.full_name
                                                                    ? paymentData
                                                                          ?.participant_id
                                                                          ?.contact_id
                                                                          ?.full_name
                                                                    : ""
                                                            }
                                                            className="!w-[278px] resize-none !important !h-[40px] cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="w-[278px] py-[5px]">
                                                    <div className="py-[5px]">
                                                        Transaction Status
                                                    </div>
                                                    <div>
                                                        {/* TODO: need to disable select for confirmed and failed transaction ids */}
                                                        <Select
                                                            value={transaction}
                                                            onValueChange={(
                                                                val: any
                                                            ) => {
                                                                transactionOnchange(
                                                                    val
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-[278px]">
                                                                <SelectValue placeholder="Select Course Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItems>
                                                                    {transactionStatus.map(
                                                                        (
                                                                            option: any,
                                                                            index: number
                                                                        ) => (
                                                                            <>
                                                                                <SelectItem
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                    className="h-[44px]"
                                                                                >
                                                                                    {
                                                                                        option.label
                                                                                    }
                                                                                </SelectItem>
                                                                                {index <
                                                                                    transactionStatus?.length -
                                                                                        1 && (
                                                                                    <hr className="border-[#D6D7D8]" />
                                                                                )}
                                                                            </>
                                                                        )
                                                                    )}
                                                                </SelectItems>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="py-[5px]">
                                                    <div className="py-[5px]">
                                                        Transaction ID
                                                    </div>
                                                    <div>
                                                        <Textarea
                                                            value={
                                                                paymentData?.payment_transaction_id
                                                            }
                                                            className="!w-[278px] resize-none !important h-[40px]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="py-[5px]">
                                                    <div className="py-[5px]">
                                                        Payment Date
                                                    </div>
                                                    {/* TODO: need to disable it for confirmed and failed transaction ids */}
                                                    <div>
                                                        <Dialog open={open}>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    onClick={() =>
                                                                        setOpen(
                                                                            true
                                                                        )
                                                                    }
                                                                    className="w-[278px] h-[40px] flex flex-row items-center"
                                                                    variant="outline"
                                                                >
                                                                    <div className="flex gap-8">
                                                                        <div className="">
                                                                            {paymentDate ? (
                                                                                <div>
                                                                                    {formatDateString(
                                                                                        new Date(
                                                                                            paymentDate
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex gap-2 font-normal">
                                                                                    Select
                                                                                    the
                                                                                    Date
                                                                                    Range
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="">
                                                                            <CalenderIcon color="#666666" />
                                                                        </div>
                                                                    </div>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-[#FFFFFF] !rounded-3xl">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        paymentDate
                                                                    }
                                                                    onSelect={
                                                                        paymentDateOnchange
                                                                    }
                                                                    className="rounded-md border"
                                                                />
                                                                <Button
                                                                    onClick={() =>
                                                                        setOpen(
                                                                            false
                                                                        )
                                                                    }
                                                                    className=" w-[94px] h-10 rounded-xl"
                                                                >
                                                                    Apply
                                                                </Button>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>

                                                <div className="py-[5px]">
                                                    <div className="py-[5px]">
                                                        Payment Method
                                                    </div>
                                                    <div className="!w-[278px]">
                                                        {/* TODO:need to disable select for confimed and failed transaction ids */}
                                                        <Select
                                                            value={payment}
                                                            onValueChange={(
                                                                val: any
                                                            ) => {
                                                                paymentMethodOnchange(
                                                                    val
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-[278px]">
                                                                <SelectValue placeholder="Select Course Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItems>
                                                                    {payment_method?.map(
                                                                        (
                                                                            option: any,
                                                                            index: number
                                                                        ) => (
                                                                            <>
                                                                                <SelectItem
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                    className="h-[44px]"
                                                                                >
                                                                                    {
                                                                                        option.label
                                                                                    }
                                                                                </SelectItem>
                                                                                {index <
                                                                                    payment_method?.length -
                                                                                        1 && (
                                                                                    <hr className="border-[#D6D7D8]" />
                                                                                )}
                                                                            </>
                                                                        )
                                                                    )}
                                                                </SelectItems>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="py-[5px]">
                                                    <div className="py-[5px]">
                                                        Response Message
                                                    </div>
                                                    <div>
                                                        <Textarea
                                                            value={
                                                                paymentData?.response_message
                                                            }
                                                            className="!w-[278px] resize-none !important h-[40px]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col py-[5px]">
                                            <div className="py-[5px]">
                                                Error Message
                                            </div>
                                            <div>
                                                <Textarea
                                                    value={
                                                        paymentData?.error_message
                                                    }
                                                    className=" resize-none !important !h-[40px] !w-[578px]"
                                                />
                                            </div>

                                            <div className="flex gap-4 py-[30px]">
                                                <div>
                                                    <Checkbox
                                                        checked={
                                                            emailConfirmation
                                                        }
                                                        onCheckedChange={
                                                            emailConfirmatiOnchange
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    Send Payment confirmation
                                                    mail?
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6">
                                    <div>
                                        <Button
                                            // onClick={() => setEditPayment(false)}
                                            className="border rounded-xl border-[#7677F4] bg-[white] w-[87px] h-[46px] text-[#7677F4] font-semibold"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] "
                                            onClick={() => {
                                                onFormSubmission(formData);
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    )}
                </Popover>
            </div>
        </div>
    );
}
