import ScrollableTab from "@components/participant/viewParticipant/ScrollableTab";
import ViewParticipantTransactionDetails from "@components/participant/viewParticipant/ViewParticipantTransactionDetails";
import ViewParticipantUtmParameters from "@components/participant/viewParticipant/ViewParticipantUtmParameters";
import CrossIcon from "@public/assets/CrossIcon";
import TransactionActivityIcon from "@public/assets/TransactionActivityIcon";
import { useList, useTable, useUpdate } from "@refinedev/core";
import _ from "lodash";
import { useTranslation } from "next-i18next";
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
import TransactionActivity from "../TransactionActivityPopover";
import AccomodationDetails from "./AccomodationDetails";
import CourseFee from "./CourseFee";
import ParticipantInformation from "./ParticipantInformation";
import PaymentDetails from "./PaymentDetails";

export default function EditParticipantTabs() {
    const { t } = useTranslation([
        "course.participants",
        "common",
        "new_strings",
    ]);
    const { watch } = useFormContext();
    const router = useRouter();
    let formData = watch();
    const [initialValue, setinitialValue] = useState(formData);
    const [activeTabId, setActiveTabId] = useState<string>("");

    const { query } = useRouter();
    const [cancelEditParticipant, setcancelEditParticipant] = useState(false);

    // Getting participant registered data for particular participant routed in the router
    const Id: number | undefined = router?.query?.participantId
        ? parseInt(router.query.participantId as string)
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

    // This variable stores boolean values, which informs that, the particular have accommodation or not
    const accommodationData =
        data?.data[0]?.program_id?.program_type_id?.is_online_program;

    // Validating and Posting the modified data to participant registration and participant payment history api
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
                id: Number(query?.participantId),
            });
        isAllFieldsFilled &&
            mutate({
                resource: "participant_payment_history",
                values: {
                    accommodation_type_id: formData?.accommodationType,
                },
                id: Number(Id),
            });
        router.back();
    };
    let {
        tableQueryResult: participantTransactionDetailsData, // Table data result
        pageCount, // Number of pages
        pageSize, // Number of items per page
        setPageSize, // Function to set page size
        current, // Current page number
        setCurrent, // Function to set current page number
    } = useTable({
        resource: "participant_payment_history", // Resource name for fetching data
        meta: {
            select: "*,transaction_type_id(*),payment_method_id(*),transaction_fee_level_id(*),transaction_status_id(*),accommodation_type_id(*,accommodation_type_id(*))", // Selecting specific fields
        },
        filters: {
            permanent: [
                {
                    field: "participant_id",
                    operator: "eq",
                    value: Id,
                },
            ],
        },
    });

    // TODO: need to integrated with efficient tabs component

    let tabs = [
        {
            id: "section1",
            label: t(
                "edit_participant.participants_information_tab.participant_information"
            ),
            content: (
                <div>
                    <ParticipantInformation />
                </div>
            ),
            header: (
                <div>
                    <p
                        className={`font-semibold text-[18px] pt-[20px] ${
                            activeTabId == "section1" && "text-[#7677F4]"
                        }`}
                    >
                        {t(
                            "edit_participant.participants_information_tab.participants_details"
                        )}
                    </p>
                </div>
            ),
        },
        {
            id: "section2",
            label: t(
                "edit_participant.participants_information_tab.course_fees"
            ),
            content: (
                <div>
                    <CourseFee />
                </div>
            ),
            header: (
                <div>
                    <p
                        className={`font-semibold text-[18px] pt-[20px]  ${
                            activeTabId == "section2" && "text-[#7677F4]"
                        }`}
                    >
                        {t(
                            "edit_participant.participants_information_tab.course_fees"
                        )}
                    </p>
                </div>
            ),
        },
        {
            id: "section3",
            label: t(
                "edit_participant.participants_information_tab.accommodation_details"
            ),
            content: (
                <div>
                    <AccomodationDetails />
                </div>
            ),
            header: (
                <div>
                    <p
                        className={`font-semibold text-[18px] pt-[20px] ${
                            activeTabId == "section3" && "text-[#7677F4]"
                        }`}
                    >
                        {t(
                            "edit_participant.participants_information_tab.accommodation_details"
                        )}
                    </p>
                </div>
            ),
        },
        {
            id: "section4",
            label: t(
                "edit_participant.participants_information_tab.payment_details"
            ),
            content: (
                <div>
                    <PaymentDetails />
                </div>
            ),
            header: (
                <div>
                    <p
                        className={`font-semibold text-[18px] pt-[20px]  ${
                            activeTabId == "section4" && "text-[#7677F4]"
                        }`}
                    >
                        {t(
                            "course.participants:edit_participant.participants_information_tab.payment_details"
                        )}
                    </p>
                </div>
            ),
        },
        {
            id: "section5",
            label: t("view_participant.transaction_details"),
            content: (
                <div>
                    <ViewParticipantTransactionDetails participantId={Id} />
                </div>
            ),
            header: (
                <div className="flex pt-[20px]">
                    
                    <p
                        className={`text-[18px] font-[600] pr-[10px] !m-[0] !py-[0] !h-[0] ${
                            activeTabId == "section5" && "text-[#7677F4]"
                        }`}
                    >
                        {t(
                            "course.participants:view_participant.transaction_details"
                        )}
                    </p>
                    <div className="cursor-pointer ">
                        <div className="text-left ">
                            <TransactionActivity
                                transactionHistory={
                                    participantTransactionDetailsData?.data
                                        ?.data
                                }
                                renderHeader={<TransactionActivityIcon />}
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id:"section6",
            label:t("view_participant.utm_parameters"),
            content:(
                <div>
                      <ViewParticipantUtmParameters participantId={Id} />
                </div>
            ),
            header:
            (
                <div>
                <p
                    className={`font-semibold text-[18px] pt-[20px]  ${
                        activeTabId == "section6" && "text-[#7677F4]"
                    }`}
                >
                    {t("course.participants:view_participant.utm_parameters")}
                </p>
            </div>  
            )
        }
    ];

    // Check if accommodation tab should be rendered in tabs list or not
    if (!accommodationData) {
        tabs = tabs.filter((tab) => tab.label !== "Accommodation Details");
    }

    // Both functions are confirmation popups to save or cancel the changes of the edit participant form
    const cancelConfirmation = () => {
        if (!_.isEqual(initialValue, formData)) {
            setcancelEditParticipant(true);
        } else {
            router.back();
        }
    };
    const cancelEditParticipantHandler = () => {
        setcancelEditParticipant(false);
        router.back();
    };
    const handleActiveTabChange = (tabId: string) => {
        setActiveTabId(tabId);
    };

    return (
        <div onClick={(e) => e.preventDefault()}>
            <ScrollableTab
                tabs={tabs}
                onActiveTabChange={handleActiveTabChange}
            />
            <div className="flex justify-center gap-4">
                <div>
                    <Button
                        onClick={() => {
                            cancelConfirmation();
                        }}
                        className="border border-[#7677F4] bg-[white] w-[101px] h-[46px] text-[#7677F4] font-semibold rounded-[12px]"
                    >
                        {t("common:cancel_button")}
                    </Button>
                </div>
                <div>
                    <Button
                        className="bg-[#7677F4] w-[86px] h-[46px] rounded-[12px] text-base "
                        onClick={() => {
                            onFormSubmission(formData);
                        }}
                    >
                        {t("common:save_button")}
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
                                            setcancelEditParticipant(false);
                                        }}
                                    >
                                        {t("common:no")}
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
                                        {t("common:yes")}
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
