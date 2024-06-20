import { AuthProvider } from "@refinedev/core";
import jwt from "jsonwebtoken";
import router from "next/router";
import nookies from "nookies";
import { supabaseClient } from "./utility";
import { getCountryCodeFromLocale } from "./utility/useGetCountryCode";
import { getLanguageCodeFromLocale } from "./utility/useGetLanguageCode";

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const supabase = supabaseClient();

    const { error } = await signInWithKeycloak();

    if (error) {
      return {
        success: false,
        error,
      };
    }
    const countryCode = getCountryCodeFromLocale(router.locale as string);
    const languageCode = getLanguageCodeFromLocale(router.locale as string);
    return {
      success: true,
      redirectTo: `/${countryCode}-${languageCode}/`,
    };
  },
  logout: async (ctx) => {
    const token = nookies.get(ctx).token || nookies.get(null).token;
    const supabase = supabaseClient(undefined, token);

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    return {
      success: false,
      error: {
        message: "Registeration not enabled yet",
        name: "RegDisabled",
      },
    };
  },
  check: async (ctx) => {
    const token = nookies.get(ctx).token || nookies.get(null).token;

    const { countryLanguageCode, countryCode } = getCountryLanguageCode(ctx);

    const supabase = supabaseClient(countryCode, token);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_identifier", getAuthUuid(token));

    if (error) {
      return {
        authenticated: false,
        redirectTo: `${countryLanguageCode}/login`,
      };
    } else if (data.length !== 1) {
      return {
        authenticated: false,
        redirectTo: `${countryLanguageCode}/not-authorized`,
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async (ctx) => {
    if ((await authProvider.check(ctx)).authenticated) {
      return "authenticated";
    }

    return null;
  },
  getIdentity: async (ctx) => {
    const token = nookies.get(ctx).token || nookies.get(null).token;
    const supabase = supabaseClient(undefined, token);

    const { data: userData, error } = await supabase
      .from("users")
      .select(
        "*,user_roles(*,role_id(*)),program_type_teachers(program_type_id)"
      )
      .eq("user_identifier", getAuthUuid(token));

    if (error) {
      console.error("Error while fetching login user data", error);
    }
    if (userData) {
      return {
        userData: userData?.at(0),
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

const signInWithKeycloak = async (redirectTo = "") => {
  const supabase = supabaseClient();
  const { countryCode, languageCode, countryLanguageCode } =
    getCountryLanguageCode();

  return await supabase.auth.signInWithOAuth({
    provider: "keycloak",
    options: {
      scopes: "openid",
      queryParams: {
        response_type: "token",
        country: countryCode,
        kc_locale: languageCode,
        redirect_uri: `${
          window.location.origin
        }${countryLanguageCode}/login?${new URLSearchParams([
          ["to", redirectTo],
        ])}`,
      },
    },
  });
};

const getAuthUuid = (token: string) => {
  return jwt.decode(token, { json: true })?.sub || "non-existent-uuid";
};

const getCountryLanguageCode = (ctx?: any) => {
  const locale = ctx?.locale || router.locale;
  const countryCode = getCountryCodeFromLocale(locale);
  const languageCode = getLanguageCodeFromLocale(locale);
  const countryLanguageCode =
    countryCode === "public" ? "" : `/${countryCode}-${languageCode}`;

  return { countryCode, languageCode, countryLanguageCode };
};

export { authProvider, signInWithKeycloak };
