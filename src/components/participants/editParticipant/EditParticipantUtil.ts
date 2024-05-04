import { supabaseClient } from "src/utility/supabaseClient";

// api call for getting defaultvalues for edit participant tab from payment history
export const handleEditParticipantValues = async (participantId: number) => {
  const supabase = supabaseClient();

  const { data, error } = await supabase
    .from("participant_payment_history")
    .select(
      "id,payment_method_id,transaction_status_id!inner(id,value),payment_date,send_payment_confirmation,transaction_status,participant_id!inner(id,memo,roommate_snore,accommodation_snore,participant_code,participant_attendence_status_id,discount_code, payment_method)"
    )
    .order("created_at", { ascending: false })
    .eq("participant_id", participantId);
  if (!error) {
    const defaultValues = await getDefaultValues(
      data[0] as unknown as ParticipantPaymentHistoryDataBaseType
    );

    return defaultValues;
  }
  return {};
};

// api call for getting default values for edit payment form from payment history
export const handleEditPaymentValues = async (paymentHistoryId: number) => {
  const supabase = supabaseClient();

  const { data, error } = await supabase
    .from("participant_payment_history")
    .select(
      "id,payment_method_id(id,value),transaction_status_id!inner(id,value),payment_date,send_payment_confirmation"
    )
    .eq("id", paymentHistoryId);
  if (!error) {
    const defaultValues = await getDefaultValues(
      data[0] as unknown as ParticipantPaymentHistoryDataBaseType
    );

    return defaultValues;
  }
  return {};
};

// Assigning all api data to default values variable
export const getDefaultValues = async (
  data: ParticipantPaymentHistoryDataBaseType
) => {
  const defaultValues: EditParticipantFormFieldTypes = {};
  if (data.id) defaultValues.id = data.id;

  if (typeof data.participant_id === "object" && data.participant_id !== null) {
    // memo
    if (data.participant_id?.memo)
      defaultValues.memo = data.participant_id.memo;

    // program_id
    if (data.participant_id.program_id)
      defaultValues.program_id = data.participant_id.program_id;

    // accommodation_snore
    if (data.participant_id)
      defaultValues.accommodation_snore =
        data.participant_id.accommodation_snore;

    // payment_method_id
    if (data.payment_method_id)
      defaultValues.payment_method_id = data?.payment_method_id;

    // transaction_status
    if (data?.transaction_status)
      defaultValues.transaction_status = data?.transaction_status;

    // roommate_snore
    if (data.participant_id)
      defaultValues.roommate_snore = data?.participant_id.roommate_snore;

    // participant_code
    if (data.participant_id)
      defaultValues.participant_code = data.participant_id.participant_code;

    // discount_code
    if (data.participant_id?.discount_code)
      defaultValues.discount_code = data.participant_id.discount_code;

    // participant_attendance_status_id
    if (data.participant_id?.participant_attendence_status_id)
      defaultValues.participant_attendence_status_id =
        data.participant_id.participant_attendence_status_id;
  }
  // transaction_status_id
  if (data.transaction_status_id)
    defaultValues.transaction_status_id = data.transaction_status_id?.id;

  // transaction_status
  if (data.transaction_status_id?.value)
    defaultValues.transaction_status_value = data.transaction_status_id?.value;

  //payment_method_id
  if (data.payment_method_id)
    defaultValues.payment_method_id = data.payment_method_id?.id;

  // payment_method
  if (data.payment_method_id?.value)
    defaultValues.payment_method_value = data.payment_method_id?.value;

  // payment_date
  if (data.payment_date) defaultValues.payment_date = data.payment_date;

  // send_payment_confirmation
  if (data.send_payment_confirmation)
    defaultValues.send_payment_confirmation = data.send_payment_confirmation;

  return defaultValues;
};
