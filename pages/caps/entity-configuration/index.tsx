import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "src/ui/alert"
import { customFetch } from "./custom-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
// import "bootstrap/dist/css/bootstrap.min.css";
import { CountryCode, countryCodes } from "caps-ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog } from "../../../src/components/Dialog";
import EntityConfig  from "./entity-config";
import { Button } from "src/ui/button";
import { useRouter } from "next/router";
import { supabaseClient } from "src/utility";

const schema = z.object({
  country: z.string().refine(v => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
  org: z.number({ invalid_type_error: "Organization ID is mandatory" }).refine(o => o > 0, { message: "Invalid Organization ID" }),
  module: z.string().min(1, { message: "Please enter the module (eg : 'RX', 'DX', 'BX', 'CX', ...)" }),
});
type FormValues = z.infer<typeof schema>;


const Entity = () => {
    const router = useRouter();
    // const [isNumber, setIdNumber] = useState(false);
  const { id} = router.query;
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
      resolver: zodResolver(schema),
  });
  const [entity, setEntity] = useState<number | null>(null);
  const [entityExists, setEntityExists] = useState<boolean | null>(null);

  // undefined : not yet submitted
  //       > 0 : successfully retrieved
  //        -1 : failed to retrieve
console.log('id :', id);



const checkEntityExistence = async (entityId: number): Promise<boolean> => {
  const supabase = supabaseClient("caps");
  const { data, error } = await supabase
    .from('pg_entity')
    .select('id')
    .eq('id', entityId)
    .limit(1);
    console.log('Supabase Data:', data);
    console.log('Supabase Error:', error);
  if (error) {
    console.error('Error checking entity existence:', error);
    return false;
  }

  return data.length > 0;
};

useEffect(() => {
    const checkIfEntityExists = async () => {
      if (id) {
        const idString = Array.isArray(id) ? id[0] : id;
        const numericRegex: RegExp = /^[0-9]+$/;
        const isIdNumber = numericRegex.test(idString) ? true : false;
        if (isIdNumber) {
          const exists = await checkEntityExistence(parseInt(idString, 10));
          console.log("rt8y9dsh", exists)
          setEntityExists(exists);
        } else {
          setEntityExists(false);
        }
      }
    };

    checkIfEntityExists();
  }, []);

  const createEntity = async (data: FormValues) => {
      const response = await customFetch("/rest/v1/rpc/get_entity", "POST", { _country: data.country, _org: data.org, _module: data.module });
      const message = JSON.stringify(await response.json());
      console.log('Helloooooooo!!! ' ,message)
      const match = message.match(/(\d+)/);
      if (match) {
          setEntity(parseInt(match[1], 10));
      } else {
          setEntity(-1);
      }
  }
  console.log('Entity exists: ', entityExists);


  if (entityExists === null) {
    return <div>Loading...</div>;
  } else if (entityExists === false){
    return <Dialog title="Error" message="Entity does not exist." buttonMessage="OK" onClick={() => setEntityExists(null)} />;
  } 
  else if (entityExists === true)
  {
    // Check if entity is null (initial state) or set, and render accordingly
    return (
      <>
        {entity !== null && entity > 0 && (
          <>
            <div className="px-4" style={{ display: "flex" }}>
              <div className="pd-5 text-center bg-body-tertiary" style={{ marginLeft: "30em" }}>
                <h1 className="mb-3">Entity Configuration</h1>
              </div>
              <Alert id="entity-alert" className="alert alert-success py-1 text-center" style={{ width: "9em", marginLeft: "auto" }}>
                <AlertTitle>Entity ID</AlertTitle>
                <AlertDescription>#{entity}</AlertDescription>
              </Alert>
            </div>
            <EntityConfig eid={entity} />
          </>
        )}
        {entity === -1 && <Dialog title="Oops!" message="Something went wrong. Please try again after some time." buttonMessage="Try Again" onClick={() => setEntity(null)} />}
        {entity === null && <div>Loading...</div>}
      </>
    );
  } else {
    return (
      <form autoComplete="off" onSubmit={handleSubmit(createEntity)}>
        <div className="px-4">
          <div className="pd-5 text-center bg-body-tertiary">
            <h1 className="mb-3">Entity Configuration</h1>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="country">Country</label>
            <input id="country" className="form-control" type="text" placeholder={countryCodes[38]}  {...register("country")} />
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
        </div>
      </form>
    );
  }

}
Entity.requireAuth = false;

export default Entity