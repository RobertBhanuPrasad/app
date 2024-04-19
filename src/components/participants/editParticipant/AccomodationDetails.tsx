import { useList } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { Input } from "src/ui/input";
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

export default function AccomodationDetails() {
    const { getValues } = useFormContext();
    const FormData = getValues();
    const {
        field: { value: accommodation_type_id },
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
    });
    // TODO: need to get the api data for accomodation types for particular program_id

    const { data: accommodationOptions } = useList<any>({
        resource: "program_accommodations",
        filters: [
            {
                field: "program_id",
                operator: "eq",
                value: FormData?.program_id?.id,
            },
        ],
        meta: {
            select: "accommodation_type_id!inner(id,name)",
        },
    });
    const { query } = useRouter();
    const Id: number | undefined = query?.participantId
        ? parseInt(query.id as string)
        : undefined;
    const {data} = useList({
        resource: "participant_payment_history",
        meta: {
            select: "accommodation_fee,currency_code,participant_id(program_id(id,program_type_id!inner(is_online_program)),roommate_preferences_1,roommate_preferences_2,roommate_preferences_3)",
        },
        filters: [
            {
                field: "participant_id",
                operator: "eq",
                value: Id,
            },
        ],
        sorters: [
            {
                field: "created_at",
                order: "desc",
            },
        ],
    });
    const accommodationData=data?.data[0]
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
                        <Select disabled={true} value={accommodation_type_id}>
                            <SelectTrigger className="w-[278px] border text-[#999999] font-semibold !border-[#999999]">
                                <SelectValue placeholder="Select accomodation type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItems>
                                    {accommodationOptions?.data?.map(
                                        (option: any, index: number) => (
                                            <>
                                                <SelectItem
                                                    key={
                                                        option
                                                            .accommodation_type_id
                                                            .id
                                                    }
                                                    value={
                                                        option
                                                            .accommodation_type_id
                                                            .id
                                                    }
                                                    className="h-[44px]"
                                                >
                                                    {
                                                        option
                                                            .accommodation_type_id
                                                            .name
                                                    }
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
                        {accommodationData?.currency_code
                            ? accommodationData?.currency_code
                            : ""}{" "}
                        {accommodationData?.accommodation_fee
                            ? accommodationData?.accommodation_fee
                            : "-"}
                    </Text>
                </div>
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Roommate Preferences 1
                    </Text>
                    <Input
                        value={
                            accommodationData?.participant_id?.roommate_preferences_1
                                ?  accommodationData?.participant_id?.roommate_preferences_1
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
                    <Input
                        value={
                            accommodationData?.participant_id?.roommate_preferences_2
                                ?  accommodationData?.participant_id?.roommate_preferences_2
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none py-[5px]"
                    />
                </div>
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Roommate Preferences 3
                    </Text>
                    <Input
                        value={
                            accommodationData?.participant_id?.roommate_preferences_3
                                ?  accommodationData?.participant_id?.roommate_preferences_3
                                : "-"
                        }
                        className="w-[278px] !h-[40px] resize-none py-[5px]"
                    />
                </div>
                {/* TODOD: need to amke it editable and store default values */}
                <div className="text-[#999999] ">
                    <Text className="text-[#999999] text-[14px]">
                        Do you snore?
                    </Text>
                    <div className=""></div>
                    <RadioGroup
                        value={JSON.stringify(accommodation_snore)}
                        onValueChange={(value) =>
                            snoreChange(parseInt(value), console.log(value))
                        }
                    >
                        <div className="flex flex-row gap-6 ">
                            <RadioButtonCard
                                value={JSON.stringify(
                                    FormData?.accommodation_snore
                                )}
                                selectedRadioValue={accommodation_snore}
                                label="Yes"
                                className="w-[112px] !h-[40px] rounded-[12px]"
                            />
                            <RadioButtonCard
                                value={JSON.stringify(
                                    !FormData?.accommodation_snore
                                )}
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
                            value={String(roommate_snore)}
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
