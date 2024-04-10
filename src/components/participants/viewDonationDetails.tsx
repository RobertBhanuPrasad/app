import SimpleCross from "@public/assets/SimpleCross";
import { Button } from "src/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";

export default function ViewDonationDetails({data}) {
    return (
        <div>
            viewDonationDetails
            <Popover>
                <PopoverTrigger>
                    <Button>View Dontaion Details</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[993px]">
                    <div>
                        <div className="flex justify-end">
                            <div>
                                <SimpleCross />
                            </div>
                        </div>
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
                                            -
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Amount
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* MYR 183.34 */}
                                            {data?.data?.data[0]?.currency_code} {data?.data?.data[0]?.total_amount}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Donation Type
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            One time
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Donation Date
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* write a function for created date */}
                                            2022-03-24 05:41:50
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pr-[20px]">
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Payment Method
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* credit/Debit Card Stripe */}
                                            {data?.data?.data[0]?.payment_method_id?.value}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Transaction Type
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* Sale */}
                                            {data?.data?.data[0]?.transaction_type_id?.value}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Transaction Status
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* Confirmed */}
                                            {data?.data?.data[0]?.transaction_status_id?.value}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Transaction ID
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                        {data?.data?.data[0]?.payment_transaction_id}
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
                                        <div className="text-[#999999]">
                                            Name
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* Test user 12 */}
                                            {data?.data?.data[0]?.participant_id?.contact_id?.full_name}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Date of Birth
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* created dob */}
                                            2020-01-17
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Address
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            st43534 city343, BC 45654756 Canda
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Country
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* Canada */}
                                              {data?.data?.data[0]?.participant_id?.contact_id?.country_id?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pr-[20px]">
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Zip/Postal Code
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* 45654756 */}
                                            {data?.data?.data[0]?.participant_id?.contact_id?.postal_code}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            State
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* British Columbia */}
                                            {data?.data?.data[0]?.participant_id?.contact_id?.state_id?.name}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            City
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* City343 */}
                                            {data?.data?.data[0]?.participant_id?.contact_id?.city_id?.name}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Mobile
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* 2343466546 */}
                                            {data?.data?.data[0]?.participant_id?.contact_id?.mobile}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pr-[20px]">
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Email ID
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            {/* test.user12@yopmail.com */}                                            
                                            {data?.data?.data[0]?.participant_id?.contact_id?.email}
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            PAN Card Number
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            456768
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button>Close</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
