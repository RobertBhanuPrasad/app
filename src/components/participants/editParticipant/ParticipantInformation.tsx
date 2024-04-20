import Star from "@public/assets/star";
import { useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController } from "react-hook-form";
import { Input } from "src/ui/input";
import { Text } from "src/ui/TextTags";

export default function ParticipantInformation() {
    const { query } = useRouter();
    // Use useController to control the participantMemo field
    const {
        field: { value: full_name },
    } = useController({ name: "full_name" });
    const {
        field: { value: memo, onChange: participantMemoChange },
    } = useController({
        name: "memo",
    });
    const Id: number | undefined = query?.participantId
        ? parseInt(query.participantId as string)
        : undefined;
    const { data } = useOne({
        resource: "participant_registration",
        id: Number(Id),
        meta: {
            select: "contact_id(full_name)",
        },
    });
    return (
        <div id="participants">
            <Text className="font-semibold text-[18px] pt-[25px] ">
                Participant Details
            </Text>
            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">
                        Participants
                    </Text>
                    <Text className="text-[16px] font-semibold">
                        {data?.data?.contact_id?.full_name
                            ? data?.data?.contact_id?.full_name
                            : "-"}
                    </Text>
                </div>
                {/* TODO: need to make this required field */}
                <div className="flex">
                    <div className="w-[303px]">
                        <div className="flex gap-2">
                            <div>
                                <Text>Memo</Text>
                            </div>
                            <div>
                                <Star />
                            </div>
                        </div>

                        <div>
                            <Input
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
