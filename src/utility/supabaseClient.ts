import { createClient } from "@refinedev/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import nookies from "nookies";
import { ConfigStore } from "src/zustandStore/ConfigStore";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase URL or key is not defined");
}

/**
 * supabase client
 * @param schema - schema
 * @returns supabaseClient
 */
export const supabaseClient = (schema?: string, token?: string) => {
  /**
   * To get country code or language code we need useRouter hook becuase in that we have locale attribute
   * but we cant call hook inside this file becuase there was no component or hooks here
   * so we need to store in zustand we need to get the data with getState it will helpful for that
   */
if (schema === "caps") {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      db: { schema },
      auth: {
        persistSession: false,
      },
    });
}

  const { countryCode } = ConfigStore.getState();

  if (schema === undefined) schema = countryCode || "public";

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: {
      schema,
    },
    auth: {
      persistSession: true,
    },
    global: {
      headers: {
        "country-code": schema,
        Authorization: `Bearer ${token || SUPABASE_KEY}`,
      },
    },
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      nookies.destroy(null, "token", { path: "/" });

      const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
      const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

      let currentUrl = window.location.href;
      if (currentUrl.match(/\/not-authorized/)) {
        currentUrl = window.location.origin;
      }

      if (keycloakUrl && clientId) {
        window.location.replace(
          `${keycloakUrl}/protocol/openid-connect/logout?${new URLSearchParams({
            client_id: clientId,
            post_logout_redirect_uri: currentUrl,
          })}`
        );
      } else {
        console.log(
          "Could not logout successfully due to missing keycloak-configuration in env"
        );
      }
    }
  });

  return supabase;
};

// Generic SupabaseClient Type for allowing non-public schemas as well
type SupabaseClientType = SupabaseClient<any, string, any>;
export { type SupabaseClientType as SupabaseClient };
