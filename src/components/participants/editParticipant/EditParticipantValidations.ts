import { z } from 'zod'
export const editParticipantSchema=()=>{
    return z.object({
        memo:z.string({
            required_error:"Memo is required field"
        })
        .refine((value)=>!(value==""),{
            message:"Memo is required field"
        }),
        accommodation_type_id:z.number({
            required_error:"Select Accommodation Type"
        }),
        accommodation_snore:z.boolean({
            required_error:"Select one option"
        }),
        roommate_snore:z.boolean({
            required_error:"Select one option"
        }),
        participant_attendence_status_id:z.number({
            required_error:"Select Attendance status"
        })
    })
}