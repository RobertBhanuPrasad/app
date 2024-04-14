import { formatDateString } from "src/utility/DateFunctions";
import { Text } from "src/ui/TextTags";

export default function CourseFee({ data }) {
    return (
        <div className="" id="Course">
            <Text className="font-semibold text-[18px] pt-[25px]">
                Course Fees
            </Text>

            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px]">Registartion Date</Text>
                    <Text className="font-semibold text-[16px]">
                        {data?.participant_id?.created_at
                            ? formatDateString(
                                  new Date(data?.participant_id?.created_at)
                              )
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">Fee Level</Text>
                    <Text className="font-semibold text-[16px]">
                        {data?.transaction_fee_level_id?.value
                            ? data?.transaction_fee_level_id?.value
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">Course Fee</Text>
                    <Text className="font-semibold text-[16px]">
                        {data?.currency_code?data?.currency_code:'-'} {data?.participant_id?.total_amount?data?.participant_id?.total_amount:'-'}
                    </Text>
                </div>
            </div>
            <hr />
        </div>
    );
}
