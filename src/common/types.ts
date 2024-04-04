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
  identification_num?: number;
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
}

interface ProgramAccommodationsDataBaseType {
  id?: number;
  created_at?: Date;
  accommodation_type_id?: number | AccommodationTypesDataBaseType;
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
  allowed_countries?: string[];
  description?: string;
  email_notes?: string;
  is_geo_restriction_applicable?: boolean;
  is_language_translation_for_participants?: boolean;
  max_capacity?: number;
  online_url?: string;
  visibility_id?: number | OptionValuesDataBaseType;
  early_bird_cut_off_period?: number;
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
  early_brid_tax?: number;
  early_brid_total?: number;
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
  created_at?: Date;
  payment_transaction_id?: number;
  currency_code?: string;
  participant_id?: number | ContactDataBaseType;
  program_id?: number;
  total_amount?: number;
  transaction_type?: string;
  transaction_status_id?: number;
  transaction_date?: Date;
}

interface ParticipantReassignmentHistoryDataBaseType {
  id?: number;
  created_at?: Date;
  participant_id?: number;
  old_program_id?: number;
  new_program_id?: number;
  new_participant_id?: number | ContactDataBaseType;
}

interface ParticipantRegistrationDataBaseType {
  id?: number;
  created_at?: Date;
  contact_id?: number | ContactDataBaseType;
  discount_code_id?: number;
  is_payment_refund_request?: boolean;
  is_payment_refunded?: boolean;
  participant_attendence_status_id?: number;
  price_category_id?: number;
  program_category_id?: number;
  program_id?: number;
  discount_code?: string;
  discounted_amount?: number;
  discounted_tax?: number;
  hear_program_from_id?: number;
  is_health_declaration_checked?: boolean;
  is_program_agreement_checked?: boolean;
  legal_agreement_version?: number;
  payment_status_id?: number;
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
  status_id?: number | OptionValuesDataBaseType;
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
  program_details_info?: ProgramDetailsInfoDataBaseType[];
  program_fee_level_settings?: ProgramFeeLevelSettingsDataBaseType[];
  program_schedules?: ProgramSchedulesDataBaseType[];
  program_teachers?: ProgramTeachersDataBaseType[];
  program_translation_languages?: ProgramTranslationLanguagesDataBaseType[];
  program_organizers?: ProgramOrganizersDataBaseType[];
}

interface AccommodationTypes {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface Center {
  id?: number;
  created_at?: Date;
  name?: string;
  city_id?: number;
  city?: City;
  state_id?: number;
  state?: State;
  latitude?: number;
  longitude?: number;
}

interface City {
  id?: number;
  created_at?: Date;
  state_id?: number;
  state?: State;
  name?: string;
  postal_code?: number;
  latitude?: number;
  longitude?: number;
}

interface Contact {
  id?: number;
  created_at?: Date;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: number;
  identification_num?: number;
  state_id?: number;
  state?: State;
  city_id?: number;
  city?: City;
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

interface ContactNotificationPreferences {
  id?: number;
  created_at?: Date;
  contact_id?: number;
  contact?: Contact;
  medium_of_communication?: string;
  status?: boolean;
}

interface CountryCallingCodes {
  id?: number;
  created_at?: Date;
  call_code?: string;
}

interface CountryConfig {
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

interface CountryCurrencies {
  id?: number;
  created_at?: Date;
  country_config_id?: number;
  country_config?: CountryConfig;
  currency_name?: string;
  currency_symbol?: string;
  currency_code?: string;
}

interface DiscountCodes {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface HealthTypes {
  id?: number;
  created_at?: Date;
  name?: string;
  health_declaration?: string;
}

interface IdentificationTypes {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface Languages {
  id?: number;
  created_at?: Date;
  organization_id?: number;
  organization?: Organizations;
  language_name?: string;
  language_code?: string;
  country_config_id?: number;
  country_config?: CountryConfig;
  is_organizational_language?: boolean;
}

interface LeadTransactionsHistory {
  id?: number;
  created_at?: Date;
  lead_id?: number;
  transaction_id?: number;
}

interface Leads {
  id?: number;
  created_at?: Date;
  contact_id?: number;
  contact?: Contact;
  event_id?: number;
  utm_params?: any;
  source_title?: string;
  source_url?: string;
  confirmation_date?: Date;
  stage?: string;
}

interface OptionGroupValues {
  id?: number;
  created_at?: Date;
  value?: string;
  label?: string;
  description?: string;
  order?: number;
  is_enabled?: boolean;
  option_group_id?: number;
}

interface OptionGroups {
  id?: number;
  created_at?: Date;
  title?: string;
  description?: string;
  name?: string;
  data_type?: string;
  is_enabled?: boolean;
}

interface OptionLabels {
  id?: number;
  created_at?: Date;
  name?: string;
  is_default?: boolean;
  language_code?: string;
  key?: string;
}

interface OptionValues {
  id?: number;
  created_at?: Date;
  value?: string;
  option_label_id?: number;
  is_default?: boolean;
  language_code?: string;
  order?: number;
}

interface ProgramAccommodations {
  id?: number;
  created_at?: Date;
  accommodation_type_id?: number;
  accommodation_type?: AccommodationTypes;
  fee_per_person?: number;
  no_of_residential_spots?: number;
  program_id?: number;
}

interface ProgramAssistantTeachers {
  id?: number;
  created_at?: Date;
  program_id?: number;
  user_id?: number;
  user?: Users;
}

interface ProgramContactDetails {
  id?: number;
  created_at?: Date;
  program_id?: number;
  contact_name?: string;
  contact_email?: string;
  contact_number?: number;
}

interface ProgramDetailsInfo {
  id?: number;
  created_at?: Date;
  is_registration_required?: boolean;
  disable_bank_transfer_paylater?: boolean;
  program_id?: number;
  program?: Program;
  is_registration_via_3rd_party?: boolean;
  registration_via_3rd_party_url?: string;
  notes?: string;
  allowed_countries?: string[];
  description?: string;
  email_notes?: string;
  is_geo_restriction_applicable?: boolean;
  is_language_translation_for_participants?: boolean;
  max_capacity?: number;
  online_url?: string;
  visibility_id?: number;
  visibility?: OptionValues;
  early_bird_cut_off_period?: number;
}

interface ProgramFeeLevelSettings {
  id?: number;
  created_at?: Date;
  sub_total?: number;
  total?: number;
  tax?: number;
  is_enable?: boolean;
  program_fee_setting_id?: number;
  program_fee_setting?: ProgramFeeLevelSettings;
  custom_fee_label?: string;
  early_bird_sub_total?: number;
  early_brid_tax?: number;
  early_brid_total?: number;
  fee_level_id?: number;
  fee_level?: OptionValues;
  is_custom_fee?: boolean;
  program_id?: number;
  program?: Program;
}

interface ProgramFeeSettings {
  id?: number;
  created_at?: Date;
  organization_id?: number;
  organization?: Organizations;
  state_id?: number;
  state?: State;
  city_id?: number;
  city?: City;
  use_center?: boolean;
  center_id?: number;
  center?: Center;
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

interface ProgramGroupRelations {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  group_id?: number;
}

interface ProgramGroups {
  id?: number;
  created_at?: Date;
  name?: string;
  program_level_id?: number;
  parent_id?: number;
  is_parent?: boolean;
}

interface ProgramLanguages {
  id?: number;
  created_at?: Date;
  program_id?: number;
  language_id?: number;
  language?: Languages;
}

interface ProgramOrganizers {
  id?: number;
  created_at?: Date;
  program_id?: number;
  user_id?: number;
  user?: Users;
}

interface ProgramSchedules {
  id?: number;
  created_at?: Date;
  program_id?: number;
  start_time?: Date;
  end_time?: Date;
  program_schedule_name?: string;
  schedule_type?: number;
  order?: number;
}

interface ProgramTeachers {
  id?: number;
  created_at?: Date;
  program_id?: number;
  program?: Program;
  user_id?: number;
  user?: Users;
}

interface ProgramTranslationLanguages {
  id?: number;
  created_at?: Date;
  language_id?: number;
  language?: Languages;
  program_id?: number;
}

interface ProgramTypeAliasNames {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  program_type?: ProgramTypes;
  alias_name?: string;
}

interface ProgramTypeDetails {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  program_type?: ProgramTypes;
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

interface ProgramTypeTags {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  program_type?: ProgramTypes;
  tag_id?: number;
  group_id?: number;
  program_id?: number;
}

interface ProgramTypeTeachers {
  id?: number;
  created_at?: Date;
  program_type_id?: number;
  user_id?: number;
  user?: Users;
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

interface ProgramTypes {
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
}

interface RegistrationFieldGroups {
  id?: number;
  created_at?: Date;
  name?: string;
  description?: string;
  order?: number;
  pre_form_help?: string;
  post_form_help?: string;
  is_active?: boolean;
}

interface RegistrationFieldValues {
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

interface State {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface Tags {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface TtpTypes {
  id?: number;
  created_at?: Date;
  name?: string;
}

interface UserOrganizationRelation {
  id?: number;
  created_at?: Date;
  user_id?: number;
  user?: Users;
  organization_id?: number;
  organization?: Organizations;
}

interface UserRoles {
  id?: number;
  created_at?: Date;
  user_id?: number;
  user?: Users;
  role_id?: number;
}

interface Users {
  id?: number;
  created_at?: Date;
  contact_id?: number;
  contact?: Contact;
  user_identifier?: string;
  user_name?: string;
}

interface Venue {
  id?: number;
  created_at?: Date;
  state_id?: number;
  state?: State;
  city_id?: number;
  city?: City;
  postal_code?: string;
  address?: string;
  name?: string;
  latitude?: string;
  longitude?: string;
  center_id?: number;
  center?: Center;
  created_by_user_id?: number;
  created_by_user?: Users;
}

interface OrganizationCalenderSettings {
  id?: number;
  created_at?: Date;
  is_city_enabled?: boolean;
  is_state_enabled?: boolean;
  Is_venue_enabled?: boolean;
  organization_id?: number;
  organization?: Organizations;
}

interface OrganizationInfo {
  id?: number;
  created_at?: Date;
  minimum_age_for_adult_programs?: boolean;
  enable_reminder_emails?: boolean;
  no_of_days_for_remainder_1?: number;
  no_of_days_for_remainder_2?: number;
  enable_language_preference_for_courses?: boolean;
  enable_language_preference_for_events?: boolean;
}

interface Organizations {
  id?: number;
  created_at?: Date;
  name?: string;
  is_active?: boolean;
  tax_enabled?: boolean;
  tax_rate?: number;
  support_email?: string;
}

interface ParticipantAttendenceStatus {
  id?: number;
  created_at?: Date;
  participant_id?: number;
  program_id?: number;
  program_schedule_id?: number;
  is_attended?: boolean;
}

interface ParticipantPaymentHistory {
  id?: number;
  created_at?: Date;
  payment_transaction_id?: number;
  currency_code?: string;
  participant_id?: number;
  participant?: Contact;
  program_id?: number;
  total_amount?: number;
  transaction_type?: string;
  transaction_status_id?: number;
  transaction_date?: Date;
}

interface ParticipantReassignmentHistory {
  id?: number;
  created_at?: Date;
  participant_id?: number;
  old_program_id?: number;
  new_program_id?: number;
  new_participant_id?: number;
  new_participant?: Contact;
}

interface ParticipantRegistration {
  id?: number;
  created_at?: Date;
  contact_id?: number;
  contact?: Contact;
  discount_code_id?: number;
  is_payment_refund_request?: boolean;
  is_payment_refunded?: boolean;
  participant_attendence_status_id?: number;
  price_category_id?: number;
  program_category_id?: number;
  program_id?: number;
  discount_code?: string;
  discounted_amount?: number;
  discounted_tax?: number;
  hear_program_from_id?: number;
  is_health_declaration_checked?: boolean;
  is_program_agreement_checked?: boolean;
  legal_agreement_version?: number;
  payment_status_id?: number;
}

interface Program {
  id?: number;
  created_at?: Date;
  organization_id?: number;
  organization?: Organizations;
  venue_id?: number;
  venue?: Venue;
  registration_link?: string;
  program_code?: string;
  program_fee_settings_id?: number;
  program_fee_setting?: ProgramFeeSettings;
  program_type_id?: number;
  program_type?: ProgramTypes;
  status_id?: number;
  status?: OptionValues;
  accommodation_fee_payment_mode?: number;
  center_id?: number;
  center?: Center;
  city_id?: number;
  city?: City;
  details_page_link?: string;
  is_early_bird_enabled?: boolean;
  is_residential_program?: boolean;
  program_alias_name_id?: number;
  program_alias_name?: ProgramTypeAliasNames;
  program_created_by?: number;
  program_creator?: Users;
  state_id?: number;
  state?: State;
  use_default_fee?: boolean;
  is_registration_required?: boolean;
  disable_bank_transfer_paylater?: boolean;
  is_registration_via_3rd_party?: boolean;
  registration_via_3rd_party_url?: string;
  notes?: string;
  allowed_countries?: string[];
  description?: string;
  email_notes?: string;
  is_geo_restriction_applicable?: boolean;
  is_language_translation_for_participants?: boolean;
  max_capacity?: number;
  online_url?: string;
  visibility_id?: number;
  visibility?: OptionValues;
  early_bird_cut_off_period?: number;
  program_accommodations?: AccommodationTypes[];
  program_assistant_teachers?: ProgramAssistantTeachers[];
  assistant_teacher_ids?: number[];
  program_contact_details?: ProgramContactDetails[];
  program_details_info?: ProgramDetailsInfo;
  program_fee_level_settings?: ProgramFeeLevelSettings[];
  program_schedules?: ProgramSchedules[];
  program_teachers?: ProgramTeachers[];
  teacher_ids?: number[];
  program_translation_languages?: ProgramTranslationLanguages[];
  translation_language_ids?: number[];
  program_organizers?: ProgramOrganizers[];
  organizer_ids?: number[];
  program_languages?: ProgramLanguages[];
  languages_ids?: number[];
}
