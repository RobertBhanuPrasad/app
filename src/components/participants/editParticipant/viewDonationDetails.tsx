import { useList, useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import { translatedText } from "src/common/translations";
import { Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";

interface ViewDonationDetailsProps {
    setViewDonation: React.Dispatch<React.SetStateAction<any>>;
}
export default function ViewDonationDetails({
    setViewDonation,
}: ViewDonationDetailsProps) {
    const { query } = useRouter();
    const Id: number | undefined = query?.participantId
        ? parseInt(query.participantId as string)
        : undefined;

    // participant_payment_history contains numerous records of same participant, getting the latest history record
    const { data: donationData } = useList({
        resource: "participant_payment_history",
        meta: {
            select: "participant_id(organisation_id(name),donation_type(value),donation_date,transaction_type(value)),total_amount,currency_code,payment_method_id(name),transaction_status_id(name),payment_transaction_id,program_id(organization_id(name)),created_at",
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
    
    // Getting participant contact detials for that particular participantId from router
    const { data: contactData } = useOne({
        resource: "participant_registration",
        id: Number(Id),
        meta: {
            select: "contact_id(id,full_name,email,mobile,identification_num,identification_type_id,date_of_birth,street_address,state_id!inner(name),city_id!inner(name),country_id!inner(name),postal_code)",
        },
    });
    
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
                                    {donationData?.data[0]?.program_id?.organization_id?.name ? donationData?.data[0]?.program_id?.organization_id?.name : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Amount
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.currency_code &&
                                        donationData?.data[0]
                                            ?.currency_code}{" "}
                                    {donationData?.data[0]?.total_amount
                                        ? donationData?.data[0]?.total_amount
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Donation Type
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    One Time
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Donation Date
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.created_at ? formatDateString(new Date((donationData?.data[0]?.created_at))) : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Payment Method
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.payment_method_id
                                        ?.name
                                        ? translatedText(donationData?.data[0]
                                              ?.payment_method_id?.name)
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction Type
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.participant_id
                                        ?.transaction_type?.value
                                        ? donationData?.data[0]?.participant_id
                                              ?.transaction_type?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction Status
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]
                                        ?.transaction_status_id?.name
                                        ? translatedText(donationData?.data[0]
                                              ?.transaction_status_id?.name)
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Transaction ID
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]
                                        ?.payment_transaction_id
                                        ? donationData?.data[0]
                                              ?.payment_transaction_id
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
                                    {contactData?.data?.contact_id?.full_name
                                        ? contactData?.data?.contact_id
                                              ?.full_name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Date of Birth
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id
                                        ?.date_of_birth
                                        ? formatDateString(
                                              new Date(
                                                  contactData?.data?.contact_id?.date_of_birth
                                              )
                                          )
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Address
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id
                                        ?.street_address
                                        ? contactData?.data?.contact_id
                                              ?.street_address
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Country
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id?.country_id
                                        ?.name
                                        ? contactData?.data?.contact_id
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
                                    {contactData?.data?.contact_id?.postal_code
                                        ? contactData?.data?.contact_id
                                              ?.postal_code
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    State
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id?.state_id
                                        ?.name
                                        ? contactData?.data?.contact_id
                                              ?.state_id?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    City
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id?.city_id
                                        ?.name
                                        ? contactData?.data?.contact_id?.city_id
                                              ?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                    Mobile
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id?.mobile
                                        ? contactData?.data?.contact_id?.mobile
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
                                    {contactData?.data?.contact_id?.email
                                        ? contactData?.data?.contact_id?.email
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[16px]">
                                    {contactData?.data?.contact_id
                                        ?.identification_type_id?.value ??
                                        contactData?.data?.contact_id
                                            ?.identification_type_id?.value}
                                </Text>

                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {contactData?.data?.contact_id
                                        ?.identification_num
                                        ? contactData?.data?.contact_id
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