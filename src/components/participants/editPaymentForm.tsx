import CalenderIcon from "@public/assets/CalenderIcon";
import SimpleCross from "@public/assets/SimpleCross";
import { format } from "date-fns";
import { DateRangePickerComponent } from "pages/Courses/FindCourse";
import { useState } from "react";
import { useController } from "react-hook-form";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import CustomSelect from "src/ui/custom-select";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Textarea } from "src/ui/textarea";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";

export default function EditPaymentForm() {
    const [open, setOpen] = useState(false);
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
        defaultValue: {
            from: "Mon May 20 2024 00:00:00 GMT-0400 (Eastern Daylight Time)",
            to: "Thu May 23 2024 00:00:00 GMT-0400 (Eastern Daylight Time)",
        },
    });
    const {
        field: { value: payment, onChange: paymentMethodOnchange },
    } = useController({
        name: "paymentMethod",
    });
    const {
        field: { value: errorMessage, onChange: errorMessageOnchange },
    } = useController({
        name: "errorMessage",
    });
    const {
        field: { value: emailConfirmation, onChange: emailConfirmatiOnchange },
    } = useController({
        name: "emailConfirmation",
    });
    let transactionStatus =
        getOptionValuesByOptionLabel("TRANSACTION_STATUS")?.[0]?.option_values;
    console.log(transactionStatus, "transactionStatus1");
    transactionStatus = transactionStatus?.map(
        (val: { id: any; value: string }) => {
            return {
                value: val?.id,
                label: val?.value,
            };
        }
    );
    //     {
    //         label: "Confirmed",
    //         value: "confirmed",
    //     },
    //     {
    //         label: "Pending",
    //         value: "pending",
    //     },
    //     {
    //         label: "Failed",
    //         value: "failed",
    //     },
    //     {
    //         label: "Not Recieved",
    //         value: "not recieved",
    //     },
    // ];
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
    const x = "xyz";
    return (
        <div>
            <div>
                <div className="flex justify-end ">
                    <div>
                        <SimpleCross />
                    </div>
                </div>
                <div className="flex justify-center text-[24px] font-semibold ">
                    Edit Payment
                </div>
                <div className="flex flex-row">
                    <div className="flex-1">
                        <div className="py-[5px]">
                            <div className="py-[5px]">Participant Name</div>
                            <div>
                                <Textarea
                                    // TODO: replace it with api data
                                    value={x}
                                    placeholder=""
                                    // TODO: height adjustment
                                    className="!w-[278px] resize-none !important !h-[40px]"
                                />
                            </div>
                        </div>
                        <div className="w-[278px] py-[5px]">
                            <div className="py-[5px]">Transaction Status</div>
                            <div>
                                <CustomSelect
                                    data={transactionStatus}
                                    onBottomReached={() => { }}
                                    onChange={transactionOnchange}
                                    placeholder={""}
                                    value={transaction} 
                                    onSearch={()=>{}}                                />
                            </div>
                        </div>
                        <div className="py-[5px]">
                            <div className="py-[5px]">Transaction ID</div>
                            <div>
                                <Textarea
                                    value={'121wqqw2123d'}
                                    className="!w-[278px] resize-none !important h-[40px]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="py-[5px]" >
                            <div className="py-[5px]">Payment Date</div>
                            <div>
                                <Dialog open={open}>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => setOpen(true)}
                                            className="w-[278px] h-[40px] flex flex-row items-center"
                                            variant="outline"
                                            
                                        >
                                            <div className="flex gap-8">
                                                <div className="">
                                                    {paymentDate?.from ? (
                                                        paymentDate?.to ? (
                                                            <>
                                                                {format(
                                                                    paymentDate.from,
                                                                    "MM/dd/yyyy"
                                                                )}{" "}
                                                                -{" "}
                                                                {format(
                                                                    paymentDate.to,
                                                                    "MM/dd/yyyy"
                                                                )}
                                                            </>
                                                        ) : (
                                                            format(
                                                                paymentDate.from,
                                                                "MM/dd/yyyy"
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="flex gap-2 font-normal">
                                                            Select the Date
                                                            Range
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="">
                                                    <CalenderIcon color="#666666" />
                                                </div>
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="!w-[810px] !h-[446px] bg-[#FFFFFF] !rounded-3xl">
                                        <DateRangePickerComponent
                                            setOpen={setOpen}
                                            value={paymentDate}
                                            onSelect={paymentDateOnchange}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="py-[5px]">
                            <div className="py-[5px]">Payment Method</div>
                            <div className="!w-[278px]">
                                <CustomSelect
                                    data={paymentMethod}
                                    onSearch={()=>{}}
                                    onBottomReached={() => {}}
                                    onChange={paymentMethodOnchange}
                                    value={payment}
                                />x
                            </div>
                        </div>
                        <div className="py-[5px]">
                            <div className="py-[5px]">Response Message</div>
                            <div>
                                <Textarea
                                    value={'Response Message'}
                                    className="!w-[278px] resize-none !important h-[40px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col py-[5px]">
                    <div className="py-[5px]">Error Message</div>
                    <div>
                        <Textarea
                            value={errorMessage}
                            onChange={(value) => {
                                errorMessageOnchange(value);
                            }}
                            placeholder=""
                            className=" resize-none !important !h-[40px] !w-[578px]"
                        />
                    </div>
                    <div className="flex gap-4 py-[30px]">
                        <div>
                            <Checkbox checked={emailConfirmation} onCheckedChange={emailConfirmatiOnchange}/>
                        </div>
                        <div>Send Payment confirmation mail?</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
