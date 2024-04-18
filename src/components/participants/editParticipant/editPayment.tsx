import { useState } from "react";
import { Button } from "src/ui/button";

import CalenderIcon from "@public/assets/CalenderIcon";
import { useList, useSelect, useUpdate } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { Calendar } from "src/ui/calendar";
import { Checkbox } from "src/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
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
export default function EditPayment({ setEditPayment }) {
    const { query } = useRouter();
    const { mutate } = useUpdate();
    const { watch, getValues } = useFormContext();
    const defaultData = getValues();
    const formData = watch();
    const onFormSubmission = (data: any) => {
        mutate({
            resource: "participant_payment_history",
            values: {
                send_payment_confirmation: formData?.emailConfirmation,
                payment_date: formData?.paymentDate,
                payment_method_id: formData?.paymentMethod,
                transaction_status_id: formData?.transaction,
            },
            // TODO: replace with participant_paymente_history id
            id: defaultData?.id,
        });
        setEditPayment(false);
    };

    // Form fileds useControllers
    const [open, setOpen] = useState(false);
    const {
        field: { value: transaction_status_id, onChange: transactionOnchange },
    } = useController({
        name: "transaction_status_id",
    });

    const {
        field: { value: payment_date, onChange: paymentDateOnchange },
    } = useController({
        name: "payment_date",
    });
    const {
        field: { value: payment_method_id, onChange: paymentMethodOnchange },
    } = useController({
        name: "payment_method",
        // defaultValue: paymentData?.payment_method_id?.id,
    });
    const {
        field: { value: transaction_id },
    } = useController({
        name: "transaction_id",
    });
    const {
        field: { value: response_message },
    } = useController({
        name: "response_message",
    });
    const {
        field: { value: error_message },
    } = useController({
        name: "error_message",
    });
    const {
        field: {
            value: send_payment_confirmation,
            onChange: emailConfirmatiOnchange,
        },
    } = useController({
        name: "send_payment_confirmation",
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
                <div>
                    <div>
                        <div>
                            <Text className="flex justify-center text-[24px] font-semibold ">
                                Edit Payment
                            </Text>
                            <div className="flex flex-row">
                                <div className="flex-1">
                                    <div className="py-[5px]">
                                        <Text className="py-[5px] ">
                                            Participant Name
                                        </Text>
                                        <div>
                                            <Textarea
                                                value={
                                                    defaultData?.full_name
                                                        ? defaultData?.full_name
                                                        : ""
                                                }
                                                className="!w-[278px] resize-none !important !h-[40px] cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-[278px] py-[5px]">
                                        <Text className="py-[5px]">
                                            Transaction Status
                                        </Text>
                                        <div>
                                            {/* TODO: need to disable select for confirmed and failed transaction ids */}
                                            <Select
                                                disabled={
                                                    transaction_status_id?.id ==
                                                        77||78
                                                        ? true
                                                        : false
                                                }
                                                value={transaction_status_id?.id}
                                                onValueChange={(val: any) => {
                                                    transactionOnchange(val);
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
                                                                </>
                                                            )
                                                        )}
                                                    </SelectItems>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="py-[5px]">
                                        <Text className="py-[5px]">
                                            Transaction ID
                                        </Text>
                                        <div>
                                            <Textarea
                                                value={transaction_id}
                                                className="!w-[278px] resize-none !important h-[40px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="py-[5px]">
                                        <Text className="py-[5px]">
                                            Payment Date
                                        </Text>
                                        {/* TODO: need to disable it for confirmed and failed transaction ids */}
                                        <div>
                                            <Dialog open={open}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        onClick={() =>
                                                            setOpen(true)
                                                        }
                                                        className="w-[278px] h-[40px] flex flex-row items-center"
                                                        variant="outline"
                                                    >
                                                        <div className="flex gap-8">
                                                            <div className="">
                                                                {payment_date ? (
                                                                    <Text>
                                                                        {formatDateString(
                                                                            new Date(
                                                                                payment_date
                                                                            )
                                                                        )}
                                                                    </Text>
                                                                ) : (
                                                                    <Text className="flex gap-2 font-normal">
                                                                        Select
                                                                        the Date
                                                                        Range
                                                                    </Text>
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
                                                        selected={payment_date}
                                                        onSelect={
                                                            paymentDateOnchange
                                                        }
                                                        className="rounded-md border"
                                                    />
                                                    <Button
                                                        onClick={() =>
                                                            setOpen(false)
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
                                        <Text className="py-[5px]">
                                            Payment Method
                                        </Text>
                                        <div className="!w-[278px]">
                                            {/* TODO:need to disable select for confimed and failed transaction ids */}
                                            <Select
                                                value={payment_method_id}
                                                onValueChange={(val: any) => {
                                                    paymentMethodOnchange(val);
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
                                        <Text className="py-[5px]">
                                            Response Message
                                        </Text>
                                        <div>
                                            <Textarea
                                                value={response_message}
                                                className="!w-[278px] resize-none !important h-[40px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col py-[5px]">
                                <Text className="py-[5px]">Error Message</Text>
                                <div>
                                    <Textarea
                                        value={error_message}
                                        className=" resize-none !important !h-[40px] !w-[578px]"
                                    />
                                </div>

                                <div className="flex gap-4 py-[30px]">
                                    <div>
                                        <Checkbox
                                            checked={send_payment_confirmation}
                                            onCheckedChange={
                                                emailConfirmatiOnchange
                                            }
                                        />
                                    </div>
                                    <Text>Send Payment confirmation mail?</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6">
                        <div>
                            <Button
                                onClick={() => setEditPayment(false)}
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
            </div>
        </div>
    );
}
