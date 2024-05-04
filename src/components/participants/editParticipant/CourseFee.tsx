import { useList } from "@refinedev/core";
import { useRouter } from "next/router";
import { Text } from "src/ui/TextTags";
import { formatDateString } from "src/utility/DateFunctions";

export default function CourseFee() {
    const { query } = useRouter();
    const Id: number | undefined = query?.participantId
        ? parseInt(query?.participantId as string)
        : undefined;

    // participant_payment_history contains numerous records of same participant, getting the latest history record
    const { data } = useList({
        resource: "participant_payment_history",
        meta: {
            select: "id,transaction_fee_level_id(value),accommodation_fee,currency_code,participant_id(id,created_at),organization_fee",
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
                Course Fees
            </Text>
            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px]">
                        Registartion Date
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
                        Fee Level
                    </Text>
                    <Text className="font-semibold text-[16px]">
                        {courseFeedata?.transaction_fee_level_id?.value
                            ? courseFeedata?.transaction_fee_level_id?.value
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">
                        Course Fee
                    </Text>
                    <Text className="font-semibold text-[16px]">
                        {courseFeedata?.organization_fee ? `${courseFeedata?.currency_code ? courseFeedata?.currency_code : ''} ${courseFeedata?.organization_fee}` : '-'}
                    </Text>
                </div>
            </div>
            <hr />
        </div>
    );
}
