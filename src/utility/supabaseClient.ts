import { createClient } from "@refinedev/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { ConfigStore } from "src/zustandStore/ConfigStore";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or key is not defined");
}

/**
 * supabase client
 * @param schema - schema
 * @returns supabaseClient
 */
export const supabaseClient = (schema?: string) => {
  /**
   * To get country code or language code we need useRouter hook becuase in that we have locale attribute
   * but we cant call hook inside this file becuase there was no component or hooks here
   * so we need to store in zustand we need to get the data with getState it will helpful for that
   */
  const { countryCode } = ConfigStore.getState();

  if (schema === undefined) schema = countryCode || "public";

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: {
      schema,
    },
    auth: {
      persistSession: true,
    },
    global: {
      headers: {
        "country-code": schema,
      },
    },
  });
};
type SupabaseClientType = SupabaseClient<any, string, any>;
export { type SupabaseClientType as SupabaseClient };
