import NewCourseStep1 from "@components/course/newCourse/NewCourseStep1";
import NewCourseStep2 from "@components/course/newCourse/NewCourseStep2";
import Car from "@public/assets/Car";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import { Button } from "src/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";
import Fees from "@public/assets/Fees";
import _ from "lodash";
import NewCourseStep6 from "@components/course/newCourse/NewCourseStep6";
import NewCourseStep4 from "@components/course/newCourse/NewCourseStep4";
import NewCourseStep5 from "@components/course/newCourse/NewCourseStep5";
import NewCourseStep3 from "@components/course/newCourse/NewCourseStep3";
import { useGetIdentity } from "@refinedev/core";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import {
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep3FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
} from "src/constants/NewCourseFormNames";
import Form from "@components/Formfield";
import { stepStore } from "src/zustandStore/StepStore";
import { useValidateCurrentStepFields } from "./ValidateCurrentStep";
import { z } from "zod";
import { useFormContext } from "react-hook-form";
import {
  ACCOMMODATION_STEP_NUMBER,
  BASIC_DETAILS_STEP_NUMBER,
  CONTACT_INFO_STEP_NUMBER,
  COURSE_DETAILS_STEP_NUMBER,
  FEE_STEP_NUMBER,
  TIME_AND_VENUE_STEP_NUMBER,
} from "src/constants/CourseConstants";

function index() {
  const { data: loginUserData }: any = useGetIdentity();

  const { viewPreviewPage } = newCourseStore();

  // if (!loginUserData?.userData) {
  //   return <div>Loading...</div>;
  // }

  if (viewPreviewPage) {
    return <div> Render Preview Page</div>;
  } else {
    return <NewCourse />;
  }
}
function NewCourse() {
  const { data: loginUserData }: any = useGetIdentity();

  const loggedUserData = loginUserData?.userData?.id;

  const { currentStep, setCurrentStep } = stepStore();

  // Array of step titles, icons, and colors
  const stepTitles = [
    {
      value: BASIC_DETAILS_STEP_NUMBER,
      label: "Basic Details",
      icon: (
        <Profile
          color={` ${
            currentStep == BASIC_DETAILS_STEP_NUMBER ? "#7677F4" : "#999999"
          }`}
        />
      ),
    },
    {
      value: COURSE_DETAILS_STEP_NUMBER,
      label: "Course Details",
      icon: (
        <Group
          color={` ${
            currentStep == COURSE_DETAILS_STEP_NUMBER ? "#7677F4" : "#999999"
          }`}
        />
      ),
    },
    {
      value: TIME_AND_VENUE_STEP_NUMBER,
      label: "Time and Venue",
      icon: (
        <Venue
          color={` ${
            currentStep == TIME_AND_VENUE_STEP_NUMBER ? "#7677F4" : "#999999"
          }`}
        />
      ),
    },
    {
      value: FEE_STEP_NUMBER,
      label: "Fees",
      icon: (
        <Fees
          color={` ${currentStep == FEE_STEP_NUMBER ? "#7677F4" : "#999999"}`}
        />
      ),
    },
    {
      value: ACCOMMODATION_STEP_NUMBER,
      label: "Accommodation",
      icon: (
        <Car
          color={` ${
            currentStep == ACCOMMODATION_STEP_NUMBER ? "#7677F4" : "#999999"
          }`}
        />
      ),
    },
    {
      value: CONTACT_INFO_STEP_NUMBER,
      label: "Contact Info",
      icon: (
        <Info
          color={` ${
            currentStep == CONTACT_INFO_STEP_NUMBER ? "#7677F4" : "#999999"
          }`}
        />
      ),
    },
  ];

  const onSubmit = (formData: any) => {
    console.log(formData);
  };

  const defaultValues = {
    [NewCourseStep2FormNames?.visibility_id]: "public",
    [NewCourseStep2FormNames?.is_language_translation_for_participants]: "true",
    [NewCourseStep2FormNames?.is_geo_restriction_applicable]: "true",
    [NewCourseStep5FormNames?.is_residential_program]: "No",
    [NewCourseStep5FormNames?.accommodation_fee_payment_mode]: "Pay Online",
    [NewCourseStep1FormNames?.organizer_ids]: [loggedUserData],
  };

  const schema = z.object({
    organization_id: z
      .number()
      .refine((value) => value !== null && value !== 0, {
        message: "SelectOrganizerName",
        path: ["organization_id"],
      }),
  });

  // If the form is still loading, display a loading message
  // if (formLoading) {
  //   return <div>Loading...</div>;
  // }

  const contentStylings =
    "inline-flex !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background ";
  return (
    <div className="bg-[white]  ">
      <Tabs value={JSON.stringify(currentStep)}>
        <div className="flex flex-row">
          <TabsList className="h-full bg-[#7677F41B] w-[238px] rounded-l-[24px] shadow-md py-10">
            <div className="flex flex-col  h-full gap-4 ">
              {stepTitles.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={JSON.stringify(tab.value)}
                  className="!h-12  items-center w-[230px] text-[#999999] !font-normal data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  onClick={() => setCurrentStep(tab.value)}
                >
                  {currentStep === tab.value && (
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
            <Form
              onSubmit={onSubmit}
              defaultValues={defaultValues}
              schema={schema}
            >
              <div className="flex flex-col justify-between max-h-[460px] h-[460px] overflow-y-auto scrollbar">
                <div>
                  <TabsContent
                    value={JSON.stringify(BASIC_DETAILS_STEP_NUMBER)}
                    className={contentStylings}
                  >
                    <NewCourseStep1 />
                  </TabsContent>
                  <TabsContent
                    value={JSON.stringify(COURSE_DETAILS_STEP_NUMBER)}
                    className={contentStylings}
                  >
                    <NewCourseStep2 />
                  </TabsContent>
                  <TabsContent
                    value={JSON.stringify(TIME_AND_VENUE_STEP_NUMBER)}
                    className={contentStylings}
                  >
                    <NewCourseStep3 />
                  </TabsContent>
                  <TabsContent
                    value={JSON.stringify(FEE_STEP_NUMBER)}
                    className={contentStylings}
                  >
                    <NewCourseStep4 />
                  </TabsContent>
                  <TabsContent
                    value={JSON.stringify(ACCOMMODATION_STEP_NUMBER)}
                    className={contentStylings}
                  >
                    <NewCourseStep5 />
                  </TabsContent>
                  <TabsContent
                    value={JSON.stringify(CONTACT_INFO_STEP_NUMBER)}
                    className={contentStylings}
                  >
                    <NewCourseStep6 />
                  </TabsContent>
                </div>

                <Footer stepTitles={stepTitles} />
              </div>
            </Form>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default index;

const Footer = ({ stepTitles }: any) => {
  const { currentStep } = stepStore();
  const { setViewPreviewPage, setNewCourseData, newCourseData } =
    newCourseStore();
  const { handleClickNext, handleClickPrevious } =
    useValidateCurrentStepFields();

  const { watch } = useFormContext();

  const formData = watch();

  const validationFieldsStepWise = [
    Object.values(NewCourseStep1FormNames),
    Object.values(NewCourseStep2FormNames),
    Object.values(NewCourseStep3FormNames),
    Object.values(NewCourseStep4FormNames),
    Object.values(NewCourseStep5FormNames),
    Object.values(NewCourseStep6FormNames),
  ];

  const onSubmit = () => {
    console.log("heyy on submitttt");
  };

  const handleClickReviewDetailsButton = () => {
    setViewPreviewPage(true);
    setNewCourseData(formData);
  };

  return (
    <div className="flex self-end justify-center gap-4 w-full mt-2">
      {currentStep > 0 && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleClickPrevious();
          }}
          className="border border-[#7677F4] bg-[white] w-[118px] h-[46px] text-[#7677F4] font-semibold"
        >
          Previous
        </Button>
      )}

      {currentStep < stepTitles.length - 2 && (
        <Button
          className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] font-semibold"
          onClick={async (e) => {
            e.preventDefault();
            await handleClickNext(validationFieldsStepWise[currentStep - 1]);
          }}
        >
          Next
        </Button>
      )}

      {currentStep == CONTACT_INFO_STEP_NUMBER && (
        <Button
          className="bg-[#7677F4] w-[117px] h-[46px] rounded-[12px] "
          onClick={handleClickReviewDetailsButton}
        >
          Review Details
        </Button>
      )}
    </div>
  );
};
