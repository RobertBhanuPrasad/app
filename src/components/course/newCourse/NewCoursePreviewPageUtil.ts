import _ from "lodash";
import { fetchCourseFee } from "pages/courses/add";
import {
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
} from "src/constants/CourseConstants"
import { NATIONAL_ADMIN, SUPER_ADMIN } from "src/constants/OptionValueOrder"
import { supabaseClient } from "src/utility"
import { StaticData } from "src/zustandStore/StaticDataStore"

export const getRequiredFieldsForValidation = async (
  formData: any,
  loginUserData: any,
  countryCode: any,
  staticData: {countryConfigData:CountryConfigDataBaseType | null,timeZoneData: TimeZoneDataBaseType | null}
) => {
  const supabase = supabaseClient();

  const timeZoneData = staticData?.timeZoneData

  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  let RequiredNewCourseStep1FormNames = _.omit(
    NewCourseStep1FormNames,
    formData?.is_registration_via_3rd_party
      ? []
      : ["registration_via_3rd_party_url"]
  );

  let programTypesData: any = {};

  if (formData?.program_type_id) {
    /**
     * @constant programTypesData
     * @description this constant stores the data which came from the program_types table using the program type id which is there in the formData
     */
    const { data: programTypesDataObjects } = await supabase
      .from("program_types")
      .select("*")
      .eq("id", formData?.program_type_id);

    if (programTypesDataObjects && programTypesDataObjects.length > 0)
      programTypesData = programTypesDataObjects[0];
  }

  let RequiredNewCourseStep2FormNames = _.omit(NewCourseStep2FormNames, [
    ...(programTypesData?.has_alias_name ? [] : ["program_alias_name_id"]),
    ...(formData?.is_geo_restriction_applicable ? [] : ["allowed_countries"]),
    ...(hasSuperAdminRole ? [] : ["is_language_translation_for_participants"]),
    ...(programTypesData?.is_geo_restriction_applicable_for_registrations
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
  if (programTypesData?.is_online_program === true) {
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

  //Checking Weather login user is Super Admin or Not
  let isUserNationAdminOrSuperAdmin = false;

  //Fetching login user roles
  const user_roles: any[] = loginUserData?.userData?.user_roles || [];

  if (
    user_roles.some(
      (role) =>
        role.role_id.order === NATIONAL_ADMIN ||
        role.role_id.order === SUPER_ADMIN
    )
  ) {
    isUserNationAdminOrSuperAdmin = true;
  }

  const feeData = await fetchCourseFee({ formData, countryCode: countryCode });

  //Checking Weather a fee is editable or not
  const isFeeEditable =
    isUserNationAdminOrSuperAdmin || feeData?.[0]?.is_program_fee_editable
      ? true
      : false;

  let RequiredNewCourseStep4FormNames: string[] = ["feeLevels"];

  //If it is a Editable fee need to validate
  if (isFeeEditable) {
    RequiredNewCourseStep4FormNames = [...RequiredNewCourseStep4FormNames,"is_early_bird_enabled","program_fee_level_settings"];
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
