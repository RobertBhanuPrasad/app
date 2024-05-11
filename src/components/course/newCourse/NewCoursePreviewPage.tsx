import {
  useGetIdentity,
  useInvalidate,
  useList,
  useMany,
  useOne,
} from "@refinedev/core";
import { useEffect, useState } from "react";
import {
  COURSE_ACCOUNTING_STATUS,
  PAYMENT_MODE,
  PROGRAM_ORGANIZER_TYPE,
  TIME_FORMAT,
  VISIBILITY,
} from "src/constants/OptionLabels";
import {
  NATIONAL_ADMIN,
  NOT_SUBMITTED,
  SUPER_ADMIN,
} from "src/constants/OptionValueOrder";
import countryCodes from "src/data/CountryCodes";
import { CardLabel, CardValue } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { supabaseClient } from "src/utility";
import {
  formatDateString,
  subtractDaysAndFormat,
} from "src/utility/DateFunctions";
import {
  getOptionValueObjectById,
  getOptionValueObjectByOptionOrder,
} from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { EditModalDialog } from "./NewCoursePreviewPageEditModal";
import NewCourseStep1 from "./NewCourseStep1";
import NewCourseStep2 from "./NewCourseStep2";
import NewCourseStep3 from "./NewCourseStep3";
import NewCourseStep4 from "./NewCourseStep4";
import NewCourseStep5 from "./NewCourseStep5";
import NewCourseStep6 from "./NewCourseStep6";
import { handlePostProgramData } from "./NewCourseUtil";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "src/ui/alert-dialog";
import { useRouter } from "next/router";
import Tick from "@public/assets/Tick";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import { translatedText } from "src/common/translations";
import { IsEditCourse } from "./EditCourseUtil";
import useGetCountryCode from "src/utility/useGetCountryCode";
import useGetLanguageCode from "src/utility/useGetLanguageCode";

export default function NewCourseReviewPage() {
  const { t } = useTranslation([
    "common",
    "course.new_course",
    "course.view_course",
    "new_strings",
  ]);
  const supabase = supabaseClient();

  const { data: loginUserData }: any = useGetIdentity();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Checking weather login user is super admin or not
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  // Checking weather login user is National admin or not
  const hasNationalAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) =>
      val.role_id?.order == NATIONAL_ADMIN
  );
  const { newCourseData } = newCourseStore();

  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: newCourseData?.program_type_id,
  });

  let stateId: number = 0,
    cityId: number = 0,
    centerId: number = 0;

  //Finding the state_id ,city_id and center_id where course is going on
  if (programTypeData?.data?.is_online_program) {
    stateId = newCourseData?.state_id;
    cityId = newCourseData?.city_id;
    centerId = newCourseData?.center_id;
  } else {
    if (newCourseData?.is_existing_venue == "new-venue") {
      stateId = newCourseData?.newVenue?.state_id;
      cityId = newCourseData?.newVenue?.city_id;
      centerId = newCourseData?.newVenue?.center_id;
    } else if (newCourseData?.is_existing_venue == "existing-venue") {
      stateId = newCourseData?.existingVenue?.state_id;
      cityId = newCourseData?.existingVenue?.city_id;
      centerId = newCourseData?.existingVenue?.center_id;
    }
  }

  const { data: venueState } = useOne({
    resource: "state",
    id: stateId,
  });

  const StateNames = venueState?.data?.name;

  const { data: venueCity } = useOne({
    resource: "city",
    id: cityId,
  });

  const CityNames = venueCity?.data?.name;

  const { data: venueCenter } = useOne({
    resource: "center",
    id: centerId,
  });

  const CenterNames = venueCenter?.data?.name;

  const VenueName =
    newCourseData?.is_existing_venue == "existing-venue"
      ? newCourseData?.existingVenue?.name
      : newCourseData?.newVenue?.name;
  const VenueAddress =
    newCourseData?.is_existing_venue == "existing-venue"
      ? newCourseData?.existingVenue?.address
      : newCourseData?.newVenue?.address;
  const VenuePostalCode =
    newCourseData?.is_existing_venue == "existing-venue"
      ? newCourseData?.existingVenue?.postal_code
      : newCourseData?.newVenue?.postal_code;

  const VenueData = [
    VenueName?`${VenueName},`:``,
    VenueAddress?`${VenueAddress},`:``,
    `${CityNames},`,
    `${StateNames}`,
    VenuePostalCode?`,${VenuePostalCode}`:``,
  ]

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data }: any = useGetIdentity();

  const pathname = usePathname();

  const [courseFeeSettings, setCourseFeeSettings] = useState<any>();

  //fetching the user's country code
  const countryCode = useGetCountryCode();

  //fetching the user's language code
  const languageCode = useGetLanguageCode();

  //Finding course start date
  const courseStartDate = newCourseData?.schedules?.[0]?.date?.toISOString();

  const fetchFeeData = async () => {
    //Sending all required params
    const { data, error } = await supabase.functions.invoke("course-fee", {
      method: "POST",
      body: {
        state_id: stateId,
        city_id: cityId,
        center_id: centerId,
        start_date: courseStartDate,
        program_type_id: newCourseData?.program_type_id,
      },
      headers: {
        "country-code": countryCode,
      },
    });

    if (error)
      console.log("error while fetching course fee level settings data", error);
    setCourseFeeSettings(data);
  };

  useEffect(() => {
    fetchFeeData();
  }, []);

  const creator =
    newCourseData?.program_created_by &&
    getOptionValueObjectById(
      PROGRAM_ORGANIZER_TYPE,
      newCourseData?.program_created_by
    );

  const paymentMethod = getOptionValueObjectById(
    PAYMENT_MODE,
    newCourseData?.accommodation_fee_payment_mode
  );

  const timeFormat =
    newCourseData?.hour_format_id &&
    getOptionValueObjectById(TIME_FORMAT, newCourseData?.hour_format_id);

  const visibility =
    newCourseData?.visibility_id &&
    getOptionValueObjectById(VISIBILITY, newCourseData?.visibility_id);

  const { data: organizationName } = useOne({
    resource: "organizations",
    id: newCourseData?.organization_id,
  });

  const { data: ProgramOrganizer } = useMany({
    resource: "users",
    ids: newCourseData?.organizer_ids || [],
    meta: { select: "contact_id(full_name)" },
  });

  const programOrganizersNames = ProgramOrganizer?.data
    ?.map((user_id) => {
      if (user_id?.contact_id?.full_name) return user_id?.contact_id?.full_name;
    })
    .join(", ");

  const { data: CourseLanguages } = useMany({
    resource: "languages",
    ids: newCourseData?.language_ids || [],
    meta: { select: "language_name" },
  });

  const courselLanguageName = CourseLanguages?.data
    ?.map((language: any) => {
      if (language?.language_name) return language?.language_name;
    })
    .join(", ");

  const { data: CourseTranslation } = useMany({
    resource: "languages",
    ids: newCourseData?.translation_language_ids || [],
    meta: { select: "language_name" },
  });

  const languagesTranslations = CourseTranslation?.data
    ?.map((CourseTranslation: any) => {
      return CourseTranslation?.language_name;
    })
    .join(", ");

  const { data: CourseTeachers } = useMany({
    resource: "users",
    ids: newCourseData?.teacher_ids || [],
    meta: { select: "contact_id(full_name)" },
  });

  const CourseTeachersNames: any = CourseTeachers?.data
    ?.map((teacher_id) => {
      if (teacher_id?.contact_id?.full_name)
        return teacher_id?.contact_id?.full_name;
    })
    .join(", ");

  const { data: courseType } = useOne({
    resource: "program_types",
    id: newCourseData?.program_type_id,
  });

  const venueSessions = () => {
    let schedules = newCourseData?.schedules || [];

    // sort the schedules

    schedules = schedules.sort((a: any, b: any) => {
      let aDate = new Date(a.date);
      aDate.setHours(a?.startHour, a?.startMinute);

      let bDate = new Date(b.date);
      bDate.setHours(b?.startHour, b?.startMinute);

      return aDate.getTime() - bDate.getTime();
    });

    return (
      <div className="w-[291px]">
        <p className="text-sm font-normal text-accent-light text-[#999999]">
          {t("sessions")}
        </p>
        {newCourseData?.schedules?.map((data: any) => {
          const schedule = `${formatDateString(data.date)} | ${
            data?.startHour || "00"
          } : ${data?.startMinute || "00"}  ${
            data?.startTimeFormat ? data?.startTimeFormat : ""
          } to ${data?.endHour || "00"} : ${data?.endMinute || "00"}  ${
            data?.endTimeFormat ? data?.endTimeFormat : ""
          }`;

          return (
            <div>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={schedule}
              >
                {schedule}
              </abbr>
            </div>
          );
        })}
      </div>
    );
  };

  const allowedCountries = newCourseData?.allowed_countries
    ?.map((countryCode: string) => {
      return countryCodes[countryCode];
    })
    .join(", ");

  const { data: timeZone } = useOne({
    resource: "time_zones",
    id: newCourseData?.time_zone_id,
  });

  const user_roles: any[] = data?.userData?.user_roles || [];

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
    courseFeeSettings?.[0]?.is_program_fee_editable
      ? true
      : false;

  //Exacting default Fee Levels from settings.In this Data we will have entire object in fee_level_id but we need only fee_level_id.
  const defaultFeeLevels =
    courseFeeSettings?.[0]?.program_fee_level_settings?.map((feeLevel: any) => {
      return {
        ...feeLevel,
        fee_level_id: feeLevel?.fee_level_id?.id,
      };
    });

  //If fee Levels is editable then need to show edited fee i.e; fee entered by user (form data) else we need to show fee levels coming from settings.
  const feeLevels = isFeeEditable
    ? newCourseData?.program_fee_level_settings?.map((feeLevel: { fee_level_id: any; })=>{
      const defaultFeeLevel=defaultFeeLevels?.find((defaultFee: { fee_level_id: any; })=>defaultFee.fee_level_id==feeLevel?.fee_level_id)
      //If is_custom_fee is true then need to show custom label. So appending is_custom_fee and custom_fee_label to existing formData
      return {is_custom_fee:defaultFeeLevel?.is_custom_fee,custom_fee_label:defaultFeeLevel?.custom_fee_label,...feeLevel}
    })
    : defaultFeeLevels;

  //Requirement: Need to show only enabled fee levels.
  const enabledFeeLevelData = feeLevels?.filter(
    (feeLevel: { is_enable: boolean }) => feeLevel.is_enable === true
  );

  const [openBasicDetails, setOpenBasicDetails] = useState(false);
  const [openCourseDetails, setOpenCourseDetails] = useState(false);
  const [openVenueDetails, setOpenVenueDetails] = useState(false);
  const [openAccomidationDetails, setOpenAccomidationDetails] = useState(false);
  const [openContactDetails, setOpenContactDetails] = useState(false);
  const [openFeesDetails, setOpenFeesDetails] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const [onEditSuccess, setOnEditSuccess] = useState(false);

  const { setProgramId, setViewPreviewPage, setViewThankyouPage } =
    newCourseStore();

  /**
   * invalidate is used to access the mutate function of useInvalidate() and useInvalidate() is a hook that can be used to invalidate the state of a particular resource
   */
  const invalidate = useInvalidate();

  /**
   * The variable holds the course accounting status not submitted id
   */
  const accountingNotSubmittedStatusId =
    getOptionValueObjectByOptionOrder(COURSE_ACCOUNTING_STATUS, NOT_SUBMITTED)
      ?.id ?? 0;

  const handClickContinue = async () => {
    setIsSubmitting(true);

    /**
     * This variable will retur true if all api calls has been successfully it will return false if any api call fails
     */
    const isPosted = await handlePostProgramData(
      newCourseData,
      data?.userData?.id,
      setProgramId,
      accountingNotSubmittedStatusId,
      pathname,
      countryCode,
      languageCode
    );

    // we are checking the course is edit or user created new course
    const isEdited = IsEditCourse(pathname);

    // we have to display thank you page or success modal pop up only when the posting done successfully without any error
    if (isPosted) {
      if (isEdited) {
        setOnEditSuccess(true);
      } else {
        // invalidating the program list because we are doing edit course and when we save ,  we will be navigating the course listing page which contains list of programs
        await invalidate({
          resource: "program",
          invalidates: ["list"],
        });
        // i need to set params with section=thank_you
        const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
        current.set("section", "thank_you");

        const params = current.toString();

        router.replace(`${pathname}?${params}`);

        setViewPreviewPage(false);
        setViewThankyouPage(true);
      }
    }
    setIsSubmitting(false);
  };

  /**
   * @constant countryConfigData
   * @description this constant stores the country config data based on the organization
   * REQUIRMENT we need to show the current currency code befor the ammount in the accommodation details
   * we will get the currency code in the country config
   *
   */
  const { data: countryConfigData } = useList({
    resource: "country_config",
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: newCourseData?.organization_id,
      },
    ],
  });
  return (
    <div className="pb-12">
      <div className="text-[24px] my-4 font-semibold ml-6">
        {t("new_strings:review_course_details")}
      </div>
      <section className="w-full text-base bg-white">
        <EditCourseSuccessfullyInfo
          onEditSuccess={onEditSuccess}
          setOnEditSuccess={setOnEditSuccess}
        />
      </section>
      <div className="w-full p-6 text-base bg-white shadow-sm max-h-fit rounded-3xl">
        {/* Basic Details */}
        <section className="w-full pb-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t("basic_details")}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of BasicDetails page */}
            <EditModalDialog
              title={t("basic_details")}
              content={<NewCourseStep1 />}
              onClose={() => setOpenBasicDetails(false)}
              open={openBasicDetails}
              openEdit={() => {
                setOpenBasicDetails(true);
                setClickedButton("Basic Details");
              }}
              onOpenChange={setOpenBasicDetails}
              currentStep={1}
            />{" "}
          </div>
          {/* body */}
          <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] mt-2">
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999] ">
                {t("course.new_course:review_post_details.creator")}
              </p>

              <abbr
                className="font-semibold no-underline  truncate block   text-accent-secondary text-[#666666]"
                title={translatedText(creator?.name)}
              >
                {creator?.name ? translatedText(creator?.name) : "-"}
              </abbr>
            </div>
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("organization")}
              </p>
              <abbr
                className="font-semibold no-underline truncate block text-accent-secondary text-[#666666]"
                title={organizationName?.data?.name}
              >
                {organizationName?.data?.name}
              </abbr>
            </div>
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("program_organizer")}
              </p>
              <abbr
                className="font-semibold no-underline truncate block text-accent-secondary text-[#666666]"
                title={programOrganizersNames}
              >
                {programOrganizersNames ? programOrganizersNames : "-"}
              </abbr>
            </div>
            {(hasSuperAdminRole || hasNationalAdminRole) && (
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("registration_via_3rd_party_gateway")}
                </p>
                <abbr
                  className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                  title={newCourseData?.is_registration_via_3rd_party}
                >
                  {newCourseData?.is_registration_via_3rd_party ? "Yes" : "No"}
                </abbr>
              </div>
            )}
            {newCourseData?.is_registration_via_3rd_party ? (
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("new_strings:registration_via_3rd_party_gateway_url")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={newCourseData?.registration_via_3rd_party_url}
                >
                  {newCourseData?.registration_via_3rd_party_url}
                </abbr>
              </div>
            ) : null}
          </div>
        </section>
        {/* Course Details */}
        <section className="w-full py-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center  ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t("course.new_course:review_post_details.course_details")}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of CourseDetails page */}
            <EditModalDialog
              title={t("course.new_course:review_post_details.course_details")}
              content={<NewCourseStep2 />}
              onClose={() => setOpenCourseDetails(false)}
              open={openCourseDetails}
              openEdit={() => {
                setOpenCourseDetails(true);
                setClickedButton("Course Details");
              }}
              onOpenChange={setOpenCourseDetails}
              currentStep={2}
            />{" "}
          </div>
          {/* body */}
          <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] mt-4">
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("course_type")}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={
                  courseType?.data?.name
                    ? translatedText(courseType?.data?.name)
                    : "-"
                }
              >
                {courseType?.data?.name
                  ? translatedText(courseType?.data?.name)
                  : "-"}
              </abbr>
            </div>
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t("new_strings:teacher")}
              </p>
              <abbr
                title={CourseTeachersNames ? CourseTeachersNames : "-"}
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
              >
                {CourseTeachersNames ? CourseTeachersNames : "-"}
              </abbr>
            </div>
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("language_course_is_taught_in")}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={courselLanguageName}
              >
                {courselLanguageName ? courselLanguageName : "-"}
              </abbr>
            </div>
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("available_languages_for_translation")}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={languagesTranslations}
              >
                {languagesTranslations ? languagesTranslations : "-"}
              </abbr>
            </div>
            {hasSuperAdminRole && (
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t(
                    "course.new_course:course_details_tab.display_language_option"
                  )}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={
                    newCourseData?.is_language_translation_for_participants
                  }
                >
                  {newCourseData?.is_language_translation_for_participants
                    ? "Yes"
                    : "No"}
                </abbr>
              </div>
            )}
            {hasSuperAdminRole && (
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t(
                    "course.new_course:course_details_tab.registration_mandatory"
                  )}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={newCourseData?.is_registration_required}
                >
                  {newCourseData?.is_registration_required ? "Yes" : "No"}
                </abbr>
              </div>
            )}
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("max_capacity")}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.max_capacity}
              >
                {newCourseData?.max_capacity
                  ? newCourseData?.max_capacity
                  : "-"}
              </abbr>
            </div>
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("program_visibility")}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={translatedText(visibility?.name)}
              >
                {visibility ? translatedText(visibility?.name) : "-"}
              </abbr>
            </div>
            {/* This should be shown when the logged in user has superadmin role and is_geo_restriction_applicable is set to true */}
            {hasSuperAdminRole &&
              newCourseData?.is_geo_restriction_applicable && (
                <div className="w-[291px]">
                  <p className="text-sm font-normal text-accent-light text-[#999999]">
                    {t("countries_from_where_registrations_are_allowed")}
                  </p>
                  <abbr
                    className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                    title={allowedCountries}
                  >
                    {allowedCountries ? allowedCountries : "-"}
                  </abbr>
                </div>
              )}
            {hasSuperAdminRole && (
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("is_geo_restriction")}
                </p>
                <abbr
                  className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                  title={newCourseData?.is_geo_restriction_applicable}
                >
                  {newCourseData?.is_geo_restriction_applicable ? "Yes" : "No"}
                </abbr>
              </div>
            )}
            {/* // TODO need to do when the form filed is clear */}
            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("course_description")}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={
                  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma"
                }
              >
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur ma
              </abbr>
            </div>
            {/* // TODO need to do when the form filed is clear */}

            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("course_notes")}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={
                  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma"
                }
              >
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur ma{" "}
              </abbr>
            </div>
            {/* // TODO need to do when the form filed is clear */}

            <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("email_notes")}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={
                  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma"
                }
              >
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur ma{" "}
              </abbr>
            </div>
          </div>
        </section>
        {/* Time and Venue */}
        <section className="w-full py-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center  ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t("time_and_venue")}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of VenueDetails page */}
            <EditModalDialog
              title="Venue Details"
              content={<NewCourseStep3 />}
              onClose={() => setOpenVenueDetails(false)}
              open={openVenueDetails}
              openEdit={() => {
                setOpenVenueDetails(true);
                setClickedButton("Venue Details");
              }}
              onOpenChange={setOpenVenueDetails}
              currentStep={3}
            />{" "}
          </div>
          {/* body */}
          {/* // TODO need to do when the form filed is clear */}
          {programTypeData?.data?.is_online_program === true ? (
            <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] mt-4">
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("course.new_course:time_and_venue_tab.online_meeting_url")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={newCourseData?.online_url}
                >
                  {newCourseData?.online_url}
                </abbr>
              </div>
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("course.new_course:time_and_venue_tab.province")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={StateNames ? StateNames : "-"}
                >
                  {StateNames ? StateNames : "-"}
                </abbr>
              </div>
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("city")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={CityNames ? CityNames : "-"}
                >
                  {CityNames ? CityNames : "-"}
                </abbr>
              </div>
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("course.view_course:course_accounting_form_tab.center")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={CenterNames ? CenterNames : "-"}
                >
                  {CenterNames ? CenterNames : "-"}
                </abbr>
              </div>
              <div>{venueSessions()}</div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] mt-4">
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("venue_address")}
                </p>
                <abbr
                  className="font-semibold break-all block no-underline text-accent-secondary text-[#666666]"
                  title={VenueData ? VenueData : "-"}
                >
                  {VenueData ? VenueData : "-"}
                </abbr>
              </div>
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("course.new_course:review_post_details.time_formate")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={timeFormat?.value}
                >
                  {timeFormat?.value
                    ? timeFormat?.value.split(" ")[0] +
                      " " +
                      timeFormat?.value.split(" ")[1] +
                      "s"
                    : "-"}
                </abbr>
              </div>
              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("course.new_course:review_post_details.time_zone")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={`${timeZone?.data?.name} - ${timeZone?.data?.utc_off_set}`}
                >
                  {timeZone?.data?.name} - {timeZone?.data?.utc_off_set}
                </abbr>
              </div>
              <div>{venueSessions()}</div>
            </div>
          )}
        </section>
        {/* Fees Information */}
        {/* // TODO need to do when the form filed is clear */}
        <section className="w-full py-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center  ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t("new_strings:fees_information")}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of FeesDetails page */}
            <EditModalDialog
              title="Fees Details"
              content={<NewCourseStep4 />}
              onClose={() => setOpenFeesDetails(false)}
              open={openFeesDetails}
              openEdit={() => {
                setOpenFeesDetails(true);
                setClickedButton("Venue Details");
              }}
              onOpenChange={setOpenFeesDetails}
              currentStep={4}
            />{" "}
          </div>
          {/* body */}
          <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] mt-4">
            {enabledFeeLevelData?.map((feeLevel: any, index: number) => {
              return <Fees feeLevelSettingsData={feeLevel} />;
            })}

            {newCourseData?.is_early_bird_enabled &&
              enabledFeeLevelData?.map((feeLevel: any, index: number) => {
                return <EarlyBirdFees feeLevelSettingsData={feeLevel} />;
              })}

            {/* Requirment: Show the early bird calender when 
      1.Super or National Admin is logged in 
      2.Early bird fee enabled in settings
      3.Early bird fee enabled by user
      4.Early bird cut off editable in settings */}
            {isFeeEditable &&
              newCourseData?.is_early_bird_enabled &&
              courseFeeSettings?.[0]?.is_early_bird_fee_enabled &&
              courseFeeSettings?.[0]?.is_early_bird_cut_off_editable && (
                <div className="w-[291px]">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                    {t("new_strings:Early_bird_cutoff_period")}
                  </p>
                  <p className="font-semibold truncate no-underline text-accent-secondary text-[#666666]">
                    {subtractDaysAndFormat(
                      newCourseData?.early_bird_cut_off_period,
                      newCourseData?.schedules?.[0]?.date
                    )}{" "}
                    ({newCourseData?.early_bird_cut_off_period} Days)
                  </p>
                </div>
              )}

            {/* <div className="w-[291px]">
              <p className="text-sm font-normal text-accent-light text-[#999999] ">
                {t("course.new_course:fees_tab.disable")}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={t("yes")}
              >
                {t("yes")}
              </abbr>
            </div> */}
          </div>
        </section>
        {/* Accommodation Information */}
        <section className="w-full py-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t("new_strings:accommodation_information")}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of AccomidationDetails page */}
            <EditModalDialog
              title="Accomidation Details"
              content={<NewCourseStep5 />}
              onClose={() => setOpenAccomidationDetails(false)}
              open={openAccomidationDetails}
              openEdit={() => {
                setOpenAccomidationDetails(true);
                setClickedButton("Accomidation Details");
              }}
              onOpenChange={setOpenAccomidationDetails}
              currentStep={5}
            />{" "}
          </div>
          {newCourseData?.is_residential_program && (
            <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] mt-4">
              {newCourseData?.accommodation?.map((data: any) => {
                return (
                  <Accommodation
                    accomdationData={data}
                    currencyCode={
                      countryConfigData?.data?.[0]?.default_currency_code
                    }
                  />
                );
              })}

              <div className="w-[291px]">
                <p className="text-sm font-normal text-accent-light text-[#999999] ">
                  {t("course.new_course:accommodation_tab.accommodation_fee")}
                </p>
                <abbr
                  className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                  title={translatedText(paymentMethod?.name)}
                >
                  {translatedText(paymentMethod?.name)}
                </abbr>
              </div>
            </div>
          )}
        </section>
        {/* Contact Info */}
        <section className="w-full py-8 text-base ">
          {/* title section */}
          <div className="flex items-center  ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t("new_strings:contact_info")}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of ContactDetails page */}
            <EditModalDialog
              title="Contact Details"
              content={<NewCourseStep6 />}
              onClose={() => setOpenContactDetails(false)}
              open={openContactDetails}
              openEdit={() => {
                setOpenContactDetails(true);
                setClickedButton("Contact Details");
              }}
              onOpenChange={setOpenContactDetails}
              currentStep={6}
            />{" "}
          </div>
          {/* body */}
          {newCourseData?.contact?.map((data: any) => {
            return (
              <div className="flex flex-wrap gap-x-[50px] gap-y-[24px] pb-4 mt-2 ">
                <div className="w-[291px]">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                    {t("contact_email")}
                  </p>
                  <abbr
                    className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                    title={data?.contact_email}
                  >
                    {data?.contact_email ? data?.contact_email : "-"}
                  </abbr>
                </div>
                <div className="w-[291px]">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                    {t("course.new_course:contact_info_tab.contact_number")}
                  </p>
                  <abbr
                    className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                    title={data?.contact_number}
                  >
                    {data?.contact_number ? data?.contact_number : "-"}
                  </abbr>
                </div>
                <div className="w-[291px]">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                    {t("contact_name")}
                  </p>
                  <abbr
                    className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                    title={data?.contact_name}
                  >
                    {data?.contact_name ? data?.contact_name : "-"}
                  </abbr>
                </div>
              </div>
            );
          })}

          <div className="w-[291px] mt-4">
            <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t("new_strings:bcc_registration_confirmation_email")}
            </p>
            <div className="truncate">
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.bcc_registration_confirmation_email}
              >
                {newCourseData?.bcc_registration_confirmation_email
                  ? newCourseData?.bcc_registration_confirmation_email
                  : "-"}
              </abbr>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center">
          {isSubmitting ? (
            <Button className="bg-[white] border-[1px] border-[#7677F4] h-[46px] w-[100px] border-solid">
              <div className="loader !w-[30px]"></div>
            </Button>
          ) : (
            <Button onClick={handClickContinue}>{t("continue_button")}</Button>
          )}
        </div>
      </div> 
    </div>
  );
}

/**
 * @function Accommodation
 * REQUIRMENT we need to show the both name and the fee of the accommodation name
 * @description this function is used to display both the accommodation type name and the fee which we have already gave in the creation of the course
 * @param accomdationData
 * @returns
 */

const Accommodation = ({
  accomdationData,
  currencyCode,
}: {
  accomdationData: { accommodation_type_id: number; fee_per_person: number };
  currencyCode: string;
}) => {
  /**
   * @constant data
   * REQUIRMENT we need to show the both name and the fee of the accommodation name
   * we have the accommodation type id and we need the name of the type
   * For that we are doing appi call for the accomdation_types table and we are getting the data in that data we have the accommodation type name
   * @description this data const is used to store the accommodation type api data with respective to the accommodation type id
   *
   */
  const { data } = useOne({
    resource: "accomdation_types",
    id: accomdationData?.accommodation_type_id,
  });

  return (
    <div className="w-[291px]">
      <abbr title={translatedText(data?.data?.name)} className="no-underline">
        <CardLabel className="truncate">
          {translatedText(data?.data?.name)}
        </CardLabel>
      </abbr>
      <abbr
        // If currencyCode undefined and the currencyCode is not present then we will display empty string else there will be chance of displaying the undefined
        // we need to display the currency code when the code is present for the organization
        title={`${currencyCode ? currencyCode : ""} ${
          accomdationData?.fee_per_person
        }`}
        className="no-underline"
      >
        <CardValue className="truncate">
          {/* If currencyCode undefined and the currencyCode is not present then we will display empty string else there will be chance of displaying the undefined */}
          {currencyCode ? currencyCode : ""}
          {accomdationData?.fee_per_person}
        </CardValue>
      </abbr>
    </div>
  );
};

/**
 * @function Fees
 * REQUIRMENT we need to show the both fee level type and total of the fee level
 * @param feeLevelSettingsData
 * @returns
 */
const Fees = ({
  feeLevelSettingsData,
}: {
  feeLevelSettingsData: ProgramFeeLevelSettingsDataBaseType;
}) => {

  /**
   * @constant countryConfigData
   * @description this constant stores the country config data based on the organization
   * REQUIRMENT we need to show the current currency code befor the ammount in the fee details
   * we will get the currency code in the country config
   *
   */
  const { data: countryConfigData } = useList({
    resource: "country_config",
  });
  
  //If custom fee is enabled Need to show custom label.
  if(feeLevelSettingsData?.is_custom_fee==true){
    return (
      <div className="w-[291px]">
        <abbr title={translatedText(feeLevelSettingsData?.custom_fee_label as Object)} className="no-underline">
          <CardLabel className="truncate">{translatedText(feeLevelSettingsData?.custom_fee_label as Object)}</CardLabel>
        </abbr>
        <abbr
          title={JSON.stringify(feeLevelSettingsData?.total)}
          className="no-underline"
        >
          <CardValue className="truncate">
            {countryConfigData?.data?.[0]?.default_currency_code}{" "}
            {feeLevelSettingsData?.total}
          </CardValue>
        </abbr>
      </div>
    ); 
  }

   /**
   * @constant feeLevelData
   * REQUIRMENT we need to show the both fee level type and total of the fee level
   * we have the fee_level_id and we need the fee level type
   * For that we are doing appi call for the option_values table and we are getting the data in that data we have the fee level type
   * @description this data const is used to store the fee level type data with respective to the fee level type id
   *
   */
   const { data: feeLevelData } = useOne({
    resource: "option_values",
    id: feeLevelSettingsData?.fee_level_id as number,
  });

  //If custom label is false then show only fee_level label.
  return (
    <div className="w-[291px]">
      <abbr
        title={translatedText(feeLevelData?.data?.name)}
        className="no-underline"
      >
        <CardLabel className="truncate">
          {translatedText(feeLevelData?.data?.name)}
        </CardLabel>
      </abbr>
      <abbr
        title={JSON.stringify(feeLevelSettingsData?.total)}
        className="no-underline"
      >
        <CardValue className="truncate">
          {countryConfigData?.data?.[0]?.default_currency_code}{" "}
          {(feeLevelSettingsData?.total)}
        </CardValue>
      </abbr>
    </div>
  );
};

/**
 * @function EarlyBirdFees
 * REQUIRMENT we need to show the both fee level type and early bird total of the fee level
 * @param feeLevelSettingsData
 * @returns
 */
const EarlyBirdFees = ({
  feeLevelSettingsData,
}: {
  feeLevelSettingsData: ProgramFeeLevelSettingsDataBaseType;
}) => {

  /**
   * @constant countryConfigData
   * @description this constant stores the country config data based on the organization
   * REQUIRMENT we need to show the current currency code befor the ammount in the fee details
   * we will get the currency code in the country config
   *
   */

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });


  //If custom fee is enabled Need to show custom label.
  if(feeLevelSettingsData?.is_custom_fee==true){
    return (
      <div className="w-[291px]">
      {/* We have the same fee level types for normal fee and the early bird fee, for differentiating we keep the Early Bird for the Early Bird fees  */}
      <abbr
        title={`Early Bird ${translatedText(feeLevelSettingsData?.custom_fee_label as object)}`}
        className="no-underline"
      >
        <CardLabel className="truncate">
          Early Bird {translatedText(feeLevelSettingsData?.custom_fee_label as object)}
        </CardLabel>
      </abbr>
      <abbr
        title={JSON.stringify(feeLevelSettingsData?.early_bird_total)}
        className="no-underline"
      >
        <CardValue className="truncate">
          {countryConfigData?.data?.[0]?.default_currency_code}{" "}
          {feeLevelSettingsData?.early_bird_total}
        </CardValue>
      </abbr>
    </div>
    ); 
  }


   /**
   * @constant feeLevelData
   * REQUIRMENT we need to show the both fee level type and early bird total of the fee level
   * we have the fee_level_id and we need the fee level type
   * For that we are doing appi call for the option_values table and we are getting the data in that data we have the fee level type
   * @description this data const is used to store the fee level type data with respective to the fee level type id
   *
   */
   const { data: feeLevelData } = useOne({
    resource: "option_values",
    id: feeLevelSettingsData?.fee_level_id as number,
  });
  const { t } = useTranslation("new_strings");
  //If custom fee is false show fee level label.
  return (
    <div className="w-[291px]">
      {/* We have the same fee level types for normal fee and the early bird fee, for differentiating we keep the Early Bird for the Early Bird fees  */}
      <abbr
        title={`Early Bird ${translatedText(feeLevelData?.data?.name)}`}
        className="no-underline"
      >
        <CardLabel className="truncate">
          {t("new_strings:early_bird")}{" "}
          {translatedText(feeLevelData?.data?.name)}
        </CardLabel>
      </abbr>
      <abbr
        title={JSON.stringify(feeLevelSettingsData?.early_bird_total)}
        className="no-underline"
      >
        <CardValue className="truncate">
          {countryConfigData?.data?.[0]?.default_currency_code}{" "}
          {(feeLevelSettingsData?.early_bird_total)}
        </CardValue>
      </abbr>
    </div>
  );
};

// to show the success alert component while editing of course completed

export const EditCourseSuccessfullyInfo = ({
  onEditSuccess,
  setOnEditSuccess,
}: any) => {
  const [onButtonLoading, setOnButtonLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    const courseId = router.query.id; // Get the courseId from the router query
    setOnButtonLoading(true);
    // Construct the URL string with the courseId
    const courseUrl = `/courses/${courseId}`;
    router
      .push(courseUrl)
      .then(() => {
        setOnButtonLoading(false);
        setOnEditSuccess(false);
      })
      .catch((e: any) => {
        console.log(e, "error while routing");
      });
  };
  const { t } = useTranslation("new_strings");

  return (
    <AlertDialog open={onEditSuccess}>
      <AlertDialogContent className="flex flex-col items-center justify-center h-[309px] w-[414px] !rounded-[24px] !gap-[34px] !p-[24px]">
        <AlertDialogHeader>
          <div className="flex justify-center cursor-pointer">
            <Tick />
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="flex flex-col !w-[366px] !h-[71px] !gap-4 text-[#333333] items-center text-center">
          <h2 className="pt-[16px] text-[24px] font-semibold">
            {t("successfully_updated")}
          </h2>
          <p className="text-[16px] font-normal">
            {t("your_changes_have_been_saved_successfully")}
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <div className="w-full flex justify-center items-center gap-5">
            <Button
              type="button"
              className={`${onButtonLoading ? 'bg-[#fff] border-[1px] rounded-[12px] border-solid border-[#7677F4] w-[210px] h-[46px]' : 'bg-blue-500 rounded-[12px] text-white text-[16px] p-[12px 24px] w-[210px] h-[46px]'}`}
              onClick={handleClick}
            >
              {onButtonLoading ? 
              <div className="loader !w-[30px]"></div>
               : t("go_to_course_details")}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
