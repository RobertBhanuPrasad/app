import { NewCourseStep1FormNames, NewCourseStep2FormNames, NewCourseStep3FormNames, NewCourseStep4FormNames, NewCourseStep5FormNames, NewCourseStep6FormNames } from "src/constants/CourseConstants";
import { z } from "zod";
export const validationSchema = () => {
  return z.object({
    // Step 1 Schema
    [NewCourseStep1FormNames?.organization_id]: z
    .number({
      required_error: "Select Organization Name."
    }),
    [NewCourseStep1FormNames?.organizer_ids]: z.array(z.number(),{required_error:"Select Organizer Name"}),
    [NewCourseStep1FormNames?.program_created_by]: z.number({required_error:"Select who is going to teach the course"}),

    // Step 2 Schema
    [NewCourseStep2FormNames?.program_type_id]: z.number({ required_error: "Course type is a required field"}),
    [NewCourseStep2FormNames?.teacher_ids]: z.array(z.number(),{required_error: 'Please enter at least one teacher'}),
    [NewCourseStep2FormNames?.assistant_teacher_ids]: z.array(z.number(),{required_error: 'Please enter at least one associate teacher'}).optional(),
    [NewCourseStep2FormNames?.visibility_id]: z.number().optional(),
    [NewCourseStep2FormNames?.is_language_translation_for_participants]: z.boolean().optional(),
    [NewCourseStep2FormNames?.program_alias_name_id]: z.number({ required_error: "Course Name is a required field"}),
    [NewCourseStep2FormNames?.is_geo_restriction_applicable]: z.boolean().optional(),
    [NewCourseStep2FormNames?.language_ids]: z.array(z.number(),{ required_error: "Please select atleast one Language"}),
    [NewCourseStep2FormNames?.translation_language_ids]: z.array(z.number(),{ required_error: "Please select atleast one Language translation"}).optional(),
    [NewCourseStep2FormNames?.allowed_countries]: z.array(z.number(),{required_error:"Country is is a required fields"}),
    [NewCourseStep2FormNames?.max_capacity]: z.string({required_error:"Maximum capacity should be between 1 and %1 - which is the allowed limit set for this course type by Program / National Admin."}).regex(/^\d+$/ , {message : 'Maximum Capacity can accept only integers'}).refine(val => parseInt(val) > 50, {message:'Maximum capacity exceeds the allowed limit %1 for this course type by Program / National Admin'}),

    // Step 3 Schema
    [NewCourseStep3FormNames?.online_url]: z.string({required_error:" Online meeting URL is a required fields"}).url(),
    [NewCourseStep3FormNames?.hour_format_id]: z.number(),
    [NewCourseStep3FormNames?.time_zone_id]: z.number(),
    [NewCourseStep3FormNames?.schedules]: scheduleValidationSchema,

    // Step 4 Schema
    [NewCourseStep4FormNames?.is_early_bird_enabled]:z.boolean().optional(),
    feeLevels: feelLevelsValidationSchema,

    // Step 5 Schema
    [NewCourseStep5FormNames?.accommodation]: accommodationValidationSchema,
    [NewCourseStep5FormNames?.is_residential_program]: z.boolean().optional(),
    [NewCourseStep5FormNames?.accommodation_fee_payment_mode]: z.boolean().optional(),

    // Step 6 Schema
    [NewCourseStep6FormNames?.contact]: contactValidationSchema,
    [NewCourseStep6FormNames?.bcc_registration_confirmation_email]: z.string(),
  });
};


const feelLevelsValidationSchema = z.array(
  z.object({
    total: z.number(),
    earlyBirdTotal: z.number(),
  }).refine(() => {
  })
);

const contactValidationSchema = z.array(
  z.object({
    [NewCourseStep6FormNames?.contact_name]: z.string().regex(/^[a-zA-Z\s]+$/ ,{message : 'Contact Name is a required field.'}),
    [NewCourseStep6FormNames?.contact_email]: z.string({required_error:"Contact email is a required field."}).email({message:"Please enter correct Email"}),
    [NewCourseStep6FormNames?.contact_number]: z.string({required_error:"Contact mobile is a required field."}).regex(/^\d+$/),
  })
);
const accommodationValidationSchema = z.array(
  z.object({
    [NewCourseStep5FormNames?.accommodation_type_id]: z.number({required_error:"Accommodation type is required field."}),
    [NewCourseStep5FormNames?.fee_per_person]: z.string({required_error:"Please enter a valid money value for fee per person."}),
    [NewCourseStep5FormNames?.no_of_residential_spots]: z.string({required_error:"Please enter a valid money value for fee per person."}),
  })
);

const scheduleValidationSchema = z
  .array(
    z
      .object({
        date: z.date(),
        startHour: z.string(),
        startMinute: z.string(),
        endHour: z.string(),
        endMinute: z.string(),
      })
      .refine(
        (value) => {
          const { startHour, endHour, startMinute, endMinute } = value;
          if (startHour === endHour) {
            return parseInt(endMinute) > parseInt(startMinute);
          }
          return true;
        },
        { message: "End minute must be greater than start minute" }
      )
  )
  .refine(
    (value) => {
      if (value.length <= 1) {
        return true;
      }
      for (let i = 1; i < value.length; i++) {
        const prev = value[i - 1];
        const current = value[i];

        const prevDate = new Date(prev.date);
        const currentDate = new Date(current.date);

        if (currentDate < prevDate) {
          return false;
        } else if (currentDate.getTime() === prevDate.getTime()) {
          const prevStartDateTime = new Date(prev.date);
          prevStartDateTime.setHours(
            parseInt(prev.startHour),
            parseInt(prev.startMinute)
          );

          const currentStartDateTime = new Date(current.date);
          currentStartDateTime.setHours(
            parseInt(current.startHour),
            parseInt(current.startMinute)
          );

          if (currentStartDateTime < prevStartDateTime) {
            return false;
          }
        }
      }
      return true;
    },
    { message: "Dates and times must be in chronological order" }
  )
  .refine(
    (value) => {
      if (value.length <= 1) {
        if (value.length === 1) {
          const schedule = value[0];
          const scheduleDate = new Date(schedule.date);
          const startHour = parseInt(schedule.startHour);
          const startMinute = parseInt(schedule.startMinute);
          scheduleDate.setHours(startHour, startMinute, 0, 0);
          const todayDate = new Date();

          if (scheduleDate.getTime() < todayDate.getTime()) {
            return false; // Schedule start time cannot be in the past
          }
        }
        return true; // Passes validation if there is only one schedule or none
      } else {
        for (let i = 0; i < value.length; i++) {
          const prev = value[i - 1];
          const current = value[i];

          const prevEndDateTime = new Date(prev.date);
          prevEndDateTime.setHours(
            parseInt(prev.endHour),
            parseInt(prev.endMinute)
          );

          const currentStartDateTime = new Date(current.date);
          currentStartDateTime.setHours(
            parseInt(current.startHour),
            parseInt(current.startMinute)
          );

          if (currentStartDateTime <= prevEndDateTime) {
            return false; // Start hour of the current day must be greater than end hour of the previous day
          }
        }
        return true; // Passes validation if all subsequent schedules start after the end time of the previous schedule
      }
    },
    {
      message:
        "Start hour of the second day must be greater than end hour of the first day",
    }
  )
  .refine((value: any[]) => value.every((item) => item.date instanceof Date), {
    message: "Invalid date format",
  })
  .refine(
    (value: any[]) => value.every((item) => !isNaN(item.date.getTime())),
    { message: "Invalid date value" }
  )
  .refine((value: any[]) => value.every((item) => parseInt(item.startMinute)),);
