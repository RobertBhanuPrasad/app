import Form from "@components/Formfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/ui/button";
import { supabaseClient } from "src/utility";
import { z } from "zod";
import { Dialog, DialogProps } from "../add-payment";

const EditPaymentGateway = () => {
    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const router = useRouter();

    const supabase = supabaseClient('caps')

    const [showForm, setShowForm] = useState(true);

    const [isLoading, setIsLoading] = useState(false)

    const [data, setData] = useState<any>({});

    const [fileContent, setFileContent] = useState<string>();

    const [fileName, setFileName] = useState('');

    const [dialogConfig, setDialogConfig] = useState<DialogProps>({ buttonMessage: "", message: "", onClick: () => { }, title: "" })

    useEffect(() => {
        const id = getId();
        const getData = async () => {
            try {
                const { data: dataArray, error } = await supabase
                    .from('decrypted_payment_gateways')
                    .select('*')
                    .eq('id', id);

                if (error) {
                    throw error;
                }

                setData(dataArray[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, []);

    denullify(data)

    useEffect(() => {
        // After data is updated, set form values based on data
        if (data) {
            reset(data);
            if (!data?.transaction_intent) {
                setValue('transaction_intent', 'sale');
            } else {
                setValue('transaction_intent', 'refund');
            }
            if (data?.test) {
                setValue('test', 'yes');
            } else {
                setValue('test', 'no');
            }
            if (data?.type === 'corvuspay') {
                const cor = breakSignature(data);
                setFileName('API CERTIFICATE');
                if (cor) {
                    setFileContent(cor[1]);
                    setValue('signature', cor[1]);
                    setValue('passphrase', cor[0]);
                }
            }

        }
    }, [data, reset, setValue]); // Run this useEffect whenever data changes


    const selectedType = watch("type");

    const handleDownload = () => {
        if (!fileContent) return;
        try {
            var binaryString = window.atob(fileContent);  // Decode the base64-encoded string into a binary string

            var binaryLen = binaryString.length;  // Get the length of the binary string

            var bytes = new Uint8Array(binaryLen); // Create a Uint8Array to hold the binary data

            for (var i = 0; i < binaryLen; i++) {
                var ascii = binaryString.charCodeAt(i);  // Get the ASCII value of the character at position i
                bytes[i] = ascii;  // Assign the ASCII value to the corresponding position in the Uint8Array
            }

            const blob = new Blob([bytes], { type: 'application/x-pkcs12' }); // Create a Blob object from the file content

            const url = URL.createObjectURL(blob); // Create a download URL for the Blob

            const link = document.createElement('a'); // Trigger a download by creating a link element

            link.href = url;

            link.download = fileName; // Set the file name

            document.body.appendChild(link);

            link.click();

            URL.revokeObjectURL(url); // Clean up by revoking the download URL
            document.body.removeChild(link);
        } catch (err) {
            console.log(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValue(name as keyof FormValues, value); // Directly set the value using react-hook-form

    };

    const passwordVisibility = (secrets: string) => {

        var x: any = document.getElementById(secrets)!;
        if (x.type === 'password')
            x.type = 'text';
        else
            x.type = 'password';
    }


    const updateData = async (formData: FormValues) => {
        try {
            setIsLoading(true)
            if (data.name != formData.name || data.description != formData.description || data.transaction_intent != (formData.transaction_intent === 'sale' ? false : true) || data.test != (formData.test === 'yes' ? true : false)) {
                const { error } = await supabase.from('payment_gateways').update({
                    name: formData.name,
                    transaction_intent: formData.transaction_intent === 'sale' ? false : true,
                    test: formData.test === 'yes' ? true : false,
                    description: formData.description
                }).eq('id', getId());

                if (error) {
                    setShowForm(false);
                    setIsLoading(false)
                    setDialogConfig({
                        title: "Oops!",
                        message: <>
                            <p className="py-2 text-[14px] font-medium"> Something went wrong while updating this Gateway.</p>
                            <p className="text-[#FF6D6D] text-[14px] font-medium py-2">{error.message}</p>
                            <p className="py-2 text-[14px] font-medium">Please try again after some time</p>
                        </>,
                        onClick: () => { setShowForm(true); },
                        buttonMessage: "Ok",
                    });
                    return;
                }
            }

            // Update credentials
            if (data.username != formData.username || data.username_label != formData.username_label) {
                if (formData.username !== '') {
                    await updateCreds('username', formData.username, formData.username_label, false);
                };
            }
            if (formData.password !== '') {
                if (data.password != formData.password || data.password_label != formData.password_label) {
                    await updateCreds('password', formData.password, formData.password_label, formData.password === '' ? true : false);
                }
                if (data.signature != getSignature(formData) || data.signature_label != formData.signature_label) {
                    await updateCreds('signature', getSignature(formData), formData.signature_label, formData.signature === '' ? true : false);
                }
            } else {
                if (data.signature != getSignature(formData) || data.signature_label != formData.signature_label) {
                    await updateCreds('signature', getSignature(formData), formData.signature_label, formData.signature === '' ? true : false);
                }
                if (data.password != formData.password || data.password_label != formData.password_label) {
                    await updateCreds('password', formData.password, formData.password_label, formData.password === '' ? true : false);
                }
            }
            if (data.webhook_secret != formData.webhook_secret) {
                await updateCreds('webhook_secret', formData.webhook_secret, formData.webhook_secret, formData.webhook_secret === '' ? true : false);
            }
            setIsLoading(false)
            setShowForm(false)
            setDialogConfig({
                title: "Gateway update Successful",
                message: <>
                    <p className="py-2 text-[14px] font-medium">The gateway has successfully been updated.</p>
                    <p className="py-2 text-[14px] font-medium"> To check the same, please visit the Payment Gateways Dashboard Page.</p>
                </>,
                onClick: () => { router.push('/caps/payment-dashboard') },
                buttonMessage: "Go to Dashboard"
            });


        } catch (error: any) {
            setIsLoading(false)
            setShowForm(false)
            setDialogConfig({
                title: "Error",
                message: <>
                    <p className="py-2 text-[14px] font-medium"> Something went wrong while updating this Gateway.</p>
                    <p className="text-[#FF6D6D] text-[14px] font-medium py-2">{error.message}</p>
                    <p className="py-2 text-[14px] font-medium">Please try again after some time</p>
                </>,
                onClick: () => { setShowForm(true); },
                buttonMessage: "Ok",
            });
        }
    }

    const updateCreds = async (name: string, value: string | null, label: string | "", bool: boolean) => {
        const { data, error } = await supabase
            .rpc('update_gateway_creds', {
                _id: getId(),
                _entry: name,
                _secret: value,
                _secret_label: label,
                unset: bool,
            });

        if (error) {
            const message = JSON.stringify(error);
            const { match } = checkSuccess(message);
            if (!match) {
                throw new Error(`Couldn't update the data: ${message}`);
            }
        } else {
            const message = JSON.stringify(data);
            const { match } = checkSuccess(message);
            if (!match) {
                throw new Error(`Couldn't update the data: ${message}`);
            }
        }
    };

    return (
        <div>
            {showForm && (
                <Form onSubmit={handleSubmit(updateData)} defaultValues={{}}>
                    <div className="bg-white">
                        <div className="max-w-fit mx-auto font-semibold text-2xl">Edit Payment Gateway</div>
                        <div className="flex flex-wrap gap-x-16 gap-y-4 mt-6 w-[80%] mx-auto">
                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="name">Name</label>
                                <input id="name" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Stripe Germany" {...register("name", { onChange: handleInputChange })} />
                                {errors.name && <small id="nameError" className="text-[#FF6D6D] text-[14px]">{errors.name.message}</small>}
                            </div>


                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="type">Type</label>
                                <input id="type" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" disabled={true} placeholder="stripe" {...register("type", { onChange: handleInputChange })} />
                            </div>

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="username">Username</label>
                                <input id="username" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="pk_xxx" {...register("username", { onChange: handleInputChange })} />
                                {errors.username && <small id="usernameError" className="text-[#FF6D6D] text-[14px]">{errors.username.message}</small>}
                                <div className="mt-2 flex items-center gap-1 text-[14px]">
                                    <input className="w-4 h-4 " type="checkbox" value="" onClick={() => { passwordVisibility('username') }} id="flexCheckDefault" />
                                    <label htmlFor="flexCheckDefault">
                                        Show Username
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="username_label">Username Label</label>
                                <input id="username_label" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" disabled={true} placeholder="Publishable Key" {...register("username_label")} />
                                {errors.username_label && <small id="usernameLabelError" className="text-[#FF6D6D] text-[14px]">{errors.username_label.message}</small>}
                            </div>

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="password">Password</label>
                                <input id="password" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="sk_xxx" {...register("password", { onChange: handleInputChange })} />
                                {errors.password && <small id="passwordError" className="text-[#FF6D6D] text-[14px]">{errors.password.message}</small>}
                                <div className="mt-2 flex items-center gap-1 text-[14px]">
                                    <input className="w-4 h-4" type="checkbox" value="" onClick={() => { passwordVisibility('password') }} id="flexCheckDefault1" />
                                    <label htmlFor="flexCheckDefault1">
                                        Show Password
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="password_label">Password Label</label>
                                <input id="password_label" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" disabled={!data.password} placeholder="Secret Key" {...register("password_label")} />
                                {errors.password_label && <small id="passwordLabelError" className="text-[#FF6D6D] text-[14px]">{errors.password_label.message}</small>}
                            </div>

                            {selectedType === 'corvuspay' &&
                                <div className="flex flex-col w-[360px]">
                                    <label className="font-medium" htmlFor="apiCertificate">API Certificate (.p12 format)</label>
                                    <input id="apiCertificate" className="mt-2" type="file" accept="application/x-pkcs12" onChange={(e) => { encodeCertificate(e, setValue) }} />
                                    <Button type='button' style={{ marginTop: '10px' }} onClick={handleDownload} className="max-w-fit">Download File</Button>
                                </div>
                            }

                            {selectedType === 'corvuspay' &&
                                <div className="flex flex-col w-[360px]" >
                                    <label className="font-medium" htmlFor="apiPassphrase">Passphrase for Certificate</label>
                                    <input id="apiPassphrase" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="passphrase for the encrypted certificate (if present)" {...register("passphrase", { onChange: handleInputChange })} />
                                </div>
                            }

                            {selectedType !== 'corvuspay' &&
                                <div className="flex flex-col w-[360px]">
                                    <label className="font-medium" htmlFor="signature">Signature</label>
                                    <input id="signature" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="CA95-05e74kkk" {...register("signature", { onChange: handleInputChange })} />
                                    {errors.signature && <small id="signatureError" className="text-[#FF6D6D] text-[14px]">{errors.signature.message}</small>}
                                    <div className="mt-2 flex items-center gap-1 text-[14px]">
                                        <input className="w-4 h-4" type="checkbox" value="" onClick={() => { passwordVisibility('signature') }} id="flexCheckDefault2" />
                                        <label htmlFor="flexCheckDefault2">
                                            Show Signature
                                        </label>
                                    </div>
                                </div>
                            }

                            {selectedType !== 'corvuspay' &&
                                <div className="flex flex-col w-[360px]">
                                    <label className="font-medium" htmlFor="signature_label">Signature Label</label>
                                    <input id="signature_label" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" disabled={!data.signature} placeholder="Custom Signature" {...register("signature_label", { onChange: handleInputChange })} />
                                    {errors.signature_label && <small id="signatureLabelError" className="text-[#FF6D6D] text-[14px]">{errors.signature_label.message}</small>}
                                </div>
                            }

                            {selectedType !== 'corvuspay' &&
                                <div className="flex flex-col w-[360px]">
                                    <label className="font-medium" htmlFor="webhook_secret">Webhook Secret</label>
                                    <input id="webhook_secret" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="wh_sec_xxx" {...register("webhook_secret", { onChange: handleInputChange })} />
                                    {errors.webhook_secret && <small id="webhookSecretError" className="text-[#FF6D6D] text-[14px]">{errors.webhook_secret.message}</small>}
                                    <div className="mt-2 flex items-center gap-1 text-[14px]">
                                        <input className="w-4 h-4" type="checkbox" value="" onClick={() => { passwordVisibility('webhook_secret') }} id="flexCheckDefault3" />
                                        <label htmlFor="flexCheckDefault3">
                                            Show webhook_secret
                                        </label>
                                    </div>
                                </div>
                            }

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="transaction_intent">Purpose</label>
                                <select className="border border-black px-2 h-[42px] rounded-[10px] mt-2" id="transaction_intent" {...register("transaction_intent")} defaultValue={"unchosen"}>
                                    <option value="unchosen" disabled>--- choose the purpose of this gateway ---</option>
                                    <option value="sale">Sale</option>
                                    <option value="refund">Refund</option>
                                </select>
                                {errors.transaction_intent && <small id="purposeError" className="text-[#FF6D6D] text-[14px]">{errors.transaction_intent.message}</small>}
                            </div>

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium" htmlFor="description">Description</label>
                                <input id="description" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Payment Gateway for Stripe Germany - (Account Owner : Akash)" {...register("description", { onChange: handleInputChange })} />
                                {errors.description && <small id="descriptionError" className="text-[#FF6D6D] text-[14px]">{errors.description.message}</small>}
                            </div>

                            <div className="flex flex-col w-[360px]">
                                <label className="font-medium">Is this test gateway ?</label>
                                <div className="flex flex-row mt-2 gap-4">
                                    <div className="flex flex-row gap-2 items-center">
                                        <input className="cursor-pointer w-4 h-4" type="radio" id="testYes" value="yes" {...register("test", { onChange: handleInputChange })} />
                                        <label className="font-medium" htmlFor="testYes">Yes</label>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <input className="cursor-pointer w-4 h-4" type="radio" id="testNo" value="no" {...register("test", { onChange: handleInputChange })} />
                                        <label className="font-medium" htmlFor="testNo">No</label>
                                    </div>
                                </div>
                                {errors.test && (<small id="isTestGatewayError" className="text-[#FF6D6D] text-[14px]">{errors.test.message}</small>)}
                            </div>
                        </div>
                        <div className="flex items-center text-base justify-center mt-8">
                            {isLoading && (
                                <div className="fixed inset-0 bg-[white]/50 opacity-100 flex items-center justify-center z-50">
                                    <div className="loader"></div>
                                </div>
                            )}
                            <Button type="submit" className="w-[240px] h-[42px] ">Submit</Button>
                        </div>
                    </div>
                </Form>

            )}
            {!showForm && <Dialog {...dialogConfig} />}
        </div>
    )
}

export default EditPaymentGateway



const pgTypes = ["stripe", "corvuspay", "paypal"] as const;
type PGType = typeof pgTypes[number];

const schema = z.object({
    name: z.string().min(1, { message: "Please enter the name of the Payment Gateway" }),
    type: z.string().refine((t): t is PGType => pgTypes.includes(t as PGType), { message: "Please choose Payment Gateway Type" }),
    username: z.string().min(1, { message: "Please enter the username" }),
    username_label: z.string().min(1, { message: "Please enter username label" }),
    password: z.string(),
    password_label: z.string(),
    signature: z.string(),
    signature_label: z.string(),
    webhook_secret: z.string(),
    passphrase: z.string().optional(),
    transaction_intent: z.string().refine((val) => val === "sale" || val === "refund", { message: "Please choose transaction intent : 'Sale' or 'Refund'" }),
    description: z.string().min(1, { message: "Description is mandatory." }),
    test: z.string({ invalid_type_error: "Please choose if these credentials are for 'test' or 'live' gateway" })
});

const getId = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id;
}

type FormValues = z.infer<typeof schema>;

const nullify = (x: string) => (x === "") ? null : x;

const denullify = (dataObj: FormValues) => {
    Object.keys(dataObj).forEach((key) => {
        const k = key as keyof FormValues;
        if (dataObj[k] === null) {
            if (k !== 'type') {
                dataObj[k] = '' as any;
            }
        }
    })
};

const getSignature = (data: FormValues) => {
    if (data.type === "corvuspay") {
        const signature = `${data.passphrase},${data.signature}`
        return signature === "," ? null : signature;
    }
    return nullify(data.signature);
}

const breakSignature = (data: FormValues) => {
    if (!data?.signature)
        return 'no signature was found';
    if (data?.signature.includes(',')) {
        const [passphrase, apiCertificate] = data.signature.split(',');
        return [passphrase, apiCertificate];
    }
    else return ['', data.signature];
}


function encodeCertificate(e: React.ChangeEvent<HTMLInputElement>, setValue: any) {
    const file = e.target.files?.[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const encodedString = (e.target!.result as string).substring(33);
            setValue("signature", encodedString);
            setValue("signature_label", "API Certificate");
        }
        reader.readAsDataURL(file);
    };
}

function checkSuccess(message: string) {
    const regex = /unset successfully\.|updated successfully\./;
    // Attempt to match the message with the regex pattern
    const trimmedMessage = message.trim();
    const match = trimmedMessage.match(regex);

    // If a match is found, return match: true
    if (match) {
        return { match: true as const };
    }

    // If no match is found, return match: false
    return { match: false as const };
}






