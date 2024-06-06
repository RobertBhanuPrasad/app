import { zodResolver } from "@hookform/resolvers/zod";
import { CountryCode, countryCodes } from "caps-ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "src/ui/button";
import "bootstrap/dist/css/bootstrap.min.css";
import { customFetch } from "../../../src/utility/custom-fetch";
import { useRouter } from "next/router";
import { X } from "lucide-react";

const schema = z.object({
  country: z.string().refine((v) => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
  org: z.number({ invalid_type_error: "Organization ID is mandatory" }).refine((o) => o > 0, { message: "Invalid Organization ID" }),
  module: z.string().min(1, { message: "Please enter the module (eg: 'RX', 'DX', 'BX', 'CX', ...)" }),
});
type FormValues = z.infer<typeof schema>;

type CustomAlert = { title: string; description: string };

const Entity = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [alert, setAlert] = useState<CustomAlert>();

  // Retrive QueryParam 
  useEffect(() => {
    const errorParam = router.query.error;
    if (Array.isArray(errorParam)) {
      setError(errorParam[0]);
    } else {
      setError(errorParam);
    }
  }, [router.query]);

  // Alert Error message
  const errorAlertMessage = () => {
    setAlert({ title: "Sorry! Something went wrong.", description: 'Please try again later.' })
  }

  // Create entity or Find entity
  const createEntity = async (data: FormValues) => {
    const response = await customFetch("/rest/1/rpc/get_entity", "POST", { _country: data.country, _org: data.org, _module: data.module });
    const message = JSON.stringify(await response.json());
    const match = message.match(/(\d+)/);
    if (match) {
      router.push("/caps/entity-configuration?" + new URLSearchParams([["id", match[1]]]))
    } else {
      errorAlertMessage()
    }
  };

  // Alert Ui design
  const AlertDestructive = (props: CustomAlert) => {
    return (
      <div className="mx-5 alert gjjgjgjhg alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center" role="alert">
        {props.title}<br />{props.description}
        <button type="button" className="btn-lg px-2 h-7 rounded-lg" aria-label="Close" onClick={() => setAlert(undefined)}>
          <X />
        </button>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mx-5 alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center" role="alert">
          {error}
          <button type="button" className=" close bg-red-400 btn-lg px-2 h-7 rounded-lg" data-dismiss="alert" aria-label="Close" onClick={() => setError(undefined)}>
            <span aria-hidden="true" className="font-bold">&times;</span>
          </button>
        </div>
      )}
      {alert && <AlertDestructive {...alert} />}
      <form className="px-4" autoComplete="off" onSubmit={handleSubmit(createEntity)}>
        <div className="pd-5 text-center bg-body-tertiary">
          <h1 className="mb-3">Add Entity</h1>
        </div>
        <div className="form-group pb-3">
          <label htmlFor="country">Country</label>
          <input id="country" className="form-control" type="text" placeholder={countryCodes[38]} {...register("country")} />
          {errors.country && <small id="countryError" className="form-text text-danger">{errors.country.message}</small>}
        </div>
        <div className="form-group pb-3">
          <label htmlFor="org">Organization</label>
          <input id="org" className="form-control" type="number" placeholder="4 (organization id)" {...register("org", { valueAsNumber: true })} />
          {errors.org && <small id="orgError" className="form-text text-danger">{errors.org.message}</small>}
        </div>
        <div className="form-group pb-3">
          <label htmlFor="module">Module</label>
          <input id="module" className="form-control" type="text" placeholder="RX" {...register("module")} />
          {errors.module && <small id="moduleError" className="form-text text-danger">{errors.module.message}</small>}
        </div>
        <div className="text-center">
          <Button type="submit">Continue</Button>
        </div>
      </form>

    </>
  );
};

export default Entity;
