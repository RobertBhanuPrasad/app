import { useSelect } from "@refinedev/core";
import { useRouter } from "next/router";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";

export default function ViewDonationDetails({ setViewDonation }) {
    const { id } = useRouter();
    let filter = [{ field: "participant_id", operator: "eq", value: id }];
    let sorter = [{ field: "created_at", order: "desc" }];
    const selectQuery: any = {
        resource: "participant_payment_history",
        meta: {
            select: "currency_code,payment_date,error_message,response_message,send_payment_confirmation,total_amount,payment_method_id!inner(id,value),transaction_type_id!inner(id,value),transaction_status_id!inner(id,value),payment_transaction_id,participant_id!inner(id,contact_id!inner(id,full_name,date_of_birth,street_address,postal_code,country_id!inner(name),state_id!inner(name),city_id!inner(name),mobile,email,identification_num,identification_type_id!inner(id,name)),organisation_id!inner(id,name),donation_type,donation_date)",
        },
        filters: filter,
        sorters: sorter,
    };

    const { queryResult } = useSelect(selectQuery);
    const data = queryResult?.data?.data[0];
    return (
        <div>
            <div>
                <div className="flex justify-center text-[24px] font-semibold ">
                    View Donation Details
                </div>
                <div className="flex flex-col ">
                    <div className="text-[18px] font-semibold py-[15px]">
                        Donation Details
                    </div>
                    <hr />
                    <div className="flex flex-col gap-4 py-[20px]">
                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    orgainization
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.organisation_id?.name
                                        ? data?.participant_id?.organisation_id
                                              ?.name
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">Amount</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.currency_code && data?.currency_code}{" "}
                                    {data?.total_amount
                                        ? data?.total_amount
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Donation Type
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.donation_type
                                        ? data?.participant_id?.donation_type
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Donation Date
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.donation_date
                                        ? formatDateString(
                                              new Date(
                                                  data?.participant_id?.donation_date
                                              )
                                          )
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Payment Method
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.payment_method_id?.value
                                        ? data?.payment_method_id?.value
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Transaction Type
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.transaction_type_id?.value
                                        ? data?.transaction_type_id?.value
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Transaction Status
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.transaction_status_id?.value
                                        ? data?.transaction_status_id?.value
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Transaction ID
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.payment_transaction_id
                                        ? data?.payment_transaction_id
                                        : "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-[18px] font-semibold py-[15px]">
                        Personal Details
                    </div>
                    <hr />
                    <div className="flex flex-col gap-4 py-[20px]">
                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <div className="text-[#999999]">Name</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.full_name
                                        ? data?.participant_id?.contact_id
                                              ?.full_name
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Date of Birth
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.date_of_birth
                                        ? formatDateString(
                                              new Date(
                                                  data?.participant_id?.contact_id?.date_of_birth
                                              )
                                          )
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">Address</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.street_address
                                        ? data?.participant_id?.contact_id
                                              ?.street_address
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">Country</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.country_id?.name
                                        ? data?.participant_id?.contact_id
                                              ?.country_id?.name
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    Zip/Postal Code
                                </div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.postal_code
                                        ? data?.participant_id?.contact_id
                                              ?.postal_code
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">State</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.state_id
                                        ?.name
                                        ? data?.participant_id?.contact_id
                                              ?.state_id?.name
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">City</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.city_id
                                        ?.name
                                        ? data?.participant_id?.contact_id
                                              ?.city_id?.name
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">Mobile</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.mobile
                                        ? data?.participant_id?.contact_id
                                              ?.mobile
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <div className="text-[#999999]">Email ID</div>
                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id?.email
                                        ? data?.participant_id?.contact_id
                                              ?.email
                                        : "-"}
                                </div>
                            </div>

                            <div className="w-[225px]">
                                <div className="text-[#999999]">
                                    {data?.participant_id?.contact_id
                                        ?.identification_type_id?.name
                                        ? data?.participant_id?.contact_id
                                              ?.identification_type_id?.name
                                        : "-"}
                                </div>

                                <div className="font-semibold text-[#666666]">
                                    {data?.participant_id?.contact_id
                                        ?.identification_num
                                        ? data?.participant_id?.contact_id
                                              ?.identification_num
                                        : "-"}
                                </div>
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
