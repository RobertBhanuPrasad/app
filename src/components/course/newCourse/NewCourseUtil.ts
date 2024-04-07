import _ from "lodash";
import {
  COURSE_ACTIVE_STATUS_ID,
  COURSE_PENDING_REVIEW_STATUS_ID,
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep3FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
} from "src/constants/CourseConstants";
import { supabaseClient } from "src/utility";

export const handlePostProgramData = async (
  body: any,
  loggedInUserId: number,
  setProgramId: (by: number) => void
) => {
  console.log("i will post course data in this function", body);
 
  let programId = body.id;
  // we have to create course only when we dont have id
  //   if (!programId) {
  const programBody: ProgramDataBaseType = {
    last_modified_by_user_id: loggedInUserId,
  };

  // if body contains id pls insert if it does not contain id then record will create if it contains id just it will update table
  // we are using upsert function so it will take care to insert or update
  if (body.id) {
    programBody.id = body.id;
  }

  // step 1
  if (body[NewCourseStep1FormNames.program_created_by]) {
    programBody.program_created_by =
      body[NewCourseStep1FormNames.program_created_by];
  }

  if (body[NewCourseStep1FormNames.organization_id]) {
    programBody.organization_id = body[NewCourseStep1FormNames.organization_id];
  }

  if (body[NewCourseStep2FormNames.program_type_id]) {
    programBody.program_type_id = body[NewCourseStep2FormNames.program_type_id];
  }

  if (body[NewCourseStep2FormNames.visibility_id]) {
    programBody.visibility_id =
      31 || body[NewCourseStep2FormNames.visibility_id];
  }

  if (body[NewCourseStep1FormNames.is_registration_via_3rd_party]) {
    programBody.is_registration_via_3rd_party =
      body[NewCourseStep1FormNames.is_registration_via_3rd_party];
  }

  if (body[NewCourseStep1FormNames.registration_via_3rd_party_url]) {
    programBody.registration_via_3rd_party_url =
      body[NewCourseStep1FormNames.registration_via_3rd_party_url];
  }

  if (body[NewCourseStep2FormNames.program_alias_name_id]) {
    programBody.program_alias_name_id =
      body[NewCourseStep2FormNames.program_alias_name_id];
  }

  if (body[NewCourseStep2FormNames.is_language_translation_for_participants]) {
    programBody.is_language_translation_for_participants =
      body[NewCourseStep2FormNames.is_language_translation_for_participants];
  }

  if (body[NewCourseStep2FormNames.max_capacity]) {
    programBody.max_capacity = body[NewCourseStep2FormNames.max_capacity];
  }

  //allowed_countries
  if (body[NewCourseStep2FormNames.allowed_countries]) {
    programBody.allowed_countries =
      body[NewCourseStep2FormNames.allowed_countries];
  }

  //online_url
  if (body[NewCourseStep3FormNames.online_url]) {
    programBody.online_url = body[NewCourseStep3FormNames.online_url];
  }

  //state_id
  if (body[NewCourseStep3FormNames.state_id]) {
    programBody.state_id = body[NewCourseStep3FormNames.state_id];
  }

  //city_id
  if (body[NewCourseStep3FormNames.city_id]) {
    programBody.city_id = body[NewCourseStep3FormNames.city_id];
  }

  //center_id
  if (body[NewCourseStep3FormNames.center_id]) {
    programBody.center_id = body[NewCourseStep3FormNames.center_id];
  }

  //hour_format_id
  if (body[NewCourseStep3FormNames.hour_format_id]) {
    programBody.hour_format_id = body[NewCourseStep3FormNames.hour_format_id];
  }

  //time_zone_id
  if (body[NewCourseStep3FormNames.time_zone_id]) {
    programBody.time_zone_id = body[NewCourseStep3FormNames.time_zone_id];
  }

  // step 4
  if (body[NewCourseStep4FormNames.is_early_bird_enabled] || true) {
    //TODO: new to remove || true
    programBody.is_early_bird_enabled =
      body[NewCourseStep4FormNames.is_early_bird_enabled] || true;
  }

  //Fetching fee level settings of course
  const { data: feeData, error } = await supabaseClient.functions.invoke(
    "course-fee",
    {
      method: "POST",
      body: {
        state_id: "3", //TODO Need to change with form data
        city_id: "3",
        center_id: "1",
        start_date: "2024-03-18T07:00:00-00:00",
        program_type_id: body?.program_type_id,
      },
    }
  );

  if (error) {
    console.log("error while fetching fee data", error);
  }

  if (body[NewCourseStep4FormNames?.program_fee_level_settings]?.length == 0) {
    programBody.program_fee_settings_id = feeData?.[0]?.id;
  } else {
    programBody.early_bird_cut_off_period = body["early_bird_cut_off_period"]
      ? body["early_bird_cut_off_period"]
      : feeData?.[0]?.early_bird_cut_off_period;
  }

  // step 5

  //is_residential_program
  if (body[NewCourseStep5FormNames.is_residential_program]) {
    programBody.is_residential_program =
      body[NewCourseStep5FormNames.is_residential_program];
  }

  //accommodation_fee_payment_mode
  if (
    body[NewCourseStep5FormNames.accommodation_fee_payment_mode] &&
    body[NewCourseStep5FormNames?.is_residential_program]
  ) {
    programBody.accommodation_fee_payment_mode =
      body[NewCourseStep5FormNames.accommodation_fee_payment_mode];
  }

  // step 6
  //bcc_registration_confirmation_email
  if (body[NewCourseStep6FormNames.bcc_registration_confirmation_email]) {
    programBody.bcc_registration_confirmation_email =
      body[NewCourseStep6FormNames.bcc_registration_confirmation_email];
  }

  console.log("body to create program", programBody);

  const { data: programData, error: programError } = await supabaseClient
    .from("program")
    .upsert(programBody)
    .select();
  console.log("course data is created", programData);

  if (programError) {
    console.log(programError);
    return false;
  } else {
    programId = programData[0].id;
    //call zustand function to store created programId
    // so that it can be helpful in thankyou page
    setProgramId(programId);
  }

  //   await handlePostProgramInfoData(body, programId);

  // if anyone of above was returning false it means there was an error so we will not display thank you page
  // so that he will click again continue

  if (!(await handlePostProgramOrganizersData(body, programId))) return false;

  if (!(await handlePostProgramTeachersData(body, programId))) return false;

  if (!(await handlePostProgramAssistantTeachersData(body, programId)))
    return false;

  if (!(await handlePostProgramLanguagesData(body, programId))) return false;

  if (!(await handlePostProgramTranslationLanguagesData(body, programId)))
    return false;

  if (!(await handleProgramSchedulesData(body, programId))) return false;

  if (!(await handleProgramFeeLevelSettingsData(body, programId))) return false;

  if (!(await handlePostProgramContactDetailsData(body, programId)))
    return false;

  //now after all data was stored into respective table we have to update status of program
  //Requirement: If the slected program_type of the program contains is_approval_required:true then we have to update status of program to "pending_approval"
  //Requirement: If the slected program_type of the program contains is_approval_required:false then we have to update status of program to "active"

  if (!(await handleProgramStatusUpdate(programId))) return false;

  return true;
};

export const handlePostProgramInfoData = async (
  body: any,
  programId: number
) => {
  // store is_registration_via_3rd_party,registration_via_3rd_party_url data in program_details_info
  const programDetailsInfoData: ProgramDetailsInfoDataBaseType = {
    //TODO: need to remove 31
  };

  programDetailsInfoData.program_id = programId;

  console.log("program details info data to create", programDetailsInfoData);

  const { data: programDetailsInfoResponse, error: programDetailsError } =
    await supabaseClient
      .from("program_details_info")
      .insert(programDetailsInfoData)
      .select();

  if (programDetailsError) {
    console.log(
      "error while creating data of program details info",
      programDetailsError
    );
    return;
  } else {
    console.log(
      "program detials info data is created",
      programDetailsInfoResponse
    );
  }
};

export const handlePostProgramOrganizersData = async (
  body: any,
  programId: number
) => {
  //store program organizers in program_organizers table and

  // Step 1: Retrieve existing organizers of the program from the database
  const { data: existingOrganizersResponse } = await supabaseClient
    .from("program_organizers")
    .select("user_id")
    .eq("program_id", programId);

  // Extract the user IDs of existing organizers
  const existingOrganizers: number[] = existingOrganizersResponse?.map(
    (organizer) => organizer.user_id
  ) as number[];

  // Step 2: Determine organizers to remove
  const organizersToRemove = _.difference(
    existingOrganizers,
    body.organizer_ids
  );

  // Step 3: Remove organizers from the program_organizers table
  if (organizersToRemove.length > 0) {
    await supabaseClient
      .from("program_organizers")
      .delete()
      .eq("program_id", programId)
      .in("user_id", organizersToRemove);
  }

  // Step 4: Determine organizers to add
  const organizersToAdd = _.difference(body.organizer_ids, existingOrganizers);

  // Step 5: Insert new organizers into the program_organizers table
  if (organizersToAdd.length > 0) {
    const organizersToAddData: ProgramOrganizersDataBaseType[] =
      organizersToAdd.map((userId) => ({
        program_id: programId,
        user_id: userId,
      }));

    const { data: programOrganizerData, error: programOrganizerError } =
      await supabaseClient
        .from("program_organizers")
        .insert(organizersToAddData);

    console.log("program organizers data is created", programOrganizerData);

    if (programOrganizerError) {
      console.log(
        "error while creating data of program organizers",
        programOrganizerError
      );
      return false;
    }
  }
  return true;
};

export const handlePostProgramTeachersData = async (
  body: any,
  programId: number
) => {
  // Step 1: Retrieve existing teachers of the program from the database
  const { data: existingTeachersResponse } = await supabaseClient
    .from("program_teachers")
    .select("user_id")
    .eq("program_id", programId);

  // Extract the user IDs of existing teachers
  const existingTeachers: number[] = existingTeachersResponse?.map(
    (teacher) => teacher.user_id
  ) as number[];

  // Step 2: Determine teachers to remove
  const teachersToRemove = _.difference(
    existingTeachers,
    body[NewCourseStep2FormNames.teacher_ids]
  );

  // Step 3: Remove teachers from the program_teachers table
  if (teachersToRemove.length > 0) {
    await supabaseClient
      .from("program_teachers")
      .delete()
      .eq("program_id", programId)
      .in("user_id", teachersToRemove);
  }

  // Step 4: Determine teachers to add
  const teachersToAdd = _.difference(
    body[NewCourseStep2FormNames.teacher_ids],
    existingTeachers
  );

  // Step 5: Insert new teachers into the program_teachers table
  if (teachersToAdd.length > 0) {
    const teachersToAddData: ProgramTeachersDataBaseType[] = teachersToAdd.map(
      (userId: number) => ({
        program_id: programId,
        user_id: userId,
      })
    );

    const { data: programTeacherData, error: programTeacherError } =
      await supabaseClient
        .from("program_teachers")
        .insert(teachersToAddData)
        .select();

    console.log("program teachers data is created", programTeacherData);

    if (programTeacherError) {
      console.log(
        "error while creating data of program teachers",
        programTeacherError
      );
      return false;
    }
  }

  console.log("Program teachers update complete");
  return true;
};

export const handlePostProgramAssistantTeachersData = async (
  body: any,
  programId: number
) => {
  // Step 1: Retrieve existing assistant teachers of the program from the database
  const { data: existingTeachersResponse } = await supabaseClient
    .from("program_assistant_teachers")
    .select("user_id")
    .eq("program_id", programId);

  // Extract the user IDs of existing assistant teachers
  const existingAssistantTeachers: number[] = existingTeachersResponse?.map(
    (teacher) => teacher.user_id
  ) as number[];

  // Step 2: Determine assistant teachers to remove
  const assistantTeachersToRemove = _.difference(
    existingAssistantTeachers,
    body[NewCourseStep2FormNames.assistant_teacher_ids]
  );

  // Step 3: Remove assistant teachers from the program_assistant_teachers table
  if (assistantTeachersToRemove.length > 0) {
    await supabaseClient
      .from("program_assistant_teachers")
      .delete()
      .eq("program_id", programId)
      .in("user_id", assistantTeachersToRemove);
  }

  // Step 4: Determine assistant teachers to add
  const assistantTeachersToAdd = _.difference(
    body[NewCourseStep2FormNames.assistant_teacher_ids],
    existingAssistantTeachers
  );

  // Step 5: Insert new assistant teachers into the program_assistant_teachers table
  if (assistantTeachersToAdd.length > 0) {
    const assistantTeachersToAddData: ProgramAssistantTeachersDataBaseType[] =
      assistantTeachersToAdd.map((userId: number) => ({
        program_id: programId,
        user_id: userId,
      }));

    const {
      data: programAssistantTeacherData,
      error: programAssistantTeacherError,
    } = await supabaseClient
      .from("program_assistant_teachers")
      .insert(assistantTeachersToAddData)
      .select();

    console.log(
      "program assistant teachers data is created",
      programAssistantTeacherData
    );

    if (programAssistantTeacherError) {
      console.log(
        "error while creating data of program assistant teachers",
        programAssistantTeacherError
      );
      return false;
    }
  }

  console.log("Program assistant teachers update complete");
  return true;
};

export const handlePostProgramLanguagesData = async (
  body: any,
  programId: number
) => {
  // Step 1: Retrieve existing languages of the program from the database
  const { data: existingLanguagesResponse } = await supabaseClient
    .from("program_languages")
    .select("language_id")
    .eq("program_id", programId);

  // Extract the language IDs of existing languages
  const existingLanguages: number[] = existingLanguagesResponse?.map(
    (language) => language.language_id
  ) as number[];

  // Step 2: Determine languages to remove
  const languagesToRemove = _.difference(
    existingLanguages,
    body[NewCourseStep2FormNames.language_ids]
  );

  // Step 3: Remove languages from the program_languages table
  if (languagesToRemove.length > 0) {
    await supabaseClient
      .from("program_languages")
      .delete()
      .eq("program_id", programId)
      .in("language_id", languagesToRemove);
  }

  // Step 4: Determine languages to add
  const languagesToAdd = _.difference(
    body[NewCourseStep2FormNames.language_ids],
    existingLanguages
  );

  // Step 5: Insert new languages into the program_languages table
  if (languagesToAdd.length > 0) {
    const languagesToAddData: ProgramLanguagesDataBaseType[] =
      languagesToAdd.map((languageId: number) => ({
        program_id: programId,
        language_id: languageId,
      }));

    const { data: programLanguageData, error: programLanguageError } =
      await supabaseClient
        .from("program_languages")
        .insert(languagesToAddData)
        .select();

    console.log("program languages data is created", programLanguageData);

    if (programLanguageError) {
      console.log(
        "error while creating data of program languages",
        programLanguageError
      );
      return false;
    }
  }

  console.log("Program languages update complete");
  return true;
};

export const handlePostProgramTranslationLanguagesData = async (
  body: any,
  programId: number
) => {
  // Step 1: Retrieve existing translation languages of the program from the database
  const { data: existingTranslationLanguagesResponse } = await supabaseClient
    .from("program_translation_languages")
    .select("language_id")
    .eq("program_id", programId);

  // Extract the language IDs of existing translation languages
  const existingTranslationLanguages: number[] =
    existingTranslationLanguagesResponse?.map(
      (language) => language.language_id
    ) as number[];

  // Step 2: Determine translation languages to remove
  const translationLanguagesToRemove = _.difference(
    existingTranslationLanguages,
    body[NewCourseStep2FormNames.translation_language_ids]
  );

  // Step 3: Remove translation languages from the program_translation_languages table
  if (translationLanguagesToRemove.length > 0) {
    await supabaseClient
      .from("program_translation_languages")
      .delete()
      .eq("program_id", programId)
      .in("language_id", translationLanguagesToRemove);
  }

  // Step 4: Determine translation languages to add
  const translationLanguagesToAdd = _.difference(
    body[NewCourseStep2FormNames.translation_language_ids],
    existingTranslationLanguages
  );

  // Step 5: Insert new translation languages into the program_translation_languages table
  if (translationLanguagesToAdd.length > 0) {
    const translationLanguagesToAddData: ProgramTranslationLanguagesDataBaseType[] =
      translationLanguagesToAdd.map((languageId: number) => ({
        program_id: programId,
        language_id: languageId,
      }));

    const {
      data: programTranslationLanguageData,
      error: programTranslationLanguageError,
    } = await supabaseClient
      .from("program_translation_languages")
      .insert(translationLanguagesToAddData)
      .select();

    console.log(
      "program translation languages data is created",
      programTranslationLanguageData
    );

    if (programTranslationLanguageError) {
      console.log(
        "error while creating data of program translation languages",
        programTranslationLanguageError
      );
      return false;
    }
  }

  console.log("Program translation languages update complete");

  return true;
};

export const handleProgramSchedulesData = async (
  body: any,
  programId: number
) => {
  // Delete records which are not present in body schedules and present in database
  const { data: existingScheduleData } = await supabaseClient
    .from("program_schedules")
    .select("id")
    .eq("program_id", programId);

  const scheduleIdsToDelete = _.difference(
    existingScheduleData?.map((schedule) => schedule.id),
    body[NewCourseStep3FormNames.schedules]?.map((schedule: any) => schedule.id)
  );

  if (scheduleIdsToDelete.length > 0) {
    const { data } = await supabaseClient
      .from("program_schedules")
      .delete()
      .in("id", scheduleIdsToDelete)
      .select();

    console.log(
      "deleted schedules because they are not present in database ",
      data
    );
  }

  const schedulesData: ProgramSchedulesDataBaseType[] = body[
    NewCourseStep3FormNames.schedules
  ].map((scheduleData: any, index: number) => {
    const {
      startHour = "00",
      startMinute = "00",
      endHour = "00",
      endMinute = "00",
      startTimeFormat,
      endTimeFormat,
      date,
    } = scheduleData;

    // Parse date and time strings to create Date objects
    const startTime = new Date(date);
    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
    if (startTimeFormat === "PM") startTime.setHours(startTime.getHours() + 12);

    const endTime = new Date(date);
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);
    if (endTimeFormat === "PM") endTime.setHours(endTime.getHours() + 12);

    const scheduleBody: ProgramSchedulesDataBaseType = {
      program_id: programId,
      start_time: startTime,
      end_time: endTime,
      program_schedule_name: `Schedule ${index + 1}`,
      //TODO: schedule_type is optional if need we need to pass here
      order: index + 1,
    };

    if (scheduleData.id) {
      scheduleBody.id = scheduleData.id;
    }

    return scheduleBody;
  });

  console.log(
    "schedulesData to create or update program_schedules was",
    schedulesData
  );

  // Perform upsert operation for all schedules at once
  const { data, error } = await supabaseClient
    .from("program_schedules")
    .upsert(schedulesData)
    .select();

  if (error) {
    console.error("Error while upserting program schedules:", error);
    return false;
  } else {
    console.log("Program schedules upsert complete:", data);
  }
  console.log("Program schedules upsert complete");
  return true;
};

export const handlePostAccommodations = async (
  body: any,
  programId: number
) => {
  // Delete records which are not present in body accommodations and present in database
  const { data: existingAccommodationData } = await supabaseClient
    .from("program_accommodations")
    .select("id")
    .eq("program_id", programId);

  const accommodationIdsToDelete = _.difference(
    existingAccommodationData?.map((accommodation) => accommodation.id),
    body[NewCourseStep5FormNames.accommodation]?.map(
      (accommodation: any) => accommodation.id
    )
  );

  if (accommodationIdsToDelete.length > 0) {
    const { data } = await supabaseClient
      .from("program_accommodations")
      .delete()
      .in("id", accommodationIdsToDelete)
      .select();

    console.log("deleted this record because this are not there in form", data);
  }

  // Prepare accommodation data
  const accommodationsData: ProgramAccommodationsDataBaseType[] = body[
    NewCourseStep5FormNames.accommodation
  ]?.map((accommodationData: any) => {
    const dataObject: ProgramAccommodationsDataBaseType = {
      program_id: programId,
      accommodation_type_id: accommodationData.accommodation_type_id,
      fee_per_person: accommodationData.fee_per_person,
      no_of_residential_spots: accommodationData.no_of_residential_spots,
    };

    if (accommodationData.id) {
      dataObject.id = accommodationData.id;
    }

    return dataObject;
  });

  // Perform upsert operation
  const { data, error } = await supabaseClient
    .from("program_accommodations")
    .upsert(accommodationsData)
    .select();

  // Handle upsert result
  if (error) {
    console.error("Error while upserting accommodations:", error);
    return false;
  } else {
    console.log("Accommodations upsert complete:", data);
  }
  return true;
};

export const handlePostProgramContactDetailsData = async (
  body: any,
  programId: number
) => {
  // Delete records which are not present in body contact details and present in database
  const { data: existingContactDetailsData } = await supabaseClient
    .from("program_contact_details")
    .select("id")
    .eq("program_id", programId);

  const contactDetailsIdsToDelete = _.difference(
    existingContactDetailsData?.map((contact) => contact.id),
    body[NewCourseStep6FormNames.contact]?.map((contact: any) => contact.id)
  );

  if (contactDetailsIdsToDelete.length > 0) {
    const { data } = await supabaseClient
      .from("program_contact_details")
      .delete()
      .in("id", contactDetailsIdsToDelete)
      .select();

    console.log(
      "Deleted these contact details records because they are not present in the form:",
      data
    );
  }

  // Prepare contact details data
  const contactDetailsData: ProgramContactDetailsDataBaseType[] = body[
    NewCourseStep6FormNames.contact
  ]?.map((contactData: any) => {
    const dataObject: ProgramContactDetailsDataBaseType = {
      program_id: programId,
      contact_name: contactData.contact_name,
      contact_email: contactData.contact_email,
      contact_number: contactData.contact_number,
    };

    if (contactData.id) {
      dataObject.id = contactData.id;
    }

    return dataObject;
  });

  console.log(
    "contactDetailsData need to create in databse",
    contactDetailsData
  );
  // Perform upsert operation
  const { data, error } = await supabaseClient
    .from("program_contact_details")
    .upsert(contactDetailsData)
    .select();

  // Handle upsert result
  if (error) {
    console.error("Error while upserting program contact details:", error);
    return false;
  } else {
    console.log("Program contact details upsert complete:", data);
  }

  return true;
};

export const handleProgramStatusUpdate = async (programId: number) => {
  const { data, error }: any = await supabaseClient
    .from("program")
    .select("id,program_type_id(*)")
    .eq("id", programId);

  if (error) {
    console.log(
      "error was happened while fetch data of program at the time of updat status_id",
      error
    );
    return false;
  }

  const is_approval_required: boolean | null =
    data[0]?.program_type_id?.is_approval_required;

  if (is_approval_required === null) {
    console.log("in program type there is no is_approval_required");
    console.warn("it should need to be true or false");
    return false;
  }

  if (is_approval_required) {
    console.log("program is_approval_required");
    console.log("patching program status_id as pending");

    const { data, error } = await supabaseClient
      .from("program")
      .update({
        status_id: COURSE_PENDING_REVIEW_STATUS_ID,
      })
      .eq("id", programId)
      .select();

    if (error) {
      console.log(
        "error was happened while patching program status_id as pending",
        error
      );
      return false;
    } else {
      console.log("patched program status_id as pending", data);
    }
    return true;
  } else {
    console.log("program doesnt need approval which is auto approval");
    console.log("patching program status_id as active directley");

    const { data, error } = await supabaseClient
      .from("program")
      .update({
        status_id: COURSE_ACTIVE_STATUS_ID,
      })
      .eq("id", programId)
      .select();

    if (error) {
      console.log(
        "error was happened while patching program status_id as active",
        error
      );
      return false;
    } else {
      console.log("patched program status_id as active", data);
    }
  }

  return true;
};

export const handleProgramFeeLevelSettingsData = async (
  body: any,
  programId: number
) => {
  if (body?.program_fee_level_settings?.length == 0) {
    return true;
  }
  // Fetching the existing fee level settings data
  const { data: existingFeeLevelSettingsData } = await supabaseClient
    .from("program_fee_level_settings")
    .select("id")
    .eq("program_id", programId);

  //Inserting ids of program fee level settings already exist
  const modifiedProgramFeeLevel = body?.program_fee_level_settings?.map(
    (feeLevel: any, index: number) => {
      if (existingFeeLevelSettingsData?.[index]?.id) {
        return {
          id: existingFeeLevelSettingsData?.[index]?.id,
          program_id: programId,
          ...feeLevel,
        };
      }
      return { program_id: programId, ...feeLevel };
    }
  );

  //upsert operation for program feeLevel settings data
  const { data, error } = await supabaseClient
    .from("program_fee_level_settings")
    .upsert(modifiedProgramFeeLevel)
    .select();

  if (error) {
    console.log("Error while posting program fee level settings data", error);
    return false;
  } else {
    console.log("Program fee level settings upsert complete", data);
  }

  return true;
};
