import _ from "lodash";
import { TransformDataStructureWithHigherOrderConversion } from "src/utility/InternalHigherOrderDataStructure";

export const mapContactModifiedDataStructure = (
  data: ContactDataBaseType
): Contact => {
  const modifiedData: Contact = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.first_name !== undefined) modifiedData.first_name = data.first_name;
  if (data.last_name !== undefined) modifiedData.last_name = data.last_name;
  if (data.email !== undefined) modifiedData.email = data.email;
  if (data.mobile !== undefined) modifiedData.mobile = data.mobile;
  if (data.identification_num !== undefined)
    modifiedData.identification_num = data.identification_num;
  if (data.state_id !== undefined) {
    if (typeof data.state_id == "number") {
      modifiedData.state_id = data.state_id;
    } else {
      modifiedData.state_id = data.state_id?.id;
      modifiedData.state = data.state_id;
    }
  }
  if (data.city_id !== undefined) {
    modifiedData.city_id = data.city_id as number;
  }
  if (data.postal_code !== undefined)
    modifiedData.postal_code = data.postal_code;
  if (data.date_of_birth !== undefined)
    modifiedData.date_of_birth = data.date_of_birth;
  if (data.identification_type_id !== undefined)
    modifiedData.identification_type_id = data.identification_type_id;
  if (data.contact_type !== undefined)
    modifiedData.contact_type = data.contact_type;
  if (data.mobile_country_code !== undefined)
    modifiedData.mobile_country_code = data.mobile_country_code;
  if (data.gender_id !== undefined) modifiedData.gender_id = data.gender_id;
  if (data.full_name !== undefined) modifiedData.full_name = data.full_name;
  if (data.country_id !== undefined) modifiedData.country_id = data.country_id;
  if (data.preferred_to_receive_notifications !== undefined)
    modifiedData.preferred_to_receive_notifications =
      data.preferred_to_receive_notifications;

  return modifiedData;
};

export const mapUsersModifiedDataStructure = (
  data: UsersDataBaseType
): Users => {
  const modifiedData: Users = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.contact_id !== undefined) {
    if (typeof data.contact_id == "number") {
      modifiedData.contact_id = data.contact_id;
    } else {
      (modifiedData.contact_id = data.contact_id?.id),
        (modifiedData.contact = data.contact_id as Contact);
    }
  }
  if (data.user_identifier !== undefined)
    modifiedData.user_identifier = data.user_identifier;
  if (data.user_name !== undefined) modifiedData.user_name = data.user_name;

  return modifiedData;
};

export const mapOrganizationsModifiedDataStructure = (
  data: OrganizationsDataBaseType
) => {
  const modifiedData: Organizations = {};

  // Conditionally assign properties
  if (data.id !== undefined) modifiedData.id = data.id;

  if (data.is_active !== undefined) modifiedData.is_active = data.is_active;

  if (data.name !== undefined) modifiedData.name = data.name;

  if (data.support_email !== undefined)
    modifiedData.support_email = data.support_email;

  if (data.tax_enabled !== undefined)
    modifiedData.support_email = data.support_email;

  if (data.tax_rate !== undefined) modifiedData.tax_rate = data.tax_rate;

  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;

  return modifiedData;
};

export const mapProgramTeachersModifiedDataStructure = (
  data: ProgramTeachersDataBaseType
) => {
  const modifiedData: ProgramTeachers = {};

  if (data.id !== undefined) modifiedData.id = data.id;

  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;

  if (data.program_id !== undefined) {
    if (typeof data.program_id == "number") {
      modifiedData.program_id = data.program_id;
    } else {
      modifiedData.program = data.program_id as Program;
    }
  }

  if (data.user_id !== undefined) {
    if (typeof data.user_id == "number") {
      modifiedData.user_id = data?.user_id;
    } else {
      modifiedData.user = data?.user_id as Users;
    }
  }

  return modifiedData;
};

export const mapCenterModifiedDataStructure = (
  data: CenterDataBaseType
): Center => {
  const modifiedData: Center = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.name !== undefined) modifiedData.name = data.name;
  if (data.city_id !== undefined) {
    if (typeof data?.city_id == "number") {
      modifiedData.city_id = data?.city_id;
    } else {
      modifiedData.city = data?.city_id as City;
    }
  }
  if (data.state_id !== undefined) {
    if (typeof data?.state_id == "number") {
      modifiedData.state_id = data?.state_id;
    } else {
      modifiedData.state = data?.state_id as State;
    }
  }
  if (data.latitude !== undefined) modifiedData.latitude = data.latitude;
  if (data.longitude !== undefined) modifiedData.longitude = data.longitude;

  return modifiedData;
};

export const mapProgramAssistantTeachersModifiedDataStructure = (
  data: ProgramAssistantTeachersDataBaseType
): ProgramAssistantTeachers => {
  const modifiedData: ProgramAssistantTeachers = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.program_id !== undefined) modifiedData.program_id = data.program_id;

  if (data.user_id !== undefined) {
    if (typeof data.user_id === "number") {
      modifiedData.user_id = data.user_id;
    } else {
      modifiedData.user_id = data.user_id?.id;
      modifiedData.user = data.user_id as Users;
    }
  }

  return modifiedData;
};

export const mapProgramAccommodationsModifiedDataStructure = (
  data: ProgramAccommodationsDataBaseType
): ProgramAccommodations => {
  const modifiedData: ProgramAccommodations = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;

  if (data.accommodation_type_id !== undefined) {
    if (typeof data.accommodation_type_id === "number") {
      modifiedData.accommodation_type_id = data.accommodation_type_id;
    } else {
      modifiedData.accommodation_type_id = data.accommodation_type_id?.id;
      modifiedData.accommodation_type =
        data.accommodation_type_id as AccommodationTypes;
    }
  }

  if (data.fee_per_person !== undefined)
    modifiedData.fee_per_person = data.fee_per_person;

  if (data.no_of_residential_spots !== undefined)
    modifiedData.no_of_residential_spots = data.no_of_residential_spots;

  if (data.program_id !== undefined) modifiedData.program_id = data.program_id;

  return modifiedData;
};

export const mapProgramContactDetailsModifiedDataStructure = (
  data: ProgramContactDetailsDataBaseType
): ProgramContactDetails => {
  const modifiedData: ProgramContactDetails = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.program_id !== undefined) modifiedData.program_id = data.program_id;
  if (data.contact_name !== undefined)
    modifiedData.contact_name = data.contact_name;
  if (data.contact_email !== undefined)
    modifiedData.contact_email = data.contact_email;
  if (data.contact_number !== undefined)
    modifiedData.contact_number = data.contact_number;

  return modifiedData;
};

export const mapProgramDetailsInfoModifiedDataStructure = (
  data: ProgramDetailsInfoDataBaseType
): ProgramDetailsInfo => {
  const modifiedData: ProgramDetailsInfo = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.is_registration_required !== undefined)
    modifiedData.is_registration_required = data.is_registration_required;
  if (data.disable_bank_transfer_paylater !== undefined)
    modifiedData.disable_bank_transfer_paylater =
      data.disable_bank_transfer_paylater;
  if (data.program_id !== undefined) {
    if (typeof data.program_id === "number") {
      modifiedData.program_id = data.program_id;
    } else {
      modifiedData.program_id = data.program_id?.id;
      modifiedData.program = data.program_id as Program;
    }
  }
  if (data.is_registration_via_3rd_party !== undefined)
    modifiedData.is_registration_via_3rd_party =
      data.is_registration_via_3rd_party;
  if (data.registration_via_3rd_party_url !== undefined)
    modifiedData.registration_via_3rd_party_url =
      data.registration_via_3rd_party_url;
  if (data.notes !== undefined) modifiedData.notes = data.notes;
  if (data.allowed_countries !== undefined)
    modifiedData.allowed_countries = data.allowed_countries;
  if (data.description !== undefined)
    modifiedData.description = data.description;
  if (data.email_notes !== undefined)
    modifiedData.email_notes = data.email_notes;
  if (data.is_geo_restriction_applicable !== undefined)
    modifiedData.is_geo_restriction_applicable =
      data.is_geo_restriction_applicable;
  if (data.is_language_translation_for_participants !== undefined)
    modifiedData.is_language_translation_for_participants =
      data.is_language_translation_for_participants;
  if (data.max_capacity !== undefined)
    modifiedData.max_capacity = data.max_capacity;
  if (data.online_url !== undefined) modifiedData.online_url = data.online_url;
  if (data.visibility_id !== undefined) {
    if (typeof data.visibility_id === "number") {
      modifiedData.visibility_id = data.visibility_id;
    } else {
      modifiedData.visibility_id = data.visibility_id?.id;
      modifiedData.visibility = data.visibility_id as OptionValues;
    }
  }
  if (data.early_bird_cut_off_period !== undefined)
    modifiedData.early_bird_cut_off_period = data.early_bird_cut_off_period;

  return modifiedData;
};

export const mapProgramFeeLevelSettingsModifiedDataStructure = (
  data: ProgramFeeLevelSettingsDataBaseType
): ProgramFeeLevelSettings => {
  const modifiedData: ProgramFeeLevelSettings = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.sub_total !== undefined) modifiedData.sub_total = data.sub_total;
  if (data.total !== undefined) modifiedData.total = data.total;
  if (data.tax !== undefined) modifiedData.tax = data.tax;
  if (data.is_enable !== undefined) modifiedData.is_enable = data.is_enable;
  if (data.program_fee_setting_id !== undefined) {
    if (typeof data.program_fee_setting_id === "number") {
      modifiedData.program_fee_setting_id = data.program_fee_setting_id;
    } else {
      modifiedData.program_fee_setting_id = data.program_fee_setting_id?.id;
      modifiedData.program_fee_setting =
        data.program_fee_setting_id as ProgramFeeSettings;
    }
  }
  if (data.custom_fee_label !== undefined)
    modifiedData.custom_fee_label = data.custom_fee_label;
  if (data.early_bird_sub_total !== undefined)
    modifiedData.early_bird_sub_total = data.early_bird_sub_total;
  if (data.early_brid_tax !== undefined)
    modifiedData.early_brid_tax = data.early_brid_tax;
  if (data.early_brid_total !== undefined)
    modifiedData.early_brid_total = data.early_brid_total;
  if (data.fee_level_id !== undefined) {
    if (typeof data.fee_level_id === "number") {
      modifiedData.fee_level_id = data.fee_level_id;
    } else {
      modifiedData.fee_level_id = data.fee_level_id?.id;
      modifiedData.fee_level = data.fee_level_id as OptionValues;
    }
  }
  if (data.is_custom_fee !== undefined)
    modifiedData.is_custom_fee = data.is_custom_fee;
  if (data.program_id !== undefined) {
    if (typeof data.program_id === "number") {
      modifiedData.program_id = data.program_id;
    } else {
      modifiedData.program_id = data.program_id?.id;
      modifiedData.program = data.program_id as Program;
    }
  }

  return modifiedData;
};

export const mapProgramSchedulesModifiedDataStructure = (
  data: ProgramSchedulesDataBaseType
): ProgramSchedules => {
  const modifiedData: ProgramSchedules = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.program_id !== undefined) modifiedData.program_id = data.program_id;
  if (data.start_time !== undefined) modifiedData.start_time = data.start_time;
  if (data.end_time !== undefined) modifiedData.end_time = data.end_time;
  if (data.program_schedule_name !== undefined)
    modifiedData.program_schedule_name = data.program_schedule_name;
  if (data.schedule_type !== undefined)
    modifiedData.schedule_type = data.schedule_type;
  if (data.order !== undefined) modifiedData.order = data.order;

  return modifiedData;
};

export const mapProgramTranslationLanguagesModifiedDataStructure = (
  data: ProgramTranslationLanguagesDataBaseType
): ProgramTranslationLanguages => {
  const modifiedData: ProgramTranslationLanguages = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.language_id !== undefined) {
    if (typeof data.language_id === "number") {
      modifiedData.language_id = data.language_id;
    } else {
      modifiedData.language = data.language_id as Languages;
      modifiedData.language_id = data.language_id.id;
    }
  }
  if (data.program_id !== undefined) modifiedData.program_id = data.program_id;

  return modifiedData;
};

export const mapProgramOrganizersModifiedDataStructure = (
  data: ProgramOrganizersDataBaseType
): ProgramOrganizers => {
  const modifiedData: ProgramOrganizers = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.program_id !== undefined) modifiedData.program_id = data.program_id;
  if (data.user_id !== undefined) {
    if (typeof data.user_id === "number") {
      modifiedData.user_id = data.user_id;
    } else {
      modifiedData.user = data.user_id as Users;
      modifiedData.user_id = data.user_id.id;
    }
  }

  return modifiedData;
};

export const mapProgramTypeAliasNamesModifiedDataStructure = (
  data: ProgramTypeAliasNamesDataBaseType
): ProgramTypeAliasNames => {
  const modifiedData: ProgramTypeAliasNames = {};

  if (data.id !== undefined) modifiedData.id = data.id;
  if (data.created_at !== undefined) modifiedData.created_at = data.created_at;
  if (data.program_type_id !== undefined) {
    if (typeof data.program_type_id == "number") {
      modifiedData.program_type_id = data.program_type_id;
    } else {
      modifiedData.program_type = data.program_type_id;
      modifiedData.program_type_id = data.program_type_id?.id;
    }
  }
  if (data.alias_name !== undefined) modifiedData.alias_name = data.alias_name;

  return modifiedData;
};

export const mapProgramModifiedDataStructure = (
  data: ProgramDataBaseType
): Program => {
  const modifiedData: Program = {};

  if (data?.id !== undefined) modifiedData.id = data?.id;
  if (data?.created_at !== undefined) modifiedData.created_at = data.created_at;

  if (data?.organization_id !== undefined) {
    if (typeof data.organization_id === "number") {
      modifiedData.organization_id = data.organization_id;
    } else {
      modifiedData.organization_id = data.organization_id?.id;
      modifiedData.organization = data.organization_id as Organizations;
    }
  }

  if (data?.venue_id !== undefined) {
    if (typeof data.venue_id === "number") {
      modifiedData.venue_id = data.venue_id;
    } else {
      modifiedData.venue_id = data.venue_id?.id;
      modifiedData.venue = data.venue_id as Venue;
    }
  }

  if (data?.registration_link !== undefined)
    modifiedData.registration_link = data.registration_link;
  if (data?.program_code !== undefined)
    modifiedData.program_code = data.program_code;

  if (data?.program_fee_settings_id !== undefined) {
    if (typeof data.program_fee_settings_id === "number") {
      modifiedData.program_fee_settings_id = data.program_fee_settings_id;
    } else {
      modifiedData.program_fee_settings_id = data.program_fee_settings_id?.id;
      modifiedData.program_fee_setting =
        data.program_fee_settings_id as ProgramFeeSettings;
    }
  }

  if (data?.program_type_id !== undefined) {
    if (typeof data.program_type_id === "number") {
      modifiedData.program_type_id = data.program_type_id;
    } else {
      modifiedData.program_type_id = data.program_type_id?.id;
      modifiedData.program_type = data.program_type_id as ProgramTypes;
    }
  }

  if (data?.status_id !== undefined) {
    if (typeof data.status_id === "number") {
      modifiedData.status_id = data.status_id;
    } else {
      modifiedData.status_id = data.status_id?.id;
      modifiedData.status = data.status_id as OptionValues;
    }
  }

  if (data?.accommodation_fee_payment_mode !== undefined) {
    modifiedData.accommodation_fee_payment_mode =
      data.accommodation_fee_payment_mode;
  }

  if (data?.center_id !== undefined) {
    if (typeof data.center_id === "number") {
      modifiedData.center_id = data.center_id;
    } else {
      modifiedData.center_id = data.center_id?.id;
      modifiedData.center = data.center_id as Center;
    }
  }

  if (data?.city_id !== undefined) {
    if (typeof data.city_id === "number") {
      modifiedData.city_id = data.city_id;
    } else {
      modifiedData.city_id = data.city_id?.id;
      modifiedData.city = data.city_id as City;
    }
  }

  if (data?.details_page_link !== undefined)
    modifiedData.details_page_link = data.details_page_link;

  if (data?.is_early_bird_enabled !== undefined)
    modifiedData.is_early_bird_enabled = data.is_early_bird_enabled;

  if (data?.is_residential_program !== undefined)
    modifiedData.is_residential_program = data.is_residential_program;

  if (data?.program_alias_name_id !== undefined) {
    if (typeof data.program_alias_name_id === "number") {
      modifiedData.program_alias_name_id = data.program_alias_name_id;
    } else {
      modifiedData.program_alias_name_id = data.program_alias_name_id?.id;
      modifiedData.program_alias_name =
        mapProgramTypeAliasNamesModifiedDataStructure(
          data?.program_alias_name_id
        );
    }
  }

  if (data?.program_created_by !== undefined) {
    if (typeof data.program_created_by === "number") {
      modifiedData.program_created_by = data.program_created_by;
    } else {
      modifiedData.program_created_by = data.program_created_by?.id;
      modifiedData.program_creator = data.program_created_by as OptionValues;
    }
  }

  if (data?.state_id !== undefined) {
    if (typeof data.state_id === "number") {
      modifiedData.state_id = data.state_id;
    } else {
      modifiedData.state_id = data.state_id?.id;
      modifiedData.state = data.state_id as State;
    }
  }

  if (data?.use_default_fee !== undefined)
    modifiedData.use_default_fee = data.use_default_fee;

  if (data?.program_accommodations !== undefined) {
    modifiedData.program_accommodations = modifiedData.program_accommodations =
      TransformDataStructureWithHigherOrderConversion(
        data.program_accommodations,
        mapProgramAccommodationsModifiedDataStructure
      );
  }

  if (data?.program_assistant_teachers !== undefined) {
    modifiedData.program_assistant_teachers =
      TransformDataStructureWithHigherOrderConversion(
        data.program_assistant_teachers,
        mapProgramAssistantTeachersModifiedDataStructure
      );
    modifiedData.assistant_teacher_ids = _.map(
      data.program_assistant_teachers,
      "user_id"
    ) as number[];
  }

  if (data?.program_contact_details !== undefined)
    modifiedData.program_contact_details =
      TransformDataStructureWithHigherOrderConversion(
        data.program_contact_details,
        mapProgramContactDetailsModifiedDataStructure
      );

  if (data?.program_details_info !== undefined)
    modifiedData.program_details_info =
      TransformDataStructureWithHigherOrderConversion(
        data.program_details_info,
        mapProgramDetailsInfoModifiedDataStructure
      );

  if (data?.program_fee_level_settings !== undefined)
    modifiedData.program_fee_level_settings =
      TransformDataStructureWithHigherOrderConversion(
        data?.program_fee_level_settings,
        mapProgramFeeLevelSettingsModifiedDataStructure
      );

  if (data?.program_schedules !== undefined) {
    modifiedData.program_schedules =
      TransformDataStructureWithHigherOrderConversion(
        data?.program_schedules,
        mapProgramSchedulesModifiedDataStructure
      );
  }

  if (data?.program_teachers !== undefined) {
    modifiedData.program_teachers =
      TransformDataStructureWithHigherOrderConversion(
        data?.program_teachers,
        mapProgramTeachersModifiedDataStructure
      );
    modifiedData.teacher_ids = _.map(
      data?.program_teachers,
      "user_id"
    ) as number[];
  }

  if (data?.program_translation_languages !== undefined) {
    modifiedData.program_translation_languages =
      TransformDataStructureWithHigherOrderConversion(
        data?.program_translation_languages,
        mapProgramTranslationLanguagesModifiedDataStructure
      );
  }

  if (data?.program_organizers !== undefined) {
    modifiedData.program_organizers =
      TransformDataStructureWithHigherOrderConversion(
        data.program_organizers,
        mapProgramOrganizersModifiedDataStructure
      );

    modifiedData.organizer_ids = _.map(
      data.program_organizers,
      "user_id"
    ) as number[];
  }

  return { ...data, ...modifiedData } as Program;
};
