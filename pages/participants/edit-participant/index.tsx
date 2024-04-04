import AccomodationDetails from "@components/participants/editParticipant/AccomodationDetails";
import CourseFee from "@components/participants/editParticipant/CourseFee";
import ParticipnatInformation from "@components/participants/editParticipant/ParticipantInformation";
import PaymentDetails from "@components/participants/editParticipant/PaymentDetails";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { useGetIdentity } from "@refinedev/core";
import { useStepsForm } from "@refinedev/react-hook-form";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Tabs, TabsTrigger } from "src/ui/tabs";
export default function index() {
    const { data: loginUserData }: any = useGetIdentity();
    const loggedUserData = {
        value: loginUserData?.userData?.id,
        label:
          loginUserData?.userData?.contact_id?.first_name +
          " " +
          loginUserData?.userData?.contact_id?.last_name,
      };
    
    const [selectedValue, setSelectedValue] = useState(
        "Participants Information"
    );
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
    const handleTabClick = (value) => {
        setSelectedTab(value);
        const section = document.getElementById(
            tabTriggers.find((trigger) => trigger.value === value).id
        );
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
    const methods = useStepsForm({
        refineCoreProps: {
          action: "create",
          resource: "event",
        },
        // resolver: zodResolver(schema),
        defaultValues: {
          visibility: "public",
          displayLanguage: "true",
          isGeoRestriction: "true",
          isResidentialCourse: "No",
          accommodationPaymentMode: "Pay Online",
          programOrganizers: [loggedUserData],
        },
      });
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
                    <ParticipnatInformation />
                    <CourseFee />
                    <AccomodationDetails />
                    <PaymentDetails />
                </TabsContent>
                <TabsContent value="Course Fees">
                    <ParticipnatInformation />
                    <CourseFee />
                    <AccomodationDetails />
                    <PaymentDetails />
                </TabsContent>
                <TabsContent value="Accomodation Details">
                    <ParticipnatInformation />
                    <CourseFee />
                    <AccomodationDetails />
                    <PaymentDetails />
                </TabsContent>
                <TabsContent value="Payment Details">
                    <ParticipnatInformation />
                    <CourseFee />
                    <AccomodationDetails />
                    <PaymentDetails />
                </TabsContent>
                <TabsContent value="Transaction Details">
                    Place Transaction Details tab here
                </TabsContent>
                <TabsContent value="UTM Parameters">
                    Place UTM Parameters tab here
                </TabsContent>
                </form>
                </FormProvider>
            </Tabs>
        </div>
    );
}
