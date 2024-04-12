import AccomodationDetails from "@components/participants/editParticipant/AccomodationDetails";
import CourseFee from "@components/participants/editParticipant/CourseFee";
import ParticipnatInformation from "@components/participants/editParticipant/ParticipantInformation";
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

    // fetching participant payment history and participant registartion data of particular participnat

    const selectQuery: any = {
        resource: "participant_payment_history",
        meta: {
            select:"id,participant_id!inner(contact_id!inner(full_name),memo,created_at),transaction_fee_level_id"
            // select: "participant_id!inner(contact_id!inner(full_name),memo,created_at,discount_code_id,discount_code,participant_attendence_status_id),transaction_fee_level_id!inner(value),expense_fee,accommodation_type,accommodation_fee,currency_code,total_fee",
        },
        // TODO: add the participant id here
        filter: [{ field: "participant_id", operator: "eq", value: "1" }],
    };
    const { queryResult } = useSelect(selectQuery);
    console.log(queryResult, "query result");
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
            resource: "categories",
            id: 1, // <BASE_URL_FROM_DATA_PROVIDER>/categories/1
        },
    });
    const onSubmit = (formData: any) => {
        console.log(formData);
        // Call onFinish with the form data if needed
        onFinish(formData);
    };
    const {
        refineCore: { onFinish, formLoading },
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


    // const methods = useStepsForm({
    //     refineCoreProps: {
    //         action: "edit",
    //         resource: "posts",
    //     },
    //     // resolver: zodResolver(schema),
    //     defaultValues: {
    //         visibility: "public",
    //         displayLanguage: "true",
    //         isGeoRestriction: "true",
    //         isResidentialCourse: "No",
    //         accommodationPaymentMode: "Pay Online",
    //         programOrganizers: [loggedUserData],
    //     },
    // });
    // const isInView = (elem) => {
    //     const rect = elem.getBoundingClientRect();
    //     return (
    //         rect.top >= 0 &&
    //         rect.bottom <=
    //             (window.innerHeight || document.documentElement.clientHeight)
    //     );
    // };
    // // Function to handle scroll events
    // const handleScroll = () => {
    //     tabTriggers.forEach((trigger) => {
    //         const section = document.getElementById(trigger.id);
    //         console.log(section, "isInView(section)");
    //         if (section && isInView(section)) {
    //             setSelectedTab(trigger.value);
    //         }
    //     });
    // };

    // // Add scroll event listener
    // window.addEventListener("scroll", handleScroll);
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
                            <div
                                className="flex flex-col gap-1"
                                // className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
                            >
                                {trigger.label}
                                {/* <a href={`#${trigger?.id}`}>{trigger.label}</a> */}
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
                            <ParticipnatInformation data={queryResult?.data} />
                            <CourseFee data={queryResult?.data} />
                            <AccomodationDetails data={queryResult?.data} />
                            <PaymentDetails data={queryResult?.data}/>
                        </TabsContent>
                        <TabsContent value="Course Fees">
                            <ParticipnatInformation data={queryResult?.data} />
                            <CourseFee data={queryResult?.data} />
                            <AccomodationDetails data={queryResult?.data} />
                            <PaymentDetails data={queryResult?.data}/>
                        </TabsContent>
                        <TabsContent value="Accomodation Details">
                            <ParticipnatInformation data={queryResult?.data} />
                            <CourseFee data={queryResult?.data} />
                            <AccomodationDetails data={queryResult?.data} />
                            <PaymentDetails data={queryResult?.data}/>
                        </TabsContent>
                        <TabsContent value="Payment Details">
                            <ParticipnatInformation data={queryResult?.data} />
                            <CourseFee data={queryResult?.data} />
                            <AccomodationDetails data={queryResult?.data} />
                            <PaymentDetails data={queryResult?.data}/>
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
                            <Button
                                className="border border-[#7677F4] bg-[white] w-[101px] h-[46px] text-[#7677F4] font-semibold rounded-[12px]"
                                // onClick={handleSubmit(onSubmit)}
                            >
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
