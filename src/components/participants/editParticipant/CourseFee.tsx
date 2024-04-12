import { formatDateString } from "src/utility/DateFunctions";

export default function CourseFee({ data }) {
    return (
        <div className="" id="Course">
            <div className="font-semibold text-[18px] pt-[25px]">
                Course Fees
            </div>

            <div className="flex py-[20px]">
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Registartion Date</div>
                    <div className="font-semibold">
                        {data?.participant_id?.created_at
                            ? formatDateString(
                                  new Date(data?.participant_id?.created_at)
                              )
                            : "-"}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Fee Level</div>
                    <div className="font-semibold">
                        {data?.transaction_fee_level_id?.value
                            ? data?.transaction_fee_level_id?.value
                            : "-"}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Course Fee</div>
                    <div className="font-semibold">
                        {data?.currency_code?data?.currency_code:'-'} {data?.participant_id?.total_amount?data?.participant_id?.total_amount:'-'}
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
