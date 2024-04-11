import { useSelect } from "@refinedev/core";

export default function CourseFee({ data }) {
    const selectQuery: any = {
        resource: "participant_payment_history",
        filters: [
            {
                field: "participant_id",
                operator: "eq",
                value: data?.data[0]?.id,
            },
        ],
        meta: {
            select: "transaction_fee_level_id!inner(option_value),currency_code",
        },
    };
    const {queryResult}=useSelect(selectQuery)
    return (
        <div className="" id="Course">
            <div className="font-semibold text-[18px] pt-[25px]">
                Course Fees
            </div>

            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Registartion Date</div>
                    {/* call a function whic converts the date format */}
                    <div className="font-semibold">
                        {data?.data[0]?.created_at}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Fee Level</div>
                    <div className="font-semibold">
                        {/* TODO: check fee level  value*/}
                        {/* {queryResult?.data?.transaction_fee_level_id?.value} */}
                     </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Course Fee</div>
                    <div className="font-semibold">
                        EUR
                        {/* TODO: validate currency code */}
                        {/* queryResult?.data?.currency_code] */}
                        {data?.data[0]?.total_amount -
                            data?.data[0]?.discounted_amount}
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
