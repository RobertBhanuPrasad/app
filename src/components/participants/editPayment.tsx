import CalenderIcon from "@public/assets/CalenderIcon";
import Cross from "@public/assets/Cross";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "src/ui/DateRangePicker";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import CustomSelect from "src/ui/custom-select";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { Textarea } from "src/ui/textarea";

export default function EditPayment() {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <Button>EditPayment</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[637px]">
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
                                            value={""}
                                            onChange={() => {}}
                                            placeholder=""
                                            className="!w-[278px] resize-none !important h-[40px]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>Transaction Status</div>
                                    <div>
                                        <CustomSelect
                                            data={undefined}
                                            onSearch={() => {}}
                                            onBottomReached={() => {}}
                                            onChange={() => {}}
                                            placeholder={""}
                                            value={undefined}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>Transaction ID</div>
                                    <div>
                                        <Textarea
                                            value={""}
                                            onChange={() => {}}
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
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
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
                                            data={undefined}
                                            onSearch={() => {}}
                                            onBottomReached={() => {}}
                                            onChange={() => {}}
                                            placeholder={""}
                                            value={undefined}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>Response Message</div>
                                    <div>
                                        <Textarea
                                            value={""}
                                            onChange={() => {}}
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
                                    value={""}
                                    onChange={() => {}}
                                    placeholder=""
                                    className="!w-[278px] resize-none !important h-[40px]"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div><Checkbox/></div>
                                <div>Send Payment confirmation mail?</div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
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
