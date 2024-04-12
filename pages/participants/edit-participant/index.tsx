import AccomodationDetails from "@components/participants/editParticipant/AccomodationDetails";
import CourseFee from "@components/participants/editParticipant/CourseFee";
import ParticipantInformation from "@components/participants/editParticipant/ParticipantInformation";
import PaymentDetails from "@components/participants/editParticipant/PaymentDetails";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { useSelect, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "src/ui/button";
import { Tabs, TabsTrigger } from "src/ui/tabs";
export default function index() {
    const [selectedValue, setSelectedValue] = useState(
        "Participants Information"
    );
    // participant_payment_history contains numerous records of same particpant, getting the latest history record
    // TODO:replace value with participant_id
    let filter = [{ field: "participant_id", operator: "eq", value: 1 }];
    let sorter = [{ field: "created_at", order: "desc" }];
    const selectQuery: any = {
        resource: "participant_payment_history",
        meta: {
            select: "id,participant_id!inner(contact_id!inner(full_name),memo,created_at,roommate_preferences_1,roommate_preferences_2,roommate_preferences_3,accommodation_snore,roommate_snore,total_amount,participant_code,participant_attendence_status_id,discount_code),transaction_fee_level_id!inner(value),expense_fee,currency_code,accommodation_type_id,accommodation_fee",
        },
        filters: filter,
        sorters: sorter,
    };
    const { queryResult } = useSelect(selectQuery);
    const participantData = queryResult?.data?.data[0];
    const [selectedTab, setSelectedTab] = useState("Participants Information");
    const tabTriggers = [
        {
            value: "Participants Information",
            label: "Participants Information",
            disabled: false,
            id: "participants",
        },
        {
            value: "Course Fees",
            label: "Course Fees",
            disabled: false,
            id: "Course",
        },
        {
            value: "Accomodation Details",
            label: "Accomodation Details",
            disabled: false,
            id: "Accomodation",
        },
        {
            value: "Payment Details",
            label: "Payment Details",
            disabled: false,
            id: "Payment",
        },
        {
            value: "Transaction Details",
            label: "Transaction Details",
            disabled: false,
            id: "Transaction",
        },
        {
            value: "UTM Parameters",
            label: "UTM Parameters",
            disabled: false,
            id: "UTM",
        },
    ];
    const methods = useForm({
        refineCoreProps: {
            action: "edit", // or clone
        },
    });
    const { mutate } = useUpdate();
    const onSubmit = (formData: any) => {
        mutate({
            resource: "participant_registration",
            values: {
                memo: formData?.participantMemo,
                roommate_snore: formData?.roommatesnore,
                discount_code: formData?.special_code,
                participant_attendence_status_id: formData?.attendanceStatus,
            },
            // TODO: need to update it with participant_registration id
            id: 1,
        });
        mutate({
            resource: "participant_payment_history",
            values: {
                accommodation_type_id: formData?.accommodationType,
            },
            // TODO: need to update it with participant_payment_history id
            id: 2,
        });
        // Call onFinish with the form data if needed
        onFinish(formData);
    };
    const {
        refineCore: { onFinish },
        handleSubmit,
    } = methods;
    const handleTabClick = (value) => {
        setSelectedTab(value);
        const section = document.getElementById(
            tabTriggers.find((trigger) => trigger.value === value).id
        );
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
    // TODO: update the partcipant -registarion api
    // const {mutate}=useUpdate()
    // mutate({
    //     resource:"",
    //     values:{

    //     },
    //     id:
    // })

    return (
        <div>
            index
            <Tabs
                defaultValue="Participants Information"
                onValueChange={(val: any) => {
                    setSelectedValue(val);
                }}
            >
                <TabsList className="flex flex-row gap-10 !flex-start !justify-start !bg-[white] !rounded-none">
                    {tabTriggers.map((trigger: any, index: any) => (
                        <TabsTrigger
                            key={index}
                            value={trigger.value}
                            className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
                            disabled={trigger.disabled}
                            onClick={() => handleTabClick(trigger.value)}
                            isActive={
                                selectedTab === trigger.value ? true : false
                            }
                        >
                            <div className="flex flex-col gap-1">
                                {trigger.label}
                                <div
                                    className={`${
                                        selectedValue === trigger.value
                                            ? "bg-[#7677F4] rounded w-full h-[2px]"
                                            : "w-full h-[2px]"
                                    }`}
                                />
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="w-full border-b -mt-1"></div>
                <FormProvider {...methods}>
                    <form autoComplete="off">
                        <TabsContent value="Participants Information">
                            <ParticipantInformation data={participantData} />
                            <CourseFee data={participantData} />
                            <AccomodationDetails data={participantData} />
                            <PaymentDetails participantData={participantData} />
                        </TabsContent>
                        <TabsContent value="Course Fees">
                            <ParticipantInformation data={participantData} />
                            <CourseFee data={participantData} />
                            <AccomodationDetails data={participantData} />
                            <PaymentDetails participantData={participantData} />
                        </TabsContent>
                        <TabsContent value="Accomodation Details">
                            <ParticipantInformation data={participantData} />
                            <CourseFee data={participantData} />
                            <AccomodationDetails data={participantData} />
                            <PaymentDetails participantData={participantData} />
                        </TabsContent>
                        <TabsContent value="Payment Details">
                            <ParticipantInformation data={participantData} />
                            <CourseFee data={participantData} />
                            <AccomodationDetails data={participantData} />
                            <PaymentDetails participantData={participantData} />
                        </TabsContent>
                        <TabsContent value="Transaction Details">
                            Place Transaction Details tab here
                        </TabsContent>
                        <TabsContent value="UTM Parameters">
                            Place UTM Parameters tab here
                        </TabsContent>
                    </form>
                    <div className="flex justify-center gap-4">
                        <div>
                            <Button className="border border-[#7677F4] bg-[white] w-[101px] h-[46px] text-[#7677F4] font-semibold rounded-[12px]">
                                Cancel
                            </Button>
                        </div>
                        <div>
                            <Button
                                className="bg-[#7677F4] w-[86px] h-[46px] rounded-[12px] "
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </FormProvider>
            </Tabs>
        </div>
    );
}
