import Form from "@components/Formfield";
import CalenderIcon from "@public/assets/CalenderIcon";
import { useSelect } from "@refinedev/core";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import { useController } from "react-hook-form";
import { addParticipant } from "src/constants/AddParticipantFormNames";
import { cn } from "src/lib/utils";
import { Button } from "src/ui/button";
import { Calendar } from "src/ui/calendar";
import { Input } from "src/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import { Select, SelectContent, SelectItem, SelectItems, SelectTrigger, SelectValue } from "src/ui/select";

const AddParticipant = () => {
    const onSubmit = (data: any) => {
        console.log("submited data is", data);
    };
    return (
        <Form onSubmit={onSubmit} defaultValues={undefined} schema={undefined}>
            {/* form fields Section */}
            <div className="grid grid-cols-3">
                <ContactDropDown />
                <RegistrationDateInput />
                <FeeLevelDropDown />
                <CourseFeeInput />
                <AttendanceStatusDropDown />
                <FeePerPersonInput />
                <AccommodationDropDown />
                <DoYouSnoreRadioSelect />
                <HavingRoomMateWhoSnoresRadioSelect />
            </div>
            {/* Note Section */}
            <div>
                <p>
                    <span className="font-semibold">Note:</span> An email notification will be sent to the participant
                    with the following actions required:
                </p>
                <p>
                    1. Participant will need to consent to the{" "}
                    <span className="text-[#7677F4]">Program Participant Agreement (PPA).</span>
                </p>
                <p>2. Participant will need to consent to the Health declaration (displayed below).</p>
                <p>
                    3. If there is a pending payment, they will need to bring it along with the registration
                    confirmation at the start of the program.
                </p>
            </div>
            {/* Health Declaration Section */}
            <div className="mt-6">
                <p className="text-lg font-semibold">Health Declaration</p>
                <p>
                    I confirm that I am in good health, and I will inform the course organizer of any limiting health
                    conditions before the course begins. I further acknowledge that, if I am diagnosed with
                    schizophrenia; schizoaffective, bipolar, or seizure disorders; pregnancy; and/or am a new mother or
                    recent surgical patient, certain portions of this course may be unsuitable for me and I will consult
                    with my medical provider before registering (medical information form for medical provider). I
                    further acknowledge that if my medical provider has diagnosed me with Complex PTSD, an alternate
                    version of this course may be more suitable for me.
                </p>
            </div>

            {/* Button Section */}
            <div className="flex gap-4 mt-6">
                <Button className="bg-white border border-primary text-primary">Cancel</Button>
                <Button>Save</Button>
            </div>
        </Form>
    );
};

export default AddParticipant;

const ContactDropDown = () => {
    const [pageSize, setPagesize] = useState(10);
    const { options, queryResult, onSearch } = useSelect({
        resource: "options",
        optionLabel: "full_name",
        optionValue: "id",
        onSearch: (value) => [
            {
                field: "full_name",
                operator: "contains",
                value,
            },
        ],
        pagination: {
            mode: "server",
            pageSize: pageSize,
        },
    });

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name: addParticipant?.contact,
    });

    return (
        <div className="h-20 w-80">
            <div className="flex flex-col gap-1">
                <div className="text-xs font-normal text-[#333333]">
                    Contact <span className="text-[#7677F4]">*</span>
                </div>
                <Select
                    value={value}
                    onValueChange={(val: any) => {
                        console.log("value is", val);
                        onChange(val);
                    }}
                >
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Select Contact" />
                    </SelectTrigger>
                    <SelectContent>
                        <Input
                            onChange={(value: ChangeEvent<HTMLInputElement>) => {
                                onSearch(value.target.value);
                            }}
                        />
                        <SelectItems
                            onBottomReached={() => {
                                if (queryResult?.data?.total && queryResult?.data?.total > pageSize) {
                                    setPagesize((pageSize) => pageSize + 10);
                                }
                            }}
                        >
                            {options.map((option: any, index: number) => (
                                <>
                                    <SelectItem key={option.value} value={option.value} className="h-[44px]">
                                        {option.label}
                                    </SelectItem>
                                    {index < options?.length - 1 && <hr className="border-[#D6D7D8]" />}
                                </>
                            ))}
                        </SelectItems>
                    </SelectContent>
                </Select>

                {error && <span className="text-[#FF6D6D] text-[12px]">Select Contact Name.</span>}
            </div>
        </div>
    );
};
const FeeLevelDropDown = () => {
    const [pageSize, setPagesize] = useState(10);
    const { options, queryResult, onSearch } = useSelect({
        resource: "contact",
        optionLabel: "full_name",
        optionValue: "id",
        onSearch: (value) => [
            {
                field: "full_name",
                operator: "contains",
                value,
            },
        ],
        pagination: {
            mode: "server",
            pageSize: pageSize,
        },
    });

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name: addParticipant?.contact,
    });

    return (
        <div className="h-20 w-80">
            <div className="flex flex-col gap-1">
                <div className="text-xs font-normal text-[#333333] ">
                    Fee Level <span className="text-[#7677F4]">*</span>
                </div>
                <Select
                    value={value}
                    onValueChange={(val: any) => {
                        console.log("value is", val);
                        onChange(val);
                    }}
                >
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Select fee level" />
                    </SelectTrigger>
                    <SelectContent>
                        <Input
                            onChange={(value: ChangeEvent<HTMLInputElement>) => {
                                onSearch(value.target.value);
                            }}
                        />
                        <SelectItems
                            onBottomReached={() => {
                                if (queryResult?.data?.total && queryResult?.data?.total > pageSize) {
                                    setPagesize((pageSize) => pageSize + 10);
                                }
                            }}
                        >
                            {options.map((option: any, index: number) => (
                                <>
                                    <SelectItem key={option.value} value={option.value} className="h-[44px]">
                                        {option.label}
                                    </SelectItem>
                                    {index < options?.length - 1 && <hr className="border-[#D6D7D8]" />}
                                </>
                            ))}
                        </SelectItems>
                    </SelectContent>
                </Select>

                {error && <span className="text-[#FF6D6D] text-[12px]">Select Contact Name.</span>}
            </div>
        </div>
    );
};
const AttendanceStatusDropDown = () => {
    const [pageSize, setPagesize] = useState(10);
    const { options, queryResult, onSearch } = useSelect({
        resource: "contact",
        optionLabel: "full_name",
        optionValue: "id",
        onSearch: (value) => [
            {
                field: "full_name",
                operator: "contains",
                value,
            },
        ],
        pagination: {
            mode: "server",
            pageSize: pageSize,
        },
    });

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name: addParticipant?.contact,
    });

    return (
        <div className="h-20 w-80">
            <div className="flex flex-col gap-1">
                <div className="text-xs font-normal text-[#333333] ">
                    Attendance Status <span className="text-[#7677F4]">*</span>
                </div>
                <Select
                    value={value}
                    onValueChange={(val: any) => {
                        console.log("value is", val);
                        onChange(val);
                    }}
                >
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Select Attendance Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <Input
                            onChange={(value: ChangeEvent<HTMLInputElement>) => {
                                onSearch(value.target.value);
                            }}
                        />
                        <SelectItems
                            onBottomReached={() => {
                                if (queryResult?.data?.total && queryResult?.data?.total > pageSize) {
                                    setPagesize((pageSize) => pageSize + 10);
                                }
                            }}
                        >
                            {options.map((option: any, index: number) => (
                                <>
                                    <SelectItem key={option.value} value={option.value} className="h-[44px]">
                                        {option.label}
                                    </SelectItem>
                                    {index < options?.length - 1 && <hr className="border-[#D6D7D8]" />}
                                </>
                            ))}
                        </SelectItems>
                    </SelectContent>
                </Select>

                {error && <span className="text-[#FF6D6D] text-[12px]">Select Contact Name.</span>}
            </div>
        </div>
    );
};
const AccommodationDropDown = () => {
    const [pageSize, setPagesize] = useState(10);
    const { options, queryResult, onSearch } = useSelect({
        resource: "contact",
        optionLabel: "full_name",
        optionValue: "id",
        onSearch: (value) => [
            {
                field: "full_name",
                operator: "contains",
                value,
            },
        ],
        pagination: {
            mode: "server",
            pageSize: pageSize,
        },
    });

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name: addParticipant?.contact,
    });

    return (
        <div className="h-20 w-80">
            <div className="flex flex-col gap-1">
                <div className="text-xs font-normal text-[#333333] ">
                    Accommodation Type <span className="text-[#7677F4]">*</span>
                </div>
                <Select
                    value={value}
                    onValueChange={(val: any) => {
                        console.log("value is", val);
                        onChange(val);
                    }}
                >
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Select Accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                        <Input
                            onChange={(value: ChangeEvent<HTMLInputElement>) => {
                                onSearch(value.target.value);
                            }}
                        />
                        <SelectItems
                            onBottomReached={() => {
                                if (queryResult?.data?.total && queryResult?.data?.total > pageSize) {
                                    setPagesize((pageSize) => pageSize + 10);
                                }
                            }}
                        >
                            {options.map((option: any, index: number) => (
                                <>
                                    <SelectItem key={option.value} value={option.value} className="h-[44px]">
                                        {option.label}
                                    </SelectItem>
                                    {index < options?.length - 1 && <hr className="border-[#D6D7D8]" />}
                                </>
                            ))}
                        </SelectItems>
                    </SelectContent>
                </Select>

                {error && <span className="text-[#FF6D6D] text-[12px]">Select Contact Name.</span>}
            </div>
        </div>
    );
};

const RegistrationDateInput = () => {
    const {
        field: { value, onChange },
    } = useController({
        name: addParticipant?.registrationDate,
    });
    return (
        <div className="w-80">
            <div className="text-xs font-normal text-[#333333] py-1">
                Registration Date <span className="text-[#7677F4]">*</span>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-80 justify-between text-left font-normal rounded-xl",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {value ? format(value, "PPP") : <span>Select Date</span>}
                        <CalenderIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        initialFocus
                        className="w-80"
                        classNames={{
                            month: "w-full",
                            head_row: "flex justify-evenly w-full mt-2",
                            row: "flex justify-evenly w-full",
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export const CourseFeeInput = () => {
    const {
        field: { value, onChange },
    } = useController({
        name: addParticipant?.courseFee,
    });
    return (
        <div className="w-80">
            <div className="text-xs font-normal text-[#333333] py-1">
                Course Fee <span className="text-[#7677F4]">*</span>
            </div>
            <Input className="rounded-xl" value={value} onChange={onChange} />
        </div>
    );
};
export const FeePerPersonInput = () => {
    const {
        field: { value, onChange },
    } = useController({
        name: addParticipant?.feePerPersonInput,
    });
    return (
        <div className="w-80">
            <div className="text-xs font-normal text-[#333333] py-1">
                Fee per person <span className="text-[#7677F4]">*</span>
            </div>
            <Input className="rounded-xl" value={value} onChange={onChange} />
        </div>
    );
};

const DoYouSnoreRadioSelect = () => {
    const {
        field: { value, onChange },
    } = useController({
        name: addParticipant?.doYouSnore,
    });
    return (
        <div className="w-80">
            <div className="text-xs font-normal text-[#333333] py-1">
                Do you snore? <span className="text-[#7677F4]">*</span>
            </div>
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="flex flex-row gap-6 ">
                    <RadioButtonCard
                        value="true"
                        selectedRadioValue={value}
                        label="Yes"
                        className="w-[112px] !h-[40px] rounded-[12px]"
                    />
                    <RadioButtonCard
                        value="false"
                        selectedRadioValue={value}
                        label="No"
                        className="w-[112px] !h-[40px] rounded-[12px]"
                    />
                </div>
            </RadioGroup>
        </div>
    );
};
const HavingRoomMateWhoSnoresRadioSelect = () => {
    const {
        field: { value, onChange },
    } = useController({
        name: addParticipant?.havingRoomMateWhoSnores,
    });
    return (
        <div className="w-80">
            <div className="text-xs font-normal text-[#333333] py-1">
                Would you object to having room mate who snores? <span className="text-[#7677F4]">*</span>
            </div>
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="flex flex-row gap-6 ">
                    <RadioButtonCard
                        value="true"
                        selectedRadioValue={value}
                        label="Yes"
                        className="w-[112px] !h-[40px] rounded-[12px]"
                    />
                    <RadioButtonCard
                        value="false"
                        selectedRadioValue={value}
                        label="No"
                        className="w-[112px] !h-[40px] rounded-[12px]"
                    />
                </div>
            </RadioGroup>
        </div>
    );
};
const SendPaymentLinkToParticipantRadioSelect = () => {
    const {
        field: { value, onChange },
    } = useController({
        name: addParticipant?.sendPaymentLinkToParticipant,
    });
    return (
        <div className="w-80">
            <div className="text-xs font-normal text-[#333333] py-1">
                Send payment link to participant <span className="text-[#7677F4]">*</span>
            </div>
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="flex flex-row gap-6 ">
                    <RadioButtonCard
                        value="true"
                        selectedRadioValue={value}
                        label="Yes"
                        className="w-[112px] !h-[40px] rounded-[12px]"
                    />
                    <RadioButtonCard
                        value="false"
                        selectedRadioValue={value}
                        label="No"
                        className="w-[112px] !h-[40px] rounded-[12px]"
                    />
                </div>
            </RadioGroup>
        </div>
    );
};
