import CalenderIcon from "@public/assets/CalenderIcon";
import Cross from "@public/assets/Cross";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { useController } from "react-hook-form";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import CustomSelect from "src/ui/custom-select";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Textarea } from "src/ui/textarea";

export default function EditPaymentForm() {
    const [open, setOpen] = useState(false);
    const {
        field: { value: participantName, onChange: participantNameOnchange },
    } = useController({
        name: "participantName",
    });
    const {
        field: { value: transaction, onChange: transactionOnchange },
    } = useController({
        name: "transaction",
    });
    const {
        field: { value: transactionID, onChange: transactionIDOnchange },
    } = useController({
        name: "transactionID",
    });
    const {
        field: { value: paymentDate, onChange: paymentDateOnchange },
    } = useController({
        name: "paymentDate",
    });
    const {
        field: { value: payment, onChange: paymentMethodOnchange },
    } = useController({
        name: "paymentMethod",
    });
    const {
        field: { value: responseMessage, onChange: responseMessageOnchange },
    } = useController({
        name: "responseMessage",
    });
    const {
        field: { value: errorMessage, onChange: errorMessageOnchange },
    } = useController({
        name: "errorMessage",
    });
    // TODO: todo for payment confirmation checkbox
    //   const {
    //     field: { value:transactionID, onChange:transactionIDOnchange },
    //   } = useController({
    //     name: "transactionID",
    //   });
    const transactionStatus = [
        {
            label: "Confirmed",
            value: "confirmed",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Failed",
            value: "failed",
        },
        {
            label: "Not Recieved",
            value: "not recieved",
        },
    ];
    const paymentMethod = [
        {
            label: "Cash",
            value: "cash",
        },
        {
            label: "Check",
            value: "check",
        },
        {
            label: "Pay Later Label123",
            value: "pay later",
        },
        {
            label: "Credit Card(Offline)",
            value: "credit card",
        },
    ];

    return (
        <div>
            <div>
                <div className="flex justify-end ">
                    <div>
                        <Cross />
                    </div>
                </div>
                <div className="flex justify-center text-[24px] font-semibold ">
                    Edit Payment
                </div>
                <div className="flex flex-row">
                    <div className="flex-1">
                        <div>
                            <div>Participant Name</div>
                            <div>
                                <Textarea
                                    value={participantName}
                                    onChange={(value) => {
                                        participantNameOnchange(value);
                                    }}
                                    placeholder=""
                                    // TODO: height adjustment
                                    className="!w-[278px] resize-none !important !h-[40px]"
                                />
                            </div>
                        </div>
                        <div>
                            <div>Transaction Status</div>
                            <div>
                                <CustomSelect
                                    data={transactionStatus}
                                    onSearch={(value) => {
                                        transactionOnchange(value);
                                    }}
                                    onBottomReached={() => {}}
                                    onChange={() => {}}
                                    placeholder={""}
                                    value={transaction}
                                />
                            </div>
                        </div>
                        <div>
                            <div>Transaction ID</div>
                            <div>
                                <Textarea
                                    value={transactionID}
                                    onChange={(value) => {
                                        transactionIDOnchange(value);
                                    }}
                                    placeholder=""
                                    className="!w-[278px] resize-none !important h-[40px]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div>
                            <div>Payment Date</div>
                            <div>
                                <Dialog open={open}>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => setOpen(true)}
                                            className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
                                            variant="outline"
                                        >
                                            <div>
                                                <CalenderIcon />
                                            </div>
                                            <div></div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
                                        <DateRangePickerComponent
                                            setOpen={setOpen}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <div>Payment Method</div>
                            <div>
                                <CustomSelect
                                    data={paymentMethod}
                                    onSearch={(value) => {
                                        paymentMethodOnchange(value);
                                    }}
                                    onBottomReached={() => {}}
                                    onChange={() => {}}
                                    placeholder={""}
                                    value={payment}
                                />
                            </div>
                        </div>
                        <div>
                            <div>Response Message</div>
                            <div>
                                <Textarea
                                    value={responseMessage}
                                    onChange={(value) => {
                                        responseMessageOnchange(value);
                                    }}
                                    placeholder=""
                                    className="!w-[278px] resize-none !important h-[40px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>Error Message</div>
                    <div>
                        <Textarea
                            value={errorMessage}
                            onChange={(value) => {
                                errorMessageOnchange(value);
                            }}
                            placeholder=""
                            className="!w-[278px] resize-none !important h-[40px]"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <Checkbox />
                        </div>
                        <div>Send Payment confirmation mail?</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
const DateRangePickerComponent = ({ setOpen }: any) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(2024, 3, 20),
    });

    return (
        <div className="relative">
            <DateRangePicker
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                captionLayout="dropdown-buttons"
                fromYear={2000}
                toYear={2025}
            />
            <div className="flex flex-row gap-4 justify-center items-center fixed p-2 rounded-b-3xl bottom-0 left-0 w-full shadow-[rgba(0,_0,_0,_0.24)_0px_2px_8px]">
                <Button
                    onClick={() =>
                        setDate({
                            from: new Date(),
                            to: new Date(2024, 3, 20),
                        })
                    }
                    className="border rounded-xl border-[#7677F4] bg-[white] w-[94px] h-10 text-[#7677F4] font-semibold"
                >
                    Reset
                </Button>
                <Button
                    onClick={() => setOpen(false)}
                    className=" w-[94px] h-10 rounded-xl"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
};
