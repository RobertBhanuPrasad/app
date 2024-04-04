import { z } from "zod";
export const validationSchema = () => {
  return z.object({
    // Step 1 Schema
    organization_id: z
      .number()
      .refine((value) => value !== null && value !== 0, {
        message: "SelectOrganizerName",
        path: ["organization_id"],
      }),
    organizer_ids: z.array(z.number()),
    program_created_by: z.number(),

    // Step 2 Schema
    program_type_id: z.number(),
    teacher_ids: z.array(z.number()),
    assistant_teacher_ids: z.array(z.number()),
    visibility_id: z.number().optional(),
    is_language_translation_for_participants: z.boolean().optional(),
    program_alias_name_id: z.number(),
    is_geo_restriction_applicable: z.boolean().optional(),
    language_ids: z.array(z.number()),
    program_translation_language_ids: z.array(z.number()),
    allowed_countries: z.array(z.number()),
    max_capacity: z.string(),

    // Step 3 Schema
    online_url: z.string().url().optional(),
    hour_format_id: z.number(),
    schedules: scheduleValidationSchema,

    // Step 4 Schema
    is_early_bird_enabled:z.boolean().optional(),
    // feeLevels: feelLevelsValidationSchema,

    // Step 5 Schema
    accommodation: accommodationValidationSchema,
    is_residential_program: z.boolean().optional(),
    accommodationPaymentMode: z.boolean().optional(),

    // Step 6 Schema
    contact: contactValidationSchema,
    contactCourseEmails: z.string(),
  });
};

// const feelLevelsValidationSchema = z.array(
//   z.object({
//     total: z.number(),
//     earlyBirdTotal: z.number(),
//   }).refine((value) => {
//   })
// );

const contactValidationSchema = z.array(
  z.object({
    contactName: z.string().regex(/^[a-zA-Z\s]+$/),
    contactEmail: z.string().email(),
    contactMobile: z.string().regex(/^\d+$/),
  })
);
const accommodationValidationSchema = z.array(
  z.object({
    accomodationType: z.number(),
    accomodationFee: z.string(),
    accomodationSpots: z.string(),
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
        for (let i = 1; i < value.length; i++) {
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
