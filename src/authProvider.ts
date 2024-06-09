import { AuthProvider } from "@refinedev/core";

import { supabaseClient } from "./utility";

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const supabase = supabaseClient();

    const { data, error } = await signInWithKeycloak();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },
  logout: async () => {
    const supabase = supabaseClient();

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
    const supabase = supabaseClient();

    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error || data.length !== 1) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => {
    const supabase = supabaseClient();

    const user = await supabase.auth.getUser();

    if (user) {
      return user.data.user?.role;
    }

    return null;
  },
  getIdentity: async () => {
    const supabase = supabaseClient();

    const { data } = await supabase.auth.getUser();
    const { data: userData, error } = await supabase
      .from("users")
      .select(
        "*,contact_id(*),user_roles(*,role_id(*)),program_type_teachers(program_type_id)"
      )
      .eq("user_identifier", data?.user?.id);

    if (error) {
      console.error("Error while fetching login user data", error);
    }
    if (userData) {
      return {
        data,
        userData: userData?.[0],
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

const signInWithKeycloak = async () => {
  const supabase = supabaseClient();

  return await supabase.auth.signInWithOAuth({
    provider: "keycloak",
    options: {
      scopes: "openid",
      // redirectTo: "http://localhost:2000/auth/callback",
      queryParams: {
        response_type: "token",
      },
    },
  });
};

export { authProvider, signInWithKeycloak };
