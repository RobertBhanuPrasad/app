import { useController } from "react-hook-form";
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

export default function AccomodationDetails({ data }) {
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
        field: { value: roommate_snore, onChange: roomateSnoreChange },
    } = useController({
        name: "roommate_snore",
        defaultValue: data?.participant_id?.roommate_snore,
    });
    // TODO: need to get the api data for accomodation types for particular program_id
    const accommodationOptions = [
        {
            label: "single sharing",
            value: 1,
        },
        {
            label: "double sharing(men)",
            value: 2,
        },
        {
            label: "double sharing(women)",
            value: 3,
        },
        {
            label: "triple sharing",
            value: 4,
        },
        {
            lable: "four sharing",
            value: 5,
        },
    ];
    return (
        <div id="Accomodation">
            <Text className="font-semibold text-[18px] py-[25px]">
                Accomodation Details
            </Text>
            <div className="flex gap-4">
                <div className="text-[#999999] ">
                    <Text>Accomodation Type</Text>
                    <div className="">
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
                                    {accommodationOptions?.map(
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
                <div className="w-[303px] ">
                    <Text className="text-[#999999] ">Fee per Person</Text>
                    <Text>
                        {data?.currency_code ? data?.currency_code : "-"}{" "}
                        {data?.accommodation_fee
                            ? data?.accommodation_fee
                            : "-"}
                    </Text>
                </div>
                <div className="text-[#999999] ">
                    <Text>Roommate Preferences 1</Text>
                    <Textarea
                        value={
                            data?.participant_id?.roommate_preferences_1
                                ? data?.participant_id?.roommate_preferences_1
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
            </div>
            <div className="flex gap-6 py-[10px]">
                <div className="text-[#999999] ">
                    <Text>Roommate Preferences 2</Text>
                    <Textarea
                        value={
                            data?.participant_id?.roommate_preferences_2
                                ? data?.participant_id?.roommate_preferences_2
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
                <div className="text-[#999999] ">
                    <Text>Roommate Preferences 3</Text>
                    <Textarea
                        value={
                            data?.participant_id?.roommate_preferences_3
                                ? data?.participant_id?.roommate_preferences_3
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
                <div className="text-[#999999] ">
                    <Text>Do you snore?</Text>
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
                <Text>Would you object to having room mate who snores?</Text>
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
