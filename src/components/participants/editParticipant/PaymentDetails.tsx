import { useController } from "react-hook-form";
import { Button } from "src/ui/button";
import CustomSelect from "src/ui/custom-select";
import { Textarea } from "src/ui/textarea";

export default function PaymentDetails() {
    const {
        field: { value: specialCode, onChange: specialCodeChange },
    } = useController({ name: "specialCode" ,
// defaultValue:data?.data[0]?.participant_id?.discount_code

    });
    const {
        field: { value: paymentDetails, onChange: paymentDetailsChange },
    } = useController({ name: "paymentDetails" ,
        // defaultValue:data?.data[0]?.participant_id?.participant_attendence_status_id
    });
    const attendanceStatus = [
        { label: "pending", value: 1 },
        { label: "confirmed", value: 2 },
        { label: "dropout", value: 3 },
        { label: "cancelled", value: 4 },
    ];
    return (
        <div className="flex-row" id="Payment">
            <div className="font-semibold text-[18px] py-[25px]">
                Payment Details
            </div>
            <div className="flex ">
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Course Fee</div>
                    <div className="font-semibold">EUR 110.00
                     {/* {data?.data[0]?.currency_code} */}
                        {/* {data?.data[0]?.expense_fee} */}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Accomodation Fee</div>
                    <div className="font-semibold">EUR 90.00
                     {/* {data?.data[0]?.currency_code} */}
                        {/* {data?.data[0]?.accommodation_fee} */}</div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">
                        Total Fee {`(Includes VAT)`}
                    </div>
                    <div className="font-semibold">EUR 200.00
                     {/* {data?.data[0]?.currency_code} */}
                        {/* {data?.data[0]?.total_fee} */}</div>
                </div>
            </div>
            <div className="flex py-[10px] gap-4">
                <div className="">
                    <div className="text-[#999999] ">Enter Special Code</div>

                    <div className="flex">
                        <div>
                            <Textarea
                                value={specialCode}
                                onChange={(val) => {
                                    specialCodeChange(val?.target?.value);
                                }}
                                placeholder=""
                                className="w-[303px] !h-[10px] resize-none"
                            />
                        </div>
                        <div>
                            <Button>Apply</Button>
                        </div>
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Attendance Status</div>
                    <div>
                        <CustomSelect
                            data={attendanceStatus}
                            onSearch={() => {}}
                            onBottomReached={() => {}}
                            onChange={(value) => paymentDetailsChange(value)}
                            placeholder={"Select attendance status"}
                            selectBoxStyles={{
                                header: "w-80",
                                dropdown: "w-80",
                            }}
                            value={paymentDetails}
                        />
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
