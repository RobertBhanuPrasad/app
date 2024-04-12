import { useList, useSelect } from "@refinedev/core";
import { useController } from "react-hook-form";
import { Button } from "src/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectItems,
    SelectTrigger,
    SelectValue,
} from "src/ui/select";
import { Textarea } from "src/ui/textarea";

export default function PaymentDetails({ participantData }) {
    const {
        field: { value: specialCode, onChange: specialCodeChange },
    } = useController({
        name: "specialCode",
        defaultValue: participantData?.participant_id?.discount_code,
    });
    const {
        field: { value: attendanceStatus, onChange: attendanceStatusChange },
    } = useController({
        name: "attendanceStatus",
        defaultValue:
            participantData?.participant_id?.participant_attendence_status_id,
    });
    const { data } = useList<any>({
        resource: "option_labels",
        filters: [
            {
                field: "name",
                operator: "eq",
                value: "Attendance Status",
            },
        ],
    });

    const { options: attendanceOptions } = useSelect({
        resource: "option_values",
        optionLabel: "value",
        optionValue: "id",
        filters: [
            {
                field: "option_label_id",
                operator: "eq",
                value: data?.data[0]?.id,
            },
        ],
    });
    return (
        <div className="flex-row" id="Payment">
            <div className="font-semibold text-[18px] py-[25px]">
                Payment Details
            </div>
            <div className="flex ">
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Course Fee</div>
                    <div className="font-semibold">
                        {participantData?.currency_code
                            ? participantData?.currency_code
                            : "-"}
                        {participantData?.expense_fee
                            ? participantData?.expense_fee
                            : "-"}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Accomodation Fee</div>
                    <div className="font-semibold">
                        {participantData?.currency_code
                            ? participantData?.currency_code
                            : "-"}
                        {participantData?.accommodation_fee
                            ? participantData?.accommodation_fee
                            : "-"}
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">
                        Total Fee {`(Includes VAT)`}
                    </div>
                    <div className="font-semibold">
                        {participantData?.currency_code
                            ? participantData?.currency_code
                            : "-"}{" "}
                        {participantData?.participant_id?.total_amount
                            ? participantData?.participant_id?.total_amount
                            : "-"}
                    </div>
                </div>
            </div>
            <div className="flex py-[10px] gap-4">
                <div className="">
                    <div className="text-[#999999] ">Enter Special Code</div>

                    <div className="flex">
                        <div>
                            <Textarea
                                value={specialCode}
                                className="w-[278px] !h-[40px] resize-none"
                                // onChange={(val)=> specialCodeChange(val?.target?.value)}
                            />
                        </div>
                        <div>
                            <Button onClick={(e)=>{e.preventDefault(),specialCodeChange(e?.target?.value)}}>Apply</Button>
                        </div>
                    </div>
                </div>
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Attendance Status</div>
                    <div>
                        <Select
                            value={attendanceStatus}
                            onValueChange={(val) => {
                                attendanceStatusChange(val);
                            }}
                        >
                            <SelectTrigger className="w-[278px] border text-[#999999] font-semibold !border-[#999999]">
                                <SelectValue placeholder="Select attendence status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItems>
                                    {attendanceOptions?.map(
                                        (option: any, index: number) => (
                                            <>
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    className="h-[44px]"
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            </>
                                        )
                                    )}
                                </SelectItems>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
