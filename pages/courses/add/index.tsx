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
import { QueryObserverResult } from "@tanstack/react-query";
import {
  GetListResponse,
  HttpError,
  UseLoadingOvertimeReturnType,
  useGetIdentity,
  useList,
} from "@refinedev/core";
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
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";

import { useTranslation } from 'next-i18next';

function index() {
  const { data: loginUserData }: any = useGetIdentity();
  console.log(loginUserData, "loginUserData");

  const {
    query: { section },
  } = useRouter();

  console.log("router is ", section);

  if (!loginUserData?.userData) {
    return <div>Loading...</div>;
  }

  if (section === "thank_you") {
    return (
      <div className="mb-8">
        <NewCourseThankyouPage />;
      </div>
    );
  }

  if (section === "preview_page") {
    return <NewCourseReviewPage />;
  } else {
    return <NewCourse />;
  }
}
function NewCourse() {
  const { data: loginUserData }: any = useGetIdentity();

  const loggedUserData = loginUserData?.userData?.id;

  console.log("heyy logged user data", loggedUserData);

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
   *variable that holds whether the logged in user has super admin role or not
   */
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

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
          //For registration required field will be visibile to super admin only and it should be set to true by default and it should be only true for super admin role for others it should be undefined
          [NewCourseStep2FormNames?.is_registration_required]: hasSuperAdminRole
            ? true
            : undefined,

          // is_geo_restriction_applicable is visible to super admin and default it is no
          [NewCourseStep2FormNames?.is_geo_restriction_applicable]: false,
          [NewCourseStep5FormNames?.accommodation_fee_payment_mode]:
            payOnlineId,
          [NewCourseStep1FormNames?.organizer_ids]: [loggedUserData],
          [NewCourseStep5FormNames?.is_residential_program]: false,
        }
      : newCourseData;

  // fetch data from country_config table for time format
  const {
    data,
    isLoading,
  }: QueryObserverResult<
    GetListResponse<CountryConfigDataBaseType>,
    HttpError
  > &
    UseLoadingOvertimeReturnType = useList({
    resource: "country_config",
  });

  console.log("country config data is", data?.data[0]);

  // Requirement: If there is only one time zone available, we will not display time zone dropdown and we need to store that time zone id in the database
  const {
    data: timeZonesData,
    isLoading: timeZoneLoading,
  }: QueryObserverResult<GetListResponse<TimeZoneDataBaseType>, HttpError> &
    UseLoadingOvertimeReturnType = useList({
    resource: "time_zones",
  });

  // check how many records are there in time_zones table
  // if only one time_zone is there in database then we need to prefill that time_zone_id to store that in program table
  if (timeZonesData?.data?.length === 1 && newCourseData === null) {
    defaultValues[NewCourseStep3FormNames?.time_zone_id] =
      timeZonesData?.data[0]?.id;
  }

  //set defaultValue of hour_format_id to data?.data[0]?.hour_format_id if it contains any value other wise set to default timeFormat24HoursId
  // and same we need to set only if newCourseData is null
  if (newCourseData === null) {
    if (data?.data[0]?.hour_format_id) {
      defaultValues[NewCourseStep3FormNames?.hour_format_id] =
        data?.data[0]?.hour_format_id;
    } else {
      defaultValues[NewCourseStep3FormNames?.hour_format_id] =
        timeFormat24HoursId;
    }
  }

  // If the form is still loading, display a loading message
  // we have to display loading icon until the below variables will be get from database
  // isLoading also we need becuase we need to set the data right
  if (
    (!publicVisibilityId && !payOnlineId && !timeFormat24HoursId) ||
    isLoading ||
    timeZoneLoading
  ) {
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
  const {t} = useTranslation(['common', 'course.new_course', "new_strings"])
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();
  const { watch, getValues } = useFormContext();
  const { setNewCourseData, currentStep, setCurrentStep } = newCourseStore();

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
      // setViewPreviewPage(true);
      setNewCourseData(formData);

      // i need to set params with section=preview_page
      const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
      current.set("section", "preview_page");

      const params = current.toString();

      router.replace(`${pathname}?${params}`);
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
      label: t('basic_details'),
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
      label: t("course.new_course:review_post_details.course_details"),
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
      label: t("time_and_venue"),
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
      label: t("fees"),
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
      label: t("new_strings:accommodation"),
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
      label: t("new_strings:contact_info"),
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
      <p className="font-semibold text-2xl">
        {router.query.action ? router.query.action : "New"} Course
      </p>
      <div className="mt-4">
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
    </div>
  );
};

/**
 * Function to fetch server-side props.
 * This function checks the authentication status using the auth provider and
 * fetches translations for the current locale.
 * If the user is not authenticated, it redirects them to the specified destination.
 * @param context The context object containing information about the request.
 * @returns Server-side props including translated props or redirection information.
 */
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common","course.new_course", "new_strings"
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
