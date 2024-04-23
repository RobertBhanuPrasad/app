import ScrollableTabs from "@components/participant/viewParticipant/ScrollableTabs";
import ViewParticipantTransactionDetails from "@components/participant/viewParticipant/ViewParticipantTransactionDetails";
import ViewParticipantUtmParameters from "@components/participant/viewParticipant/ViewParticipantUtmParameters";
import CrossIcon from "@public/assets/CrossIcon";
import { useList, useUpdate } from "@refinedev/core";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EditParticipantFormNames } from "src/constants/CourseConstants";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "src/ui/alert-dialog";
import { Button } from "src/ui/button";
import { useValidateCurrentStepFields } from "src/utility/ValidationSteps";
import AccomodationDetails from "./AccomodationDetails";
import CourseFee from "./CourseFee";
import ParticipantInformation from "./ParticipantInformation";
import PaymentDetails from "./PaymentDetails";

export default function EditParticipantTabs() {
    const { watch } = useFormContext();
    const router = useRouter();
    let formData = watch();
    const [initialValue, setinitialValue] = useState(formData);

    const { query } = useRouter();
    const [cancelEditParticipant, setcancelEditParticipant] = useState(false);

    // participant_payment_history contains numerous records of same participant, getting the latest history record

    const Id: number | undefined = query?.id
        ? parseInt(query.id as string)
        : undefined;
    const { data } = useList({
        resource: "participant_registration",
        meta: {
            select: "program_id(program_type_id(is_online_program))",
        },
        filters: [
            {
                field: "id",
                operator: "eq",
                value: query?.participantId,
            },
        ],
    });
    const accommodationData =
        data?.data[0]?.program_id?.program_type_id?.is_online_program;
    const { mutate } = useUpdate();
    const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
    const onFormSubmission = async (formData: any) => {
        let isAllFieldsFilled;
        if (accommodationData) {
            isAllFieldsFilled = await ValidateCurrentStepFields(
                Object.values(EditParticipantFormNames)
            );
        } else {
            isAllFieldsFilled = await ValidateCurrentStepFields(
                _.pull(
                    Object.values(EditParticipantFormNames),
                    "accommodation_snore",
                    "roommate_snore"
                )
            );
        }
        isAllFieldsFilled &&
            mutate({
                resource: "participant_registration",
                values: {
                    memo: formData?.memo,
                    roommate_snore: formData?.roommate_snore,
                    accommodation_snore: formData?.accommodation_snore,
                    participant_code: formData?.participant_code,
                    participant_attendence_status_id:
                        formData?.participant_attendence_status_id,
                },
                // TODO: integrate with participant_registration id
                id: Number(query?.participantId),
            });
        isAllFieldsFilled &&
            mutate({
                resource: "participant_payment_history",
                values: {
                    accommodation_type_id: formData?.accommodationType,
                },
                // TODO: integrate with participant_payment_history id
                id: Number(Id),
            });
    };

    // TODO: need to integrated with efficient tabs component
    // Rendering tabs content through tabs variable
    let tabs = [
        {
            id: 0,
            label: "Participants Information",
            content: (
                <div>
                    <ParticipantInformation />
                </div>
            ),
        },
        {
            id: 1,
            label: "Course Fees",
            content: (
                <div>
                    <CourseFee />
                </div>
            ),
        },
        {
            id: 2,
            label: "Accommodation Details",
            content: (
                <div>
                    <AccomodationDetails />
                </div>
            ),
        },
        {
            id: 3,
            label: "Payment Details",
            content: (
                <div>
                    <PaymentDetails />
                </div>
            ),
        },
        {
            id: 4,
            label: "Transaction Details",
            content: (
                <div>
                    <ViewParticipantTransactionDetails participantId={Id} />
                </div>
            ),
        },
        {
            id: 5,
            label: "UTM Parameters",
            content: (
                <div>
                    <ViewParticipantUtmParameters participantId={Id} />
                </div>
            ),
        },
    ];
    // Check if accommodation should be rendered
    if (!accommodationData) {
        tabs = tabs.filter((tab) => tab.label !== "Accommodation Details");
    }
    const cancelConfirmation = () => {
        if (!_.isEqual(initialValue, formData)) {
            setcancelEditParticipant(true);
        }
    };
    const cancelEditParticipantHandler = () => {
        setcancelEditParticipant(false);
        router.back();
    };
    return (
        <div onClick={(e) => e.preventDefault()}>
            <ScrollableTabs tabs={tabs} />
            <div className="flex justify-center gap-4">
                <div>
                    <Button
                        onClick={() => {
                            cancelConfirmation();
                        }}
                        className="border border-[#7677F4] bg-[white] w-[101px] h-[46px] text-[#7677F4] font-semibold rounded-[12px]"
                    >
                        Cancel
                    </Button>
                </div>
                <div>
                    <Button
                        className="bg-[#7677F4] w-[86px] h-[46px] rounded-[12px] "
                        onClick={() => {
                            onFormSubmission(formData);
                        }}
                    >
                        Save
                    </Button>
                </div>
                <AlertDialog
                    open={cancelEditParticipant}
                    onOpenChange={setcancelEditParticipant}
                >
                    <AlertDialogContent className="flex flex-col h-[248px] w-[425px] !rounded-[15px] !p-6">
                        <AlertDialogHeader>
                            <div
                                className="flex justify-end cursor-pointer"
                                onClick={() => setcancelEditParticipant(false)}
                            >
                                <CrossIcon />
                            </div>
                            <AlertDialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center p-[15px]">
                                Changes made will be lost. Are you sure you want
                                to continue?
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
                                            setcancelEditParticipant(false);
                                        }}
                                    >
                                        No
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                                        onClick={() => {
                                            cancelEditParticipantHandler();
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
