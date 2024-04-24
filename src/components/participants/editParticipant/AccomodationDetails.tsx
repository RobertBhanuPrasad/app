import Star from "@public/assets/star";
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
    field: { value: accommodation_snore, onChange: snoreChange },
    fieldState: { error: accommodationSnoreError },
  } = useController({
    name: "accommodation_snore",
  });

  const {
    field: { value: roommate_snore, onChange: roomateSnoreChange },
    fieldState: { error: roommateSnoreError },
  } = useController({
    name: "roommate_snore",
  });

  const { query } = useRouter();
  const Id: number | undefined = query?.participantId
    ? parseInt(query.participantId as string)
    : undefined;
  // TODO: need to get the api data for accomodation types for particular program_id

  const { data: accommodationOptions } = useList<any>({
    resource: "program_accommodations",
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: query?.id,
      },
    ],
    meta: {
      select: "accommodation_type_id!inner(id,name)",
    },
    pagination: {
      mode: "off",
    },
  });
  const { data } = useList({
    resource: "participant_payment_history",
    meta: {
      select:
        "accommodation_fee,accommodation_type_id(accommodation_type_id(id,name)),currency_code,participant_id(program_id(id,program_type_id!inner(is_online_program)),roommate_preferences_1,roommate_preferences_2,roommate_preferences_3)",
    },
    filters: [
      {
        field: "participant_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "program_id",
        operator: "eq",
        value: query?.id,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });
  const accommodationData = data?.data[0];
  return (
    <div id="Accomodation">
      <Text className="font-semibold text-[18px] py-[25px]">
        Accomodation Details
      </Text>
      <div className="flex gap-4">
        <div className="text-[#999999] gap-2">
          <div className="flex gap-2">
            <div>
              <Text className="text-[#999999] text-[14px]">
                Accomodation Type
              </Text>
            </div>
            <div>
              <Star />
            </div>
          </div>
          <div className="py-[5px]">
            {/* TODO: need to disable this accommodation type select */}
            <Select
              disabled={true}
              value={
                accommodationData?.accommodation_type_id?.accommodation_type_id
                  ?.id
              }
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
          <Text className="text-[#999999] text-[14px]">Fee per Person</Text>
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
          <Text className="text-[#999999] text-[14px] ">
            Roommate Preferences 1
          </Text>
          <Input
            value={
              accommodationData?.participant_id?.roommate_preferences_1
                ? accommodationData?.participant_id?.roommate_preferences_1
                : "-"
            }
            className="w-[278px] !h-[40px] resize-none py-[5px] outline-none "
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
                ? accommodationData?.participant_id?.roommate_preferences_2
                : "-"
            }
            className="w-[278px] !h-[40px] resize-none py-[5px] outline-none"
          />
        </div>
        <div className="text-[#999999] ">
          <Text className="text-[#999999] text-[14px]">
            Roommate Preferences 3
          </Text>
          <Input
            value={
              accommodationData?.participant_id?.roommate_preferences_3
                ? accommodationData?.participant_id?.roommate_preferences_3
                : "-"
            }
            className="w-[278px] !h-[40px] resize-none py-[5px] outline-none"
          />
        </div>
        {/* TODOD: need to amke it editable and store default values */}
        <div className="text-[#999999] ">
          <div className="flex gap-2">
            <div>
              <Text className="text-[#999999] text-[14px]"> Do you snore?</Text>
            </div>
            <div>
              <Star />
            </div>
          </div>

          <div className=""></div>
          <RadioGroup
            value={JSON.stringify(accommodation_snore)}
            onValueChange={(value) => {
              value === "true" ? snoreChange(true) : snoreChange(false);
            }}
          >
            <div className="flex flex-row gap-6">
              <RadioButtonCard
                value="true" // Use boolean value directly
                selectedRadioValue={JSON.stringify(accommodation_snore)} // Use the actual value, no need to stringify
                label="Yes"
                className="w-[112px] h-[40px] rounded-[12px]" // Removed unnecessary ! from className
              />
              <RadioButtonCard
                value="false" // Use boolean value directly
                selectedRadioValue={JSON.stringify(accommodation_snore)} // Use the actual value, no need to stringify
                label="No"
                className="w-[112px] h-[40px] rounded-[12px]" // Removed unnecessary ! from className
              />
            </div>
          </RadioGroup>
          {accommodationSnoreError && (
            <span className="text-[#FF6D6D] text-[14px]">
              {accommodationSnoreError?.message}
            </span>
          )}
        </div>
      </div>
      <div className="text-[#999999] py-[10px]">
        <div className="flex gap-2">
          <div>
            <Text className="text-[#999999] text-[14px] py-[5px]">
              Would you object to having room mate who snores?
            </Text>
          </div>
          <div>
            <Star />
          </div>
        </div>

        <RadioGroup
          value={JSON.stringify(FormData?.roommate_snore)}
          onValueChange={(value) => {
            value === "true"
              ? roomateSnoreChange(true)
              : roomateSnoreChange(false);
          }}
        >
          <div className="flex flex-row gap-6 ">
            <RadioButtonCard
              value="true"
              selectedRadioValue={JSON.stringify(FormData?.roommate_snore)}
              label="Yes"
              className="w-[112px] !h-[40px] rounded-[12px]"
            />
            <RadioButtonCard
              value="false"
              selectedRadioValue={JSON.stringify(roommate_snore)}
              label="No"
              className="w-[112px] !h-[40px] rounded-[12px]"
            />
          </div>
        </RadioGroup>
        {roommateSnoreError && (
          <span className="text-[#FF6D6D] text-[14px]">
            {roommateSnoreError?.message}
          </span>
        )}
      </div>
      <hr />
    </div>
  );
}
