import { AuthBindings } from "@refinedev/core";
import nookies from "nookies";

import { supabaseClient } from "./utility";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const supabase = supabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {
      nookies.set(null, "token", data.session.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      return {
        success: true,
        redirectTo: "/",
      };
    }

    // for third-party login
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    const supabase = supabaseClient();

    nookies.destroy(null, "token");
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
    const supabase = supabaseClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: "Bhargavi",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  check: async (ctx) => {
    const supabase = supabaseClient();

    const { token } = nookies.get(ctx);
    const { data } = await supabase.auth.getUser(token);
    const { user } = data;

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
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
        "*,user_roles(*,role_id(*)),program_type_teachers(program_type_id)"
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
