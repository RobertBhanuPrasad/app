import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import NewCourseStep1 from "@components/course/newCourse/NewCourseStep1";
import NewCourseStep2 from "@components/course/newCourse/NewCourseStep2";
import NewCourseStep3 from "@components/course/newCourse/NewCourseStep3";
import NewCourseStep4 from "@components/course/newCourse/NewCourseStep4";
import NewCourseStep5 from "@components/course/newCourse/NewCourseStep5";
import NewCourseStep6 from "@components/course/newCourse/NewCourseStep6";
import NewCourseThankyouPage from "@components/course/newCourse/NewCourseThankyouPage";
import Car from "@public/assets/Car";
import Fees from "@public/assets/Fees";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import { useGetIdentity, useList } from "@refinedev/core";
import Form from "@components/Formfield";
import { useFormContext, useFormState } from "react-hook-form";
import {
  ACCOMMODATION_STEP_NUMBER,
  BASIC_DETAILS_STEP_NUMBER,
  CONTACT_INFO_STEP_NUMBER,
  COURSE_DETAILS_STEP_NUMBER,
  FEE_STEP_NUMBER,
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep3FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
  TIME_AND_VENUE_STEP_NUMBER,
} from "src/constants/CourseConstants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/ui/tabs";
import { Button } from "src/ui/button";
import { PAYMENT_MODE, TIME_FORMAT } from "src/constants/OptionLabels";
import {
  PAY_ONLINE,
  PUBLIC,
  TIME_FORMAT_24_HOURS,
} from "src/constants/OptionValueOrder";
import { validationSchema } from "../../../src/components/course/newCourse/NewCourseValidations";
import { useValidateCurrentStepFields } from "src/utility/ValidationSteps";
import { SUPER_ADMIN } from "src/constants/OptionValueOrder";
import { useState } from "react";
import { VISIBILITY } from "src/constants/OptionLabels";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

import Error from "@public/assets/Error";
import Success from "@public/assets/Success";
import _ from "lodash";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import LoadingIcon from "@public/assets/LoadingIcon";

function index() {
  const { data: loginUserData }: any = useGetIdentity();
  console.log(loginUserData, "loginUserData");

  const { viewPreviewPage, viewThankyouPage } = newCourseStore();

  if (!loginUserData?.userData) {
    return <div>Loading...</div>;
  }

  if (viewThankyouPage) {
    return (
      <div className="mb-8">
        <NewCourseThankyouPage />;
      </div>
    );
  }

  if (viewPreviewPage) {
    return <NewCourseReviewPage />;
  } else {
    return <NewCourse />;
  }
}
function NewCourse() {
  const { data: loginUserData }: any = useGetIdentity();

  const loggedUserData = loginUserData?.userData?.id;

  const onSubmit = (formData: any) => {
    // console.log(formData);
  };

  //Finding program Organizer role id
  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;

  const payOnlineId = getOptionValueObjectByOptionOrder(
    PAYMENT_MODE,
    PAY_ONLINE
  )?.id;

  const timeFormat24HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_24_HOURS
  )?.id;

  console.log("hehehe", timeFormat24HoursId, payOnlineId, publicVisibilityId);

  const { newCourseData } = newCourseStore();

  /**
   * default values are used to prefill the course data
   * There are two different scenarios are there
   * 1. User will click new course button at that time we need to prefill the form with below object
   * 2. User will click on Edit Course or Copy Course then also we need to prefill
   * When user coming from copy or edit course we dont need to prefill the below object because we will already set this
   */
  const defaultValues =
    newCourseData === null
      ? {
          [NewCourseStep2FormNames?.visibility_id]: publicVisibilityId,
          [NewCourseStep2FormNames?.is_language_translation_for_participants]:
            true,
          [NewCourseStep2FormNames?.is_geo_restriction_applicable]: false,
          //For registration required field will be visibile to super admin only and it should be set to true by default
          [NewCourseStep2FormNames?.is_registration_required]: true,
          [NewCourseStep5FormNames?.accommodation_fee_payment_mode]:
            payOnlineId,
          [NewCourseStep1FormNames?.organizer_ids]: [loggedUserData],
          [NewCourseStep5FormNames?.is_residential_program]: false,
          [NewCourseStep3FormNames?.hour_format_id]: timeFormat24HoursId,
        }
      : newCourseData;

  // If the form is still loading, display a loading message
  // we have to display loading icon until the below variables will be get from database
  if (!publicVisibilityId && !payOnlineId && !timeFormat24HoursId) {
    return <LoadingIcon />;
  }

  return (
    <div className="bg-[white] mx-8">
      <Form
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={validationSchema()}
      >
        <NewCourseTabs />
      </Form>
    </div>
  );
}

export default index;

export const NewCourseTabs = () => {
  const { watch, getValues } = useFormContext();
  const { setViewPreviewPage, setNewCourseData, currentStep, setCurrentStep } =
    newCourseStore();

  const [isAllFieldsValid1, setIsAllFieldsValid1] = useState(undefined);
  const [isAllFieldsValid2, setIsAllFieldsValid2] = useState(undefined);
  const [isAllFieldsValid3, setIsAllFieldsValid3] = useState(undefined);
  const [isAllFieldsValid4, setIsAllFieldsValid4] = useState(undefined);
  const [isAllFieldsValid5, setIsAllFieldsValid5] = useState(undefined);
  const [isAllFieldsValid6, setIsAllFieldsValid6] = useState(undefined);

  /**
   * @function handelIsAllFieldsFilled
   * @description this function is used to set that is all fields are filled or not in particular step
   * @param isAllFieldsFilled
   */
  const handelIsAllFieldsFilled = (isAllFieldsFilled: any) => {
    if (currentStep == 1) {
      setIsAllFieldsValid1(isAllFieldsFilled);
    } else if (currentStep == 2) {
      setIsAllFieldsValid2(isAllFieldsFilled);
    } else if (currentStep == 3) {
      setIsAllFieldsValid3(isAllFieldsFilled);
    } else if (currentStep == 4) {
      setIsAllFieldsValid4(isAllFieldsFilled);
    } else if (currentStep == 5) {
      setIsAllFieldsValid5(isAllFieldsFilled);
    } else if (currentStep == 6) {
      setIsAllFieldsValid6(isAllFieldsFilled);
    }
  };

  const { data: loginUserData }: any = useGetIdentity();

  const { data: timeZoneData } = useList({ resource: "time_zones" });
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  const formData = getValues();
  const contentStylings =
    "inline-flex !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background ";

  let RequiredNewCourseStep1FormNames = _.omit(
    NewCourseStep1FormNames,
    formData?.is_registration_via_3rd_party
      ? []
      : ["registration_via_3rd_party_url"]
  );

  let RequiredNewCourseStep2FormNames = _.omit(NewCourseStep2FormNames, [
    ...(formData?.program_type?.has_alias_name
      ? []
      : ["program_alias_name_id"]),
    ...(formData?.is_geo_restriction_applicable ? [] : ["allowed_countries"]),
    ...(hasSuperAdminRole ? [] : ["is_language_translation_for_participants"]),
    ...(formData?.program_type?.is_geo_restriction_applicable
      ? []
      : ["is_geo_restriction_applicable"]),
  ]);

  let RequiredNewCourseStep3FormNames = _.omit(NewCourseStep3FormNames, [
    ...(formData?.courseTypeSettings?.is_online_program
      ? []
      : ["online_url", "state_id", "city_id", "center_id"]),
    ...(formData?.courseTypeSettings?.is_online_program
      ? ["is_existing_venue", "newVenue", "existingVenue"]
      : []),
    ...(formData?.is_existing_venue == "new-venue" ? [] : ["newVenue"]),
    ...(formData?.is_existing_venue == "existing-venue"
      ? []
      : ["existingVenue"]),
    //If country does not have multiple time zones no need to validate time zone drop down
    ...(timeZoneData?.total == 0 ? ["time_zone_id"] : []),
  ]);

  let RequiredNewCourseStep5FormNames = _.omit(NewCourseStep5FormNames, [
    ...(formData?.is_residential_program == false
      ? [
          "accommodation",
          "fee_per_person",
          "no_of_residential_spots",
          "accommodation_type_id",
          "accommodation_fee_payment_mode",
        ]
      : []),
  ]);

  const validationFieldsStepWise = [
    Object.values(RequiredNewCourseStep1FormNames),
    Object.values(RequiredNewCourseStep2FormNames),
    Object.values(RequiredNewCourseStep3FormNames),
    Object.values(NewCourseStep4FormNames),
    Object.values(RequiredNewCourseStep5FormNames),
    Object.values(NewCourseStep6FormNames),
  ];

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();

  let isAllFieldsFilled = false;

  /**
   * @function handleClickTab
   * @description this function is used to click tabs based on the validations of present step
   * @param currentStepFormNames
   * @param tab
   */
  const handleClickTab = async (
    currentStepFormNames: any[],
    tab: { value: any }
  ) => {
    isAllFieldsFilled = await ValidateCurrentStepFields(currentStepFormNames);
    //if the clicked tab is lessthan current step then we can navigate to the clicked tab
    if (tab.value < currentStep) {
      setCurrentStep(tab.value);
    } else if (isAllFieldsFilled && tab.value == currentStep + 1) {
      // if all the fields filled in the current step then we can only able to go to next step
      setCurrentStep(tab.value);
    }
    // This function is used to handle to update that all the fields in particular step is filled or not
    handelIsAllFieldsFilled(isAllFieldsFilled);
  };

  /**
   * @function handleClickReviewDetailsButton
   * @description This function is used to send to the review page if all the fields are field
   * @param currentStepFormNames
   */
  const handleClickReviewDetailsButton = async (
    currentStepFormNames: any[]
  ) => {
    const formData = watch();

    isAllFieldsFilled = await ValidateCurrentStepFields(currentStepFormNames);
    if (isAllFieldsFilled) {
      setViewPreviewPage(true);
      setNewCourseData(formData);
    }
    handelIsAllFieldsFilled(isAllFieldsFilled);
  };

  /**
   * @function handleClickNext
   * @description this function is used to navigate to next step if all the fields of the current step is all filled
   * @param currentStepFormNames
   */
  const handleClickNext = async (currentStepFormNames: any[]) => {
    isAllFieldsFilled = await ValidateCurrentStepFields(currentStepFormNames);
    if (isAllFieldsFilled) {
      setCurrentStep(currentStep + 1);
    }
    handelIsAllFieldsFilled(isAllFieldsFilled);
  };

  /**
   * @function handleClickPrevious
   * @description this function is used to click on the previous button and able to move to a step befor from the present step
   */
  const handleClickPrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Array of step titles, icons, and colors
  const stepTitles = [
    {
      value: BASIC_DETAILS_STEP_NUMBER,
      label: "Basic Details",
      // If the current step is BASIC_DETAILS_STEP or the step is visited then we will show that in the #7677F4 color, else if we not visted and we are not in that step number then we will show in the #999999
      textColor:
        currentStep === BASIC_DETAILS_STEP_NUMBER ||
        isAllFieldsValid1 !== undefined
          ? "text-[#7677F4] !font-semibold"
          : "text-[#999999]",
      icon:
        // If the current step is in BASIC_DETAILS_STEP then we show the Profile icon with the #7677F4 color
        // else if the current step is not in the BASIC_DETAILS_STEP and we did not visited the step then we we need to show the Profile icon with #999999 color
        // else if filled all the fields in that step then we will be showing the sucess icon
        // else Error icon
        currentStep == BASIC_DETAILS_STEP_NUMBER &&
        isAllFieldsValid1 == undefined ? (
          <Profile
            color={` ${
              currentStep == BASIC_DETAILS_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid1 ? (
          <Success />
        ) : (
          <Error />
        ),
    },
    {
      value: COURSE_DETAILS_STEP_NUMBER,
      label: "Course Details",
      // If the current step is COURSE_DETAILS_STEP or the step is visited then we will show that in the #7677F4 color, else if we not visted and we are not in that step number then we will show in the #999999
      textColor:
        currentStep === COURSE_DETAILS_STEP_NUMBER ||
        isAllFieldsValid2 !== undefined
          ? "text-[#7677F4] !font-semibold"
          : "text-[#999999]",
      icon:
        // If the current step is in COURSE_DETAILS_STEP then we show the Group icon with the #7677F4 color
        // else if the current step is not in the COURSE_DETAILS_STEP and we did not visited the step then we we need to show the Group icon with #999999 color
        // else if filled all the fields in that step then we will be showing the sucess icon
        // else Error icon
        currentStep === COURSE_DETAILS_STEP_NUMBER &&
        isAllFieldsValid2 === undefined ? (
          <Group
            color={` ${
              currentStep == COURSE_DETAILS_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid2 == undefined ? (
          <Group
            color={` ${
              currentStep == COURSE_DETAILS_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid2 ? (
          <Success />
        ) : (
          <Error />
        ),
    },
    {
      value: TIME_AND_VENUE_STEP_NUMBER,
      label: "Time and Venue",
      // If the current step is TIME_AND_VENUE_STEP or the step is visited then we will show that in the #7677F4 color, else if we not visted and we are not in that step number then we will show in the #999999
      textColor:
        currentStep === TIME_AND_VENUE_STEP_NUMBER ||
        isAllFieldsValid3 !== undefined
          ? "text-[#7677F4] !font-semibold"
          : "text-[#999999]",
      icon:
        // If the current step is in TIME_AND_VENUE_STEP then we show the Venue icon with the #7677F4 color
        // else if the current step is not in the TIME_AND_VENUE_STEP and we did not visited the step then we we need to show the Venue icon with #999999 color
        // else if filled all the fields in that step then we will be showing the sucess icon
        // else Error icon
        currentStep == TIME_AND_VENUE_STEP_NUMBER &&
        isAllFieldsValid3 == undefined ? (
          <Venue
            color={` ${
              currentStep == TIME_AND_VENUE_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid3 == undefined ? (
          <Venue
            color={` ${
              currentStep == TIME_AND_VENUE_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid3 ? (
          <Success />
        ) : (
          <Error />
        ),
    },
    {
      value: FEE_STEP_NUMBER,
      label: "Fees",
      // If the current step is FEE_STEP or the step is visited then we will show that in the #7677F4 color, else if we not visted and we are not in that step number then we will show in the #999999
      textColor:
        currentStep === FEE_STEP_NUMBER || isAllFieldsValid4 !== undefined
          ? "text-[#7677F4] !font-semibold"
          : "text-[#999999]",
      icon:
        // If the current step is in FEE_STEP then we show the Fees icon with the #7677F4 color
        // else if the current step is not in the FEE_STEP and we did not visited the step then we we need to show the Fees icon with #999999 color
        // else if filled all the fields in that step then we will be showing the sucess icon
        // else Error icon
        currentStep == FEE_STEP_NUMBER && isAllFieldsValid4 == undefined ? (
          <Fees
            color={` ${currentStep == FEE_STEP_NUMBER ? "#7677F4" : "#999999"}`}
          />
        ) : isAllFieldsValid4 == undefined ? (
          <Fees
            color={` ${currentStep == FEE_STEP_NUMBER ? "#7677F4" : "#999999"}`}
          />
        ) : isAllFieldsValid4 ? (
          <Success />
        ) : (
          <Error />
        ),
    },
    {
      value: ACCOMMODATION_STEP_NUMBER,
      label: "Accommodation",
      // If the current step is ACCOMMODATION_STEP or the step is visited then we will show that in the #7677F4 color, else if we not visted and we are not in that step number then we will show in the #999999
      textColor:
        currentStep === ACCOMMODATION_STEP_NUMBER ||
        isAllFieldsValid5 !== undefined
          ? "text-[#7677F4] !font-semibold"
          : "text-[#999999]",
      icon:
        // If the current step is in ACCOMMODATION_STEP then we show the Car icon with the #7677F4 color
        // else if the current step is not in the ACCOMMODATION_STEP and we did not visited the step then we we need to show the Car icon with #999999 color
        // else if filled all the fields in that step then we will be showing the sucess icon
        // else Error icon
        currentStep == ACCOMMODATION_STEP_NUMBER &&
        isAllFieldsValid5 == undefined ? (
          <Car
            color={` ${
              currentStep == ACCOMMODATION_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid5 == undefined ? (
          <Car
            color={` ${
              currentStep == ACCOMMODATION_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid5 ? (
          <Success />
        ) : (
          <Error />
        ),
    },
    {
      value: CONTACT_INFO_STEP_NUMBER,
      label: "Contact Info",
      // If the current step is CONTACT_INFO_STEP or the step is visited then we will show that in the #7677F4 color, else if we not visted and we are not in that step number then we will show in the #999999
      textColor:
        currentStep === CONTACT_INFO_STEP_NUMBER ||
        isAllFieldsValid6 !== undefined
          ? "text-[#7677F4] !font-semibold"
          : "text-[#999999]",
      icon:
        // If the current step is in CONTACT_INFO_STEP then we show the Info icon with the #7677F4 color
        // else if the current step is not in the CONTACT_INFO_STEP and we did not visited the step then we we need to show the Info icon with #999999 color
        // else if filled all the fields in that step then we will be showing the sucess icon
        // else Error icon
        currentStep == CONTACT_INFO_STEP_NUMBER &&
        isAllFieldsValid6 == undefined ? (
          <Info
            color={` ${
              currentStep == CONTACT_INFO_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid6 == undefined ? (
          <Info
            color={` ${
              currentStep == CONTACT_INFO_STEP_NUMBER ? "#7677F4" : "#999999"
            }`}
          />
        ) : isAllFieldsValid6 ? (
          <Success />
        ) : (
          <Error />
        ),
    },
  ];

  return (
    <div>
      <Tabs value={JSON.stringify(currentStep)}>
        <div className="flex flex-row">
          <TabsList className="h-[513px] bg-[#7677F41B] w-[238px] rounded-l-[24px] shadow-md py-10">
            <div className="flex flex-col  h-full gap-4 ">
              {stepTitles.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={JSON.stringify(tab.value)}
                  className="!h-12  items-center w-[230px] text-[#999999] !font-normal data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  onClick={async () =>
                    await handleClickTab(
                      validationFieldsStepWise[currentStep - 1],
                      tab
                    )
                  }
                >
                  {currentStep === tab.value && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-3"></div>
                  )}
                  <div
                    className={`flex flex-row gap-[10px] ml-[14px] items-center ${tab?.textColor}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </div>
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          <div className="bg-[white] w-full rounded-[24px] -ml-4 -mt-1 p-6 shadow-md h-[517px]">
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
              <div className="flex self-end justify-center gap-4 w-full mt-2">
                {currentStep > 1 && (
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

                {currentStep < stepTitles.length && (
                  <Button
                    className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] font-semibold"
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleClickNext(
                        validationFieldsStepWise[currentStep - 1]
                      );
                    }}
                  >
                    Next
                  </Button>
                )}

                {currentStep == CONTACT_INFO_STEP_NUMBER && (
                  <Button
                    className="bg-[#7677F4] w-[117px] h-[46px] rounded-[12px] "
                    onClick={async () => {
                      await handleClickReviewDetailsButton(
                        validationFieldsStepWise[currentStep - 1]
                      );
                    }}
                  >
                    Review Details
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};
