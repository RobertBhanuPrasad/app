import { useController } from "react-hook-form";
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
        field: { value: accommodationType, onChange: accommodationTypeChange },
    } = useController({
        name: "accommodationType",
        defaultValue:
            data?.accommodation_type_id && data?.accommodation_type_id,
    });
    const {
        field: { value: snore, onChange: snoreChange },
    } = useController({
        name: "snore",
        defaultValue: data?.participant_id?.accommodation_snore,
    });
    const {
        field: { value: roomateSnore, onChange: roomateSnoreChange },
    } = useController({
        name: "roomatesnore",
        defaultValue: data?.participant_id?.roommate_snore,
    });
    const {
        field: { value: specialCode, onChange: specialCodeChange },
    } = useController({
        name: "specialCode",
        defaultValue: data?.participant_id?.participant_code,
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
            <div className="font-semibold text-[18px] py-[25px]">
                Accomodation Details
            </div>
            <div className="flex gap-4">
                <div className="text-[#999999] ">
                    <div>Accomodation Type</div>
                    <div className="">
                        {/* TODO: need to disable this accommodation type select */}
                        <Select
                            value={accommodationType}
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
                    <div className="text-[#999999] ">Fee per Person</div>
                    <div>
                        {data?.currency_code?data?.currency_code:'-'} {data?.accommodation_fee?data?.accommodation_fee:'-'}
                        </div>
                </div>
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 1</div>
                    <Textarea
                        value={data?.participant_id?.roommate_preferences_1?data?.participant_id?.roommate_preferences_1:'-'}
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
            </div>
            <div className="flex gap-6 py-[10px]">
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 2</div>
                    <Textarea
                        value={data?.participant_id?.roommate_preferences_2?data?.participant_id?.roommate_preferences_2:'-'}
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 3</div>
                    <Textarea
                        value={data?.participant_id?.roommate_preferences_3?data?.participant_id?.roommate_preferences_3:'-'}
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
                <div className="text-[#999999] ">
                    <div>Do you snore?</div>
                    <RadioGroup
                        value={snore}
                        onValueChange={(value) => snoreChange(value)}
                    >
                        <div className="flex flex-row gap-6 ">
                            <RadioButtonCard
                                // value={snore}
                                selectedRadioValue={snore}
                                label="Yes"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                            <RadioButtonCard
                                // value={!snore}
                                selectedRadioValue={snore}
                                label="No"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="text-[#999999] py-[10px]">
                <div>Would you object to having room mate who snores?</div>
                <RadioGroup
                    value={roomateSnore}
                    onValueChange={(value) => roomateSnoreChange(value)}
                >
                    <div className="flex flex-row gap-6 ">
                        <RadioButtonCard
                            // value={roomateSnore}
                            selectedRadioValue={roomateSnore}
                            label="Yes"
                            className="w-[112px] !h-[40px] rounded-[12px]"
                        />
                        <RadioButtonCard
                            // value={!roomateSnore}
                            selectedRadioValue={roomateSnore}
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
