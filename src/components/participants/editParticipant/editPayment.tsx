import CrossIcon from "@public/assets/CrossIcon";
import Tick from "@public/assets/Tick";
import { useList, useOne, useSelect, useUpdate } from "@refinedev/core";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { translatedText } from "src/common/translations";
import { PARTICIPANT_PAYMENT_STATUS } from "src/constants/OptionLabels";
import {
    PARTICIPANT_CONFIRMED_PAYMENT_STATUS,
    PARTICIPANT_FAILED_PAYMENT_STATUS,
} from "src/constants/OptionValueOrder";
import { DateField } from "src/ui/DateField";
import { Text } from "src/ui/TextTags";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "src/ui/alert-dialog";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import { DialogContent } from "src/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectItems,
    SelectTrigger,
    SelectValue,
} from "src/ui/select";
import { Textarea } from "src/ui/textarea";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

interface EditPaymentProps {
    setEditPayment: React.Dispatch<React.SetStateAction<any>>;
    paymentId: number;
    contactId?: number;
}
export default function EditPayment({
    setEditPayment,
    paymentId,
    contactId,
}: EditPaymentProps) {
    const { t } = useTranslation([
        "common",
        "course.participants",
        "new_strings",
    ]);
    const { query } = useRouter();
    const { mutate } = useUpdate();
    const { watch, reset } = useFormContext();
    const [cancelEditPayment, setcancelEditPayment] = useState(false);
    const [saveChangesConfirmation, setSaveChangesConfirmation] =
        useState(false);
    let formData = watch();
    const [initialValue, setinitialValue] = useState(formData);
    // Checking the chnages in form values compared to defaultvalues
    const onFormSubmission = () => {
        const initialData = _.omitBy(initialValue, _.isUndefined);
        const formValues = _.omitBy(formData, _.isUndefined);
        if (!_.isEqual(initialData, formValues)) {
            setSaveChangesConfirmation(true);
        } else {
            setEditPayment(false);
        }
    };
    // Posting form data to payment history table
    const formDataPost = async () => {
        setSaveChangesConfirmation(false);
        setEditPayment(false);
        await mutate({
            resource: "participant_payment_history",
            values: {
                send_payment_confirmation: formData?.send_payment_confirmation,
                transaction_date: formData?.payment_date,
                payment_method_id: formData?.payment_method_id,
                transaction_status_id: formData?.transaction_status_id,
            },
            id: paymentId,
        });
    };

    // Form fileds useControllers
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
        name: "payment_method_id",
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
                value: "Participant Payment Status",
            },
        ],
    });

    // Getting option value constant using option order
    const CONFIRMED_ID = getOptionValueObjectByOptionOrder(
        PARTICIPANT_PAYMENT_STATUS,
        PARTICIPANT_CONFIRMED_PAYMENT_STATUS
    )?.id;
    const FAILED_ID = getOptionValueObjectByOptionOrder(
        PARTICIPANT_PAYMENT_STATUS,
        PARTICIPANT_FAILED_PAYMENT_STATUS
    )?.id;

    // Getting option values for transaction status dropodwn
    const { options: transactionStatus } = useSelect({
        resource: "option_values",
        optionLabel: "name",
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

    // Getting option values for payment method dropdown
    const { options: payment_method } = useSelect({
        resource: "option_values",
        optionLabel: "name",
        optionValue: "id",
        filters: [
            {
                field: "option_label_id",
                operator: "eq",
                value: payment_data?.data[0]?.id,
            },
        ],
    });

    // getting participant contact name for particular participant id
    const Id: number | undefined = query?.participantId
        ? parseInt(query.participantId as string)
        : undefined;
    const { data } = useOne({
        resource: "participant_registration",
        id: contactId ? contactId : Number(Id),
        meta: {
            select: "contact_id(full_name)",
        },
    });

    // Getting transaction details for the particular payment history id
    const transactionData = useOne({
        resource: "participant_payment_history",
        id: paymentId,
        meta: {
            select: "id,payment_transaction_id,response_message,error_message,payment_method_id",
        },
    });

    // Both functions are confirmation popups to save or cancel the changes of the edit payment form
    const cancelConfirmation = () => {
        const initialData = _.omitBy(initialValue, _.isUndefined);
        const formValues = _.omitBy(formData, _.isUndefined);
        if (!_.isEqual(initialData, formValues)) {
            setcancelEditPayment(true);
        } else {
            setEditPayment(false);
        }
    };

    const cancelEditPaymentHandler = () => {
        setcancelEditPayment(false);
        setEditPayment(false);
        reset();
    };
    return (
        <DialogContent
            handleClickCloseButton={() => {
                cancelConfirmation();
            }}
        >
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <Text className="flex justify-center text-[24px] font-semibold ">
                                    {t(
                                        "course.participants:edit_participant.participants_information_tab.edit_payment"
                                    )}
                                </Text>
                                <div className="flex flex-row">
                                    <div className="flex-1">
                                        <div className="py-[5px]">
                                            <Text className="py-[5px] ">
                                                {t(
                                                    "course.participants:edit_participant.participants_information_tab.participant_name"
                                                )}
                                            </Text>
                                            <div>
                                                <Textarea
                                                    disabled={true}
                                                    value={
                                                        data?.data?.contact_id
                                                            ?.full_name
                                                            ? data?.data
                                                                  ?.contact_id
                                                                  ?.full_name
                                                            : "-"
                                                    }
                                                    className="!w-[278px] resize-none !important !h-[40px] cursor-not-allowed outline-none rounded-[12px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-[278px] py-[5px]">
                                            <Text className="py-[5px]">
                                                {t(
                                                    "course.participants:find_participant.transaction_status"
                                                )}
                                            </Text>
                                            <div>
                                                {/*  when transaction status is confirmed or failed need to disable select */}
                                                <Select
                                                    disabled={
                                                        transaction_status_id ==
                                                        FAILED_ID
                                                            ? true
                                                            : transaction_status_id ==
                                                              CONFIRMED_ID
                                                            ? true
                                                            : false
                                                    }
                                                    value={
                                                        transaction_status_id
                                                    }
                                                    onValueChange={(
                                                        val: any
                                                    ) => {
                                                        transactionOnchange(
                                                            val
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[278px]">
                                                        <SelectValue
                                                            placeholder={t(
                                                                "new_strings:select_transaction_status"
                                                            )}
                                                        />
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
                                                                            {translatedText(
                                                                                option.label
                                                                            )}
                                                                        </SelectItem>
                                                                    </>
                                                                )
                                                            )}
                                                        </SelectItems>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="py-[5px] ">
                                            <Text className="py-[5px] outline-none">
                                                {t(
                                                    "course.participants:view_participant.transaction_id"
                                                )}
                                            </Text>
                                            <div>
                                                <Textarea
                                                    disabled={true}
                                                    value={
                                                        transactionData?.data
                                                            ?.data
                                                            ?.payment_transaction_id
                                                    }
                                                    className="!w-[278px] resize-none !important h-[40px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="py-[5px]">
                                            <Text className="py-[5px]">
                                                {t(
                                                    "course.participants:edit_participant.participants_information_tab.payment_date"
                                                )}
                                            </Text>
                                            {/* TODO: need to disable it for confirmed and failed transaction ids */}
                                            <div>
                                                <DateField
                                                    value={payment_date as Date}
                                                    onChange={
                                                        paymentDateOnchange
                                                    }
                                                    placeholder={t(
                                                        "new_strings:select_date"
                                                    )}
                                                    className="!w-[278px] h-[40px] rounded-[12px]"
                                                    disabled={
                                                        transaction_status_id ==
                                                        FAILED_ID
                                                            ? true
                                                            : transaction_status_id ==
                                                              CONFIRMED_ID
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="py-[5px]">
                                            <Text className="py-[5px]">
                                                {t(
                                                    "course.participants:find_participant.payment_method"
                                                )}
                                            </Text>
                                            <div className="!w-[278px]">
                                                <Select
                                                    disabled={
                                                        transaction_status_id ==
                                                        FAILED_ID
                                                            ? true
                                                            : transaction_status_id ==
                                                              CONFIRMED_ID
                                                            ? true
                                                            : false
                                                    }
                                                    value={payment_method_id}
                                                    onValueChange={(
                                                        val: any
                                                    ) => {
                                                        paymentMethodOnchange(
                                                            val
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[278px]">
                                                        <SelectValue
                                                            placeholder={t(
                                                                "new_strings:select_payment_method"
                                                            )}
                                                        />
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
                                                                            {translatedText(
                                                                                option.label
                                                                            )}
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
                                            <Text className="py-[5px] outline-none">
                                                {t(
                                                    "course.participants:edit_participant.participants_information_tab.response_message"
                                                )}
                                            </Text>
                                            <div>
                                                <Textarea
                                                    disabled={true}
                                                    value={
                                                        transactionData?.data
                                                            ?.data
                                                            ?.response_message
                                                    }
                                                    className="!w-[278px] resize-none !important h-[40px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col py-[5px]">
                                    <Text className="py-[5px] outline-none">
                                        {t(
                                            "course.participants:edit_participant.participants_information_tab.error_message"
                                        )}
                                    </Text>
                                    <div>
                                        <Textarea
                                            disabled={true}
                                            value={
                                                transactionData?.data?.data
                                                    ?.error_message
                                            }
                                            className=" resize-none !important !h-[40px] !w-[578px]"
                                        />
                                    </div>

                                    <div className="flex gap-4 py-[30px]">
                                        <div>
                                            <Checkbox
                                                checked={
                                                    send_payment_confirmation
                                                }
                                                onCheckedChange={
                                                    emailConfirmatiOnchange
                                                }
                                            />
                                        </div>
                                        <Text>
                                            {t(
                                                "new_strings:send_payment_confirmation_mail"
                                            )}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6">
                            <div>
                                <Button
                                    onClick={() => {
                                        cancelConfirmation();
                                    }}
                                    className="border rounded-xl border-[#7677F4] bg-[white] w-[87px] h-[46px] text-[#7677F4] font-semibold"
                                >
                                    {t("cancel_button")}
                                </Button>
                            </div>
                            <div>
                                <Button
                                    className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] text-base"
                                    onClick={() => {
                                        onFormSubmission();
                                    }}
                                >
                                    {t("save_button")}
                                </Button>
                            </div>
                        </div>

                        <AlertDialog
                            open={cancelEditPayment}
                            // onOpenChange={setcancelEditPayment}
                        >
                            <AlertDialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
                                <AlertDialogHeader>
                                    <div
                                        className="flex justify-end cursor-pointer"
                                        onClick={() =>
                                            setcancelEditPayment(false)
                                        }
                                    >
                                        <CrossIcon />
                                    </div>
                                    <AlertDialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center p-[15px]">
                                        {t(
                                            "new_strings:changes_made_will_be_lost_are_you_sure_you_want_to_continue"
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <div className="w-full flex justify-center items-center gap-5">
                                        <div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-[12px] w-[71px] h-[46px]"
                                                onClick={() => {
                                                    setcancelEditPayment(false);
                                                }}
                                            >
                                                {t("no_button")}
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                type="button"
                                                className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                                                onClick={() => {
                                                    cancelEditPaymentHandler();
                                                }}
                                            >
                                                {t("yes")}
                                            </Button>
                                        </div>
                                    </div>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={saveChangesConfirmation}>
                            <AlertDialogContent>
                                <div className="flex justify-end">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            formDataPost();
                                        }}
                                    >
                                        <CrossIcon fill="#333333" />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col text-center items-center gap-4">
                                    <Tick />
                                    <div className="w-full font-bold text-[20px]">
                                        {t(
                                            "new_strings:Changes_saved_successfully"
                                        )}
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => {
                                                formDataPost();
                                            }}
                                        >
                                            {t("close")}
                                        </Button>
                                    </div>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
