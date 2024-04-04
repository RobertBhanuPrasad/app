import Form from "@components/Formfield";
import { useSelect } from "@refinedev/core";
import { useController } from "react-hook-form";
import { addParticipant } from "src/constants/AddParticipantFormNames";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";

const AddParticipant = () => {
    const onSubmit = (data: any) => {
        console.log("submited data is", data);
    };
    return (
        <div>
            <Form onSubmit={onSubmit} defaultValues={undefined} schema={undefined}>
                <ContactDropDown />
                <RegistrationDateInput />
            </Form>
        </div>
    );
};

export default AddParticipant;

const ContactDropDown = () => {
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
            pageSize: 10,
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
                <div className="text-xs font-normal text-[#333333]">Contact *</div>c
                <CustomSelect
                    error={error}
                    value={value}
                    placeholder="Select Organization"
                    data={options}
                    onBottomReached={() => {}}
                    onSearch={(val: string) => {
                        onSearch(val);
                    }}
                    onChange={(val) => {
                        onChange(val);
                    }}
                />
                {error && <span className="text-[#FF6D6D] text-[12px]">Select Organizer Name.</span>}
            </div>
        </div>
    );
};

const RegistrationDateInput = () => {
    return (
        <div>
            <div className="text-xs font-normal text-[#333333]">Registration Date *</div>
            <Input />
        </div>
    );
};
