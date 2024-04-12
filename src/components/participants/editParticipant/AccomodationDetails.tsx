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
        field: { value: roomPreference1, onChange: roomPreference1Change },
    } = useController({
        name: "roomPreference1",
        defaultValue: data?.participant_id?.roommate_preferences_1,
    });
    const {
        field: { value: roomPreference2, onChange: roomPreference2Change },
    } = useController({
        name: "roomPreference2",
        defaultValue: data?.participant_id?.roommate_preferences_2,
    });
    const {
        field: { value: roomPreference3, onChange: roomPreference3Change },
    } = useController({
        name: "roomPreference3",
        defaultValue: data?.participant_id?.roommate_preferences_3,
    });
    const {
        field: { value: accommodationType, onChange: accommodationTypeChange },
    } = useController({
        name: "accommodationType",
        defaultValue: data?.accommodation_type_id,
        // TODO: validation accomodation type, returning text but needed id
        // ,defaultValue:queryResult?.data?.accommodation_type
    });
    const {
        field: { value: snore, onChange: snoreChange },
    } = useController({
        name: "snore",
        defaultValue: data?.participant_id?.accommodation_snore,
    });
    console.log(snore, "snore");
    const {
        field: { value: roomateSnore, onChange: roomateSnoreChange },
    } = useController({
        name: "roomatesnore",
        defaultValue: data?.participant_id?.roommate_snore,
    });
    console.log(
        accommodationType,
        data?.accommodation_type_id,
        "accommodationType"
    );
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
                        {/* <CustomSelect
                            data={accommodationOptions}
                            onSearch={() => {}}
                            onBottomReached={() => {}}
                            onChange={(value) => accommodationTypeChange(value)}
                            placeholder={"Select accomodation type"}
                            selectBoxStyles={{
                                header: "w-80",
                                dropdown: "w-80",
                            }}
                            value={accommodationType}
                        /> */}
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
                        {data?.currency_code} {data?.accommodation_fee}
                        {/* {data?.data[0]?.currency_code} */}
                        {/* {data?.data[0]?.accommodation_fee} */}
                    </div>
                </div>
                <div className="">
                    <div className="text-[#999999] ">
                        Roommate Preferences 1
                    </div>
                    <Textarea
                        value={data?.participant_id?.roommate_preferences_1}
                        // onChange={(val) => {
                        //     roomPreference1Change(val?.target?.value);
                        // }}
                        // placeholder=""
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
            </div>
            <div className="flex gap-6 py-[10px]">
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 2</div>
                    <Textarea
                        value={data?.participant_id?.roommate_preferences_2}
                        // onChange={(val) => {
                        //     roomPreference2Change(val?.target?.value);
                        // }}
                        // placeholder=""
                        className="w-[278px] !h-[40px] resize-none"
                    />
                </div>
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 3</div>
                    <Textarea
                        value={data?.participant_id?.roommate_preferences_3}
                        // onChange={(val) => {
                        //     roomPreference3Change(val?.target?.value);
                        // }}
                        // placeholder=""
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
                                value={snore}
                                selectedRadioValue={snore}
                                label="Yes"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                            <RadioButtonCard
                                value={!snore}
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
                            value={roomateSnore}
                            selectedRadioValue={roomateSnore}
                            label="Yes"
                            className="w-[112px] !h-[40px] rounded-[12px]"
                        />
                        <RadioButtonCard
                            value={!roomateSnore}
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
