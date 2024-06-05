import Form from "@components/Formfield";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import NewCourseStep1 from "@components/course/newCourse/NewCourseStep1";
import NewCourseStep2 from "@components/course/newCourse/NewCourseStep2";
import NewCourseStep3 from "@components/course/newCourse/NewCourseStep3";
import NewCourseStep4 from "@components/course/newCourse/NewCourseStep4";
import NewCourseStep5 from "@components/course/newCourse/NewCourseStep5";
import NewCourseStep6 from "@components/course/newCourse/NewCourseStep6";
import NewCourseThankyouPage from "@components/course/newCourse/NewCourseThankyouPage";
import Car from "@public/assets/Car";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import {
  GetListResponse,
  HttpError,
  UseLoadingOvertimeReturnType,
  useGetIdentity,
  useList
} from "@refinedev/core";
import { QueryObserverResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import {
  ACCOMMODATION_STEP_NUMBER,
  BASIC_DETAILS_STEP_NUMBER,
  CONTACT_INFO_STEP_NUMBER,
  COURSE_DETAILS_STEP_NUMBER,
  FEE_STEP_NUMBER,
  INVALID,
  NEXT_BUTTON_CLICKED,
  NEXT_BUTTON_NOT_CLICKED,
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep3FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
  TIME_AND_VENUE_STEP_NUMBER,
  VALID,
} from "src/constants/CourseConstants";
import {
  PAYMENT_MODE,
  PROGRAM_ORGANIZER_TYPE,
  TIME_FORMAT,
  VISIBILITY,
} from "src/constants/OptionLabels";
import {
  I_AM_CO_TEACHING,
  NATIONAL_ADMIN,
  PAY_ONLINE,
  PUBLIC,
  SUPER_ADMIN,
  TIME_FORMAT_24_HOURS,
} from "src/constants/OptionValueOrder";
import { Button } from "src/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { useValidateCurrentStepFields } from "src/utility/ValidationSteps";
import { validationSchema } from "../../../src/components/course/newCourse/NewCourseValidations";

import { IsCopyCourse, IsEditCourse } from "@components/course/newCourse/EditCourseUtil";
import { IsNewCourse } from "@components/course/newCourse/NewCourseUtil";
import Error from "@public/assets/Error";
import Success from "@public/assets/Success";
import _ from "lodash";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePathname, useSearchParams } from "next/navigation";
import { NextRouter, useRouter } from "next/router";
import { authProvider } from "src/authProvider";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import useGetCountryCode from "src/utility/useGetCountryCode";
import { supabaseClient } from "src/utility";
function index() {
  const { data: loginUserData }: any = useGetIdentity();
  console.log(loginUserData, "loginUserData");

  const {
    query: { section },
  } = useRouter();

  console.log("router is ", section);

  if (!loginUserData?.userData) {
    return (
      <section className="flex justify-center align-center pt-[15%]">
        {" "}
        <div>Loading...</div>
      </section>
    );
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
export function NewCourse() {
  const { setCurrentStep, newCourseData } = newCourseStore();

  const { data: loginUserData }: any = useGetIdentity();

  const router = useRouter();

  const loggedUserData = loginUserData?.userData?.id;

  console.log("heyy logged user data", loggedUserData);

  // Get the current pathname using the useRouter hook
  const pathname = usePathname();

  const onSubmit = (formData: any) => {
    // console.log(formData);
  };

  /**
   * useEffect to run once when the component mounts.
   * It sets the current step to 1.
   * It sets the courseCreation is not yet done that false
   * This effect has an empty dependency array to ensure it runs only once.
   */
  useEffect(() => {
    /**
     * Set the current step to 1 when the component mounts.
     * This initializes the component state for the first step.
     */
    setCurrentStep(1);
  }, []);

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

  /**
   * @constant iAmCoTeachingId
   * @description thid const stores the id of the i am co teaching
   */
  const iAmCoTeachingId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_CO_TEACHING
  )?.id;

  console.log("hehehe", timeFormat24HoursId, payOnlineId, publicVisibilityId);

  /**
   *variable that holds whether the logged in user has super admin role or not
   */
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  /**
   * Getting the search params from useSearchParams function
   */
  const searchparams = useSearchParams();

  /**
   * defining the ref using use Ref function
   */
  const ref: any = useRef();

  // Requirement: When user change router from copy to new or new to new click on again we need to reset the form to intital state.
  // Implementation : Temporary : We will use useEffect with dependenancy array searchParams.
  // whenever searchParams change then just do refresh .
  // Important we dont need to run useEffect when page loads.
  // we need to run the code only router changes for that we are taking one ref when by default it will be undefined . so our code will not run initally
  // and then we are setting ref.current to true then whenever route change our needed code will run again.
  // Permanent solution : we need to seperate copy course as a new page becuase it has lot of requirements.
  useEffect(() => {
    if (ref.current) {
      router.reload();
    }
    ref.current = true;
  }, [searchparams]);

  /**
   * default values are used to prefill the course data
   * There are two different scenarios are there
   * 1. User will click new course button at that time we need to prefill the form with below object
   * 2. User will click on Edit Course or Copy Course then also we need to prefill
   * When user coming from copy or Edit Course we dont need to prefill the below object because we will already set this
   */
  let defaultValues: any = {};

  if (IsEditCourse(pathname) || IsCopyCourse(pathname)) {
    defaultValues = newCourseData;
    //REQUIRMENT if the course is copying then we need to prefill the organizers of that cousre and we need to add the logged in user as a primary organizer
    if (IsCopyCourse(pathname) && newCourseData) {
      defaultValues.organizer_ids = _.uniq([
        loggedUserData,
        ...newCourseData?.organizer_ids,
      ]);
    }
  } else {
    defaultValues[NewCourseStep2FormNames?.visibility_id] = publicVisibilityId;
    defaultValues[
      NewCourseStep2FormNames?.is_language_translation_for_participants
    ] = true;
    // For registration required field will be visible to super admin only and it should be set to true by default and it should be only true for super admin role for others it should be undefined
    if (hasSuperAdminRole) {
      defaultValues[NewCourseStep2FormNames?.is_registration_required] = true;
    } else {
      defaultValues[NewCourseStep2FormNames?.is_registration_required] =
        undefined;
    }
    // is_geo_restriction_applicable is visible to super admin and default it is no
    defaultValues[NewCourseStep2FormNames?.is_geo_restriction_applicable] =
      false;
    defaultValues[NewCourseStep5FormNames?.accommodation_fee_payment_mode] =
      payOnlineId;
    defaultValues[NewCourseStep1FormNames?.organizer_ids] = [loggedUserData];
  }

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
  if (
    timeZonesData?.data?.length === 1 &&
    (IsEditCourse(pathname) === false || IsCopyCourse(pathname) === false)
  ) {
    defaultValues[NewCourseStep3FormNames?.time_zone_id] =
      timeZonesData?.data[0]?.id;
  }

  //set defaultValue of hour_format_id to data?.data[0]?.hour_format_id if it contains any value other wise set to default timeFormat24HoursId
  // and same we need to set only if it is not edit and copy
  if (IsEditCourse(pathname) === false && IsCopyCourse(pathname) === false) {
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
    return (
      <section className="flex justify-center align-center pt-[15%]">
        {" "}
        <div className="loader"></div>
      </section>
    );
  }

  return (
    <div className="mx-auto min-w-[1000px] w-full max-w-[1640px] px-8 pb-8">
      <div>
        <Form
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          schema={validationSchema(iAmCoTeachingId as number)}
        >
          <NewCourseTabs defaultValues={defaultValues} />
        </Form>
      </div>
    </div>
  );
}

export default index;
// we are writing a function here to validate the each steps in new course page and edit previewpage
// we are calling the same function for newcoursepreviewpagepageeditcourse also to validate
export const requiredValidationFields = (
  formData: NewCourseFormFieldTypes,
  loginUserData: any,
  timeZoneData: any = [],
  programTypeData: ProgramTypesDataBaseType
) => {
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );
  let RequiredNewCourseStep1FormNames = _.omit(
    NewCourseStep1FormNames,
    formData?.is_registration_via_3rd_party
      ? []
      : ["registration_via_3rd_party_url"]
  );

  let RequiredNewCourseStep2FormNames = _.omit(NewCourseStep2FormNames, [
    ...(programTypeData?.has_alias_name ? [] : ["program_alias_name_id"]),
    ...(formData?.is_geo_restriction_applicable ? [] : ["allowed_countries"]),
    ...(hasSuperAdminRole ? [] : ["is_language_translation_for_participants"]),
    ...(programTypeData?.is_geo_restriction_applicable_for_registrations
      ? []
      : ["is_geo_restriction_applicable"]),
  ]);

  /**
   * @constant RequiredNewCourseStep3FormNames
   * @description the names which are need to trigger for the validations of step 3
   */
  let RequiredNewCourseStep3FormNames = ["schedules"];

  // REQUIRMENT if the program type is online then we need to validate the online url , state is present or not, city is present or not, center id is present or not
  // so if it is online type then we are keeping the online_url, state_id, city_id, center_id
  if (programTypeData?.is_online_program === true) {
    RequiredNewCourseStep3FormNames.push(
      "online_url",
      "state_id",
      "city_id",
      "center_id"
    );
  } else {
    // else we are validating the venues
    RequiredNewCourseStep3FormNames.push("is_existing_venue");
  }

  // REQUIRMENT If country does not have multiple time zones no need to validate time zone drop down
  // If there is one time zone then it will be the default time zone
  // If there are more than one time zones then we need to select the time zone
  // So we are sending the time_zone_id if there are more than 0ne time zone
  if ((timeZoneData?.length as number) > 1) {
    RequiredNewCourseStep3FormNames.push("time_zone_id");
  }

  //fetching user_roles of login user data
  const user_roles: any[] = loginUserData?.userData?.user_roles;

  //Checking Weather a user is Super Admin or Not
  let isUserNationAdminOrSuperAdmin = false;

  if (
    user_roles.some(
      (role) =>
        role.role_id.order === NATIONAL_ADMIN ||
        role.role_id.order === SUPER_ADMIN
    )
  ) {
    isUserNationAdminOrSuperAdmin = true;
  }

  //Checking Weather a fee is editable or not
  const isFeeEditable =
    isUserNationAdminOrSuperAdmin ||
    formData?.feeLevels?.[0]?.is_program_fee_editable
      ? true
      : false;

  let RequiredNewCourseStep4FormNames: string[] = ["feeLevels"];

  //If it is a Editable fee need to validate
  if (isFeeEditable) {
    RequiredNewCourseStep4FormNames = [
      ...RequiredNewCourseStep4FormNames,
      "is_early_bird_enabled",
      "program_fee_level_settings",
    ];
  }

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
    RequiredNewCourseStep3FormNames,
    RequiredNewCourseStep4FormNames,
    Object.values(RequiredNewCourseStep5FormNames),
    Object.values(NewCourseStep6FormNames),
  ];

  return validationFieldsStepWise;
};

type nextButtonClicks = "next_button_clicked" | "next_button_not_clicked";

export type ItabsNextButtonClickStatus = nextButtonClicks[];

export type ItabsValidationStatus = ("valid" | "invalid" | "neutral")[];

export const NewCourseTabs = ({ defaultValues }: { defaultValues: any }) => {
  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);

  const searchParams = useSearchParams();

  const pathname = usePathname();

  const router = useRouter();

  const { setNewCourseData, currentStep, setCurrentStep } = newCourseStore();

  const supabase = supabaseClient();

  const { watch, setValue } = useFormContext();

  const formData: NewCourseFormFieldTypes = watch();

  /**
   * useEffect hook to handle route changes.
   * - Monitors route changes and triggers an alert if navigating away from '/courses/add' without saving.
   * - Emits a routeChangeError event to cancel the navigation when necessary.
   * - Sets a pending URL and opens an alert dialog for user confirmation.
   * - Resets the navigation confirmation flag once the route change completes.
   */
   useEffect(() => {

    const routeChange = (url:string) => {
      const tempFormData = formData

      // we have remove the undefined key:value pairs in formData
      Object.keys(tempFormData).forEach(key => tempFormData[key] === undefined ? delete tempFormData[key] : {});
      Object.keys(defaultValues).forEach(key => defaultValues[key] === undefined ? delete defaultValues[key] : {});



      // to check whether we enter the any field value in the form and if we enter the  fields and try to navigate to another page it show the alert 
      // this varaible holds the boolean value that the data is entered or not
      const condition = _.isEqual(defaultValues,tempFormData)
      console.log(_.isEqual(defaultValues,tempFormData),defaultValues,tempFormData,"add")

      handleRouteChangeStart(url,router,pathname,condition)
    }
      router.events.on('routeChangeStart', routeChange);
    
    return () => {
        router.events.off('routeChangeStart', routeChange);
    };
  }, [formData]);

  const { data: loginUserData }: any = useGetIdentity();
  const { data: timeZoneData } = useList({ resource: "time_zones" });

  const [tabsNextButtonClickStatus, setTabsNextButtonClickStatus] =
    useState<ItabsNextButtonClickStatus>(
      new Array(6).fill(NEXT_BUTTON_NOT_CLICKED)
    );

  const [tabsValidationStatus, setTabsValidationStatus] =
    useState<ItabsValidationStatus>(new Array(6).fill(null));

  /**
   * In new course setp 2 we have program type dropdown select component
   * this variable is used to store latest program type data from selected program type id form form.
   */
  const [selectedProgramTypeData, setSelectedProgramTypeData] = useState({});

  /**
   * @description this function is used to get the latest program type data
   * @param programTypeId - program type id
   * @returns latest program type data
   */
  const getProgramTypeData = async (
    programTypeId: number | string | undefined
  ) => {
    if (
      programTypeId === "" ||
      programTypeId === undefined ||
      programTypeId === null
    ) {
      setSelectedProgramTypeData({});
      return;
    }

    const { data: programTypeData, error } = await supabase
      .from("program_types")
      .select("*")
      .eq("id", programTypeId);

    if (!error && programTypeData) {
      setSelectedProgramTypeData(programTypeData[0]);
    }
  };

  // in use Effect we will call the function to get the latest program type data
  useEffect(() => {
    getProgramTypeData(formData?.program_type_id);
  }, [formData?.program_type_id]);

  const contentStylings =
    "inline-flex w-full !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background";

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();

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
    //if the clicked tab is lessthan current step then we can navigate to the clicked tab
    if (tab.value < currentStep) {
      setCurrentStep(tab.value);
    } else {
      // there are so many cases here
      // we need to check tabsNextButtonClickStatus of steps upto tab.value - 1
      // if any one of the tabsNextButtonClickStatus is next_button_not_clicked then dont navigate to that clicked tab
      // if all the tabsNextButtonClickStatus is next_button_clicked then we can navigate to that clicked tab only if
      // tabsValidationStatus is valid

      let isAllFieldsFilled = await ValidateCurrentStepFields(
        currentStepFormNames
      );

      /**
       * because of state variable updataion we will not get updated data so taking temp variables
       */
      let tempTabsNextButtonClickStatus = tabsNextButtonClickStatus;
      let tempTabsValidationStatus = tabsValidationStatus;

      // if user clicks on next tab of current tab then and if tabsNextButtonClickStatus is next_button_not_clicked then change status and move to clicked tab
      if (
        tempTabsNextButtonClickStatus[currentStep - 1] ===
        NEXT_BUTTON_NOT_CLICKED
      ) {
        tempTabsNextButtonClickStatus = tempTabsNextButtonClickStatus.map(
          (status, index) => {
            if (index === currentStep - 1) {
              return NEXT_BUTTON_CLICKED;
            } else {
              return status;
            }
          }
        );

        setTabsNextButtonClickStatus(tempTabsNextButtonClickStatus);
      }

      if (isAllFieldsFilled) {
        // if all fields filled set tabsValidationStatus of current step to valid
        tempTabsValidationStatus = tempTabsValidationStatus.map(
          (status, index) => {
            if (index === currentStep - 1) {
              return VALID;
            } else {
              return status;
            }
          }
        );

        setTabsValidationStatus(tempTabsValidationStatus);

        // if user clicks on next tab and if all the tabsNextButtonClickStatus is next_button_clicked then only move to clicked tab
        if (
          tempTabsNextButtonClickStatus
            .slice(0, tab.value - 1)
            .every((status) => status === NEXT_BUTTON_CLICKED) &&
          tempTabsValidationStatus
            .slice(0, tab.value - 1)
            .every((status) => status === VALID)
        ) {
          setCurrentStep(tab.value);
        }
      } else {
        // if all fields are not filled and if user click on next button we need to make in valid
        tempTabsValidationStatus = tempTabsValidationStatus.map(
          (status, index) => {
            if (index === currentStep - 1) {
              return INVALID;
            } else {
              return status;
            }
          }
        );

        setTabsValidationStatus(tempTabsValidationStatus);
      }
      // if all the fields filled in the current step then we can only able to go to next step
    }
  };

  /**
   * @function handleClickReviewDetailsButton
   * @description This function is used to send to the review page if all the fields are field
   * @param currentStepFormNames
   */
  const handleClickReviewDetailsButton = async (
    currentStepFormNames: any[]
  ) => {
    // set tabsNextButtonClickStatus to next_button_clicked for the current step
    if (tabsNextButtonClickStatus[currentStep - 1] !== NEXT_BUTTON_CLICKED) {
      setTabsNextButtonClickStatus((tabsNextButtonClickStatus) => {
        return tabsNextButtonClickStatus.map((status, index) => {
          if (index === currentStep - 1) {
            return NEXT_BUTTON_CLICKED;
          } else {
            return status;
          }
        });
      });
    }

    const formData = watch();

    let isAllFieldsFilled = await ValidateCurrentStepFields(
      currentStepFormNames
    );

    if (isAllFieldsFilled) {
      // if all fields are not filled and if user click on next button we need to make in valid
      setTabsValidationStatus((tabsValidationStatus) => {
        return tabsValidationStatus.map((status, index) => {
          if (index === currentStep - 1) {
            return VALID;
          } else {
            return status;
          }
        });
      });

      // setViewPreviewPage(true);
      setNewCourseData(formData);

      // i need to set params with section=preview_page
      const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
      current.set("section", "preview_page");

      const params = current.toString();

      router.replace(`${pathname}?${params}`);
    } else {
      // if all fields are not filled and if user click on next button we need to make in valid
      setTabsValidationStatus((tabsValidationStatus) => {
        return tabsValidationStatus.map((status, index) => {
          if (index === currentStep - 1) {
            return INVALID;
          } else {
            return status;
          }
        });
      });
    }
  };

  /**
   * @function handleClickNext
   * @description this function is used to navigate to next step if all the fields of the current step is all filled
   * @param currentStepFormNames
   */
  const handleClickNext = async (currentStepFormNames: any[]) => {
    // set tabsNextButtonClickStatus to next_button_clicked for the current step
    if (tabsNextButtonClickStatus[currentStep - 1] !== NEXT_BUTTON_CLICKED) {
      setTabsNextButtonClickStatus((tabsNextButtonClickStatus) => {
        return tabsNextButtonClickStatus.map((status, index) => {
          if (index === currentStep - 1) {
            return NEXT_BUTTON_CLICKED;
          } else {
            return status;
          }
        });
      });
    }

    let isAllFieldsFilled = await ValidateCurrentStepFields(
      currentStepFormNames
    );

    if (isAllFieldsFilled) {
      // if all fields filled set tabsValidationStatus of current step to valid
      setTabsValidationStatus((tabsValidationStatus) => {
        return tabsValidationStatus.map((status, index) => {
          if (index === currentStep - 1) {
            return VALID;
          } else {
            return status;
          }
        });
      });

      setCurrentStep(currentStep + 1);
    } else {
      // if all fields are not filled and if user click on next button we need to make in valid
      setTabsValidationStatus((tabsValidationStatus) => {
        return tabsValidationStatus.map((status, index) => {
          if (index === currentStep - 1) {
            return INVALID;
          } else {
            return status;
          }
        });
      });
    }
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
      label: t("basic_details"),
      icon: (color: string) => <Profile color={color} />,
      component: <NewCourseStep1 />,
    },
    {
      value: COURSE_DETAILS_STEP_NUMBER,
      label: t("course.new_course:review_post_details.course_details"),
      icon: (color: string) => <Group color={color} />,
      component: <NewCourseStep2 />,
    },
    {
      value: TIME_AND_VENUE_STEP_NUMBER,
      label: t("time_and_venue"),
      icon: (color: string) => <Venue color={color} />,
      component: <NewCourseStep3 />,
    },
    {
      value: FEE_STEP_NUMBER,
      label: t("fees"),
      icon: (color: string) => <Venue color={color} />,
      component: <NewCourseStep4 />,
    },
    {
      value: ACCOMMODATION_STEP_NUMBER,
      label: t("new_strings:accommodation"),
      icon: (color: string) => <Car color={color} />,
      component: <NewCourseStep5 />,
    },
    {
      value: CONTACT_INFO_STEP_NUMBER,
      label: t("new_strings:contact_info"),
      icon: (color: string) => <Info color={color} />,
      component: <NewCourseStep6 />,
    },
  ];

  /**
   * @constant iAmCoTeachingId
   * @description thid const stores the id of the i am co teaching
   */
  const iAmCoTeachingId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_CO_TEACHING
  )?.id;

  /**
   * Validate every time with the form data to display tabs success or error messages
   * we will write one function and in that we use zod to validate so that error messages will not populate in the form
   */
  useEffect(() => {
    handleValidateTabs(formData);
  }, [JSON.stringify(formData), selectedProgramTypeData]);

  //fetching the user's country code
  const countryCode = useGetCountryCode();

  //Fetching the course fee
  //Need to update the course-fee when organization or program type or location data is edited.
  useEffect(() => {
    // This function handleCourseFeeData is used to fetch course-fee
    const handleCourseFeeData = async () => {
      const courseFees = await fetchCourseFee({ formData, countryCode });

      //Updating course fee
      setValue("feeLevels", courseFees);

      //Updating early_bird_cut_off_period
      if (formData?.early_bird_cut_off_period == undefined) {
        setValue(
          "early_bird_cut_off_period",
          courseFees?.[0]?.early_bird_cut_off_period
        );
      }

      //Updating is_early_bird_enabled
      if (
        formData?.is_early_bird_enabled == undefined &&
        courseFees?.[0]?.is_early_bird_fee_enabled != null
      ) {
        setValue(
          "is_early_bird_enabled",
          courseFees?.[0]?.is_early_bird_fee_enabled
        );
      }
    };

    handleCourseFeeData();
  }, [
    formData?.program_type_id,
    formData?.schedules,
    formData?.is_existing_venue,
    formData?.newVenue,
    formData?.existingVenue,
    formData?.organization_id,
    formData?.state_id,
    formData?.city_id,
    formData?.center_id,
  ]);

  /**
   * This function is used to display success or error messages for each tab instantly when user change the form data
   * @param formData the form data
   */
  const handleValidateTabs = (formData: NewCourseFormFieldTypes) => {
    let validationFieldsStepWise = requiredValidationFields(
      formData,
      loginUserData,
      timeZoneData,
      selectedProgramTypeData
    );

    let tempTabsValidationStatus = tabsValidationStatus;

    // iterate each step and validate it with zod and set VALID or INVALID for each step
    //!important right now we will do this for only where tabs next button clicked
    validationFieldsStepWise.forEach((fields, index) => {
      if (tabsNextButtonClickStatus[index] === NEXT_BUTTON_CLICKED) {
        const newCourseZodSchema = validationSchema(iAmCoTeachingId as number);

        let modifiedFields: any = {};
        fields.forEach((field) => {
          modifiedFields[field] = true;
        });

        const results = newCourseZodSchema
          .pick(modifiedFields)
          .safeParse(formData);

        // now do VALID for current step because it was not throwing any error
        if (results.success === true) {
          tempTabsValidationStatus = tempTabsValidationStatus.map(
            (status, i) => {
              if (i === index) {
                return VALID;
              }
              return status;
            }
          );
        } else {
          tempTabsValidationStatus = tempTabsValidationStatus.map(
            (status, i) => {
              if (i === index) {
                return INVALID;
              }
              return status;
            }
          );
        }
      }
    });

    setTabsValidationStatus(tempTabsValidationStatus);
  };

  /*
   * @constant errors
   * @description this constant stores the error messages of the form data
   */
  const { errors } = useFormState();

  return (
    <div>
      <div className="flex gap-20 items-center">
        <p className="font-semibold text-2xl">
          {IsCopyCourse(pathname) ? t("Copy") : t("new_strings:new")}{" "}
          {t("new_strings:course")}
        </p>

        {/* REQUIRMENT : If the fields in the fee step  are not filled or the fees are not present then we need to show this error message */}
        {errors?.program_fee_level_settings && (
          <div className="flex gap-2">
            <Error />
            <p className="font-semibold text-[red] text-l -mt-1">
              There is no price set for current settings. Select course type and
              city/center.
            </p>
          </div>
        )}
      </div>
      <div className="bg-[white] mt-4 shadow-2xl rounded-[24px]">
        <Tabs value={JSON.stringify(currentStep)}>
          <div className="flex flex-row overflow-x-hidden">
            <TabsList className="h-[517px] bg-[#7677F41B] min-w-[238px] rounded-l-[24px] shadow-md py-10">
              <div className="flex flex-col  h-full gap-4 ">
                {stepTitles.map((tab, index) => {
                  return (
                    <TabsTrigger
                      key={index}
                      value={JSON.stringify(tab.value)}
                      className="!h-12  items-center text-base w-[230px] text-[#999999] !font-normal data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      onClick={async () => {
                        let validationFieldsStepWise = requiredValidationFields(
                          formData,
                          loginUserData,
                          timeZoneData?.data,
                          selectedProgramTypeData
                        );

                        await handleClickTab(
                          validationFieldsStepWise[currentStep - 1],
                          tab
                        );
                      }}
                    >
                      {currentStep === tab.value && (
                        <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-3"></div>
                      )}
                      <div
                        className={`flex flex-row gap-[10px] ml-[14px] items-center `}
                      >
                        {tabsNextButtonClickStatus[index] ===
                        NEXT_BUTTON_NOT_CLICKED ? (
                          tab.icon(
                            currentStep - 1 === index ? "#7677F4" : "#999999"
                          )
                        ) : tabsValidationStatus[index] === VALID ? (
                          <Success />
                        ) : (
                          <Error />
                        )}

                        <span
                          className={
                            currentStep - 1 === index ||
                            tabsNextButtonClickStatus[index] ===
                              NEXT_BUTTON_CLICKED
                              ? "text-[#7677F4] font-semibold"
                              : "text-[#999999]"
                          }
                        >
                          {tab.label}
                        </span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </div>
            </TabsList>

            <div className="bg-[white] w-full rounded-[24px] p-6 overflow-auto h-[517px] flex flex-col justify-between">
              <div>
                {stepTitles?.map((step, index) => {
                  if (index + 1 === currentStep)
                    return (
                      <TabsContent
                        value={JSON.stringify(index + 1)}
                        className={contentStylings}
                        key={index}
                      >
                        {step.component}
                      </TabsContent>
                    );
                  else {
                    return <></>;
                  }
                })}
              </div>
              <div className="flex justify-center gap-4 w-full mb-2 mt-6">
                {currentStep > 1 && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickPrevious();
                    }}
                    className="border border-[#7677F4] bg-[white] w-[118px] h-[46px] text-[16px] leading-[22px] text-[#7677F4] font-bold rounded-[12px]"
                  >
                    {t("previous_button")}
                  </Button>
                )}

                {currentStep < stepTitles.length && (
                  <Button
                    className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] font-bold text-[16px] leading-[22px]"
                    onClick={async (e) => {
                      e.preventDefault();

                      let validationFieldsStepWise = requiredValidationFields(
                        formData,
                        loginUserData,
                        timeZoneData?.data,
                        selectedProgramTypeData
                      );

                      await handleClickNext(
                        validationFieldsStepWise[currentStep - 1]
                      );
                    }}
                  >
                    {t("next")}
                  </Button>
                )}

                {currentStep == CONTACT_INFO_STEP_NUMBER && (
                  <Button
                    className="bg-[#7677F4] w-[165px] h-[46px] rounded-[12px] text-base font-bold"
                    onClick={async () => {
                      let validationFieldsStepWise = requiredValidationFields(
                        formData,
                        loginUserData,
                        timeZoneData?.data,
                        selectedProgramTypeData
                      );

                      await handleClickReviewDetailsButton(
                        validationFieldsStepWise[currentStep - 1]
                      );
                    }}
                  >
                    {t("course.new_course:contact_info_tab.review_details")}
                  </Button>
                )}
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
    "common",
    "course.new_course",
    "new_strings",
    "course.participants",
    "course.view_course",
    "course.find_course",
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

/**
 * @function fetchCourseFee is used to fetch course-fee based on user input
 * @param formData is parameter where entire object is stored
 * @param countryCode countryCode of logged in user
 * @returns program fee setting record
 */
export const fetchCourseFee = async ({
  formData,
  countryCode,
}: {
  formData: NewCourseFormFieldTypes;
  countryCode: string;
}) => {
  const supabase = supabaseClient();
  //Need to fetch program_types data when program_type_id is present
  if (formData?.program_type_id) {
    const programTypeData = await supabase
      .from("program_types")
      .select("*")
      .eq("id", formData?.program_type_id)
      .single();

    let stateId: number = -1,
      cityId: number = -1,
      centerId: number = -1;

    //Finding the state_id ,city_id and center_id where course is going on
    if (programTypeData?.data?.is_online_program) {
      stateId = formData?.state_id as number;
      cityId = formData?.city_id as number;
      centerId = formData?.center_id as number;
    } else {
      if (formData.is_existing_venue == "new-venue") {
        stateId = formData?.newVenue?.state_id as number;
        cityId = formData?.newVenue?.city_id as number;
        centerId = formData?.newVenue?.center_id as number;
      } else if (formData?.is_existing_venue == "existing-venue") {
        stateId = formData?.existingVenue?.state_id as number;
        cityId = formData?.existingVenue?.city_id as number;
        centerId = formData?.existingVenue?.center_id as number;
      }
    }

    let sortedSchedules;
    if (formData?.schedules) {
      //sorting the schedules
      sortedSchedules = formData?.schedules.sort((a: any, b: any) => {
        let aDate = new Date(a.date);
        aDate.setHours(a?.startHour, a?.startMinute);

        let bDate = new Date(b.date);
        bDate.setHours(b?.startHour, b?.startMinute);

        return aDate.getTime() - bDate.getTime();
      }) as any[];
    }
    //Finding course start date from new Date object
    let utcYear = sortedSchedules?.[0]?.date["getFullYear"]();
    let utcMonth = (sortedSchedules?.[0]?.date["getMonth"]() + 1)
      .toString()
      .padStart(2, "0");
    let utcDay = sortedSchedules?.[0]?.date["getDate"]()
      .toString()
      .padStart(2, "0");

    //Construct the course start date time stamp
    const courseStartDate = `${utcYear}-${utcMonth}-${utcDay}T00:00:00.000Z`;

    const courseFeeBody: CourseFeeBody = {
      program_type_id: formData?.program_type_id as number,
    };

    if (stateId) {
      courseFeeBody.state_id = stateId;
    } else {
      courseFeeBody.state_id = -1;
    }

    if (cityId) {
      courseFeeBody.city_id = cityId;
    } else {
      courseFeeBody.city_id = -1;
    }

    if (centerId) {
      courseFeeBody.center_id = centerId;
    } else {
      courseFeeBody.center_id = -1;
    }

    if (courseStartDate) {
      courseFeeBody.start_date = courseStartDate;
    }

    console.log(courseFeeBody, "Body Send to course-fee Edge function");
    //Sending all required params
    const { data, error } = await supabase.functions.invoke("course-fee", {
      method: "POST",
      body: courseFeeBody,
      headers: {
        //Sending the country code for schema switching
        "country-code": countryCode,
      },
    });

    if (error)
      console.log("error while fetching course fee level settings", error);

    console.log("Data returned from Edge Function", data);

    return data;
  }
};

interface CourseFeeBody {
  program_type_id: number;
  state_id?: number;
  city_id?: number;
  center_id?: number;
  start_date?: string;
}
{
  /**
This function will check the any modifications in the form before leaving the page. if any changes are there then it alert the user
*/
}
export const handleRouteChangeStart = (
  url: string,
  router: NextRouter,
  pathname: string,
  condition?: boolean
) => {
  // check is there any data entered or not and check is it in newCourse or copyCourse or editCourse.
  if (
    !condition &&
    (IsNewCourse(pathname) || IsCopyCourse(pathname) || IsEditCourse(pathname))
  ) {
    // if the navigated url contain the query parameters then we don't need to alert the user.
    if((url.split('?')[0]===url)){
      if (confirm("Do you want to leave this page? Unsaved changes may be lost.")) {
        console.log("ok go ahead")
        } 
        else {
            router.events.emit('routeChangeError');
            throw 'Route change aborted. User confirmation required.';
        }
    }
   
          
         
  }
};
