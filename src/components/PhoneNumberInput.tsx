// import { FormInput } from "@/components/form/FormInput"
// import { personalInformationFieldNames } from "@/components/form/RegistrationPageFormNames"
// import { FormControl, FormField, FormItem } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useMaskedPhoneNumber } from "@/hooks/phoneNumberCodes"
import { useTranslation } from "next-i18next"
import { useFormContext, useFormState } from "react-hook-form"
import { FormControl, FormField, FormItem } from "src/ui/form"
import { Input } from "src/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/ui/select"
import { useMaskedPhoneNumber } from "src/utility/PhoneNumberCodes"
import "/node_modules/flag-icons/css/flag-icons.min.css"

/**Phone NumberInput to provide the select dropdown contains country code, a phone number input */
export const PhoneNumberInput = () => {
  const { t } = useTranslation("common")
  const formState = useFormState()
  const { countries } = useMaskedPhoneNumber({
    enforceInternational: false,
  })

  const errorMessage: any = formState?.errors?.[
    "phoneNumber"
    // personalInformationFieldNames.phoneNumber
]

  const form = useFormContext()
console.log(form,"form here is")
  const selectClasses =
    "bg-[#EBEBEB] rounded-l-[10px] rounded-r-none justify-center border-none"

  return (
    <div className="flex flex-col">
      <div className={`flex ${errorMessage ? "border rounded-[10px] !border-[#FF0000] " : "border-none"}`}>
        <FormField
          control={form.control}
          name={
            "country code"
            // personalInformationFieldNames.countryCode
        }
          render={({ field }) => {
            const selectedCountryData = countries?.find((country: any) => country.code === field.value)

            return (
              <FormItem className=" ">
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger className={selectClasses} 
                    // IconClassName="size-[22px]"
                    >
                      <SelectValue>
                        <div className="flex items-center gap-1">
                          <span
                            className={`fi fi-${selectedCountryData?.code?.toLowerCase()} w-[26px] h-[19px] mt-[3px]`}
                          />
                          +{selectedCountryData?.callingCode}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" className="">
                      {countries?.map((country: any, index: number) => (
                        <SelectItem key={index} value={country?.code}>
                          <div className="flex flex-row gap-2">
                            <span className={`fi fi-${country.code.toLowerCase()} `} />
                            {country.name} +{country.callingCode}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name={"phone"
            // personalInformationFieldNames.phoneNumber
        }
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormControl>
                <Input placeholder={"Mobile Number"}
                    className="!rounded-l-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )
          }}
        />
      </div>

      {/* Error message */}
      {errorMessage?.message && (
        <div className="px-[16px] pt-[3px] mb-[-9px]">
          <p className="text-[12px] font-normal h-[14px] text-destructive">{errorMessage?.message}</p>
        </div>
      )}
    </div>
  )
}