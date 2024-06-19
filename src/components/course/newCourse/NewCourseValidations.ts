import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { z } from "zod";
export const validationSchema = (iAmCoTeaching: string, t?:any) => {
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
    program_created_by: z.string({
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
    program_type_id: z
      .number({
        required_error: "Course type is a required field",
      })
      .or(z.string().nonempty({ message: "Course type is a required field" })),
    program_alias_name_id: z
      .number({
        required_error: "Course Name is a required field",
      })
      .or(z.string().nonempty({ message: "Course Name is a required field" })),
    teacher_ids: z
      .array(z.number({ required_error: "Please enter at least one teacher" }))
      .min(1, "Please enter at least one teacher")
      .refine(
        (teacher_ids) => {
          const { programCreatedById } = newCourseStore.getState();

          // REQUIRMENT if the programCreatedById is I am co-teching id then we need to validate the teachers field for min 2
          if (
            programCreatedById === iAmCoTeaching &&
            teacher_ids.length < 2
          ) {
            return false;
          }
          return true;
        },
        {
          message: "At least 2 teachers are required for co-teaching",
        }
      ),
    assistant_teacher_ids: z
      .array(z.number(), {
        required_error: "Please enter at least one associate teacher",
      })
      .optional(),
    visibility_id: z.string(),
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
    is_existing_venue: z
      .string({
        required_error: "Venue is a required fields",
      })
      .nonempty({ message: "Venue is a required fields" }),
    online_url: z
      .string({
        required_error: "Online meeting URL is a required field",
      })
      .nonempty({ message: "Online meeting URL is a required field" })
      .url({ message: "Online meeting URL is not valid" }),

    hour_format_id: z.string({
      required_error: "Time format is a required field",
    }),
    state_id: z.union([
      z
        .number({
          required_error: "State is a required field",
        })
        .int(),
      z.string().nonempty({ message: "State is a required field" }),
    ]),
    city_id: z.union([
      z
        .number({
          required_error: "City is a required field",
        })
        .int(),
      z.string().nonempty({ message: "City is a required field" }),
    ]),
    center_id: z.union([
      z
        .number({
          required_error: "Center is a required field",
        })
        .int(),
      z.string().nonempty({ message: "Center is a required field" }),
    ]),
    time_zone_id: z.number({
      required_error: "Time zone is a required field",
    }),
    schedules: scheduleValidationSchema(t),
    // name: z.string().optional(),
    // address: z
    //   .string({ required_error: "Address is a required field." })
    //   .optional(),
    // postal_code: z
    //   .string({
    //     required_error: "Postal Code is a required field.",
    //   })
    //   //here we need validate the postal code of different countries
    //   //for example in India we have only 6 digit postal code
    //   //but in canada they have combination of alphabets and digits (M5A 1A1)
    //   //for this we need to allow both alphabets and digits in the postal code for general validation.
    //   .regex(/^[0-9a-zA-Z\s-]{3,10}$/, {
    //     message: "Please provide a valid Postal Code",
    //   })
    //   .optional(),
    // Step 4 Schema
    product_fee_settings:z.object({}).catchall(z.any()),
    is_early_bird_enabled: z.boolean().optional(),
    program_fee: feelLevelsValidationSchema,

    // Step 5 Schema
    accommodation: accommodationValidationSchema,
    is_residential_program: z.boolean(),
    accommodation_fee_payment_mode: z.string({
      required_error: "Fee payment method is required fields",
    }),

    // Step 6 Schema
    contact: contactValidationSchema,
    bcc_registration_confirmation_email: z
      .string()
      /**
       * In the regression expression we are allowing the spaces and the commas after the email for that tailing spaces we are adding the \s
       * As i am allowing 0, one or many spaces so i am giving \s*
       * as they are can be or cannot be present so we are adding the ?
       * as per the bug 1505 we have added ,? after the email expression, then this was solved 
       *  */ 

      .regex(
        /^(?:\s*[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*)?(?:,\s*[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*)*,?\s*?$/,
        {
          message: "One of the Bcc email you entered is not in correct format",
        }
      )
      .refine(
        (value) => {
          //Requirement: Duplicate emails are not allowed
          const emails = value.split(",").map((email) => email.trim()).filter(email => email !== "");
          const uniqueEmails = new Set(emails);
          return emails.length === uniqueEmails.size;
        },
        {
          message: "Duplicate emails are not allowed",
        }
      )
      .optional(),
  });
};

const feelLevelsValidationSchema = z.array(
  z.object({
    is_enable: z.boolean(),
    total: z.number().min(0),//fee should be greater the zero
    early_bird_total: z.number().min(0).nullable().optional(),//fee should be greater the zero
  })
);

const contactValidationSchema = z.array(
  z.object({
    contact_name: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, { message: "Only Alaphabets are allowed" })
      .nullable()
      .optional(),
    contact_email: z
      .string({ required_error: "Contact email is a required field." })
      .nonempty({ message: "Contact email is a required field." })
      .email({ message: "Please enter correct Email" }),
    contact_number: z
      .union([
        z
          .string()
          .regex(/^\+?[\d\s]*$/, "Contact number must only contain numbers."),
        z.number(),
      ])
      .nullable()
      .optional(),
  })
);

const accommodationValidationSchema = z.array(
  z.object({
    accommodation_type_id: z.number({
      required_error: "Accommodation type is required field.",
    }),
    total: z
      .string({
        required_error: "Fee per person is a required field.",
      })
      .nonempty({ message: "Fee per person is a required field." })
      .regex(
        /^\d+(\.\d+)?$/,
        "Please enter a valid money value for fee per person."
      )
      .or(z.number()),
    no_of_residential_spots: z
      .string({
        required_error: "Number of spots is a required field.",
      })
      .nonempty({ message: "Number of spots is a required field." })
      .regex(/^\d+$/, "Please enter a valid number.")
      .or(z.number()),
  })
);

export const scheduleValidationSchema=(t:any) =>{
  return  z
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
          message: (t("validations_text:session_start_time_cannot_be_later_than_end_time")),
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
        { message: (t("validations_text:session_start_time_cannot_be_later_than_end_time")) }
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
};
