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
  console.log("i will post course data in this functions", body);

  let programId = body.id;
  // we have to create course only when we dont have id
  //   if (!programId) {
  const programBody: ProgramDataBaseType = {
    last_modified_by_user_id: loggedInUserId,
    modified_at: new Date(),
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
    programBody.visibility_id = body[NewCourseStep2FormNames.visibility_id];
  }

  if (body[NewCourseStep1FormNames.is_registration_via_3rd_party]) {
    programBody.is_registration_via_3rd_party =
      body[NewCourseStep1FormNames.is_registration_via_3rd_party];
  }

  if (
    (body[NewCourseStep1FormNames.registration_via_3rd_party_url]! = undefined)
  ) {
    programBody.registration_via_3rd_party_url =
      body[NewCourseStep1FormNames.registration_via_3rd_party_url];
  }

  //we are getting the form data of step - 2 and assigining them to programBody for posting the data
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

  // is_geo_restriction_applicable
  if (
    body[NewCourseStep2FormNames.is_geo_restriction_applicable] != undefined
  ) {
    programBody.is_geo_restriction_applicable =
      body[NewCourseStep2FormNames.is_geo_restriction_applicable];
  }

  // is_registration_required
  if (body[NewCourseStep2FormNames.is_registration_required] != undefined) {
    programBody.is_registration_required =
      body[NewCourseStep2FormNames.is_registration_required];
  }

  //allowed_countries
  if (body[NewCourseStep2FormNames.allowed_countries]) {
    programBody.allowed_countries =
      body[NewCourseStep2FormNames.allowed_countries];
  }

  const { data: programTypeData } = await supabaseClient
    .from("program_types")
    .select("*")
    .eq("id", body?.program_type_id)
    .single();

  //Step-3

  //We have to create a venue when the program is offline .no need to create venue for online program
  if (programTypeData?.is_online_program === false) {
    const venuId = await handlePostVenueData(body, loggedInUserId);

    if (venuId === false) {
      return false;
    } else {
      programBody.venue_id = venuId;
    }
  }

  //online_url
  if (body[NewCourseStep3FormNames.online_url]) {
    programBody.online_url = body[NewCourseStep3FormNames.online_url];
  }

  //state_id
  if (body[NewCourseStep3FormNames.state_id]) {
    if (body.is_existing_venue == "new-venue") {
      programBody.state_id = body?.newVenue?.state_id;
    } else if (body?.is_existing_venue == "existing-venue") {
      programBody.state_id = body?.existingVenue?.state_id;
    } else {
      programBody.state_id = body[NewCourseStep3FormNames.state_id];
    }
  }

  //city_id
  if (body[NewCourseStep3FormNames.city_id]) {
    if (body.is_existing_venue == "new-venue") {
      programBody.city_id = body?.newVenue?.city_id;
    } else if (body?.is_existing_venue == "existing-venue") {
      programBody.city_id = body?.existingVenue?.city_id;
    } else {
      programBody.city_id = body[NewCourseStep3FormNames.city_id];
    }
  }

  //center_id
  if (body[NewCourseStep3FormNames.center_id]) {
    if (body.is_existing_venue == "new-venue") {
      programBody.center_id = body?.newVenue?.center_id;
    } else if (body?.is_existing_venue == "existing-venue") {
      programBody.center_id = body?.existingVenue?.center_id;
    } else {
      programBody.center_id = body[NewCourseStep3FormNames.center_id];
    }
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
  if (body[NewCourseStep4FormNames.is_early_bird_enabled]) {
    programBody.is_early_bird_enabled =
      body[NewCourseStep4FormNames.is_early_bird_enabled];
  } else {
    programBody.is_early_bird_enabled = false;
  }

  let stateId: number = 1,
    cityId: number = 1,
    centerId: number = 1;

  //Finding the state_id ,city_id and center_id where course is going on
  if (programTypeData?.is_online_program) {
    stateId = body?.state_id;
    cityId = body?.city_id;
    centerId = body?.center_id;
  } else {
    if (body.is_existing_venue == "new-venue") {
      stateId = body?.newVenue?.state_id;
      cityId = body?.newVenue?.city_id;
      centerId = body?.newVenue?.center_id;
    } else if (body?.is_existing_venue == "existing-venue") {
      stateId = body?.existingVenue?.state_id;
      cityId = body?.existingVenue?.city_id;
      centerId = body?.existingVenue?.center_id;
    }
  }

  //Finding course start date
  const courseStartDate = body?.schedules?.[0]?.date?.toISOString();

  //Fetching fee level settings of course
  const { data: feeData, error } = await supabaseClient.functions.invoke(
    "course-fee",
    {
      method: "POST",
      body: {
        state_id: stateId,
        city_id: cityId,
        center_id: centerId,
        start_date: courseStartDate,
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

  //is_residential_program is not undefined in the body then add to the programBody objetc
  if (body[NewCourseStep5FormNames.is_residential_program] !== undefined) {
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
  console.log("course data is created!", programData);

  if (programError) {
    console.log(programError);
    return false;
  } else {
    programId = programData[0].id;
    //call zustand function to store created programId
    // so that it can be helpful in thankyou page
    setProgramId(programId);

    // this RX base url coming from env file now.(need to change after proper table was there in backend)
    const RX_BASE_URL: string = process.env.NEXT_PUBLIC_RX_BASE_URL as string;

    // Constructing the registration URL
    // Combining the base URL or Origin of Rx ,countryCode-languageCode, programs and program ID
    // The base URL where registration information is located
    // Adding the country code to specify the country of the program
    // Adding the language code to specify the language of the program
    // Appending the program ID to identify the specific program
    // Constructing the complete registration URL
    // this url is now posted to the program api which is used to further usage in the details view or at any other place.

    // TODO : need to integrate with country code and language code after translations are done
    const registrationUrl = `${RX_BASE_URL}/programs/${programId}`;

    // TODO need to integrate with url provided by cx team -(kalyan)
    const CX_BASE_URL: string = process.env.NEXT_PUBLIC_CX_BASE_URL as string;

    // here we have to update the created_by_user_id with loggedInUserId because this field is required
    // to know the who is created this course and this attribute is used to at the course details page who is announced this course.
    // here we have to update when we are creating the program that is when created_by_user_id is null
    // other wise no need to update the created_by_user_id
    // when one user create one program at that time we have to post created_by_user_id
    // if another person is going to edit the program which is already created by another user in this case we need not to patch the created by user id.
    // only at the time of create new program at that time only we need to update the created_by_user_id because one program is announced by one user only.
    if (loggedInUserId && programData[0].created_by_user_id == null) {
      await supabaseClient
        .from("program")
        .update({
          created_by_user_id: loggedInUserId,
          details_page_link: CX_BASE_URL,
          registration_link: registrationUrl,
        })
        .eq("id", programId);
    }

    //TODO: We are doing this in backend for only first deployment
    //TODO: We have to remove from here and need to keep in backend for code
    if (!programData[0]?.program_code) {
      await handleGenerateProgramCode(programId, loggedInUserId);
    }
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

  //if it is not online program and it is residential only we need to post the accommodations to the program_accommodations table
  if (
    programTypeData?.is_online_program === false &&
    body[NewCourseStep5FormNames.is_residential_program]
  ) {
    if (!(await handlePostAccommodations(body, programId))) return false;
  }

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
    .upsert(accommodationsData, { defaultToNull: false })
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

  /**
   * Upserts (inserts or updates) the contact data into the database.
   * This function ensures that if the data already exists, it will be updated;
   * otherwise, it will be inserted. It handles the process of inserting or updating
   * schedulesData based on the provided data.
   * @param contactDetailsData The data to be upserted into the database.
   * @param options Additional options for the upsert operation.
   * Here, the 'defaultToNull' option determines whether to default
   * unspecified fields to null or not during the upsert operation.
   * If set to 'false', unspecified fields will retain their current
   * values instead of being set to null.
   */
  const { data, error } = await supabaseClient
    .from("program_contact_details")
    .upsert(contactDetailsData, { defaultToNull: false })
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

/**
 * This is a function where we need first venue_id before creating a program
 * We need to create a new venue and then add it to program table with created venue_id
 * We need to update existing venue table if it is already present
 * @param body formData
 */
const handlePostVenueData = async (body: any, loggedInUserId: number) => {
  // if body.isNewVenue true then first we have to create a new venue and then add it to program table with created venue_id
  // if user select and created new venue in step-3 then we have to create new venue and add it to program table
  // if user sleect existed venue and updated the venue details by clicking edit icon in existed venue popup then we have to update existing venue table right

  let venueData: any = {};

  const venueBody: VenueDataBaseType = {};

  if (body.isNewVenue) {
    venueData = body?.newVenue || {};
  } else {
    const venueId = body.existingVenue?.id;
    venueData = body?.existingVenue || {};

    // if it is existing venue then we will insert the id and do upsert automatically it will work update or insert
    if (venueId) {
      venueBody.id = venueId;
    }
  }

  if (venueData.name) {
    venueBody.name = venueData.name;
  }

  if (venueData.address) {
    venueBody.address = venueData.address;
  }

  if (venueData.state_id) {
    venueBody.state_id = venueData.state_id;
  }

  if (venueData.city_id) {
    venueBody.city_id = venueData.city_id;
  }

  if (venueData.center_id) {
    venueBody.center_id = venueData.center_id;
  }

  if (venueData.postal_code) {
    venueBody.postal_code = venueData.postal_code;
  }

  venueBody.created_by_user_id = loggedInUserId;

  //TODO: Need to post latitude and longitude also when map component was done.

  const { data, error } = await supabaseClient
    .from("venue")
    .upsert(venueBody)
    .select();

  if (error) {
    console.log("error while creating venue", error);
    return false;
  } else {
    console.log("venue created or updated successfully", data);
  }

  // If the user is superAdmin or the user who is creating course created venues clicks on delete icon
  // we have to delete them from database

  const deleteVenueIDs = body.deletedVenueID;
  if (deleteVenueIDs && deleteVenueIDs.length > 0) {
    const { data, error } = await supabaseClient
      .from("venue")
      .delete()
      .in("id", deleteVenueIDs)
      .select();

    if (error) {
      console.log("error while deleting venue", error);
      return false;
    } else {
      console.log("venues deleted successfully", data);
    }
  }

  return data[0].id;
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
  if (
    body?.program_fee_level_settings?.length == 0 ||
    !body?.program_fee_level_settings
  ) {
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

/**
 * We have to generate program
 * the formulae for program code was countryCode+C+programId
 * @param programId
 */
const handleGenerateProgramCode = async (
  programId: number,
  loggedInUserId: number
) => {
  // to fetch country code call users api

  const { data, error }: any = await supabaseClient
    .from("users")
    .select("*,contact_id(*,country_id(*))")
    .eq("id", loggedInUserId);
  if (error) {
    console.log("error while fetch user data", error);
  } else {
    console.log("user data", data);

    let programCode =
      data[0]?.contact_id?.country_id?.abbr || "" + "C" + programId;

    // update program code in program
    const { data: programData, error: programError } = await supabaseClient
      .from("program")
      .update({
        program_code: programCode,
      })
      .eq("id", programId)
      .select();

    if (programError) {
      console.log("erorr while updating program code", programError);
    } else {
      console.log("program code updated successfully", programData);
    }
  }
};
