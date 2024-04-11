import { useSelect } from "@refinedev/core";
import { useController } from "react-hook-form";
import CustomSelect from "src/ui/custom-select";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import { Textarea } from "src/ui/textarea";

export default function AccomodationDetails({data}) {
    const {
        field: { value: roomPreference1, onChange: roomPreference1Change },
    } = useController({ name: "roomPreference1" });
    const {
        field: { value: roomPreference2, onChange: roomPreference2Change },
    } = useController({ name: "roomPreference2" });
    const {
        field: { value: roomPreference3, onChange: roomPreference3Change },
    } = useController({ name: "roomPreference3" });
    const {
        field: { value: accommodationType, onChange: accommodationTypeChange },
    } = useController({ name: "accommodationType" 
// TODO: validation accomodation type, returning text but needed id
    // ,defaultValue:queryResult?.data?.accommodation_type
});
    const {
        field: { value: snore, onChange: snoreChange },
    } = useController({ name: "snore" });
    const {
        field: { value: roomateSnore, onChange: roomateSnoreChange },
    } = useController({ name: "roomatesnore" });
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
                        <CustomSelect
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
                        />
                    </div>
                </div>
                <div className="w-[303px] ">
                    <div className="text-[#999999] ">Fee per Person</div>
                    <div>
                        EUR 90.00
                        {/* {data?.data[0]?.currency_code} */}
                        {/* {data?.data[0]?.accommodation_fee} */}
                    </div>
                </div>
                <div className="">
                    <div className="text-[#999999] ">
                        Roommate Preferences 1
                    </div>
                    <Textarea
                        value={roomPreference1}
                        onChange={(val) => {
                            roomPreference1Change(val?.target?.value);
                        }}
                        placeholder=""
                        className="w-[303px] !h-[10px] resize-none"
                    />
                </div>
            </div>
            <div className="flex gap-6 py-[10px]">
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 2</div>
                    <Textarea
                        value={roomPreference2}
                        onChange={(val) => {
                            roomPreference2Change(val?.target?.value);
                        }}
                        placeholder=""
                        className="w-[303px] !h-[10px] resize-none"
                    />
                </div>
                <div className="text-[#999999] ">
                    <div>Roommate Preferences 3</div>
                    <Textarea
                        value={roomPreference3}
                        onChange={(val) => {
                            roomPreference3Change(val?.target?.value);
                        }}
                        placeholder=""
                        className="w-[303px] !h-[10px] resize-none"
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
                                value="true"
                                selectedRadioValue={snore}
                                label="Yes"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                            <RadioButtonCard
                                value="false"
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
                            value="true"
                            selectedRadioValue={roomateSnore}
                            label="Yes"
                            className="w-[112px] !h-[40px] rounded-[12px]"
                        />
                        <RadioButtonCard
                            value="false"
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
