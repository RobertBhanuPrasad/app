import { useList } from "@refinedev/core";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { translatedText } from "src/common/translations";
import { Text } from "src/ui/TextTags";
import { formatDateString } from "src/utility/DateFunctions";

export default function CourseFee() {
    const { query } = useRouter();
    const {t} = useTranslation('course.participants')
    const Id: number | undefined = query?.participantId
        ? parseInt(query?.participantId as string)
        : undefined;

    // participant_payment_history contains numerous records of same participant, getting the latest history record
    const { data } = useList({
        resource: "participant_payment_history",
        meta: {
            select: "id,transaction_fee_level_id(name),total_amount,accommodation_fee,currency_code,participant_id(id,created_at,program_id(id,program_type_id!inner(is_online_program)))",
        },
        filters: [
            {
                field: "participant_id",
                operator: "eq",
                value: Id,
            },
            {
                field: "program_id",
                operator: "eq",
                value: query?.id,
            },
        ],
        sorters: [
            {
                field: "created_at",
                order: "desc",
            },
        ],
    });
    const courseFeedata = data?.data[0];
    
    return (
        <div className="" id="Course">
            <Text className="font-semibold text-[18px] pt-[25px]">
                {t('edit_participant.participants_information_tab.course_fees')}
            </Text>
            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px]">
                        {t('edit_participant.participants_information_tab.registration_date')}
                    </Text>
                    <Text className="font-semibold text-[16px]">
                        {courseFeedata?.participant_id?.created_at
                            ? formatDateString(
                                  new Date(
                                      courseFeedata?.participant_id?.created_at
                                  )
                              )
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">
                        {t('view_participant.fee_level')}
                    </Text>
                    <Text className="font-semibold text-[16px]">
                        {courseFeedata?.transaction_fee_level_id?.name
                            ? translatedText(courseFeedata?.transaction_fee_level_id?.name)
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">
                        {t('edit_participant.participants_information_tab.course_fee')}
                    </Text>
                    <Text className="font-semibold text-[16px]">
                        {courseFeedata?.currency_code
                            ? courseFeedata?.currency_code
                            : ""}{" "}
                        {courseFeedata?.total_amount
                            ? courseFeedata?.participant_id?.program_id
                                  ?.program_type_id?.is_online_program
                                ? courseFeedata?.total_amount -
                                  courseFeedata.accommodation_fee
                                : courseFeedata?.total_amount
                            : "-"}
                    </Text>
                </div>
            </div>
            <hr />
        </div>
    );
}
