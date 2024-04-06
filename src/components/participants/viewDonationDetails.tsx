import Cross from "@public/assets/Cross";
import { Button } from "src/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";

export default function ViewDonationDetails() {
    return (
        <div>
            viewDonationDetails
            <Popover>
                <PopoverTrigger>
                    <Button>View Dontaion Details</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[993px]">
                    <div>
                        <div className="flex justify-end ">
                            <div>
                                <Cross />
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
                                            MYR 183.34
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
                                            credit/Debit Card Stripe
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Transaction Type
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            Sale
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Transaction Status
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            Confirmed
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Transaction ID
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            txn_3KgnAF4IFJJDbBN11mV1fVI
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
                                            Test user 12
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Date of Birth
                                        </div>
                                        <div className="font-semibold text-[#666666]">
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
                                            Canada
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pr-[20px]">
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Zip/Postal Code
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            45654756
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            State
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            British Columbia
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            City
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            City343
                                        </div>
                                    </div>
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Mobile
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            2343466546
                                        </div>
                                    </div>
                                </div>
                                <div className="flex pr-[20px]">
                                    <div className="w-[225px]">
                                        <div className="text-[#999999]">
                                            Email ID
                                        </div>
                                        <div className="font-semibold text-[#666666]">
                                            test.user12@yopmail.com
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
