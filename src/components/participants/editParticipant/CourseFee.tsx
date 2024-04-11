import { useSelect } from "@refinedev/core";

export default function CourseFee({ data }) {
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
                        {data?.data[0]?.participant_id?.created_at}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Fee Level</div>
                    <div className="font-semibold">
                        {/* TODO: check fee level  value*/}
                        {data?.data[0]?.transaction_fee_level_id?.value}
                     </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Course Fee</div>
                    <div className="font-semibold">
                        EUR
                        {/* TODO: validate currency code */}
                        {/* data?.data[0]?.currency_code] */}
                        {data?.data[0]?.total_amount -
                            data?.data[0]?.discounted_amount}
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
