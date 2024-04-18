import Star from "@public/assets/star";
import { useList, useSelect } from "@refinedev/core";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { Input } from "src/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectItems,
    SelectTrigger,
    SelectValue,
} from "src/ui/select";

export default function PaymentDetails() {
    const { getValues } = useFormContext();
    const FormData = getValues();
    const {
        field: { value: participant_code, onChange: specialCodeChange },
    } = useController({
        name: "participant_code",
    });
    const {
        field: { value: expense_fee },
    } = useController({
        name: "expense_fee",
    });
    const {
        field: { value: accommodation_fee },
    } = useController({
        name: "accommodation_fee",
    });
    const {
        field: { value: total_amount },
    } = useController({
        name: "total_amount",
    });
    const {
        field: {
            value: participant_attendence_status_id,
            onChange: attendanceStatusChange,
        },
    } = useController({
        name: "participant_attendence_status_id",
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
        <div className="flex-row pb-[5px]" id="Payment">
            <Text className="font-semibold text-[18px] py-[25px]">
                Payment Details
            </Text>
            <div className="flex ">
                <div className="w-[303px]">
                    <Text className="text-[#999999]  text-[14px] ">
                        Course Fee
                    </Text>
                    <Text className="text-[16px] font-semibold">
                        {FormData?.currency_code ? FormData?.currency_code : ""}{" "}
                        {total_amount? (FormData?.program_type_id ?total_amount-FormData.accommodation_fee:total_amount):'-'}
                    
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999]  text-[14px]  ">
                        Accomodation Fee
                    </Text>
                    <Text className="text-[16px] font-semibold">
                        {FormData?.currency_code ? FormData?.currency_code : ""}{" "}
                        {accommodation_fee ? accommodation_fee : "-"}
                    </Text>
                </div>
                <div className="w-[303px]">
                    <Text className="text-[#999999]  text-[14px] ">
                        Total Fee {`(Includes VAT)`}
                    </Text>
                    <Text className="text-[16px] font-semibold">
                        {FormData?.currency_code ? FormData?.currency_code : ""}{" "}
                        {FormData?.total_amount ? total_amount : "-"}
                    </Text>
                </div>
            </div>
            <div className="flex py-[10px] gap-8">
                <div className="">
                    {/* TODO: need to hide it for particular requirement */}
                    <Text className="text-[#999999]  text-[14px] ">
                        Enter Special Code
                    </Text>

                    <div className="flex gap-4">
                        <div>
                            <Input
                                value={participant_code}
                                className="w-[178px] !h-[40px] resize-none"
                                onChange={(val) =>
                                    specialCodeChange(val?.target?.value)
                                }
                            />
                        </div>
                        <div>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(),
                                    specialCodeChange((e?.target as HTMLInputElement)?.value);
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-[305px]">
                    <div className="flex gap-2">
                        <div>
                            {/* TODO: make it mandatory */}
                            <Text className="text-[#999999] text-[14px]  ">
                                Attendance Status
                            </Text>
                        </div>
                        <div>
                            <Star />
                        </div>
                    </div>
                    {/* TODO: need to make it mandatory */}
                    <div>
                        <Select
                            value={participant_attendence_status_id}
                            onValueChange={(val) => {
                                attendanceStatusChange(val);
                            }}
                        >
                            <SelectTrigger className="w-[305px] border text-[#999999] font-semibold !border-[#999999]">
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
