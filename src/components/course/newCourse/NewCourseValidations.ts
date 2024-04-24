import { z } from "zod";
export const validationSchema = () => {
  return z
    .object({
      // Step 1 Schema
      organization_id: z.number({
        required_error: "Select Organization Name.",
      }),
      organizer_ids: z
        .array(z.number())
        .nonempty({ message: "Select at least one Organizer Name" })
        .refine((val) => val.length <= 10, {
          message: "Maximum number of organizers allowed is 10",
        }),
      program_created_by: z.number({
        required_error: "Select who is going to teach the course",
      }),
      is_registration_via_3rd_party: z.boolean().optional(),
      registration_via_3rd_party_url: z
        .string({
          required_error: "URL for 3rd party website is required field",
        })
        .refine(
          (value) => {
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
            return urlRegex.test(value);
          },
          {
            message: "URL for 3rd party website is not valid",
          }
        ),

      // Step 2 Schema
      program_type_id: z.number({
        required_error: "Course type is a required field",
      }),
      program_type: z.object({}).optional(),
      program_alias_name_id: z.number({
        required_error: "Course Name is a required field",
      }),
      teacher_ids: z
        .array(z.number())
        .nonempty({ message: "Please enter at least one teacher" }),
      assistant_teacher_ids: z
        .array(z.number(), {
          required_error: "Please enter at least one associate teacher",
        })
        .optional(),
      visibility_id: z.number(),
      is_language_translation_for_participants: z.boolean().optional(),
      is_geo_restriction_applicable: z.boolean(),
      language_ids: z
        .array(z.number())
        .nonempty({ message: "Please select at least one Language" }),
      translation_language_ids: z
        .array(z.number(), {
          required_error: "Please select atleast one Language translation",
        })
        .optional(),
      allowed_countries: z
        .array(z.string())
        .nonempty({ message: "Country is a required field" }),
      max_capacity: z
        .string({
          required_error: "Maximum capacity is required fields",
        })
        .regex(/^\d+$/, {
          message: "Maximum Capacity can accept only integers",
        })
        .refine((val) => parseInt(val) < 500, {
          message: "Maximum capacity exceeds the allowed limit",
        }),

      // Step 3 Schema
      is_existing_venue: z.string({
        required_error: "Venue is a required fields",
      }),
      existingVenue: existingVenueSchedules,
      newVenue: newVenueSchedules,
      online_url: z
        .string({ required_error: " Online meeting URL is a required fields" })
        .url({ message: "Online meeting URL is not valid" }),
      hour_format_id: z.number({
        required_error: "Time format is a required field",
      }),
      state_id: z.number({
        required_error: "State is is a required fields",
      }),
      city_id: z.number({
        required_error: "City is is a required fields",
      }),
      center_id: z.number({
        required_error: "Center is is a required fields",
      }),
      time_zone_id: z.number({
        required_error: "Time zone is a required field",
      }),
      schedules: scheduleValidationSchema,
      name: z.string({ required_error: "Venu Name is a required field." }),
      address: z.string({ required_error: "Address is a required field." }),
      postal_code: z
        .string({
          required_error: "Postal Code is a required field.",
        })
        .regex(/^\d+$/, { message: "Please provide a valid Postal Code" }),
      // Step 4 Schema
      is_early_bird_enabled: z.boolean().optional(),
      program_fee_level_settings: feelLevelsValidationSchema,

      // Step 5 Schema
      accommodation: accommodationValidationSchema,
      is_residential_program: z.boolean().optional(),
      accommodation_fee_payment_mode: z.number({
        required_error: "Fee payment method is required fields",
      }),

      // Step 6 Schema
      contact: contactValidationSchema,
      bcc_registration_confirmation_email: z
        .string({ required_error: "At least on email is required." })
        .regex(
          /^(?:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:,[ ]*[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
          {
            message:
              "One of the Bcc email you entered is not in correct format",
          }
        ),
    })
    .superRefine((val: any, ctx) => {
      const maxCapacityLimit = val?.program_type?.maximum_capacity;
      const maxCapacity = parseInt(val.max_capacity);
      if (maxCapacity && maxCapacityLimit && maxCapacity > maxCapacityLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum capacity exceeds the allowed limit",
          path: ["max_capacity"],
        });
        return false;
      }
      return true;
    });
};

const existingVenueSchedules = z.object({
  id: z.number({ required_error: "Venue is a required fields" }),
});

const newVenueSchedules = z.object({
  state_id: z.number({
    required_error: "Venue is a required fields",
  }),
});

const feelLevelsValidationSchema = z.array(
  z.object({
    is_enable: z.boolean(),
    total: z.union([z.string().regex(/^\d+$/), z.number()]),
    early_bird_total: z.union([z.string().regex(/^\d+$/), z.number()]),
  })
);

const contactValidationSchema = z.array(
  z.object({
    contact_name: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, { message: "Contact Name is a required field." }),
    contact_email: z
      .string({ required_error: "Contact email is a required field." })
      .email({ message: "Please enter correct Email" }),
    contact_number: z.union([
      z
        .string({ required_error: "Contact mobile is a required field." })
        .regex(/^\d+$/),
      z.number(),
    ]),
  })
);
const accommodationValidationSchema = z.array(
  z.object({
    accommodation_type_id: z.number({
      required_error: "Accommodation type is required field.",
    }),
    fee_per_person: z
      .string({
        required_error: "Please enter a valid money value for fee per person.",
      })
      .regex(/^\d+$/, "Fee can accept only integers "),
    no_of_residential_spots: z
      .string({
        required_error: "Please enter a valid no of residential spots",
      })
      .regex(/^\d+$/, "Residential spots can accept only integers "),
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
  .refine((value: any[]) => value.every((item) => parseInt(item.startMinute)));
