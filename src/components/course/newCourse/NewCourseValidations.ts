import { start } from "repl";
import { z } from "zod";
export const validationSchema = () => {
  return z.object({
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
    language_ids: z.array(z.number()).optional(),
    translation_language_ids: z
      .array(z.number(), {
        required_error: "Please select atleast one Language translation",
      })
      .optional(),
    allowed_countries: z
      .array(z.string())
      .nonempty({ message: "Country is a required field" }),
    max_capacity: z
      .string()
      .refine((val) => val === "" || /^\d+$/.test(val), {
        message: "Maximum Capacity can accept only integers",
      })
      .optional(),

    // Step 3 Schema
    is_existing_venue: z.string({
      required_error: "Venue is a required fields",
    }),
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
      .string()
      .regex(
        /^(?:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:,[ ]*[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
        {
          message: "One of the Bcc email you entered is not in correct format",
        }
      )
      .optional(),
  });
};

const feelLevelsValidationSchema = z.array(
  z.object({
    is_enable: z.boolean(),
    total: z.union([z.string().regex(/^\d+$/), z.number()]),
    early_bird_total: z.union([z.string().regex(/^\d+$/), z.number()]),
  })
);

const contactValidationSchema = z.array(
  z.object({
    contact_name: z.string().optional(),
    contact_email: z
      .string({ required_error: "Contact email is a required field." })
      .email({ message: "Please enter correct Email" }),
    contact_number: z.union([z.string().regex(/^\d+$/), z.number()]).optional(),
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
      .regex(/^\d+$/, "Fee can accept only integers ")
      .or(z.number()),
    no_of_residential_spots: z
      .string({
        required_error: "Please enter a valid no of residential spots",
      })
      .regex(/^\d+$/, "Residential spots can accept only integers ")
      .or(z.number()),
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
        startTimeFormat: z.string().optional().nullable(),
        endTimeFormat: z.string().optional().nullable(),
      })
      .transform((value) => {
        // for validations its better to use standard format irrespective of startTimeFormat and endTimeFormat.
        // modify startHour and endHour to 24 hour format based on startTimeFormat and endTimeFormat
        // startTimeFormat and endTimeFormat can be AM or PM
        // so that we dont need to write extra conditions for AM and PM

        if (value.startTimeFormat === "AM" && value.startHour === "12") {
          value.startHour = "00";
        } else if (value.startTimeFormat === "PM" && value.startHour !== "12") {
          value.startHour = JSON.stringify(parseInt(value.startHour) + 12);
        }

        if (value.endTimeFormat === "AM" && value.endHour === "12") {
          value.endHour = "00";
        } else if (value.endTimeFormat === "PM" && value.endHour !== "12") {
          value.endHour = JSON.stringify(parseInt(value.endHour) + 12);
        }

        return value;
      })
      // the current schedule date must be greater than today date
      .refine(
        (schedule) => {
          // not only date from schedule we need to take startHour and startMinute also
          const { date, startHour, startMinute } = schedule;

          // create adtae object and compare with today date with getTime method
          const dateObj = new Date(date);

          dateObj.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

          if (dateObj.getTime() <= new Date().getTime()) {
            return false;
          }

          return true;
        },
        {
          message:
            "A session date and time must be greater than today date and time",
        }
      )

      // for single session we need to do check few cases
      // the endHour must need to be greater than startHor
      // if the start Hour and endHour are same then endMinute need to be greater than startMinute

      // lets write some validation the endHour must need to be greater than startHor
      .refine(
        (value) => {
          const { startHour, endHour } = value;
          if (startHour === endHour) {
            return true;
          }
          return parseInt(endHour) > parseInt(startHour);
        },
        {
          message: "Session start time must be greater than end time",
        }
      )
      .refine(
        (value) => {
          const { startHour, endHour, startMinute, endMinute } = value;
          if (startHour === endHour) {
            return parseInt(endMinute) > parseInt(startMinute);
          }
          return true;
        },
        { message: "Session start time must be greater than end time" }
      )
  )
  // now we will need to validations for array of objects.
  // 1. the first schedule date must be greater than today date.
  // .refine(
  //   (schedules: any) => {
  //     console.log("schedules", schedules);

  //     const firstDate = new Date(schedules[0].date);

  //     firstDate.setHours(schedules[0]?.startHour, schedules[0]?.startMinute);

  //     const today = new Date();

  //     return firstDate > today;
  //   },
  // {
  //   message: "First schedule date must be greater than today date",
  // }
  // );

  // 2. the current schedule from index should need to be greater than previous schedule
  // we will use same refine method to throw an error
  .refine(
    (schedules: any) => {
      // we dont need to run this if it contains only one session
      if (schedules.length <= 1) {
        return true;
      }

      // we need to sort the schedules before we can compare
      // Requirement: we can give schedules irrespective of order
      // we will sort the schedules first
      schedules = schedules.sort((a: any, b: any) => {
        let aDate = new Date(a.date);
        aDate.setHours(a?.startHour, a?.startMinute);

        let bDate = new Date(b.date);
        bDate.setHours(b?.startHour, b?.startMinute);

        return aDate.getTime() - bDate.getTime();
      });

      // we need to use loop and need to compare current with previous
      for (let i = 1; i < schedules.length; i++) {
        const prev = schedules[i - 1];

        const current = schedules[i];

        const prevDate = new Date(prev.date);

        prevDate.setHours(prev?.endHour, prev?.endMinute);

        const currentDate = new Date(current.date);

        currentDate.setHours(current?.startHour, current?.startMinute);

        if (currentDate.getTime() <= prevDate.getTime()) {
          return false;
        }
      }

      return true;
    },
    { message: "A session cannot start before ending another session" }
  );
