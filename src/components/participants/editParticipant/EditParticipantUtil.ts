import { supabaseClient } from "src/utility";

export const handleEditParticipantValues=async(participantId:number)=>{
    const { data, error } = await supabaseClient
    .from("participant_payment_history")
    .select(
        "id,participant_id!inner(id,program_id,contact_id!inner(full_name),memo,created_at,roommate_preferences_1,roommate_preferences_2,roommate_preferences_3,accommodation_snore,roommate_snore,participant_code,participant_attendence_status_id,discount_code),transaction_fee_level_id!inner(value),expense_fee,currency_code,accommodation_type_id,accommodation_fee,total_amount",
    )
    .eq("id", participantId); 

    if (!error) {
        const defaultValues = await getDefaultValues(data[0]);
        return defaultValues;
      }
    
      return {};
}
export const getDefaultValues = async (data:ParticipantPaymentHistoryDataBaseType) => {
   const defaultValues:EditParticipantFormFieldTypes={}
    if (data.id) defaultValues.id = data.id;

    if (typeof data.participant_id === 'object' && data.participant_id !== null) {
    // full_name
    if (data.participant_id.contact_id && typeof data.participant_id.contact_id === 'object') {
        defaultValues.full_name = data.participant_id.contact_id.full_name ;
    }
    // memo
    if (data.participant_id?.memo)
        defaultValues.memo = data.participant_id.memo;

    // transaction_fee_level_id
    if (data.transaction_fee_level_id)
       defaultValues.transaction_fee_level_id = data.transaction_fee_level_id.value;
     
// program_id
if(data.participant_id.program_id)
    defaultValues.program_id=data.participant_id.program_id
    // created_at
    if (data.participant_id?.created_at)
        defaultValues.created_at = data.participant_id.created_at;

       // accommodation_snore
       if (data.participant_id?.accommodation_snore)
        defaultValues.accommodation_snore = data.participant_id.accommodation_snore;

    // roommate_snore
    if (data.participant_id?.roommate_snore)
        defaultValues.roommate_snore = data.participant_id.roommate_snore;

    // participant_code
    if (data.participant_id?.participant_code)
        defaultValues.participant_code = data.participant_id.participant_code;

      // roommate_preferences_1
      if (data.participant_id?.roommate_preferences_1)
        defaultValues.roommate_preferences_1 = data.participant_id.roommate_preferences_1;

    // roommate_preferences_2
    if (data.participant_id?.roommate_preferences_2)
        defaultValues.roommate_preferences_2 = data.participant_id.roommate_preferences_2;

    // roommate_preferences_3
    if (data.participant_id?.roommate_preferences_3)
        defaultValues.roommate_preferences_3 = data.participant_id.roommate_preferences_3;

    // discount_code
    if (data.participant_id?.discount_code)
        defaultValues.discount_code = data.participant_id.discount_code;

    // participant_attendance_status_id
    if (data.participant_id?.participant_attendence_status_id)
        defaultValues.participant_attendence_status_id = data.participant_id.participant_attendence_status_id;

  
    }
    // currency_code
    if (data.currency_code)
        defaultValues.currency_code = data.currency_code;

    // total_amount
    if (data.total_amount)
        defaultValues.total_amount = data.total_amount;

    // accommodation_type_id
    if (data.accommodation_type_id)
        defaultValues.accommodation_type_id = data.accommodation_type_id;

 
    // accommodation_fee
    if (data.accommodation_fee)
        defaultValues.accommodation_fee = data.accommodation_fee;

    // transaction_status_id
    if (data.transaction_status_id)
        defaultValues.transaction_status_id = data.transaction_status_id;

    // payment_date
    if (data.payment_date)
        defaultValues.payment_date = data.payment_date;

    // payment_method_id
    if (data.payment_method_id)
        defaultValues.payment_method_id = data.payment_method_id;

    // send_payment_confirmation
    if (data.send_payment_confirmation)
        defaultValues.send_payment_confirmation = data.send_payment_confirmation;

    // payment_transaction_id
    if (data.payment_transaction_id)
        defaultValues.payment_transaction_id = data.payment_transaction_id;

    // response_message
    if (data.response_message)
        defaultValues.response_message = data.response_message;

    // error_message
    if (data.error_message)
        defaultValues.error_message = data.error_message;

    // expense_fee
    if (data.expense_fee)
        defaultValues.expense_fee = data.expense_fee;

    return defaultValues;
}
