import { z } from 'zod'
// import { useTranslation } from 'next-i18next';
// import { translatedText } from "src/common/translations";


export const editParticipantSchema=()=>{
    // const {t} = useTranslation(['common','new_strings'])
    return z.object({
        memo:z.string({
            required_error:"Memo is required field"
            // required_error:t("new_strings:memo_is_required_field")
        })
        .refine((value)=>!(value==""),{
            message:"Memo is required field"
            // message:t("new_strings:memo_is_required_field")
        }),
        accommodation_type_id:z.number({
            required_error:"Select Accommodation Type"
            // required_error:t("new_strings:select_accommodation_type")
        }),
        accommodation_snore:z.boolean({
            required_error:"Select one option"
            // required_error:t("new_strings:select_one_option")
        }),
        roommate_snore:z.boolean({
            required_error:"Select one option"
            // required_error:t("new_strings:select_one_option")

        }),
        participant_attendence_status_id:z.number({
            required_error:"Select Attendance status"
            // required_error:t("new_strings:select_attendance_status")
        })
    })
}