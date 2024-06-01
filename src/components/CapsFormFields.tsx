import { FormType } from "pages/caps/test-payment"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "src/ui/form"
import { Input } from "src/ui/input"
import { Switch } from "src/ui/switch"

export const CapsFormFields = ({ form }: { form: UseFormReturn<FormType> }) => {
    return (
        <div className="flex flex-col items-start">

            <p className="text-lg text-[#454545] font-semibold text-center">Entity Details</p>

            {/* Is it Test Mode or Not */}
            <FormField
                control={form.control}
                name="test"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center mt-2 py-3">
                        <FormLabel className="!w-28">Is it Test Mode</FormLabel>
                        <FormControl>
                            <Switch className="w-[56px]"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            {/* Country */}
            <FormField
                control={form.control}
                name="pgCountry"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>PG Country</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter PG Country For e.g., CA, IN, US" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Organization */}
            <FormField
                control={form.control}
                name="org"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Organization (For eg. 1, 2, 3)" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Module */}
            <FormField
                control={form.control}
                name="module"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Module</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Module (For eg. RX, CX, BX)" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Amount */}
            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter Amount" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Currency code */}
            <FormField
                control={form.control}
                name="currency"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Currency For e.g., inr, cad, usd" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Meta data */}
            <FormField
                control={form.control}
                name="metaData"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Meta Data</FormLabel>
                            <FormControl>
                                <Input placeholder='"Enter Meta Data For e.g., "Hi":"Hello"' {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            <p className="text-lg text-[#454545] font-semibold text-center mt-2 py-2">User Details</p>


            {/* Name */}
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Name" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Surname */}
            <FormField
                control={form.control}
                name="surname"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Surname" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Phone  */}
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Phone Number" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Email */}
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Email" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Line 1 */}
            <FormField
                control={form.control}
                name="line1"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Line 1</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Line 1" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Line 2 */}
            <FormField
                control={form.control}
                name="line2"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Line 2</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Line 2" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* City */}
            <FormField
                control={form.control}
                name="city"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter City" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* state */}
            <FormField
                control={form.control}
                name="state"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter State" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* country */}
            <FormField
                control={form.control}
                name="country"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Country For e.g., CA, IN, US" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />

            {/* Pin code */}
            <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Pin code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Pin code" {...field} />
                            </FormControl>
                        </FormItem>
                    )
                }}
            />
        </div>
    )
}