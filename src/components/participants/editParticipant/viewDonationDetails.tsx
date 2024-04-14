import { useList } from "@refinedev/core";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";

export default function ViewDonationDetails({ setViewDonation }) {
    const { getValues } = useFormContext();
    const formData = getValues();
    const queryResult = useList({
        resource: "participant_payment_history",
        meta: {
            select: "currency_code,payment_date,error_message,response_message,send_payment_confirmation,total_amount,payment_method_id!inner(id,value),transaction_type_id!inner(id,value),transaction_status_id!inner(id,value),payment_transaction_id,participant_id!inner(id,contact_id!inner(id,full_name,date_of_birth,street_address,postal_code,country_id!inner(name),state_id!inner(name),city_id!inner(name),mobile,email,identification_num,identification_type_id!inner(id,name)),organisation_id!inner(id,name),donation_type,donation_date)",
        },
        // TODO: replace with particpant_id from router
        filters: [{ field: "participant_id", operator: "eq", value: 2 }],
        sorters: [{ field: "created_at", order: "desc" }],
    });
    const {
        field: { value: email },
    } = useController({ name: "email" });
    const {
        field: { value: mobile },
    } = useController({ name: "mobile" });
    const {
        field: { value: date_of_birth },
    } = useController({ name: "date_of_birth" });
    const {
        field: { value: street_address },
    } = useController({ name: "street_address" });
    const {
        field: { value: postal_code },
    } = useController({ name: "postal_code" });
    const data = queryResult?.data?.data[0];
    return (
        <div>
            <div>
                <Text className="flex justify-center text-[24px] font-semibold ">
                    View Donation Details
                </Text>
                <div className="flex flex-col ">
                    <Text className="text-[18px] font-semibold py-[15px]">
                        Donation Details
                    </Text>
                    <hr />
                    <div className="flex flex-col gap-4 py-[20px]">
                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    orgainization
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.organisation_id?.name
                                        ? data?.participant_id?.organisation_id
                                              ?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Amount
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.currency_code && data?.currency_code}{" "}
                                    {data?.total_amount
                                        ? data?.total_amount
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Donation Type
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.donation_type
                                        ? data?.participant_id?.donation_type
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Donation Date
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.donation_date
                                        ? formatDateString(
                                              new Date(
                                                  data?.participant_id?.donation_date
                                              )
                                          )
                                        : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Payment Method
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.payment_method_id?.value
                                        ? data?.payment_method_id?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction Type
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.transaction_type_id?.value
                                        ? data?.transaction_type_id?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction Status
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.transaction_status_id?.value
                                        ? data?.transaction_status_id?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction ID
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.payment_transaction_id
                                        ? data?.payment_transaction_id
                                        : "-"}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <Text className="text-[18px] font-semibold py-[15px]">
                        Personal Details
                    </Text>
                    <hr />
                    <div className="flex flex-col gap-4 py-[20px]">
                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Name
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.full_name
                                        ? formData.full_name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Date of Birth
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {date_of_birth
                                        ? formatDateString(
                                              new Date(date_of_birth)
                                          )
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Address
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {street_address ? street_address : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Country
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.contact_id
                                        ?.country_id?.name
                                        ? data?.participant_id?.contact_id
                                              ?.country_id?.name
                                        : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Zip/Postal Code
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {postal_code ? postal_code : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    State
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.contact_id?.state_id
                                        ?.name
                                        ? data?.participant_id?.contact_id
                                              ?.state_id?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    City
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.contact_id?.city_id
                                        ?.name
                                        ? data?.participant_id?.contact_id
                                              ?.city_id?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Mobile
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {mobile ? mobile : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Email ID
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {email ? email : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[16px]">
                                    {data?.participant_id?.contact_id
                                        ?.identification_type_id?.name
                                        ? data?.participant_id?.contact_id
                                              ?.identification_type_id?.name
                                        : "-"}
                                </Text>

                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {data?.participant_id?.contact_id
                                        ?.identification_num
                                        ? data?.participant_id?.contact_id
                                              ?.identification_num
                                        : "-"}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button onClick={() => setViewDonation(false)}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
