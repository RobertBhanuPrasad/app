import { useList, useOne } from "@refinedev/core";
import { useTranslation } from "next-i18next";
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
    const {t}= useTranslation(['common','course.participants','new_strings'])
    const { query } = useRouter();
    const Id: number | undefined = query?.participantId
        ? parseInt(query.participantId as string)
        : undefined;

    // participant_payment_history contains numerous records of same participant, getting the latest history record
    const { data: donationData } = useList({
        resource: "participant_payment_history",
        meta: {
            select: "participant_id(organisation_id(name),donation_type(value),donation_date,transaction_type(value)),total_amount,currency_code,payment_method_id(name),transaction_status_id(name),payment_transaction_id",
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
                {t('course.participants:edit_participant.participants_information_tab.view_donation_details')}
                </Text>
                <div className="flex flex-col ">
                    <Text className="text-[18px] font-semibold py-[15px]">
                    {t('course.participants:edit_participant.participants_information_tab.donation_details')}
                    </Text>
                    <hr />
                    <div className="flex flex-col gap-4 py-[20px]">
                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                {t('new_strings:orgainization')}
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.participant_id
                                        ?.organisation_id?.name
                                        ? donationData?.data[0]?.participant_id
                                              ?.organisation_id?.name
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                {t('course.participants:edit_participant.participants_information_tab.amount')}
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
                                {t('course.participants:edit_participant.participants_information_tab.donation_type')}
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.participant_id
                                        ?.donation_type?.value
                                        ? donationData?.data[0]?.participant_id
                                              ?.donation_type?.value
                                        : "-"}
                                </Text>
                            </div>

                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                {t('course.participants:edit_participant.participants_information_tab.donation_date')}
                                </Text>
                                <Text className="font-semibold text-[#666666] text-[16px]">
                                    {donationData?.data[0]?.participant_id
                                        ?.donation_date
                                        ? formatDateString(
                                              new Date(
                                                  donationData?.data[0]?.participant_id?.donation_date
                                              )
                                          )
                                        : "-"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                {t('course.participants:edit_participant.participants_information_tab.payment_method')}
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
                                {t('course.participants:find_participant.transaction_type')}
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
                                {t('course.participants:find_participant.transaction_status')}
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
                                {t('course.participants:view_participant.transaction_id')}
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
                    {t('course.participants:edit_participant.participants_information_tab.personal_details')}
                    </Text>
                    <hr />
                    <div className="flex flex-col gap-4 py-[20px]">
                        <div className="flex pr-[20px]">
                            <div className="w-[225px]">
                                <Text className="text-[#999999] text-[14px]">
                                {t('course.participants:edit_participant.participants_information_tab.name')}
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
                                {t('course.participants:edit_participant.participants_information_tab.date_of_birth')}
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
                                {t('course.participants:edit_participant.participants_information_tab.address')}
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
                                {t('course.participants:edit_participant.participants_information_tab.country')}
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
                                {t('course.participants:edit_participant.participants_information_tab.zip/postal_code')}
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
                                {t('course.participants:edit_participant.participants_information_tab.state')}
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
                                {t('city')}
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
                                {t('course.participants:edit_participant.participants_information_tab.mobile')}
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
                                {t('course.participants:edit_participant.participants_information_tab.email_id')}
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
                    {t('close')}
                    </Button>
                </div>
            </div>
        </div>
    );
}