import Star from "@public/assets/star";
import { useList, useOne, useSelect } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController } from "react-hook-form";
import { translatedText } from "src/common/translations";
import { Text } from "src/ui/TextTags";
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
  // Use useController to control the participant_code,participant_attendance_status field
  const {
    field: {
      value: participant_attendence_status_id,
      onChange: attendanceStatusChange,
    },
    fieldState: { error: attendanceError },
  } = useController({
    name: "participant_attendence_status_id",
  });

  // Getting dropdown options for attendence status
  const { data } = useList<any>({
    resource: "option_labels",
    filters: [
      {
        field: "name",
        operator: "eq",
        value: "Participant Attendance Status",
      },
    ],
  });

    const { options: attendanceOptions } = useSelect({
        resource: "option_values",
        optionLabel: "name",
        optionValue: "id",
        filters: [
            {
                field: "option_label_id",
                operator: "eq",
                value: data?.data[0]?.id,
            },
        ],
    });

  // participant_payment_history contains numerous records of same participant, getting the latest history record
  const { query } = useRouter();
  const Id: number | undefined = query?.participantId
    ? parseInt(query.participantId as string)
    : undefined;
  const paymentData = useList({
    resource: "participant_payment_history",
    meta: {
      select:
        "id,transaction_fee_level_id(value),total_amount,accommodation_fee,currency_code,organization_fee,participant_id(discount_code)",
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
  const paymentDetailData = paymentData?.data?.data[0];

 



  return (
    <div className="flex-row pb-[5px]" id="Payment">
      <Text className="font-semibold text-[18px] py-[25px]">
        Payment Details
      </Text>
      <div className="flex ">
        <div className="w-[303px]">
          <Text className="text-[#999999]  text-[14px] ">Course Fee</Text>
          <Text className="text-[16px] font-semibold">
          {paymentDetailData?.organization_fee ? `${paymentDetailData?.currency_code ? paymentDetailData?.currency_code : ''} ${paymentDetailData?.organization_fee?.toFixed(2)}` : '-'}
          </Text>
        </div>
        <div className="w-[303px]">
          <Text className="text-[#999999]  text-[14px]  ">
            Accommodation Fee
          </Text>
          <Text className="text-[16px] font-semibold">
          {paymentDetailData?.accommodation_fee ? `${paymentDetailData?.currency_code ? paymentDetailData?.currency_code : ''} ${paymentDetailData?.accommodation_fee?.toFixed(2)}` : '-'}
          </Text>
        </div>
        <div className="w-[303px]">
          <Text className="text-[#999999]  text-[14px] ">
            Total Fee {`(Includes VAT)`}
          </Text>
          <Text className="text-[16px] font-semibold">
          {paymentDetailData?.total_amount ? `${paymentDetailData?.currency_code ? paymentDetailData?.currency_code : ''} ${paymentDetailData?.total_amount?.toFixed(2)}` : '-'}
          </Text>
        </div>
      </div>
      <div className="flex py-[10px] gap-8">
        <div className="">
          {/* If the participant is registering via discount code,
          we need to show the discount code in the special code field and it has to be disabled
          If the participant is registering without a discount code, 
          we won't show anything in the special code which is empty and disabled */}
          <Text className="text-[#999999]  text-[14px] ">
            Enter Special Code
          </Text>

          <div className="flex gap-4">
            <div>
              <Input
                value={paymentDetailData?.participant_id?.discount_code}
                className="w-[268px] !h-[40px] resize-none font-semibold rounded-xl border-[#E1E1E1]"
                disabled={true}
              />
            </div>
          </div>
        </div>
        <div className="w-[305px]">
          <div className="flex gap-2">
            <div>
              <Text className="text-[#999999] text-[14px]  ">
                Attendance Status
              </Text>
            </div>
            <div>
              <Star />
            </div>
          </div>
          <div>
            <Select
              value={participant_attendence_status_id}
              onValueChange={(val) => {
                attendanceStatusChange(val);
              }}
            >
              <SelectTrigger className="w-[305px] border font-semibold !border-[#999999]">
                <SelectValue placeholder="Select attendence status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItems>
                  {attendanceOptions?.map((option: any, index: number) => (
                    <>
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="h-[44px]"
                      >
                        {translatedText(option.label)}
                      </SelectItem>
                    </>
                  ))}
                </SelectItems>
              </SelectContent>
            </Select>
            {attendanceError && (
              <span className="text-[#FF6D6D] text-[14px]">
                {attendanceError?.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
