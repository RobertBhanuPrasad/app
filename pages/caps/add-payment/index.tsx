import Form from "@components/Formfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "src/ui/alert-dialog";
import { Button } from "src/ui/button";
import { supabaseClient } from "src/utility";
import { z } from "zod";

const AddPayment = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const selectedType = watch("type");

  const supabase = supabaseClient("caps")

  const [dialogConfig, setDialogConfig] = useState<DialogProps>({ buttonMessage: "", message: "", onClick: () => { }, title: "" })
  const [showForm, setShowForm] = useState(true);

  const router = useRouter();

  const CAPS_BASE_URL: string = process.env.NEXT_PUBLIC_CAPS_BASE_URL as string;


  useEffect(() => {
    const resetIrrelevantFields = () => {
      // Define the list of fields to reset for each type
      const fieldsToReset: Record<PGType, string[]> = {
        stripe: ["signature", "signatureLabel", "passphrase"],
        paypal: ["signature", "signatureLabel", "passphrase"],
        corvuspay: ["signature", "passphrase", "signatureLabel"]
      };

      // Reset the values of irrelevant fields when type changes
      const fields = fieldsToReset[selectedType as PGType] || [];
      fields.forEach(field => setValue(field as keyof FormValues, "")); // Use keyof FormValues to specify field type
    };

    resetIrrelevantFields();
  }, [selectedType]);

  const postData = async (data: FormValues) => {
    setShowForm(false);
    const { data: response, error } = await supabase
      .rpc('create_gateway', {
        _name: data.name,
        _type: data.type,
        _username: data.username,
        _username_label: data.usernameLabel,
        _password: nullify(data.password),
        _password_label: nullify(data.passwordLabel),
        _signature: getSignature(data),
        _signature_label: nullify(data.signatureLabel),
        _webhook_secret: nullify(data.webhookSecret),
        _transaction_intent: data.purpose === "sale" ? false : true,
        _description: data.description,
        _test: data.isTestGateway === "yes" ? true : false,
        // remove later unnecessary
        _site_url: null,
        _recurring_url: null,
      });
    const message = JSON.stringify(response);
    const { match, id } = checkSuccess(message);
    if (error || !match) {
      console.error('Error:', error);
      setDialogConfig({
        title: "Oops!",
        message: <>
          Something went wrong while adding this Gateway.
          <br />
          <span className="text-red-400">{message}</span>
          <br />
          Please try again after some time
        </>,
        onClick: () => { setShowForm(true) },
        buttonMessage: "Ok",
      })
    } else {
      console.log('Success:', response);
      setDialogConfig({
        title: "Gateway Addition Successful",
        message: <>
          The gateway has successfully been added.
          <br />
          Please configure the following webhook in your payment gateway: <p><a href="#" className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{`${CAPS_BASE_URL}/webhooks/${id}`}</a></p>
          <br />
          To check the same, please visit the Payment Gateways Dashboard Page.
        </>,
        onClick: () => { router.push('/caps/payment-dashboard') },
        buttonMessage: "Go to Dashboard"
      })

    }
  };

  return (
    <div>
      {showForm &&
        <Form onSubmit={handleSubmit(postData)} defaultValues={{}}>
          <div className="bg-white  ">
            <div className="max-w-fit mx-auto font-semibold text-2xl">Add Payment Gateway</div>
            <div className="flex flex-wrap gap-x-16 gap-y-4 mt-6 w-[80%] mx-auto ">
              <div className=" flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="name">Name</label>
                <input id="name" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Stripe Germany"{...register("name")} />
                {errors.name && <p id="nameError" className="text-[#FF6D6D] text-[14px]">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="type">Type</label>
                <select className="border border-black px-2 h-[42px] rounded-[10px] mt-2" id="type" {...register("type", {
                })} defaultValue={"unchosen"} >
                  <option value="unchosen" disabled>--- choose gateway type ---</option>
                  {pgTypes.map(t => <option value={t}>{t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()}</option>)}
                </select>
                {errors.type && (
                  <p id="typeError" className="text-[#FF6D6D] text-[14px]">
                    {errors.type.message}
                  </p>
                )}
                <p id="typeDisclaimer" className="text-[14px]">"Stripe" and "Corvuspay" implemented till now</p>
              </div>
              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="username">Username</label>
                <input id="username" className="border-black px-2 h-[42px] rounded-[10px] mt-2 border" type="password" placeholder="pk_xxx" {...register("username")} />
                {errors.username && <p id="usernameError" className="text-[#FF6D6D] text-[14px]">{errors.username.message}</p>}
              </div>
              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="usernameLabel">Username Label</label>
                <input id="usernameLabel" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Publishable Key" {...register("usernameLabel")} />
                {errors.usernameLabel && <p id="usernameLabelError" className="text-[#FF6D6D] text-[14px]">{errors.usernameLabel.message}</p>}
              </div>

              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="password">Password</label>
                <input id="password" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="sk_xxx" {...register("password")} />
                {errors.password && <p id="passwordError" className="text-[#FF6D6D] text-[14px]">{errors.password.message}</p>}
              </div>
              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="passwordLabel">Password Label</label>
                <input id="passwordLabel" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Secret Key" {...register("passwordLabel")} />
                {errors.passwordLabel && <p id="passwordLabelError" className="text-[#FF6D6D] text-[14px]">{errors.passwordLabel.message}</p>}
              </div>
              {selectedType == 'corvuspay' &&
                <div className="flex flex-col w-[360px]">
                  <label className="font-medium" htmlFor="apiCertificate">API Certificate (.p12 format)</label>
                  <input id="apiCertificate" className="mt-2" type="file" accept="application/x-pkcs12" onChange={(e) => encodeCertificate(e, setValue)} />
                </div>
              }
              {selectedType == 'corvuspay' &&
                <div className="flex flex-col w-[360px]" hidden={selectedType !== 'corvuspay'}>
                  <label className="font-medium" htmlFor="apiPassphrase">Passphrase for Certificate</label>
                  <input id="apiPassphrase" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="passphrase for the encrypted certificate (if present)" {...register("passphrase")} />
                </div>
              }
              {selectedType !== "corvuspay" &&
                <div className="flex flex-col w-[360px]" >
                  <label className="font-medium" htmlFor="signature">Signature</label>
                  <input id="signature" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="CA95-05e74kkk" {...register("signature")} />
                  {errors.signature && <p id="signatureError" className="text-[#FF6D6D] text-[14px]">{errors.signature.message}</p>}
                </div>
              }
              {selectedType !== "corvuspay" &&
                <div className="flex flex-col w-[360px]" >
                  <label className="font-medium" htmlFor="signatureLabel">Signature Label</label>
                  <input id="signatureLabel" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Custom Signature" {...register("signatureLabel")} />
                  {errors.signatureLabel && <p id="signatureLabelError" className="text-[#FF6D6D] text-[14px]">{errors.signatureLabel.message}</p>}
                </div>
              }
              {selectedType !== 'corvuspay' &&
                <div className="flex flex-col w-[360px]">
                  <label className="font-medium" htmlFor="webhookSecret">Webhook Secret</label>
                  <input id="webhookSecret" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="password" placeholder="wh_sec_xxx" {...register("webhookSecret")} />
                  {errors.webhookSecret && <p id="webhookSecretError" className="text-[#FF6D6D] text-[14px]">{errors.webhookSecret.message}</p>}
                </div>
              }

              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="purpose">Purpose</label>
                <select className="border border-black px-2 h-[42px] rounded-[10px] mt-2" id="purpose" {...register("purpose")} defaultValue={"unchosen"}>
                  <option value="unchosen" disabled>--- choose the purpose of this gateway ---</option>
                  <option value="sale">Sale</option>
                  <option value="refund">Refund</option>
                </select>
                {errors.purpose && <p id="purposeError" className="text-[#FF6D6D] text-[14px]">{errors.purpose.message}</p>}
              </div>
              <div className="flex flex-col w-[360px]">
                <label className="font-medium" htmlFor="description">Description</label>
                <input id="description" className="border border-black px-2 h-[42px] rounded-[10px] mt-2" type="text" placeholder="Payment Gateway for Stripe Germany - (Account Owner : Akash)" {...register("description")} />
                {errors.description && <p id="descriptionError" className="text-[#FF6D6D] text-[14px]">{errors.description.message}</p>}
              </div>

              <div className="flex flex-col w-[360px]">
                <label className="font-medium">Is this test gateway ?</label>
                <div className="flex flex-row mt-2 gap-4">
                  <div className="flex flex-row gap-2 items-center">
                    <input className="cursor-pointer w-4 h-4" type="radio" id="testYes" value="yes" {...register("isTestGateway")} />
                    <label className="font-medium " htmlFor="testYes">Yes</label>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <input className="cursor-pointer w-4 h-4" type="radio" id="testNo" value="no" {...register("isTestGateway")} />
                    <label className="font-medium" htmlFor="testNo">No</label>
                  </div>
                </div>
                {errors.isTestGateway && (<p id="isTestGatewayError" className="text-[#FF6D6D] text-[14px]">{errors.isTestGateway.message}</p>)}
              </div>
            </div>
            <div className="text-center mt-8">
              <Button type="submit" className="w-[240px] h-[42px] ">Submit</Button>
            </div>
          </div>
        </Form>
      }
      {!showForm && <Dialog {...dialogConfig} />}
    </div>
  )
}

export default AddPayment


const pgTypes = ["stripe", "corvuspay", "paypal"] as const;
type PGType = typeof pgTypes[number]
const schema = z.object({
  name: z.string().min(1, { message: "Please enter the name of the Payment Gateway" }),
  type: z.string().refine((t): t is PGType => pgTypes.includes(t as PGType), { message: "Please choose Payment Gateway Type" }),
  username: z.string().min(1, { message: "Please enter the username" }),
  usernameLabel: z.string().min(1, { message: "Please enter username label" }),
  password: z.string(),
  passwordLabel: z.string(),
  signature: z.string(),
  signatureLabel: z.string(),
  webhookSecret: z.string(),
  passphrase: z.string().optional(),
  purpose: z.string().refine((val) => val === "sale" || val === "refund", { message: "Please choose transaction intent : 'Sale' or 'Refund'" }),
  description: z.string().min(1, { message: "Description is mandatory." }),
  isTestGateway: z.string({ invalid_type_error: "Please choose if these credentials are for 'test' or 'live' gateway" })
});

const nullify = (x: string) => (x === "") ? null : x;
type FormValues = z.infer<typeof schema>;
const getSignature = (data: FormValues) => {
  if (data.type === "corvuspay") {
    const signature = `${data.passphrase},${data.signature}`
    return signature === "," ? null : signature;
  }
  return nullify(data.signature);
}

function encodeCertificate(e: React.ChangeEvent<HTMLInputElement>, setValue: any) {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const encodedString = (e.target!.result as string).substring(33);
      setValue("signature", encodedString);

      setValue("signatureLabel", "API Certificate");
    }
    reader.readAsDataURL(file);
  };
}

function checkSuccess(message: string) {
  const regex = /inserted successfully \| (\d+)/;
  const match = message.match(regex);

  if (match) {
    const extractedInteger = parseInt(match[1], 10);
    return { match: true as const, id: extractedInteger };
  }

  return { match: false as const };
}




export type DialogProps = {
  message: React.ReactNode;
  buttonMessage: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
}

export function Dialog(props: DialogProps) {
  return (<AlertDialog defaultOpen>
    {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{props.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {props.message}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="text-center">
        {/* <AlertDialogCancel>Retry</AlertDialogCancel> */}
        <AlertDialogAction onClick={props.onClick}>{props.buttonMessage}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>);
}
