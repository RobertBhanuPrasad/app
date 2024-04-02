import NewCourseReviewPage from "@components/course/newCourse/NewCourseReviewPage";
import NewCourseStep1 from "@components/course/newCourse/NewCourseStep1";
import NewCourseStep2 from "@components/course/newCourse/NewCourseStep2";
import NewCourseStep3 from "@components/course/newCourse/NewCourseStep3";
import NewCourseStep4 from "@components/course/newCourse/NewCourseStep4";
import NewCourseStep5 from "@components/course/newCourse/NewCourseStep5";
import NewCourseStep6 from "@components/course/newCourse/NewCourseStep6";
import Car from "@public/assets/Car";
import Fees from "@public/assets/Fees";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Review from "@public/assets/Review";
import Venue from "@public/assets/Venue";
import { useGetIdentity } from "@refinedev/core";
import { useStepsForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { Button } from "src/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";

function index() {
    const { data: loginUserData }: any = useGetIdentity();

    if (!loginUserData?.userData) {
        return <div>Loading...</div>;
    }

    return <NewCourse />;
}
function NewCourse() {
    const { data: loginUserData }: any = useGetIdentity();

    // Schema definition for form validation
    // const schema = z.object({
    //   organization: z.object({
    //     // Define the schema for the organization object's properties here
    //     // For example:
    //     value: z.number(),
    //     label: z.string(),
    //     // Add more properties as needed
    //   }),
    // });

    const loggedUserData = {
        value: loginUserData?.userData?.id,
        label:
            loginUserData?.userData?.contact_id?.first_name +
            " " +
            loginUserData?.userData?.contact_id?.last_name,
    };

    // Destructuring values from useStepsForm hook
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

    const {
        refineCore: { onFinish, formLoading },
        handleSubmit,
        steps: { currentStep, gotoStep },
    } = methods;
    // Array of step titles, icons, and colors
    const stepTitles = [
        {
            value: "0",
            label: "Basic Details",
            icon: (
                <Profile
                    color={` ${currentStep == 0 ? "#7677F4" : "#999999"}`}
                />
            ),
        },
        {
            value: "1",
            label: "Course Details",
            icon: (
                <Group color={` ${currentStep == 1 ? "#7677F4" : "#999999"}`} />
            ),
        },
        {
            value: "2",
            label: "Time and Venue",
            icon: (
                <Venue color={` ${currentStep == 2 ? "#7677F4" : "#999999"}`} />
            ),
        },
        {
            value: "3",
            label: "Fees",
            icon: (
                <Fees color={` ${currentStep == 3 ? "#7677F4" : "#999999"}`} />
            ),
        },
        {
            value: "4",
            label: "Accommodation",
            icon: (
                <Car color={` ${currentStep == 4 ? "#7677F4" : "#999999"}`} />
            ),
        },
        {
            value: "5",
            label: "Contact Info",
            icon: (
                <Info color={` ${currentStep == 5 ? "#7677F4" : "#999999"}`} />
            ),
        },

        {
            value: "6",
            label: "Review",
            icon: (
                <Review
                    color={` ${currentStep == 6 ? "#7677F4" : "#999999"}`}
                />
            ),
        },
    ];

    const onSubmit = (formData: any) => {
        console.log(formData);
        // Call onFinish with the form data if needed
        onFinish(formData);
    };

    // If the form is still loading, display a loading message
    if (formLoading) {
        return <div>Loading...</div>;
    }
    const contentStylings =
        " !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background w-full";
    return (
        <div className="bg-[white]  ">
            <Tabs value={JSON.stringify(currentStep)}>
                <div className="flex flex-row">
                    <TabsList className="h-full bg-[#7677F41B] w-[238px] rounded-l-[24px] shadow-md py-10">
                        <div className="flex flex-col h-full gap-4 ">
                            {stepTitles.map((tab, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={tab.value}
                                    className="!h-12  items-center w-[230px] text-[#999999] !font-normal data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                    onClick={() => gotoStep(index)}
                                >
                                    {JSON.stringify(currentStep) ===
                                        tab.value && (
                                        <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-3"></div>
                                    )}
                                    <div className="flex flex-row gap-[10px] ml-[14px] items-center">
                                        {tab.icon}
                                        {tab.label}
                                    </div>
                                </TabsTrigger>
                            ))}
                        </div>
                    </TabsList>

                    <div className="bg-[white] w-full rounded-[24px] -ml-4 -mt-1 p-6 shadow-md h-[517px]">
                        <FormProvider {...methods}>
                            <form autoComplete="off">
                                <div className="flex flex-col justify-between max-h-[460px] h-[460px] overflow-y-auto scrollbar">
                                    <div>
                                        <TabsContent
                                            value="0"
                                            className={contentStylings}
                                        >
                                            <NewCourseStep1 />
                                        </TabsContent>
                                        <TabsContent
                                            value="1"
                                            className={contentStylings}
                                        >
                                            <NewCourseStep2 />
                                        </TabsContent>
                                        <TabsContent
                                            value="2"
                                            className={contentStylings}
                                        >
                                            <NewCourseStep3 />
                                        </TabsContent>
                                        <TabsContent
                                            value="3"
                                            className={contentStylings}
                                        >
                                            <NewCourseStep4 />
                                        </TabsContent>
                                        <TabsContent
                                            value="4"
                                            className={contentStylings}
                                        >
                                            <NewCourseStep5 />
                                        </TabsContent>
                                        <TabsContent
                                            value="5"
                                            className={contentStylings}
                                        >
                                            <NewCourseStep6 />
                                        </TabsContent>
                                        <TabsContent
                                            value="6"
                                            className={contentStylings}
                                        >
                                            <NewCourseReviewPage />
                                        </TabsContent>
                                    </div>

                                    <div className="flex self-end justify-center w-full gap-4 mt-2">
                                        {currentStep > 0 && (
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    gotoStep(currentStep - 1);
                                                }}
                                                className="border border-[#7677F4] bg-[white] w-[118px] h-[46px] text-[#7677F4] font-semibold"
                                            >
                                                Previous
                                            </Button>
                                        )}
                                        {currentStep <
                                            stepTitles.length - 1 && (
                                            <Button
                                                className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] font-semibold"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    gotoStep(currentStep + 1);
                                                }}
                                            >
                                                Next
                                            </Button>
                                        )}
                                        {currentStep ===
                                            stepTitles.length - 1 && (
                                            <Button
                                                className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] "
                                                onClick={handleSubmit(onSubmit)}
                                            >
                                                Save
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}

export default index;
