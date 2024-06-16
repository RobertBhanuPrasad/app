export const BASIC_DETAILS_STEP_NUMBER = 1;
export const COURSE_DETAILS_STEP_NUMBER = 2;
export const TIME_AND_VENUE_STEP_NUMBER = 3;
export const FEE_STEP_NUMBER = 4;
export const ACCOMMODATION_STEP_NUMBER = 5;
export const CONTACT_INFO_STEP_NUMBER = 6;
export const REVIEW_PAGE_STEP_NUMBER = 7;

// new course constants
/**
 * Based on this variable we will figure out wether we will show tab icon or success icon or error icon
 */
export const NEXT_BUTTON_CLICKED = "next_button_clicked";
export const NEXT_BUTTON_NOT_CLICKED = "next_button_not_clicked";

export const VALID = "valid";
export const INVALID = "invalid";

//Course details page tabs constant
export const COURSE_DETAILS_TAB = 1;
export const PARTICIPANTS_TAB = 2;
export const REVENUE_SUMMARY_TAB = 3;
export const COURSE_ACCOUNTING_FORM_TAB = 4;
export const VIEW_COURSE_ACCOUNTING_FORM_TAB = 5;

//course status IDs

export const COURSE_PENDING_REVIEW_STATUS_ID = 15;
export const COURSE_ACTIVE_STATUS_ID = 11;

export const NewCourseStep1FormNames = {
  organization_id: "organization_id",
  organizer_ids: "organizer_ids",
  is_registration_via_3rd_party: "is_registration_via_3rd_party",
  registration_via_3rd_party_url: "registration_via_3rd_party_url",
  program_created_by: "program_created_by",
};

export const NewCourseStep2FormNames = {
  program_type_id: "program_type_id",
  program_type: "program_type",
  teacher_ids: "teacher_ids",
  assistant_teacher_ids: "assistant_teacher_ids",
  visibility_id: "visibility_id",
  is_language_translation_for_participants:
    "is_language_translation_for_participants",
  program_alias_name_id: "program_alias_name_id",
  is_geo_restriction_applicable: "is_geo_restriction_applicable",
  language_ids: "language_ids",
  translation_language_ids: "translation_language_ids",
  allowed_countries: "allowed_countries",
  max_capacity: "max_capacity",
  is_registration_required: "is_registration_required",
};

export const NewCourseStep3FormNames = {
  online_url: "online_url",
  hour_format_id: "hour_format_id",
  time_zone_id: "time_zone_id",
  schedules: "schedules",
  state_id: "state_id",
  city_id: "city_id",
  center_id: "center_id",
  venue_id: "venue_id",
  is_existing_venue: "is_existing_venue",
};

export const NewCourseStep4FormNames = {
  is_early_bird_enabled: "is_early_bird_enabled",
  program_fee: "program_fee",
  product_fee_settings: "product_fee_settings"
};

export const NewCourseStep5FormNames = {
  accommodation: "accommodation",
  is_residential_program: "is_residential_program",
  fee_per_person: "fee_per_person",
  no_of_residential_spots: "no_of_residential_spots",
  accommodation_type_id: "accommodation_type_id",
  accommodation_fee_payment_mode: "accommodation_fee_payment_mode",
};

export const NewCourseStep6FormNames = {
  contact: "contact",
  contact_name: "contact_name",
  contact_email: "contact_email",
  contact_number: "contact_number",
  bcc_registration_confirmation_email: "bcc_registration_confirmation_email",
};

// Form names to validate
export const EditParticipantFormNames = {
  memo: "memo",
  accommodation_snore: "accommodation_snore",
  roommate_snore: "roommate_snore",
  participant_attendence_status_id: "participant_attendence_status_id",
  participant_code: "participant_code",
};
