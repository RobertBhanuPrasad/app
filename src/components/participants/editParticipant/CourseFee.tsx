import { formatDateString } from "src/utility/DateFunctions";
import { Text } from "src/ui/TextTags";
import { useController } from "react-hook-form";

export default function CourseFee() {
    const {
        field: { value: created_at },
    } = useController({
        name: "created_at",
    });
    const {
        field: { value: transaction_fee_level_id },
    } = useController({
        name: "transaction_fee_level_id",
    });
    const {
        field: { value: currency_code },
    } = useController({
        name: "currency_code",
    });
    const {
        field: { value: total_amount },
    } = useController({
        name: "total_amount",
    });
    return (
        <div className="" id="Course">
            <Text className="font-semibold text-[18px] pt-[25px]">
                Course Fees
            </Text>
{/* TODO: need confirmation about which date need to display */}
            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px]">Registartion Date</Text>
                    <Text className="font-semibold text-[16px]">
                        {created_at
                            ? formatDateString(
                                  new Date(created_at)
                              )
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">Fee Level</Text>
                    <Text className="font-semibold text-[16px]">
                        {transaction_fee_level_id
                            ? transaction_fee_level_id
                            : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999] text-[14px] ">Course Fee</Text>
                    <Text className="font-semibold text-[16px]">
                        {currency_code?currency_code:''} {total_amount?total_amount:'-'}
                    </Text>
                </div>
            </div>
            <hr />
        </div>
    );
}
