import _ from "lodash";
import { supabaseClient } from "src/utility";

export const handleCourseDefaultValues = async (programId: number) => {
  const { data, error } = await supabaseClient
    .from("program")
    .select(
      "*,program_organizers(*),program_teachers(*),program_assistant_teachers(*),program_languages(*),program_translation_languages(*),program_schedules(*),program_accommodations(*),program_contact_details(*),program_fee_level_settings(*)"
    )
    .eq("id", programId);

  console.log("data was", data);

  if (!error) {
    const defaultValues = await getDefaultValues(data[0]);

    return defaultValues;
  }

  return {};
};

export const getDefaultValues = async (data: ProgramDataBaseType) => {
  const defaultValues: NewCourseFormFieldTypes = {};

  if (data.id) defaultValues.id = data.id;

  // Step 1

  //organization_id
  if (data.organization_id)
    defaultValues.organization_id = data.organization_id as number;

    if(data.program_created_by)
      defaultValues.program_created_by=data.program_created_by as number

  //organizer_ids
  if (data?.program_organizers) {
    defaultValues.organizer_ids = _.map(
      data.program_organizers,
      "user_id"
    ) as number[];
  }

  //is_registration_via_3rd_party
  if (data.is_registration_via_3rd_party)
    defaultValues.is_registration_via_3rd_party =
      data.is_registration_via_3rd_party;

  //registration_via_3rd_party_url
  if (data.registration_via_3rd_party_url)
    defaultValues.registration_via_3rd_party_url =
      data.registration_via_3rd_party_url;

  // Step 2

  //program_type_id

  if (data.program_type_id)
    defaultValues.program_type_id = data.program_type_id as number;

  //program_teachers
  if (data?.program_teachers) {
    defaultValues.teacher_ids = _.map(
      data.program_teachers,
      "user_id"
    ) as number[];
  }

  //program_assistant_teachers
  if (data?.program_assistant_teachers) {
    defaultValues.assistant_teacher_ids = _.map(
      data.program_assistant_teachers,
      "user_id"
    ) as number[];
  }

  //program_languages
  if (data?.program_languages) {
    defaultValues.language_ids = _.map(
      data.program_languages,
      "language_id"
    ) as number[];
  }

  //is_language_translation_for_participants
  if (data.is_language_translation_for_participants)
    defaultValues.is_language_translation_for_participants =
      data.is_language_translation_for_participants;

  //translation_language_ids
  if (data?.program_translation_languages) {
    defaultValues.translation_language_ids = _.map(
      data.program_translation_languages,
      "language_id"
    ) as number[];
  }

  //max_capacity
  if (data?.max_capacity) defaultValues.max_capacity = data.max_capacity;

  //visibility_id
  if (data?.visibility_id) {
    defaultValues.visibility_id = data.visibility_id as number;
  }

  //is_geo_restriction_applicable
  if (data.is_geo_restriction_applicable)
    defaultValues.is_geo_restriction_applicable =
      data.is_geo_restriction_applicable;

  //allowed_countries
  if (data?.allowed_countries) {
    defaultValues.allowed_countries = data.allowed_countries;
  }

  //TODO: Need to do for course notes,description and emial notes

  //program_alias_name_id
  if (data?.program_alias_name_id)
    defaultValues.program_alias_name_id = data.program_alias_name_id as number;

  //Step 3

  // if the selected program_type contains is_online_program to true then load online_url, state_id,city_id and center_id
  const { data: programTypeData }: any = await supabaseClient
    .from("program_type")
    .select("*")
    .eq("id", data.program_type_id);

  if (programTypeData && programTypeData[0]?.is_online_program === true) {
    //online_url
    if (data?.online_url) defaultValues.online_url = data.online_url;

    if (data?.state_id) defaultValues.state_id = data.state_id as number;

    if (data?.city_id) defaultValues.city_id = data.city_id as number;

    if (data?.center_id) defaultValues.center_id = data.center_id as number;
  } else {
    defaultValues.is_existing_venue = "existing-venue";

    // for form to match requirement we need to store venue data into existingVenue form name
    if (data.venue_id) {
      const { data: venueData }: any = await supabaseClient
        .from("venue")
        .select("*")
        .eq("id", data.venue_id);

      if (venueData && venueData[0]) {
        defaultValues.existingVenue = venueData[0];
      }
    }
  }

  
  if (data?.hour_format_id)
  defaultValues.hour_format_id = data.hour_format_id as number;

if (data?.time_zone_id)
  defaultValues.time_zone_id = data.time_zone_id as number;

  //program_schedules
  if (data?.program_schedules) {
    defaultValues.schedules = data.program_schedules.map(
      (schedule: ProgramSchedulesDataBaseType) => {
        schedule.start_time = schedule.start_time
          ? new Date(schedule.start_time)
          : new Date();
        schedule.end_time = schedule.end_time
          ? new Date(schedule.end_time)
          : new Date();

        const scheduleType: any = {
          date: schedule.start_time,
          startHour: schedule.start_time.getHours(),
          startMinute: schedule.start_time
            ? schedule.start_time.getMinutes()
            : 0,
          endHour: schedule.end_time.getHours(),
          endMinute: schedule.end_time.getMinutes(),
        };
        return scheduleType;
      }
    );
  }

  // Step 4
  if (data.is_early_bird_enabled)
    defaultValues.is_early_bird_enabled = data.is_early_bird_enabled;

  if (!data.program_fee_settings_id) {
    defaultValues.program_fee_level_settings =
      data.program_fee_level_settings as any;

    defaultValues.early_bird_cut_off_period = data.early_bird_cut_off_period;
  }

  // Step 5
  if (data.program_accommodations)
    defaultValues.accommodation = data.program_accommodations;

  if (data.is_residential_program)
    defaultValues.is_residential_program = data.is_residential_program;

  if (data?.accommodation_fee_payment_mode)
    defaultValues.accommodation_fee_payment_mode =
      data.accommodation_fee_payment_mode;

  // Step 6
  if (data.program_contact_details)
    defaultValues.contact = data.program_contact_details;

  if (data?.bcc_registration_confirmation_email)
    defaultValues.bcc_registration_confirmation_email =
      data.bcc_registration_confirmation_email;

  return defaultValues;
};
