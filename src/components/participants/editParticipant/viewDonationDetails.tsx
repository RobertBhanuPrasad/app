import { useList } from "@refinedev/core";
import { useRouter } from "next/router";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";

interface ViewDonationDetailsProps {
    setViewDonation: React.Dispatch<React.SetStateAction<any>>;
}
export default function ViewDonationDetails({ setViewDonation }:ViewDonationDetailsProps) {
    const { getValues } = useFormContext();
    const formData = getValues();
    const { query } = useRouter();
    const {
        field: { value: organisation_id },
    } = useController({ name: "organisation_id" });
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
                                    {organisation_id ? organisation_id : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Amount
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.currency_code && formData?.currency_code}{" "}
                                    {formData?.total_amount
                                        ? formData?.total_amount
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Donation Type
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.donation_type ? formData?.donation_type : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Donation Date
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.donation_date
                                        ? formatDateString(
                                              new Date(formData?.donation_date)
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
                                    {formData?.payment_method
                                        ?formData?.payment_method
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction Type
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.transaction_type
                                        ? formData?.transaction_type
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction Status
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.transaction_status_value
                                        ? formData.transaction_status_value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction ID
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.payment_transaction_id
                                        ? formData?.payment_transaction_id
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
                                    {formData?.date_of_birth
                                        ? formatDateString(
                                              new Date(formData?.date_of_birth)
                                          )
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Address
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.street_address ? formData?.street_address : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Country
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                {formData?.country
                                        ? formData?.country
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
                                    {formData?.postal_code ? formData?.postal_code : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    State
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.state
                                        ? formData?.state
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    City
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                {formData?.city
                                        ? formData?.city
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Mobile
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.mobile ? formData?.mobile
                                     : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Email ID
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {formData?.email ? formData?.email : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[16px]">
                                    {
                                        formData?.identification_type_id??formData?.identification_type_id
                                    }
                                </Text>

                                <Text className="font-semibold text-[#666666] text-[16px]">
                                {
                                        formData?.identification_num?formData?.identification_num:'-'
                                    }
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
