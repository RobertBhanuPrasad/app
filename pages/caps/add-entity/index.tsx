import { zodResolver } from "@hookform/resolvers/zod";
import { CountryCode, countryCodes } from "caps-ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "src/ui/button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import ErrorAlerts from "@components/ErrorAlert";
import { supabaseClient } from "src/utility";

const schema = z.object({
  country: z.string().refine((v) => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
  org: z.number({ invalid_type_error: "Organization ID is mandatory" }).refine((o) => o > 0, { message: "Invalid Organization ID" }),
  module: z.string().min(1, { message: "Please enter the module (eg: 'RX', 'DX', 'BX', 'CX', ...)" }),
});
type FormValues = z.infer<typeof schema>;

type CustomAlert = { title: string; description: string };
const supabase = supabaseClient("caps");

const Entity = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [alert2, setAlert] = useState<CustomAlert>();

  // Retrive QueryParam 
  useEffect(() => {
    const _error = new URL(window.location.href).searchParams.get("error");
    router.replace({pathname:window.location.pathname}, undefined, {shallow : true});
    if (_error) setAlert({title : "Oops!", description :_error});
  },[]);
  
  // Alert Error message
  const errorAlertMessage = () => {
    setAlert({ title: "Oops! Something went wrong.", description: 'Please try again later.' })
  }

  // Create entity or Find entity
  const createEntity = async (data: FormValues) => {
      try {
        const { data: result, error } = await supabase
            .rpc('get_entity', { _country: data.country, _org: data.org, _module: data.module });

        if (error) {
            throw error;
        }

        // Convert the result to a JSON string and extract the entity ID
        const message = JSON.stringify(result);
        const match = message.match(/(\d+)/);

        if (match) {
            router.push("/caps/entity-configuration?" + new URLSearchParams([["id", match[1]]]));
        } else {
            errorAlertMessage();
        }
    } catch (error: any) {
        setAlert({ title: "Error", description: error.message });
    }
};

  

  // Alert Ui design
  const AlertDestructive = (props: CustomAlert) => {
    return (
      <ErrorAlerts title={props.title} description={props.description} onClose = {()=>{console.log("yo");setAlert(undefined)}}/>
    )
  }

  return (
    <>
      {alert2 && <AlertDestructive {...alert2} />}
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

Entity.requireAuth = true
