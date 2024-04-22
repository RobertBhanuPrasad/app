import LoadingIcon from "@public/assets/LoadingIcon";
import { useGetIdentity, useMany, useOne } from "@refinedev/core";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
  PAYMENT_MODE,
  PROGRAM_ORGANIZER_TYPE,
  TIME_FORMAT,
  VISIBILITY,
} from "src/constants/OptionLabels";
import countryCodes from "src/data/CountryCodes";
import { Button } from "src/ui/button";
import { supabaseClient } from "src/utility";
import {
  formatDateString,
  subtractDaysAndFormat,
} from "src/utility/DateFunctions";
import { getOptionValueObjectById } from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { EditModalDialog } from "./NewCoursePreviewPageEditModal";
import NewCourseStep1 from "./NewCourseStep1";
import NewCourseStep2 from "./NewCourseStep2";
import NewCourseStep3 from "./NewCourseStep3";
import NewCourseStep4 from "./NewCourseStep4";
import NewCourseStep5 from "./NewCourseStep5";
import NewCourseStep6 from "./NewCourseStep6";
import { handlePostProgramData } from "./NewCourseUtil";
import { useTranslation } from 'next-i18next';
export default function NewCourseReviewPage() {
  const { newCourseData, setViewPreviewPage, setViewThankyouPage } =
    newCourseStore();

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data }: any = useGetIdentity();

  const [courseFeeSettings, setCourseFeeSettings] = useState<any>();

  //Finding course start date
  const courseStartDate = newCourseData?.schedules?.[0]?.date?.toISOString();

  const fetchFeeData = async () => {
    //Sending all required params
    const { data, error } = await supabaseClient.functions.invoke(
      "course-fee",
      {
        method: "POST",
        body: {
          state_id: stateId,
          city_id: cityId,
          center_id: centerId,
          start_date: courseStartDate,
          program_type_id: newCourseData?.program_type_id,
        },
      }
    );

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
    id: newCourseData?._id,
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

  const { data: CourseAccomidation } = useMany({
    resource: "accomdation_types",
    ids: _.map(newCourseData?.accommodation, "accommodation_type_id") || [],
  });

  const courseAccomodationNames = CourseAccomidation?.data?.map(
    (accomdation: any) => {
      if (accomdation?.name) return accomdation?.name;
    }
  );

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

  const CourseTeachersNames = CourseTeachers?.data?.map((teacher_id) => {
    if (teacher_id?.contact_id?.full_name)
      return teacher_id?.contact_id?.full_name;
  });

  const { data: courseType } = useOne({
    resource: "program_types",
    id: newCourseData?.program_type_id,
  });

  const venueSessions = () => {

    return (
      <div className=" min-w-72 ">
        <p className="text-sm font-normal text-accent-light text-[#999999]">
          {t('sessions')}
        </p>
        {newCourseData?.schedules?.map((data: any) => {
          const schedule = `${formatDateString(data.date)} | ${
            data?.startHour || "00"
          } : ${data?.startMinute || "00"}  ${
            data?.startTimeFormat && data?.startTimeFormat
          } to ${data?.endHour || "00"} : ${data?.endMinute || "00"}  ${
            data?.endTimeFormat && data?.endTimeFormat
          }`;
          return (
            <abbr
              className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
              title={schedule}
            >
              {schedule}
            </abbr>
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

  const { data: feeLevelData } = useMany({
    resource: "option_values",
    ids: _.map(newCourseData?.program_fee_level_settings, "fee_level_id"),
  });

  const [openBasicDetails, setOpenBasicDetails] = useState(false);
  const [openCourseDetails, setOpenCourseDetails] = useState(false);
  const [openVenueDetails, setOpenVenueDetails] = useState(false);
  const [openAccomidationDetails, setOpenAccomidationDetails] = useState(false);
  const [openContactDetails, setOpenContactDetails] = useState(false);
  const [openFeesDetails, setOpenFeesDetails] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const { setProgramId } = newCourseStore();

  const handClickContinue = async () => {
    setIsSubmitting(true);

    /**
     * This variable will retur true if all api calls has been successfully it will return false if any api call fails
     */
    const isPosted = await handlePostProgramData(
      newCourseData,
      data?.userData?.id,
      setProgramId
    );

    if (isPosted) {
      setViewPreviewPage(false);
      setViewThankyouPage(true);
    } else {
      setIsSubmitting(false);
    }
  };
  const { t } = useTranslation( [ "common", 'course.new_course', "new_strings"]);

  return (
    
    <div className="pb-12">
      <div className="text-[24px] my-4 font-semibold">
      {t("new_strings:review_your_details_right_here")}
      </div>
      <div className="w-full p-6 text-base bg-white shadow-sm max-h-fit rounded-3xl">
        {/* Basic Details */}
        <section className="w-full pb-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center">
            <p className="font-semibold text-accent-primary text-[#333333]">
              {t('basic_details')}
            </p>
            {/* Here we are calling EditModalDialog for passing the data of BasicDetails page */}
            <EditModalDialog
              title={t('basic_details')}
              content={<NewCourseStep1 />}
              onClose={() => setOpenBasicDetails(false)}
              open={openBasicDetails}
              openEdit={() => {
                setOpenBasicDetails(true);
                setClickedButton("Basic Details");
              }}
            />{" "}
          </div>
          {/* body */}
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className=" min-w-72 ">
              <p className="text-sm font-normal text-accent-light text-[#999999] ">
                {t("course.new_course:review_post_details.creator")}
              </p>

              <abbr
                className="font-semibold no-underline  truncate block   text-accent-secondary text-[#666666]"
                title={creator?.value}
              >
                {creator?.value ? creator?.value : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('organization')}
              </p>
              <abbr
                className="font-semibold no-underline truncate text-accent-secondary text-[#666666]"
                title={organizationName?.data?.name}
              >
                {organizationName?.data?.name}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('program_organizer')}
              </p>
              <abbr
                className="font-semibold no-underline truncate  text-accent-secondary text-[#666666]"
                title={programOrganizersNames}
              >
                {programOrganizersNames ? programOrganizersNames : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('registration_via_3rd_party_gateway')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.is_geo_restriction_applicable}
              >
                {newCourseData?.is_geo_restriction_applicable ? "Yes" : "No"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('registration_via_3rd_party_gateway')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.is_registration_via_3rd_party}
              >
                {newCourseData?.is_registration_via_3rd_party ? "Yes" : "No"}
              </abbr>
            </div>
            {newCourseData?.is_registration_via_3rd_party ? (
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("new_strings:registration_via")}
                </p>
                <abbr
                  className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
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
            />{" "}
          </div>
          {/* body */}
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={courseType?.data?.name}
              >
                {courseType?.data?.name ? courseType?.data?.name : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t("new_strings:teacher")}
              </p>
              <abbr className="font-semibold truncate no-underline text-accent-secondary text-[#666666]">
                {CourseTeachersNames ? CourseTeachersNames : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('language_course_is_taught_in')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={courselLanguageName}
              >
                {courselLanguageName ? courselLanguageName : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('available_languages_for_translation')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={languagesTranslations}
              >
                {languagesTranslations ? languagesTranslations : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('max_capacity')}
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
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('program_visibility')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={visibility?.value}
              >
                {visibility ? visibility?.value : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('countries_from_where_registrations_are_allowed')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={allowedCountries}
              >
                {allowedCountries ? allowedCountries : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
              {t('is_geo_restriction')}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.is_geo_restriction_applicable}
              >
                {newCourseData?.is_geo_restriction_applicable ? "Yes" : "No"}
              </abbr>
            </div>
            {/* // TODO need to do when the form filed is clear */}
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('course_description')}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={
                  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma"
                }
              >
            {t("new_strings:nemo_enim_ipsam_voluptatem_quia")}
              </abbr>
            </div>
            {/* // TODO need to do when the form filed is clear */}

            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('course_notes')}
              </p>
              <abbr
                className="font-semibold truncate block no-underline text-accent-secondary text-[#666666]"
                title={
                  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma"
                }
              >
              {t("new_strings:nemo_enim_ipsam_voluptatem_quia")}{" "}
              </abbr>
            </div>
            {/* // TODO need to do when the form filed is clear */}

            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('email_notes')}
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
              {t('time_and_venue')}
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
            />{" "}
          </div>
          {/* body */}
          {/* // TODO need to do when the form filed is clear */}
          {programTypeData?.data?.is_online_program === true ? (
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('online_zoom_url')}
                </p>
                <abbr
                  className="text-sm font-normal text-accent-light text-[#999999]"
                  title={newCourseData?.online_url}
                >
                  {newCourseData?.online_url}
                </abbr>
              </div>
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("course.new_course:time_and_venue_tab.province")}
                </p>
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {StateNames ? StateNames : "-"}
                </p>
              </div>
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t('city')}
                </p>
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {CityNames ? CityNames : "-"}
                </p>
              </div>
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  Center
                </p>
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {CenterNames ? CenterNames : "-"}
                </p>
              </div>
              <div>{venueSessions()}</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                {t("course.new_course:review_post_details.time_formate")}
                </p>
                <p className="font-semibold truncate text-accent-secondary">
                  {timeFormat?.value}
                </p>
              </div>
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {t("course.new_course:review_post_details.time_zone")}
                </p>
                <p className="font-semibold truncate text-accent-secondary">
                  {timeZone?.data?.name}
                </p>
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
              {t("course.new_course:review_post_details.fee_information")}
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
            />{" "}
          </div>
          {/* body */}
          <div className="grid grid-cols-3 gap-4 mt-2">
            {newCourseData?.program_fee_level_settings?.map(
              (feeLevel: any, index: number) => {
                return (
                  <div className=" min-w-72">
                    <p className="text-sm font-normal text-accent-light ">
                      {feeLevelData?.data?.[index]?.value}
                    </p>
                    <abbr
                      className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                      title={feeLevel.total}
                    >
                      {feeLevel.total}
                    </abbr>
                  </div>
                );
              }
            )}

            {newCourseData?.is_early_bird_enabled &&
              newCourseData?.program_fee_level_settings?.map(
                (feeLevel: any, index: number) => {
                  return (
                    <div className=" min-w-72">
                      <abbr
                        className="text-sm font-normal text-accent-light"
                        title={feeLevelData?.data?.[index]?.value}
                      >
                        {feeLevelData?.data?.[index]?.value}
                      </abbr>

                      <abbr
                        className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                        title={feeLevel.early_bird_total}
                      >
                        {feeLevel.early_bird_total}
                      </abbr>
                    </div>
                  );
                }
              )}
            {courseFeeSettings?.[0]?.is_program_fee_editable &&
              courseFeeSettings?.[0]?.is_early_bird_fee_enabled &&
              courseFeeSettings?.[0]?.is_early_bird_cut_off_editable && (
                <div className=" min-w-72">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                    {t("course.new_course:fees_tab.early_bird_cutoff")}
                  </p>
                  <p className="font-semibold truncate no-underline text-accent-secondary text-[#666666]">
                    {subtractDaysAndFormat(
                      courseFeeSettings?.[0]?.early_bird_cut_off_period,
                      newCourseData?.schedules?.[0]?.date
                    )}{" "}
                    ({courseFeeSettings?.[0]?.early_bird_cut_off_period} Days)
                  </p>
                </div>
              )}

            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999] ">
                {t("course.new_course:fees_tab.disable")}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title="Yes"
              >
                {t('yes_button')}
              </abbr>
            </div>
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
            />{" "}
          </div>
          {newCourseData?.is_residential_program &&
          <div className="grid grid-cols-4 gap-4 mt-2">
            {newCourseData?.accommodation?.map((data: any) => {
              return (
                <div className=" min-w-72">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                    {" "}
                    {courseAccomodationNames}
                  </p>
                  <p className="font-semibold truncate no-underline text-accent-secondary text-[#666666]">
                    {data?.fee_per_person}
                  </p>
                </div>
              );
            })}

            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999] ">
              {t("course.new_course:accommodation_tab.accommodation_fee")}
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={paymentMethod?.value}
              >
                {paymentMethod?.value}
              </abbr>
            </div>
          </div>
          }
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
            />{" "}
          </div>
          {/* body */}
          {newCourseData?.contact?.map((data: any) => {
            return (
              <div className="grid grid-cols-4 gap-3 pb-4 mt-2 border-b">
                <div className=" min-w-72">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                  {t('contact_email')}
                  </p>
                  <abbr
                    className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                    title={data?.contact_email}
                  >
                    {data?.contact_email}
                  </abbr>
                </div>
                <div className=" min-w-72">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                  {t("new_strings:contact_phone")}
                  </p>
                  <abbr
                    className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                    title={data?.contact_number}
                  >
                    {data?.contact_number}
                  </abbr>
                </div>
                <div className=" min-w-72">
                  <p className="text-sm font-normal text-accent-light text-[#999999] ">
                  {t('contact_name')}
                  </p>
                  <abbr
                    className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                    title={data?.contact_name}
                  >
                    {data?.contact_name}
                  </abbr>
                </div>
              </div>
            );
          })}

          <div className="mt-4 min-w-72">
            <p className="text-sm font-normal text-accent-light text-[#999999]">
            {t("new_strings:bcc_registration_confirmation")}
            </p>
            <div className="truncate">
              <abbr
                className="font-semibold  no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.bcc_registration_confirmation_email}
              >
                {newCourseData?.bcc_registration_confirmation_email
                  ? newCourseData?.bcc_registration_confirmation_email
                  : "-"}
              </abbr>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center ">
          {isSubmitting ? (
            <Button disabled>
              <LoadingIcon />
            </Button>
          ) : (
            <Button onClick={handClickContinue}>{t('continue_button')}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
