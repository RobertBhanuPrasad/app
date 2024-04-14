import { useList } from "@refinedev/core";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectItems,
    SelectTrigger,
    SelectValue,
} from "src/ui/select";
import { Textarea } from "src/ui/textarea";

export default function AccomodationDetails() {
    const { getValues } = useFormContext();
    const FormData = getValues();
    const {
        field: {
            value: accommodation_type_id,
            onChange: accommodationTypeChange,
        },
    } = useController({
        name: "accommodation_type_id",
    });
    const {
        field: { value: accommodation_snore, onChange: snoreChange },
    } = useController({
        name: "accommodation_snore",
    });
    const {
        field: { value: accommodation_fee },
    } = useController({
        name: "accommodation_fee",
    });
    const {
        field: { value: roommate_preferences_1 },
    } = useController({
        name: "roommate_preferences_1",
    });
    const {
        field: { value: roommate_preferences_2 },
    } = useController({
        name: "roommate_preferences_2",
    });
    const {
        field: { value: roommate_preferences_3 },
    } = useController({
        name: "roommate_preferences_3",
    });
    const {
        field: { value: roommate_snore, onChange: roomateSnoreChange },
    } = useController({
        name: "roommate_snore",
    });
    // TODO: need to get the api data for accomodation types for particular program_id

    const { data:accommodationOptions } = useList<any>({
        resource: "program_accommodations",
        filters: [
            {
                field: "program_id",
                operator: "eq",
                value: FormData?.program_id,
            },
        ],
        meta:{
            select:'accommodation_type_id!inner(id,name)'
        }
    });
       return (
        <div id="Accomodation">
            <Text className="font-semibold text-[18px] py-[25px]">
                Accomodation Details
            </Text>
            <div className="flex gap-4">
                <div className="text-[#999999] gap-2">
                    <div>
                        <Text className="text-[#999999] text-[14px]">
                            Accomodation Type
                        </Text>
                    </div>
                    <div className="py-[5px]">
                        {/* TODO: need to disable this accommodation type select */}
                        <Select
                            value={accommodation_type_id}
                            onValueChange={(val) => {
                                accommodationTypeChange(val);
                            }}
                        >
                            <SelectTrigger className="w-[278px] border text-[#999999] font-semibold !border-[#999999]">
                                <SelectValue placeholder="Select accomodation type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItems>
                                    {accommodationOptions?.data?.map(
                                        (option: any, index: number) => (
                                            <>
                                                <SelectItem
                                                    key={option.accommodation_type_id.id}
                                                    value={option.accommodation_type_id.id}
                                                    className="h-[44px]"
                                                >
                                                    {option.accommodation_type_id.name}
                                                </SelectItem>
                                            </>
                                        )
                                    )}
                                </SelectItems>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-[303px] ">
                    <Text className="text-[#999999] text-[14px]">
                        Fee per Person
                    </Text>
                    <Text className="py-[5px] font-semibold">
                        {FormData?.currency_code ? FormData?.currency_code : ""}{" "}
                        {accommodation_fee ? accommodation_fee : "-"}
                    </Text>
                </div>
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Roommate Preferences 1
                    </Text>
                    <Textarea
                        value={
                            roommate_preferences_1
                                ? roommate_preferences_1
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none py-[5px]"
                    />
                </div>
            </div>
            <div className="flex gap-6 py-[10px]">
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Roommate Preferences 2
                    </Text>
                    <Textarea
                        value={
                            roommate_preferences_2
                                ? roommate_preferences_2
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none py-[5px]"
                    />
                </div>
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Roommate Preferences 3
                    </Text>
                    <Textarea
                        value={
                            roommate_preferences_3
                                ? roommate_preferences_3
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none py-[5px]"
                    />
                </div>
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Do you snore?
                    </Text>
                    <div className=""></div>
                    <RadioGroup
                        value={accommodation_snore}
                        onValueChange={(value) => snoreChange(value)}
                    >
                        <div className="flex flex-row gap-6 ">
                            <RadioButtonCard
                                value={accommodation_snore}
                                selectedRadioValue={accommodation_snore}
                                label="Yes"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                            <RadioButtonCard
                                value={!accommodation_snore}
                                selectedRadioValue={accommodation_snore}
                                label="No"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="text-[#999999] py-[10px]">
                <Text className="text-[#999999] text-[14px] py-[5px]">
                    Would you object to having room mate who snores?
                </Text>
                <RadioGroup
                    value={roommate_snore}
                    onValueChange={(value) => roomateSnoreChange(value)}
                >
                    <div className="flex flex-row gap-6 ">
                        <RadioButtonCard
                            value={roommate_snore}
                            selectedRadioValue={roommate_snore}
                            label="Yes"
                            className="w-[112px] !h-[40px] rounded-[12px]"
                        />
                        <RadioButtonCard
                            value={!roommate_snore}
                            selectedRadioValue={roommate_snore}
                            label="No"
                            className="w-[112px] !h-[40px] rounded-[12px]"
                        />
                    </div>
                </RadioGroup>
            </div>
            <hr />
        </div>
    );
}
