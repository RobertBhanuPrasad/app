import { useController } from "react-hook-form";
import { Textarea } from "src/ui/textarea";
import { Text } from "src/ui/TextTags";

export default function ParticipantInformation() {
    // Use useController to control the participantMemo field
    const {
        field: { value: full_name },
    } = useController({ name: "full_name" });
    const {
        field: { value: memo, onChange: participantMemoChange },
    } = useController({
        name: "memo",
    });
    return (
        <div id="participants">
            <Text className="font-semibold text-[18px] pt-[25px] ">
                Participant Details
            </Text>
            <div className="flex gap-4 py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] ">Participants</Text>
                    <Text>{full_name ? full_name : "-"}</Text>
                </div>

                <div className="flex">
                    <div className="w-[303px]">
                        <div>Memo</div>

                        <div>
                            <Textarea
                                value={memo}
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
