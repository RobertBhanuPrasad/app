import { useController, useForm } from "react-hook-form";
import { Textarea } from "src/ui/textarea";

export default function ParticipantInformation({ data }) {
    const { formState } = useForm({
        defaultValues: {
            participantMemo: data?.participant_id?.memo, // Set default value for participantMemo
            // Add more fields with their default values if needed
        }
    });
    // Access the memo field from the form state
    // const { memo } = formState;
    
    // Use useController to control the participantMemo field
    const {
        field: { value: participantMemo, onChange: participantMemoChange },
    } = useController({
        name: "participantMemo",
        // control:formState, // Pass the form control to useController
    });
    console.log(data?.participant_id?.memo,"memo",participantMemo)
    return (
        <div id="participants">
            <div className="font-semibold text-[18px] pt-[25px] ">
                Participant Details
            </div>
            <div className="flex gap-4 py-[20px]">
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Participants</div>
                    <div className="font-semibold">
                        {data?.participant_id?.contact_id?.full_name
                            ? data?.participant_id?.contact_id?.full_name
                            : "-"}
                    </div>
                </div>

                <div className="flex">
                    <div className="w-[303px]">
                        <div>Memo</div>

                        <div>
                            <Textarea
                                value={participantMemo}
                                onChange={(val) => {
                                    participantMemoChange(val?.target?.value);
                                }}
                                placeholder="Add Memo"
                                className="w-[303px] !h-[40px] resize-none rounded-[14px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
