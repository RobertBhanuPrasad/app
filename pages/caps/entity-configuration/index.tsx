import { Alert, AlertDescription, AlertTitle } from "src/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";
import { CountryCode, countryCodes } from "caps-ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EntityConfig from "./entity-config";
import { Button } from "src/ui/button";
import { customFetch } from "./custom-fetch";
import { Dialog } from "@components/Dialog";
import { useRouter } from "next/router";
import { supabaseClient } from "src/utility";

const schema = z.object({
  country: z.string().refine((v) => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
  org: z.number({ invalid_type_error: "Organization ID is mandatory" }).refine((o) => o > 0, { message: "Invalid Organization ID" }),
  module: z.string().min(1, { message: "Please enter the module (eg: 'RX', 'DX', 'BX', 'CX', ...)" }),
});
type FormValues = z.infer<typeof schema>;

const checkEntityQueryParam = async (entityId: number): Promise<boolean> => {
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

const entityQueryParam = async (id: string | string[] | undefined)  => {
  const idString = Array.isArray(id) ? id[0] : id;
  console.log('ID is :', idString);
  if (idString && /^[1-9][0-9]*$/.test(idString)) {
    const idNumber = parseInt(idString, 10);
    if (await checkEntityQueryParam(idNumber)) {
      return { exists: true, id: idNumber } as const;
    }
    // if (idNumber < 20) {
    //   return { exists: true, id: idNumber } as const;
    // }
  } else if (!idString) {
    return {exists:undefined};
  }
  return { exists: false, id: idString } as const;
};

const Entity = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [entity, setEntity] = useState<number>();
  const [error, setError] = useState<string>();
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async ()=> {
      try {
      const { id, exists } = await entityQueryParam(router.query.id);
      if (exists) {
        setEntity(id);
      } else if (exists === false) {
        setError("Invalid entity-id: " + id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    }; 
    fetchData().then(()=>setLoading(false))
    
  }, [router.query.id]);

  const createEntity = async (data: FormValues) => {
    const response = await customFetch("/rest/v1/rpc/get_entity", "POST", { _country: data.country, _org: data.org, _module: data.module });
    const message = JSON.stringify(await response.json());
    const match = message.match(/(\d+)/);
    if (match) {
      setEntity(parseInt(match[1], 10));
    } else {
      setEntity(-1);
    }
  };

  if (isLoading) {
    return  <div className="loader !w-[35px]"></div>
  }

  return (
    <>
      {error && (
        <div className="mx-5 alert alert-danger alert-dismissible fade show flex justify-between" role="alert">
          {error}
          <button type="button" className="close btn btn-danger btn-sm" data-dismiss="alert" aria-label="Close" onClick={() => setError(undefined)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      {!entity && (
        <form className="px-4" autoComplete="off" onSubmit={handleSubmit(createEntity)}>
          <div className="pd-5 text-center bg-body-tertiary">
            <h1 className="mb-3">Entity Configuration</h1>
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
      )}
      {entity === -1 && <Dialog title="Oops!" message="Something went wrong. Please try again after some time." buttonMessage="Try Again" onClick={() => setEntity(undefined)} />}
      {!error && entity && entity > 0 && (
        <>
          <div style={{ display: "flex" }}>
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
    </>
  );
};

export default Entity;
