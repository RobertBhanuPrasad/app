import { useList } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { formatDateString } from "src/utility/DateFunctions";

export default function CourseFee() {
    
    const { query } = useRouter();
    const Id: number | undefined = query?.participantId
        ? parseInt(query.id as string)
        : undefined;
    const { data } = useList({
        resource: "participant_payment_history",
        meta: {
            select: "id,created_at,transaction_fee_level_id(value),total_amount,accommodation_fee,currency_code,participant_id(program_id(id,program_type_id!inner(is_online_program)))",
        },
        filters: [
            {
                field: "participant_id",
                operator: "eq",
                value: Id,
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
            {/* TODO: need confirmation about which date need to display */}
            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px]">
                        Registartion Date
                    </Text>
                    <Text className="font-semibold text-[16px]">
                        {courseFeedata?.created_at
                            ? formatDateString(
                                  new Date(courseFeedata?.created_at)
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
