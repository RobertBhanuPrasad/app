//@ts-ignore
interface AccommodationTypesDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface CenterDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  city_id?: number | CityDataBaseType;
  state_id?: number | StateDataBaseType;
  latitude?: number;
  longitude?: number;
}

interface CityDataBaseType {
  id?: number;
  created_at?: Date;
  state_id?: number | StateDataBaseType;
  name?: string;
  postal_code?: number;
  latitude?: number;
  longitude?: number;
}

interface ContactDataBaseType {
  id?: number;
  created_at?: Date;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: number;
  street_address?: string;
  identification_num?: string;
  state_id?: number | StateDataBaseType;
  city_id?: number | CityDataBaseType;
  postal_code?: string;
  date_of_birth?: Date;
  identification_type_id?: number;
  contact_type?: string;
  mobile_country_code?: string;
  gender_id?: number;
  full_name?: string;
  country_id?: number;
  preferred_to_receive_notifications?: boolean;
}

interface ContactNotificationPreferencesDataBaseType {
  id?: number;
  created_at?: Date;
  contact_id?: number | ContactDataBaseType;
  medium_of_communication?: string;
  status?: boolean;
}

interface CountryCallingCodesDataBaseType {
  id?: number;
  created_at?: Date;
  call_code?: string;
}

interface CountryConfigDataBaseType {
  created_at?: Date;
  id?: number;
  thousands_separator?: string;
  decimal_delimiter?: string;
  monetary_amount_display?: string;
  monetary_value_display?: string;
  default_currency_name?: string;
  default_currency_symbol?: string;
  default_currency_code?: string;
  default_language_name?: string;
  default_language_code?: string;
}

interface CountryCurrenciesDataBaseType {
  id?: number;
  created_at?: Date;
  country_config_id?: number | CountryConfigDataBaseType;
  currency_name?: string;
  currency_symbol?: string;
  currency_code?: string;
}

interface DiscountCodesDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface HealthTypesDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  health_declaration?: string;
}

interface IdentificationTypesDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface LanguagesDataBaseType {
  id?: number;
  created_at?: Date;
  organization_id?: number | OrganizationsDataBaseType;
  language_name?: string;
  language_code?: string;
  country_config_id?: number | CountryConfigDataBaseType;
  is_organizational_language?: boolean;
}

interface LeadTransactionsHistoryDataBaseType {
  id?: number;
  created_at?: Date;
  lead_id?: number;
  transaction_id?: number;
}

interface LeadsDataBaseType {
  id?: number;
  created_at?: Date;
  contact_id?: number | ContactDataBaseType;
  event_id?: number;
  utm_params?: any;
  source_title?: string;
  source_url?: string;
  confirmation_date?: Date;
  stage?: string;
}

interface OptionGroupValuesDataBaseType {
  id?: number;
  created_at?: Date;
  value?: string;
  label?: string;
  description?: string;
  order?: number;
  is_enabled?: boolean;
  option_group_id?: number;
}

interface OptionGroupsDataBaseType {
  id?: number;
  created_at?: Date;
  title?: string;
  description?: string;
  name?: string;
  data_type?: string;
  is_enabled?: boolean;
}

interface OptionLabelsDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  is_default?: boolean;
  language_code?: string;
  key?: string;
}

interface OptionValuesDataBaseType {
  id?: number;
  created_at?: Date;
  value?: string;
  option_label_id?: number;
  is_default?: boolean;
  language_code?: string;
  order?: number;
  language_id?: number | null;
}

interface ProgramAccommodationsDataBaseType {
  id?: number;
  created_at?: Date;
  accommodation_type_id?: AccommodationTypesDataBaseType;
  fee_per_person?: number;
  no_of_residential_spots?: number;
  program_id?: number;
}

interface ProgramAssistantTeachersDataBaseType {
  id?: number;
  created_at?: Date;
  program_id?: number;
  user_id?: number | UsersDataBaseType;
}

interface ProgramContactDetailsDataBaseType {
  id?: number;
  created_at?: Date;
  program_id?: number;
  contact_name?: string;
  contact_email?: string;
  contact_number?: number;
}

interface ProgramDetailsInfoDataBaseType {
  id?: number;
  created_at?: Date;
  is_registration_required?: boolean;
  disable_bank_transfer_paylater?: boolean;
  program_id?: number | ProgramDataBaseType;
  is_registration_via_3rd_party?: boolean;
  registration_via_3rd_party_url?: string;
  notes?: string;
  description?: string;
  email_notes?: string;
  is_geo_restriction_applicable?: boolean;
  is_language_translation_for_participants?: boolean;
  max_capacity?: number;
  online_url?: string;
  visibility_id?: number | OptionValuesDataBaseType;
  early_bird_cut_off_period?: number;
  hour_format_id?: number | OptionValuesDataBaseType;
  time_zone_id?: number | TimeZoneDataBaseType;
}

interface TimeZoneDataBaseType {
  id?: number;
  created_at?: string;
  name?: string;
  utc_off_set?: string;
  country_config_id?: number;
}

interface ProgramFeeLevelSettingsDataBaseType {
  id?: number;
  created_at?: Date;
  sub_total?: number;
  total?: number;
  tax?: number;
  is_enable?: boolean;
  program_fee_setting_id?: number | ProgramFeeSettingsDataBaseType;
  custom_fee_label?: string;
  early_bird_sub_total?: number;
  early_bird_tax?: number;
  early_bird_total?: number;
  fee_level_id?: number | OptionValuesDataBaseType;
  is_custom_fee?: boolean;
  program_id?: number | ProgramDataBaseType;
}

interface ProgramFeeSettingsDataBaseType {
  id?: number;
  created_at?: Date;
  organization_id?: number | OrganizationsDataBaseType;
  state_id?: number | StateDataBaseType;
  city_id?: number | CityDataBaseType;
  use_center?: boolean;
  center_id?: number | CenterDataBaseType;
  is_date_based_pricing?: boolean;
  early_bird_cut_off_period?: number;
  is_early_bird_cut_off_editable?: boolean;
  status?: number;
  program_end_date?: Date;
  program_start_date?: Date;
  program_type_id?: number;
  is_early_bird_fee_enabled?: boolean;
  is_program_fee_editable?: boolean;
}

interface ProgramGroupRelationsDataBaseType {
  id?: number;
  created_at?: Date;
  program_type_idid?: number;
  group_id?: number;
}

interface ProgramGroupsDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  program_level_id?: number;
  parent_id?: number;
  is_parent?: boolean;
}

interface ProgramLanguagesDataBaseType {
  id?: number;
  created_at?: Date;
  program_id?: number;
  language_id?: number | LanguagesDataBaseType;
}

interface ProgramOrganizersDataBaseType {
  id?: number;
  created_at?: Date;
  program_id?: number;
  user_id?: number | UsersDataBaseType;
}

interface ProgramSchedulesDataBaseType {
  id?: number;
  created_at?: Date;
  program_id?: number;
  start_time?: Date;
  end_time?: Date;
  program_schedule_name?: string;
  schedule_type?: number;
  order?: number;
}

interface ProgramTeachersDataBaseType {
  id?: number;
  created_at?: Date;
  program_id?: number | ProgramDataBaseType;
  user_id?: number | UsersDataBaseType;
}

interface ProgramTranslationLanguagesDataBaseType {
  id?: number;
  created_at?: Date;
  language_id?: number | LanguagesDataBaseType;
  program_id?: number;
}

interface ProgramTypeAliasNamesDataBaseType {
  id?: number;
  created_at?: Date;
  program_type_id?: number | ProgramTypesDataBaseType;
  alias_name?: string;
}

interface ProgramTypeDetailsDataBaseType {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  program_description?: string;
  user_agreement?: string;
  refund_policy?: string;
  privacy_policy?: string;
  health_privacy_policy?: string;
  printable_policy?: string;
  waiver_of_liability_risk_and_indemnity_agreement?: string;
  language_name?: string;
  language_code?: string;
  eligibility_criteria_text?: string;
}

interface ProgramTypeTagsDataBaseType {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  tag_id?: number;
  group_id?: number;
  program_id?: number;
}

interface ProgramTypeTeachersDataBaseType {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  user_id?: number | UsersDataBaseType;
  certification_level_id?: number;
  notes?: string;
  tape_expires_on?: Date;
  tape_number?: string;
  tape_received_on?: Date;
  tape_version?: string;
  teacher_since?: Date;
  ttp_country_id?: number;
  ttp_graduation_date?: Date;
  ttp_type_id?: number;
}

interface ProgramTypesDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  organization_name?: string;
  maximum_age_limit?: number;
  minimum_age_limit?: number;
  is_online_program?: boolean;
  is_geo_restriction_applicable_for_registrations?: boolean;
  allow_program_to_announcement_in_bo?: boolean;
  is_program_active?: boolean;
  is_registration_required?: boolean;
  is_registration_required_editable?: boolean;
  is_age_limit_editable?: boolean;
  allowed_countries?: string[];
  maximum_capacity?: number;
  is_approval_required?: boolean;
  is_program_description_editable?: boolean;
  display_eligibility_criteria_on_registration_form?: boolean;
  collect_eligibility_criteria_on_registration_form?: boolean;
  question_for_eligibilty_criteria?: string;
  is_refund_policy_editable_by_national_administrator?: boolean;
  IAOLF_revenue_share?: number;
  program_announcement_privileges?: string;
  program_level?: number;
  program_category?: string;
  has_alias_name?: boolean;
  health_type_name?: string;
  health_declaration?: string;
  program_type_id?: ProgramDataBaseType;
}

interface RegistrationFieldGroupsDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  description?: string;
  order?: number;
  pre_form_help?: string;
  post_form_help?: string;
  is_active?: boolean;
}

interface RegistrationFieldValuesDataBaseType {
  id?: number;
  created_at?: Date;
  field_name?: string;
  field_label?: string;
  is_required?: boolean;
  is_view_only?: boolean;
  visibility?: string;
  field_pre_help?: string;
  field_post_help?: string;
  order?: number;
  is_active?: boolean;
  registration_group_id?: number;
}

interface StateDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface TagsDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface TtpTypesDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface UserOrganizationRelationDataBaseType {
  id?: number;
  created_at?: Date;
  user_id?: number | UsersDataBaseType;
  organization_id?: number | OrganizationsDataBaseType;
}

interface UserRolesDataBaseType {
  id?: number;
  created_at?: Date;
  user_id?: number | UsersDataBaseType;
  role_id?: number;
}

interface UsersDataBaseType {
  id?: number;
  created_at?: Date;
  contact_id?: number | ContactDataBaseType;
  user_identifier?: string;
  user_name?: string;
}

interface VenueDataBaseType {
  id?: number;
  created_at?: Date;
  state_id?: number | StateDataBaseType;
  city_id?: number | CityDataBaseType;
  postal_code?: string;
  address?: string;
  name?: string;
  latitude?: string;
  longitude?: string;
  center_id?: number | CenterDataBaseType;
  created_by_user_id?: number | UsersDataBaseType;
}

interface OrganizationCalenderSettingsDataBaseType {
  id?: number;
  created_at?: Date;
  is_city_enabled?: boolean;
  is_state_enabled?: boolean;
  Is_venue_enabled?: boolean;
  organization_id?: number | OrganizationsDataBaseType;
}

interface OrganizationInfoDataBaseType {
  id?: number;
  created_at?: Date;
  minimum_age_for_adult_programs?: boolean;
  enable_reminder_emails?: boolean;
  no_of_days_for_remainder_1?: number;
  no_of_days_for_remainder_2?: number;
  enable_language_preference_for_courses?: boolean;
  enable_language_preference_for_events?: boolean;
}

interface OrganizationsDataBaseType {
  id?: number;
  created_at?: Date;
  name?: string;
  is_active?: boolean;
  tax_enabled?: boolean;
  tax_rate?: number;
  support_email?: string;
}

interface ParticipantAttendenceStatusDataBaseType {
  id?: number;
  created_at?: Date;
  participant_id?: number;
  program_id?: number;
  program_schedule_id?: number;
  is_attended?: boolean;
}

interface ParticipantPaymentHistoryDataBaseType {
  id?: number;
  created_at?: string;
  payment_transaction_id?: number | null;
  currency_code?: string | null;
  participant_id?: ParticipantRegistrationDataBaseType | number;
  program_id?: ProgramDataBaseType | number;
  total_amount?: number;
  transaction_status_id?: OptionValuesDataBaseType;
  transaction_date?: string | null;
  payment_method_id?: OptionValuesDataBaseType;
  source_change?: string | null;
  source_contact_id?: number | null;
  source_text?: string | null;
  source_timestamp?: string | null;
  transaction_fee_level_id?: OptionValuesDataBaseType;
  transaction_reason?: string | null;
  transaction_type_id?: OptionValuesDataBaseType;
  hx_pkey?: string | null;
  accommodation_fee?: number | null;
  expense_fee?: number | null;
  organization_fee?: number | null;
  refund_reason?: string | null;
  tax?: number | null;
  error_message?: string | null;
  payment_date?: string | null;
  payment_method?: string | null;
  response_message?: string | null;
  send_payment_confirmation?: boolean | null;
  transaction_id?: number | null;
  transaction_status?: string | null;
  sub_payment_method?: string | null;
  accommodation_type_id?: ProgramAccommodationsDataBaseType;
  discounted_amount?: number;
}

interface ParticipantReassignmentHistoryDataBaseType {
  id?: number;
  created_at?: Date;
  participant_id?: number;
  old_program_id?: number;
  new_program_id?: number;
  new_participant_id?: number | ContactDataBaseType;
}

interface ParticipantEmailDeliveryLogsDataBaseType {
  id?: number;
  browser?: string;
  ip_address?: string;
  time_stamp?: string;
  transaction_id?: string;
  operating_system?: string;
}

interface ParticipantCustomerDeviceDetailsDataBaseType {
  program_type?: number;
  delivery_status?: string;
  delivery_time_stamp?: string;
  source?: string;
  open_time_stamp?: string;
}

interface ParticipantUtmParametersDataBaseType {
  program_type_id?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  http_refer?: string;
}

interface ParticipantRegistrationDataBaseType {
  // TODO: transaction_type will change to transaction_type_id
  transaction_type: number | OptionValuesDataBaseType;
  id?: number;
  created_at?: Date;
  contact_id?: number | ContactDataBaseType;
  discount_code_id?: number;
  is_payment_refund_request?: boolean;
  is_payment_refunded?: boolean;
  participant_attendence_status_id?:
    | number
    | ParticipantAttendenceStatusDataBaseType;
  price_category_id?: number;
  donation_type?: OptionValuesDataBaseType;
  donation_date?: Date;
  program_category_id?: number;
  program_id?: number | ProgramTypesDataBaseType;
  discount_code?: string;
  discounted_amount?: number;
  discounted_tax?: number;
  hear_program_from_id?: number;
  is_health_declaration_checked?: boolean;
  is_program_agreement_checked?: boolean;
  legal_agreement_version?: number;
  payment_status_id?: number;
  email_delivery_logs_section?: ParticipantEmailDeliveryLogsDataBaseType;
  customer_device_details_section?: ParticipantCustomerDeviceDetailsDataBaseType;
  utm_parameters_section?: ParticipantUtmParametersDataBaseType;
  memo?: string;
  transaction_fee_level_id?: number | OptionValuesDataBaseType;
  roommate_preferences_1?: string;
  roommate_preferences_2?: string;
  roommate_preferences_3?: string;
  participant_code?: string;
  roommate_snore?: boolean;
  accommodation_snore?: boolean;
  organisation_id?: number | OrganizationsDataBaseType;
}

interface ProgramOfflineRevenueDatabaseType {
  id?: number;
  created_at?: Date;
  program_id?: number;
  organization_id?: number;
  date?: Date;
  amount?: number;
  notes?: string;
}

interface ProgramDataBaseType {
  id?: number;
  created_at?: Date;
  organization_id?: number | OrganizationsDataBaseType;
  venue_id?: number | VenueDataBaseType;
  registration_link?: string;
  program_code?: string;
  program_fee_settings_id?: number | ProgramFeeSettingsDataBaseType;
  program_type_id?: number | ProgramTypesDataBaseType;
  visibility_id?: number | OptionValuesDataBaseType;
  status_id?: number | OptionValuesDataBaseType;
  is_registration_via_3rd_party?: boolean;
  registration_via_3rd_party_url?: string;
  hour_format_id?: number | OptionValuesDataBaseType;
  time_zone_id?: number | OptionValuesDataBaseType;
  disable_bank_transfer_paylater?: boolean;
  early_bird_cut_off_period?: number;
  is_geo_restriction_applicable?: boolean;
  is_language_translation_for_participants?: boolean;
  is_registration_required?: boolean;
  max_capacity?: number;
  online_url?: string;
  accommodation_fee_payment_mode?: number;
  center_id?: number | CenterDataBaseType;
  city_id?: number | CityDataBaseType;
  details_page_link?: string;
  is_early_bird_enabled?: boolean;
  is_residential_program?: boolean;
  program_alias_name_id?: number | ProgramTypeAliasNamesDataBaseType;
  program_created_by?: number | UsersDataBaseType;
  state_id?: number | StateDataBaseType;
  use_default_fee?: boolean;
  program_accommodations?: AccommodationTypesDataBaseType[];
  program_assistant_teachers?: ProgramAssistantTeachersDataBaseType[];
  program_contact_details?: ProgramContactDetailsDataBaseType[];
  program_details_info?: ProgramDetailsInfoDataBaseType;
  program_fee_level_settings?: ProgramFeeLevelSettingsDataBaseType[];
  program_schedules?: ProgramSchedulesDataBaseType[];
  program_teachers?: ProgramTeachersDataBaseType[];
  program_translation_languages?: ProgramTranslationLanguagesDataBaseType[];
  program_languages?: ProgramLanguagesDataBaseType[];
  program_organizers?: ProgramOrganizersDataBaseType[];
  last_modified_by_user_id?: number | UsersDataBaseType;
  allowed_countries?: string[];
  program_offline_revenue?: ProgramOfflineRevenueDatabaseType[];
  bcc_registration_confirmation_email?: string;
  program_contact_detials?: {
    prgram_id?: number;
    id?: number;
    contact_name?: string;
    contact_email?: string;
    contact_number?: number;
  }[];
  modified_at?: Date;
  is_online_program?: boolean;
}

interface NewCourseFormFieldTypes {
  id?: number;

  //step 1
  organization_id?: number;
  organizer_ids?: number[];
  is_registration_via_3rd_party?: boolean;
  registration_via_3rd_party_url?: string;
  program_created_by?: number;

  //step 2
  program_type_id?: number;
  teacher_ids?: number[];
  assistant_teacher_ids?: number[];
  visibility_id?: number;
  is_language_translation_for_participants?: boolean;
  program_alias_name_id?: number;
  is_geo_restriction_applicable?: boolean;
  language_ids?: number[];
  translation_language_ids?: number[];
  allowed_countries?: string[];
  max_capacity?: string;

  // Step 3
  online_url?: string;
  hour_format_id?: number;
  time_zone_id?: number;
  schedules?: any[];
  state_id?: number;
  city_id?: number;
  center_id?: number;
  venue_id?: number;
  is_existing_venue?: string;
  existingVenue?: VenueDataBaseType;

  // Step 4
  is_early_bird_enabled?: boolean;
  early_bird_cut_off_period?: number;
  program_fee_level_settings?: {
    program_id?: number;
    id?: number;
    total?: number;
    early_bird_total?: number;
    is_enable?: boolean;
    fee_level_id?: number;
  }[];

  // Step 5
  accommodation?: any[];
  is_residential_program?: boolean;
  fee_per_person?: number;
  no_of_residential_spots?: number;
  accommodation_type_id?: number;
  accommodation_fee_payment_mode?: number;

  // Step 6
  contact?: {
    program_id?: number;
    id?: number;
    contact_name?: string;
    contact_email?: string;
    contact_number?: number;
  }[];
  bcc_registration_confirmation_email?: string;
}
interface EditParticipantDataBaseTypes {
  id: number;
  participant_id: {
    contact_id: {
      full_name: string;
    };
    memo: string;
    transaction_fee_level_id: string;
    created_at: string | null;
    total_amount: string;
    accommodation_snore: boolean;
    roommate_snore: boolean;
    participant_code: string;
    roommate_preferences_1: string;
    roommate_preferences_2: string;
    roommate_preferences_3: string;
    discount_code: string;
    participant_attendance_status_id: number;
  };
  transaction_fee_level_id: {
    value: string;
  };
  currency_code: string;
  accommodation_type_id: number;
  accommodation_fee: string;
  expense_fee: string;
  // Add other fields here
  transaction_status_id: number;
  payment_date: string;
  payment_method_id: number;
  send_payment_confirmation: boolean;
  payment_transaction_id: string;
  response_message: string;
  error_message: string;
}

interface EditParticipantFormFieldTypes {
  id?: number | string;
  memo?: string;
  transaction_status?: string;
  transaction_id?: number;
  accommodation_type_id?: number | ProgramAccommodationsDataBaseType;
  accommodation_snore?: boolean;
  roommate_snore?: boolean;
  participant_code?: string;
  program_id?: number | ProgramTypesDataBaseType;
  discount_code?: string;
  participant_attendence_status_id?:
    | number
    | ParticipantAttendenceStatusDataBaseType;
  transaction_status_id?: number | OptionValuesDataBaseType;
  transaction_status_value?: string;
  payment_date?: string;
  payment_method_id?: number | OptionValuesDataBaseType;
  send_payment_confirmation?: boolean;
  program_type_id?: boolean;
}

/**
 * This is are form names where we are mantaining in course-accounting-form tab.
 * This can be helpful to give specified form name for a field instead of giving random names to useControllers.
 * When you are registering a field in useController assign this type to useController<CourseAccountingFormFieldTypes>({name:"program_id"}) like this example
 * This will be helpful in edit course accounting form also where we need to prefill at that time also we will do
 */
interface CourseAccountingFormFieldTypes {
  program_id?: number;
  program_expenses?: {
    id?: number;
    expense_category?: number;
    details?: string;
    recipt_id?: number;
    purchase_date?: string;
    amount?: number;
    reimbursable?: boolean;
    name_of_person_to_reimbursable?: number;
    payment_method?: number;
    vat_condition?: number;
    vat_tax_id?: number;
    vendor_name?: string;
    vat_rate?: string;
    new_person_to_reimburse?: string;
  }[];

  // close registrations form names
  action_id?: number;
  status_id?: number;

  program_offline_revenue?: ProgramOfflineRevenueDatabaseType[];
  course_accounting_user_consent?: boolean;
}
