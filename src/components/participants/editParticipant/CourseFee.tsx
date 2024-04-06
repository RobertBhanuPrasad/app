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
                    <div className="font-semibold">07 Sep 2022</div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Fee Level</div>
                    <div className="font-semibold">
                        {data?.data[0]?.price_category_id?.option_values?.value}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Course Fee</div>
                    <div className="font-semibold">EUR {data?.data[0]?.total_amount-data?.data[0]?.discounted_amount}</div>
                </div>
            </div>
            <hr />
        </div>
    );
}
