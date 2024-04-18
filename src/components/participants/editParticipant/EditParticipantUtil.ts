import { supabaseClient } from "src/utility/supabaseClient";

export const handleEditParticipantValues=async(participantId:number)=>{
    const { data, error } = 
    await supabaseClient
    .from("participant_payment_history")
    .select(
        "id,transaction_id,payment_transaction_id,participant_id!inner(id,program_id!inner(id,program_type_id!inner(is_online_program)),contact_id!inner(full_name,email,mobile,identification_num,postal_code,date_of_birth,street_address,state_id!inner(name),city_id!inner(name),country_id!inner(name)),memo,created_at,roommate_preferences_1,roommate_preferences_2,roommate_preferences_3,accommodation_snore,roommate_snore,participant_code,participant_attendence_status_id,discount_code,organisation_id!inner(name),donation_type!inner(value),donation_date,payment_method,transaction_type!inner(value)),transaction_fee_level_id!inner(value),expense_fee,currency_code,accommodation_type_id,accommodation_fee,total_amount,transaction_status_id!inner(id,value),error_message,response_message,payment_method,payment_date,send_payment_confirmation,transaction_status"
        ) 
    .order("created_at",{ ascending: false })
    .eq("participant_id", participantId);
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
        defaultValues.full_name = data.participant_id.contact_id.full_name  ;
        defaultValues.email=data.participant_id.contact_id.email
        defaultValues.postal_code=data.participant_id.contact_id.postal_code
        defaultValues.street_address=data.participant_id.contact_id.street_address
        defaultValues.date_of_birth=data.participant_id?.contact_id.date_of_birth
        defaultValues.mobile=data.participant_id.contact_id.mobile
        defaultValues.state = (data.participant_id.contact_id.state_id as StateDataBaseType)?.name
        defaultValues.country=(data.participant_id.contact_id.country_id as StateDataBaseType)?.name
        defaultValues.city=(data.participant_id.contact_id.city_id as CityDataBaseType)?.name
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
// organisation_id
if((data?.participant_id?.organisation_id as OrganizationsDataBaseType)?.name)
    defaultValues.organisation_id=(data?.participant_id?.organisation_id as OrganizationsDataBaseType)?.name
// donation_type
if(data?.participant_id?.donation_type?.value)
    defaultValues.donation_type=data?.participant_id?.donation_type?.value
//    donation_date
if(data?.participant_id?.donation_date)
    defaultValues.donation_date=data?.participant_id?.donation_date
// transaction_type
if(data?.participant_id?.transaction_type?.value)
    defaultValues.transaction_type=data?.participant_id?.transaction_type?.value
// transaction_status
if(data?.transaction_status)
    defaultValues.transaction_status=data?.transaction_status
// is_online_program
if( (data?.participant_id?.program_id?.program_type_id as unknown as ProgramDataBaseType)?.is_online_program)
    defaultValues.program_type_id=data?.participant_id?.program_id?.program_type_id?.is_online_program
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
// transaction_status
if(data.transaction_status_id?.value)
    defaultValues.transaction_status_value=data.transaction_status_id?.value
    // payment_date
    if (data.payment_date)
        defaultValues.payment_date = data.payment_date;

    // payment_method_id
    if (data.payment_method)
        defaultValues.payment_method = data.payment_method;

    // send_payment_confirmation
    if (data.send_payment_confirmation)
        defaultValues.send_payment_confirmation = data.send_payment_confirmation;

    // payment_transaction_id
    if (data.payment_transaction_id)

        defaultValues.payment_transaction_id = data.payment_transaction_id;
// transaction_id
        if(data.transaction_id)
    defaultValues.transaction_id=data.transaction_id
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
