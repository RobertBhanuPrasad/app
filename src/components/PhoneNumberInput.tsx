import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { FormControl, FormField, FormItem } from "src/ui/form";
import { Input } from "src/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "src/ui/select";
import { useMaskedPhoneNumber } from "src/utility/PhoneNumberCodes";
import useGetCountryCode from "src/utility/useGetCountryCode";
import "/node_modules/flag-icons/css/flag-icons.min.css";

/** Phone NumberInput to provide the select dropdown contains country code, a phone number input */
interface PhoneNumberInputProps {
    value?: string;
    onChange?: (value: unknown) => void;
}
interface SelectCountryDate {
    code?: string;
    name?: string;
    callingCode?: string;
}
export const PhoneNumberInput = ({
    value,
    onChange,
}: PhoneNumberInputProps) => {
    const { t } = useTranslation("common");
    const formState = useFormState();
    const { countries } = useMaskedPhoneNumber({
        enforceInternational: false,
    });
    const errorMessage: any = formState?.errors?.["phoneNumber"];
    const form = useFormContext();
    const initialCountryCode = useGetCountryCode();
    const selectClasses =
        "bg-[#EBEBEB] rounded-l-[10px] rounded-r-none justify-center border-none";

    const [selectedCountryData, setSelectedCountryData] = useState<
        SelectCountryDate | undefined
    >(
        countries?.find(
            (country: any) => country.code === initialCountryCode.toUpperCase()
        )
    );
    const [phoneNumber, setPhoneNumber] = useState<string>(value || "");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const initialCountryData = countries?.find(
            (country: any) => country.code === initialCountryCode.toUpperCase()
        );
        setSelectedCountryData(initialCountryData);
        setLoading(false);
    }, [initialCountryCode, countries]);
    return (
        <div className="flex flex-col">
            <div
                className={`flex ${
                    errorMessage
                        ? "border rounded-[10px] !border-[#FF0000]"
                        : "border-none"
                }`}
            >
                <FormField
                    control={form.control}
                    name={"countryCode"}
                    render={({ field }) => {
                        const handleCountryChange = (value: unknown) => {
                            field.onChange(value);
                            const countryData = countries?.find(
                                (country: any) => country.code === value
                            );
                            setSelectedCountryData(countryData);
                        };
                        return (
                            <FormItem className="">
                                <FormControl>
                                    {loading == false &&
                                        selectedCountryData && (
                                            <Select
                                                {...field}
                                                onValueChange={
                                                    handleCountryChange
                                                }
                                            >
                                                <SelectTrigger
                                                    className={selectClasses}
                                                >
                                                    <SelectValue>
                                                        <div className="flex items-center gap-1">
                                                            <>
                                                                <span
                                                                    className={`fi fi-${
                                                                        selectedCountryData
                                                                            ? selectedCountryData?.code?.toLowerCase()
                                                                            : initialCountryCode.toUpperCase()
                                                                    } w-[26px] h-[19px] mt-[3px]`}
                                                                />
                                                                +
                                                                {
                                                                    selectedCountryData?.callingCode
                                                                }
                                                            </>
                                                        </div>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent
                                                    position="popper"
                                                    className=""
                                                >
                                                    {countries?.map(
                                                        (
                                                            country: any,
                                                            index: number
                                                        ) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={
                                                                    country?.code
                                                                }
                                                            >
                                                                <div className="flex flex-row gap-2">
                                                                    <span
                                                                        className={`fi fi-${country.code.toLowerCase()}`}
                                                                    />
                                                                    {
                                                                        country.name
                                                                    }{" "}
                                                                    +
                                                                    {
                                                                        country.callingCode
                                                                    }
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                </FormControl>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name={"phoneNumber"}
                    render={({ field }) => {
                        return (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        placeholder={"Mobile Number"}
                                        className="!rounded-l-none"
                                        {...field}
                                        value={phoneNumber}
                                        onChange={(event) => {
                                            setPhoneNumber(event.target.value);
                                            if (onChange) {
                                                onChange(event.target.value);
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        );
                    }}
                />
            </div>

            {/* Error message */}
            {errorMessage?.message && (
                <div className="px-[16px] pt-[3px] mb-[-9px]">
                    <p className="text-[12px] font-normal h-[14px] text-destructive">
                        {errorMessage?.message}
                    </p>
                </div>
            )}
        </div>
    );
};
