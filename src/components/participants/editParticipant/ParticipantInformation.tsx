import Star from "@public/assets/star";
import { useOne } from "@refinedev/core";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useController } from "react-hook-form";
import { Input } from "src/ui/input";
import { Text } from "src/ui/TextTags";

export default function ParticipantInformation() {
    const { query } = useRouter();
    const {t} = useTranslation('course.participants')

    // Use useController to control the participantMemo field
    const {
        field: { value: memo, onChange: participantMemoChange },
        fieldState: { error: memoError },
    } = useController({
        name: "memo",
    });

    // Using participant Id from router and getting participant contact details
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
                {t('edit_participant.participants_information_tab.participants_details')}
            </Text>
            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">
                        {t('edit_participant.participants_information_tab.participants')}
                    </Text>
                    <Text className="text-[16px] font-semibold">
                        {data?.data?.contact_id?.full_name
                            ? data?.data?.contact_id?.full_name
                            : "-"}
                    </Text>
                </div>
                <div className="flex">
                    <div className="w-[303px]">
                        <div className="flex gap-2">
                            <div>
                                <Text>{t('edit_participant.participants_information_tab.memo')}</Text>
                            </div>
                            <div>
                                <Star />
                            </div>
                        </div>

                        <div>
                            <Input
                                value={memo}
                                onChange={(val) => {
                                        participantMemoChange(
                                              val?.target?.value
                                          );
                                }}
                                placeholder="Add Memo"
                                className="w-[303px] !h-[40px] resize-none rounded-[14px]"
                            />
                            {memoError && (
                                <span className="text-[#FF6D6D] text-[14px]">
                                    {memoError?.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
