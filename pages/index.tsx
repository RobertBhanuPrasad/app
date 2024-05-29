import { useEffect } from "react";
import { Button } from "src/ui/button";
import { supabaseClient } from "src/utility";

export default function Index() {
  const supabase = supabaseClient();

  const createCourse = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("upsert-course", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
          "country-code": "public",
        },
        method: "POST",
        body: {
          program_data: body,
          loggedin_user_id: 2,
          accounting_not_submitted_status_id: 64,
          language_code: "en",
        },
      });

      console.log("data is ", data, error);
    } catch (error) {
      console.log("error in catch block", error);
    }
  };

  return (
    <div className="text-3xl">
      <Button
        onClick={() => {
          createCourse();
        }}
      >
        Hello
      </Button>
    </div>
  );
}

Index.noLayout = false;

const body = {
  visibility_id: 31,
  is_language_translation_for_participants: true,
  is_geo_restriction_applicable: false,
  accommodation_fee_payment_mode: 51,
  organizer_ids: [2],
  hour_format_id: 49,
  program_created_by: 46,
  teacher_ids: [2],
  organization_id: 1,
  feeLevels: [
    {
      id: 3,
      created_at: "2024-05-28T09:03:09.327349+00:00",
      organization_id: 1,
      state_id: 1,
      use_center: true,
      center_id: 1,
      is_date_based_pricing: false,
      early_bird_cut_off_period: null,
      is_early_bird_cut_off_editable: null,
      program_end_date: null,
      program_start_date: null,
      program_type_id: 2,
      is_early_bird_fee_enabled: false,
      is_program_fee_editable: false,
      hx_pkey: null,
      is_active: true,
      city: null,
      hx_entity_id: null,
      city_id: 1,
      program_fee_level_settings: [
        {
          id: 1,
          tax: 10,
          total: 1000,
          hx_pkey: null,
          is_enable: true,
          sub_total: null,
          created_at: "2024-05-28T09:18:20.966903+00:00",
          program_id: null,
          fee_level_id: {
            id: 1,
            name: {
              en: "Regular",
            },
            order: 1,
            value: "Regular",
            created_at: "2024-02-23T05:29:05.560665+00:00",
            is_default: true,
            language_id: null,
            language_code: null,
            option_label_id: 1,
          },
          hx_entity_id: null,
          is_custom_fee: false,
          early_bird_tax: null,
          custom_fee_label: null,
          early_bird_total: null,
          early_bird_sub_total: null,
          program_fee_setting_id: 3,
        },
      ],
    },
  ],
  early_bird_cut_off_period: null,
  program_type_id: 2,
  program_type: {
    id: 2,
    created_at: "2024-05-28T09:16:11.714115+00:00",
    maximum_age_limit: null,
    minimum_age_limit: null,
    is_online_program: false,
    is_geo_restriction_applicable_for_registrations: null,
    allow_program_to_announcement_in_bo: null,
    is_program_active: null,
    is_registration_required: null,
    is_registration_required_editable: null,
    is_age_limit_editable: null,
    allowed_countries: null,
    maximum_capacity: null,
    is_approval_required: null,
    display_eligibility_criteria_on_registration_form: null,
    collect_eligibility_criteria_on_registration_form: null,
    question_for_eligibilty_criteria: null,
    is_refund_policy_editable_by_national_administrator: null,
    program_announcement_privileges: null,
    program_level: null,
    has_alias_name: null,
    IAOLF_revenue_share: null,
    health_type_id: null,
    organization_id: 1,
    program_category_id: 17,
    hx_pkey: null,
    is_program_description_editable: null,
    hx_entity_id: null,
    primary_tag_id: null,
    ux_entity_id: null,
    is_parent: null,
    parent_id: null,
    eligibility_criteria_text: null,
    health_privacy_policy: null,
    printable_policy: null,
    privacy_policy: null,
    program_description: null,
    refund_policy: null,
    user_agreement: null,
    waiver_of_liability_risk_and_indemnity_agreement: null,
    name: {
      en: "Offline program",
    },
    program_type_teachers: [
      {
        user_id: 2,
      },
    ],
  },
  program_alias_name_id: "",
  assistant_teacher_ids: [],
  language_ids: [],
  translation_language_ids: [],
  max_capacity: "",
  online_url: "",
  newVenue: {
    city_id: 1,
    state_id: 1,
    center_id: 1,
    postal_code: "123456",
    address: "jhre ",
    name: "venue 1",
  },
  is_existing_venue: "new-venue",
  state_id: 1,
  city_id: 1,
  center_id: 1,
  is_residential_program: true,
  program_fee_level_settings: [],
  is_early_bird_enabled: false,
  isNewVenue: true,
  schedules: [
    {
      date: new Date(),
      startHour: "18",
      startMinute: "00",
      endHour: "20",
      endMinute: "00",
    },
  ],
  name: "venue 1",
  postal_code: "123456",
  address: "jhre ",
  accommodation: [
    {
      accommodation_type_id: 1,
      fee_per_person: "100",
      no_of_residential_spots: "100",
    },
    {
      accommodation_type_id: 2,
      fee_per_person: "100",
      no_of_residential_spots: "100",
    },
    {
      accommodation_type_id: 3,
      fee_per_person: "100",
      no_of_residential_spots: "100",
    },
    {
      accommodation_type_id: 5,
      fee_per_person: "1000",
      no_of_residential_spots: "100",
    },
    {
      accommodation_type_id: 4,
      fee_per_person: "100",
      no_of_residential_spots: "100",
    },
    {
      accommodation_type_id: 6,
      fee_per_person: "100",
      no_of_residential_spots: "100",
    },
    {
      accommodation_type_id: 7,
      fee_per_person: "100",
      no_of_residential_spots: "10",
    },
  ],
  bcc_registration_confirmation_email:
    "balanagaraju2506@gmail.com, balanagaraju2506@gmail.cc, 1@gmail.com, 2@gmail.com",
  contact: [
    {
      contact_name: "Payyavula Bala nagaraju",
      contact_email: "balanagaraju2506@gmail.com",
      contact_number: "08688696792",
    },
    {
      contact_name: null,
      contact_email: "balanagaraju2506@gmail.com",
    },
  ],
};
