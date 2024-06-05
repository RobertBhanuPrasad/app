import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "src/ui/alert"
import { customFetch } from "./custom-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
// import "bootstrap/dist/css/bootstrap.min.css";
import { CountryCode, countryCodes } from "caps-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog } from "../../../src/components/Dialog";
import EntityConfig  from "./entity-config";
import { Button } from "src/ui/button";

const schema = z.object({
  country: z.string().refine(v => countryCodes.includes(v as CountryCode), { message: "Please enter a correct country code" }),
  org: z.number({ invalid_type_error: "Organization ID is mandatory" }).refine(o => o > 0, { message: "Invalid Organization ID" }),
  module: z.string().min(1, { message: "Please enter the module (eg : 'RX', 'DX', 'BX', 'CX', ...)" }),
});
type FormValues = z.infer<typeof schema>;


const Entity = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
      resolver: zodResolver(schema),
  });
  const [entity, setEntity] = useState<number>();
  // undefined : not yet submitted
  //       > 0 : successfully retrieved
  //        -1 : failed to retrieve

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

  return (
      <>
          {!entity && <form autoComplete="off" onSubmit={handleSubmit(createEntity)}>
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
                  <div className="text-center">
                      <Button type="submit">Continue</Button>
                  </div>
              </div>
              </div>
          </form >}

          {entity && entity === -1 && <Dialog title="Oops!" message="Something went wrong. Please try again after some time." buttonMessage="Try Again" onClick={() => setEntity(undefined)} />}
          
          {entity && entity > 0 && <>
              <div className="px-4" style={{ display: "flex" }}>
                  <div className="pd-5 text-center bg-body-tertiary" style={{ marginLeft: "30em" }}>
                      <h1 className="mb-3">Entity Configuration</h1>
                  </div>
                  <Alert id="entity-alert" className="alert alert-success py-1 text-center" style={{ width: "9em", marginLeft: "auto" }}>

                      <AlertTitle >
                          Entity ID
                      </AlertTitle>
                      <AlertDescription>
                          #{entity}
                      </AlertDescription>
                  </Alert>
              </div>
              <EntityConfig eid={entity} />
          </>

          }
      </>
  )
}
Entity.requireAuth = false;

export default Entity