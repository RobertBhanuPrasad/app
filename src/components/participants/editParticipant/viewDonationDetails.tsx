import { useList, useSelect } from "@refinedev/core";
import { useRouter } from "next/router";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";
import { TableHeader, Text } from 'src/ui/TextTags'

export default function ViewDonationDetails({ setViewDonation }) {
    const { id } = useRouter();
   
    const queryResult  = useList({
        resource: "participant_payment_history",
        meta: {
            select: "currency_code,payment_date,error_message,response_message,send_payment_confirmation,total_amount,payment_method_id!inner(id,value),transaction_type_id!inner(id,value),transaction_status_id!inner(id,value),payment_transaction_id,participant_id!inner(id,contact_id!inner(id,full_name,date_of_birth,street_address,postal_code,country_id!inner(name),state_id!inner(name),city_id!inner(name),mobile,email,identification_num,identification_type_id!inner(id,name)),organisation_id!inner(id,name),donation_type,donation_date)",
        },
        // TODO: replace with particpant_id from router
        filters: [{ field: "participant_id", operator: "eq", value: 2 }],
        sorters: [{ field: "created_at", order: "desc" }],
    });
    console.log(queryResult)
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
                                <Text className="text-[#999999]">
                                    orgainization
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.organisation_id?.name
                                        ? data?.participant_id?.organisation_id
                                              ?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">Amount</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.currency_code && data?.currency_code}{" "}
                                    {data?.total_amount
                                        ? data?.total_amount
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    Donation Type
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.donation_type
                                        ? data?.participant_id?.donation_type
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    Donation Date
                                </Text>
                                <Text className="font-semibold text-[#666666]">
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
                                <Text className="text-[#999999]">
                                    Payment Method
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.payment_method_id?.value
                                        ? data?.payment_method_id?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    Transaction Type
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.transaction_type_id?.value
                                        ? data?.transaction_type_id?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    Transaction Status
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.transaction_status_id?.value
                                        ? data?.transaction_status_id?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    Transaction ID
                                </Text>
                                <Text className="font-semibold text-[#666666]">
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
                                <Text className="text-[#999999]">Name</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.full_name
                                        ? data?.participant_id?.contact_id
                                              ?.full_name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    Date of Birth
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.date_of_birth
                                        ? formatDateString(
                                              new Date(
                                                  data?.participant_id?.contact_id?.date_of_birth
                                              )
                                          )
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">Address</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.street_address
                                        ? data?.participant_id?.contact_id
                                              ?.street_address
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">Country</Text>
                                <Text className="font-semibold text-[#666666]">
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
                                <Text className="text-[#999999]">
                                    Zip/Postal Code
                                </Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.postal_code
                                        ? data?.participant_id?.contact_id
                                              ?.postal_code
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">State</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.state_id
                                        ?.name
                                        ? data?.participant_id?.contact_id
                                              ?.state_id?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">City</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.city_id
                                        ?.name
                                        ? data?.participant_id?.contact_id
                                              ?.city_id?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">Mobile</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.mobile
                                        ? data?.participant_id?.contact_id
                                              ?.mobile
                                        : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999]">Email ID</Text>
                                <Text className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.email
                                        ? data?.participant_id?.contact_id
                                              ?.email
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999]">
                                    {data?.participant_id?.contact_id
                                        ?.identification_type_id?.name
                                        ? data?.participant_id?.contact_id
                                              ?.identification_type_id?.name
                                        : "-"}
                                </Text>

                                <Text className="font-semibold text-[#666666]">
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
