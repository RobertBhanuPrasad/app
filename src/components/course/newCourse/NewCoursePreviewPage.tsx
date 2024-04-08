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

export default function NewCourseReviewPage() {
  const { newCourseData, setViewPreviewPage, setViewThankyouPage } =
    newCourseStore();

  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: newCourseData?.program_type_id,
  });

  const { data: venueState } = useOne({
    resource: "state",
    id: newCourseData?.state_id,
  });

  const StateNames = venueState?.data?.map((state: any) => {
    return state?.name;
  });

  const { data: venueCity } = useOne({
    resource: "city",
    id: newCourseData?.city_id,
  });

  const CityNames = venueCity?.data?.map((city: any) => {
    return city?.name;
  });

  const { data: venueCenter } = useOne({
    resource: "center",
    id: newCourseData?.center_id,
  });
  const CenterNames = venueCenter?.data?.map((center: any) => {
    return center?.name;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data }: any = useGetIdentity();

  const [courseFeeSettings, setCourseFeeSettings] = useState<any>();

  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: newCourseData?.program_type_id,
  });

  let stateId: number, cityId: number, centerId: number;

  //Finding the state_id ,city_id and center_id where course is going on
  if (programTypeData?.data?.is_online_program) {
    stateId = newCourseData?.state_id;
    cityId = newCourseData?.city_id;
    centerId = newCourseData?.center_id;
  } else {
    if (newCourseData.is_existing_venue == "new-venue") {
      stateId = newCourseData?.newVenue?.state_id;
      cityId = newCourseData?.newVenue?.city_id;
      centerId = newCourseData?.newVenue?.center_id;
    } else if (newCourseData?.is_existing_venue == "existing-venue") {
      stateId = newCourseData?.existingVenue?.state_id;
      cityId = newCourseData?.existingVenue?.city_id;
      centerId = newCourseData?.existingVenue?.center_id;
    }
  }

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
    id: newCourseData?.organization_id,
  });

  const { data: ProgramOrganizer } = useMany({
    resource: "users",
    ids: newCourseData?.organizer_ids,
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
          Sessions
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

  return (
    <div className="pb-12">
      <div className="text-[24px] my-4 font-semibold">
        Review Your Details Right Here
      </div>
      <div className="w-full p-6 text-base bg-white shadow-sm max-h-fit rounded-3xl">
        {/* Basic Details */}
        <section className="w-full pb-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center">
            <p className="font-semibold text-accent-primary text-[#333333]">
              Basic Details
            </p>
            {/* Here we are calling EditModalDialog for passing the data of BasicDetails page */}
            <EditModalDialog
              title="Basic Details"
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
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999] ">
                Creator
              </p>
              <abbr
                className="font-semibold no-underline truncate  text-accent-secondary text-[#666666]"
                title={creator}
              >
                {creator?.value ? creator?.value : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                Organization
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
                Program Organizer
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
                Is geo restriction applicable for registrations
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
                Registration via 3rd party gateway
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
                  Registration via 3rd party gateway url
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
              Course Details
            </p>
            {/* Here we are calling EditModalDialog for passing the data of CourseDetails page */}
            <EditModalDialog
              title="Course Details"
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
                Course Type
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
                Teacher
              </p>
              <abbr className="font-semibold truncate no-underline text-accent-secondary text-[#666666]">
                {CourseTeachersNames ? CourseTeachersNames : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                Language(s) course is taught in
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
                Available language(s) for translation
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
                Max Capacity
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
                Program Visibility
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={visibility}
              >
                {visibility ? visibility : "-"}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                Online zoom URL
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={newCourseData?.online_url}
              >
                {newCourseData?.online_url}
              </abbr>
            </div>
            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                Country(s) from where registrations are allowed
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
                Is geo restriction applicable for registrations
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
                Course Description
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

            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                Course Notes
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

            <div className=" min-w-72">
              <p className="text-sm font-normal text-accent-light text-[#999999]">
                Email Notes
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
              Time and Venue
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
                  Online zoom URL
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
                  Province
                </p>
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  {StateNames ? StateNames : "-"}
                </p>
              </div>
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  City
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
                  Time Format
                </p>
                <p className="font-semibold truncate text-accent-secondary">
                  {timeFormat?.value}
                </p>
              </div>
              <div className=" min-w-72">
                <p className="text-sm font-normal text-accent-light text-[#999999]">
                  Time Zone
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
              Fees Information
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
                    Early bird cut-off period
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
                Disable Pay Later Label123?
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title="Yes"
              >
                Yes
              </abbr>
            </div>
          </div>
        </section>
        {/* Accommodation Information */}
        <section className="w-full py-8 text-base border-b">
          {/* title section */}
          <div className="flex items-center ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              Accommodation Information
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
          {/* body */}
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
                Accommodation fee payment mode
              </p>
              <abbr
                className="font-semibold truncate no-underline text-accent-secondary text-[#666666]"
                title={paymentMethod?.value}
              >
                {paymentMethod?.value}
              </abbr>
            </div>
          </div>
        </section>
        {/* Contact Info */}
        <section className="w-full py-8 text-base ">
          {/* title section */}
          <div className="flex items-center  ">
            <p className="font-semibold text-accent-primary text-[#333333]">
              Contact Info
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
                    Contact Email
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
                    Contact Phone
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
                    Contact Name
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
              BCC registration confirmation email
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
            <Button onClick={handClickContinue}>Continue</Button>
          )}
        </div>
      </div>
    </div>
  );
}
