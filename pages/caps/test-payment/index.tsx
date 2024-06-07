
import { CapsEnvironment, CountryCode, CurrencyCode, GatewayAddress, GatewayCustomer, GatewayStyle, PaymentGateways, PaymentGatewaysConfig, countryCodes, currencyCodes } from "caps-ui"

import { CapsFormFields } from "@components/CapsFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "src/ui/button"
import { Form } from "src/ui/form"
import { z } from "zod"
import useGetCountryCode from "src/utility/useGetCountryCode"
import useGetLanguageCode from "src/utility/useGetLanguageCode"


// Form Validation Schema
const formValidationSchema = z.object({
    name: z.string().min(1, { message: "First name is required" }),
    surname: z.string().min(1, { message: "Last name is required" }),
    phone: z.string(),
    email: z.string(),
    line1: z.string(),
    line2: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().refine(v => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
    pgCountry: z.string().refine(v => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
    pincode: z.string(),
    org: z.string(),
    metaData: z.string().optional(),
    module: z.string(),
    amount: z.string(),
    currency: z.string().refine(v => currencyCodes.includes(v as CurrencyCode), { message: "Please enter a correct country code" }),
    test: z.boolean()
})


const TestPayment = () => {
    const [pConfig, setPConfig] = useState<PaymentGatewaysConfig>()
    
    const countryCode = useGetCountryCode()
    const languageCode = useGetLanguageCode()

    const CAPS_BASE_URL = process.env.NEXT_PUBLIC_RETURN_URL

    const ReturnURL = `${CAPS_BASE_URL}/${countryCode}-${languageCode}/caps/thankyou-page`

    useEffect(() => document.getElementById("testing123")?.click(), [])
    const form = useForm<FormType>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "Rohit",
            surname: "Nandwani",
            phone: "+919537935955",
            email: "rohit@gmail.com",
            line1: "201, Sonia Apartment",
            line2: "Bhatar Road",
            city: "Surat",
            state: "Gujarat",
            country: "US",
            pgCountry: "CA",
            pincode: "395001",
            org: "1",
            metaData: undefined, // or null depending on how you handle optional values
            module: "RX",
            amount: "1000",
            currency: "eur",
            test: true
        },
        mode: "onChange",
    })

    const parseInputToObject = (inputString: string) => {
        const keyValuePairs = inputString.split(';').map(pair => pair.trim());
        const result: Record<string, string> = {};

        keyValuePairs.forEach(pair => {
            const [key, value] = pair.split(':').map(item => item.replace(/"/g, '').trim());
            result[key] = value;
        });

        return result;
    };
    const handleSubmit = (data: FormType) => {
        const customerAddress: GatewayAddress = {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode
        }

        const customerDetails: GatewayCustomer = {
            name: data.name,
            surname: data.surname,
            phone: data.phone,
            email: data.email,
            address: customerAddress
        }

        const style: GatewayStyle = {
            theme: 'dark',
            size: 'XL',
            shadow: [0, -1, 0, 3],
            corners: 'rounded'
        }

        const pConfig: PaymentGatewaysConfig = {
            country: data.pgCountry as CountryCode,
            org: parseInt(data.org),
            module: data.module,
            test: data.test,
            amount: parseInt(data.amount),
            currency: data.currency as CurrencyCode,
            description: "Donation for CAPS Testing",
            customerInfo: customerDetails,
            metadata: data.metaData ? parseInputToObject(data.metaData) : null,
            appearance: style,
            returnUrl: ReturnURL!,
            environment: process.env.NEXT_PUBLIC_CAPS_ENVIRONMENT! as CapsEnvironment
        };

        setPConfig(pConfig)

    }


    return (
        <div className="flex flex-col justify-center sm:flex-row gap-5 p-5">
            <div className="w-[400px] flex flex-col items-center justify-center border-b sm:border-r pb-10 sm:px-10">
                {/* User Details Filling Side */}
                <p className="text-lg text-[#454545] font-semibold text-center pb-3">User Page</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} method="onchange">
                        <CapsFormFields form={form} />
                        <Button id="testing123">Submit</Button>
                    </form>
                </Form>
            </div>

            {/* Payment gateways after submitting the data */}
            <div className="w-[350px]">
                <p className="font-semibold text-lg pb-3">Available Payment Gateways</p>
                {pConfig && (
                    < PaymentGateways config={pConfig} />
                )}
            </div>
        </div>
    )
}
// TestPayment.noLayout = true;
TestPayment.requireAuth = true;

export default TestPayment
// Form Interface
export type FormType = z.infer<typeof formValidationSchema>;

