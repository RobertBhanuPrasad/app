import {
  useActiveAuthProvider,
  useList,
  useRegister,
  useSelect,
} from "@refinedev/core";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { authProvider } from "src/authProvider";
import CustomSelect from "src/ui/custom-select";
import { supabaseClient } from "src/utility";
import { loginUserStore } from "src/zustandStore/LoginUserStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setLoginUserData } = loginUserStore();

  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    console.log("heyy error", error, data);

    if (data?.session) {
      nookies.set(null, "token", data.session.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      router.push("/");
    }

    const { data: loginData } = await supabaseClient.auth.getUser();

    if (loginData?.user?.id) {
      const { data: userData } = await supabaseClient
        .from("users")
        .select(
          "*,contact_id(*),user_roles(*,role_id(*)),program_type_teachers(program_type_id)"
        )
        .eq("user_identifier", loginData?.user?.id);

      setLoginUserData({
        loginData: data?.user as Object,
        userData: userData?.[0],
      });
    }
  };
  return (
    <div className="login flex min-h-screen bg-neutral justify-center items-center ">
      <div className="card w-[300px] bg-base-100 px-4 py-8 shadow-xl">
        <div className="px-4">
          <h1 className="text-[32px] font-bold text-center my-5">LOGIN</h1>
        </div>
        <form
          className="card-body pt-2 space-y-[10px]"
          onSubmit={async (ev) => {
            ev.preventDefault();
          }}
        >
          <div className="form-control flex justify-between items-center">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              name="email"
              placeholder="Enter email"
              className="border-[1px] border-black ml-[10px] p-1"
            />
          </div>

          <div className="form-control mt-0  flex justify-between items-center">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              name="password"
              placeholder="Enter password"
              className="border-[1px] border-black ml-[10px] p-1"
            />
          </div>
          {/* <div className="form-control mt-6">
            <button id="login" type="submit" className="btn">
              Login
            </button>
          </div> */}
          <div className="form-control mt-6 flex justify-center">
            <button
              id="signup"
              type="button"
              className="btn font-semibold"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>

        <div>
          If not registered then?{" "}
          <span
            onClick={() => {
              router.push("/register");
            }}
            className="font-semibold"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};
export default Login;

Login.requireAuth = false;
Login.noLayout = true;
