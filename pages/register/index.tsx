import {
  useActiveAuthProvider,
  useList,
  useRegister,
  useSelect,
} from "@refinedev/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { authProvider } from "src/authProvider";
import CustomSelect from "src/ui/custom-select";
import { supabaseClient } from "src/utility";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleValue, setRoleValue] = useState(42); // Teacher role id

  const router = useRouter();

  const { data } = useList<any>({
    resource: "option_labels",
    filters: [
      {
        field: "name",
        operator: "eq",
        value: "User Role",
      },
    ],
  });

  const { options } = useSelect({
    resource: "option_values",
    optionLabel: "value",
    optionValue: "id",
    filters: [
      {
        field: "option_label_id",
        operator: "eq",
        value: data?.data[0]?.id,
      },
    ],
  });

  const handleSignup = async () => {
    const { data } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    const { data: contactData } = await supabaseClient
      .from("contact")
      .insert([{ first_name: firstName, last_name: lastName }])
      .select();

    const { data: userData } = await supabaseClient
      .from("users")
      .insert([
        { user_identifier: data?.user?.id, contact_id: contactData?.[0]?.id },
      ])
      .select();

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .insert([{ user_id: userData?.[0]?.id, role_id: roleValue }])
      .select();

    router.push("/login");
  };

  return (
    <div className="login flex min-h-screen bg-neutral justify-center items-center">
      <div className="card w-full max-w-sm bg-base-100 px-4 py-8 shadow-xl">
        <div className="px-4">
          <h1 className="text-[32px] font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
            SIGN UP
          </h1>
        </div>
        <form
          className="card-body pt-2 space-y-[10px]"
          onSubmit={async (ev) => {
            ev.preventDefault();
          }}
        >
          {error && (
            <div className="alert alert-error justify-start">
              <i className="i-feather-alert-triangle"></i>
              <span className="flex-grow">{error.message}</span>
            </div>
          )}
          <div className="form-control flex items-center justify-between">
            <label htmlFor="email" className="label">
              <span className="label-text">User Name</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
              name="firstname"
              placeholder="Enter name"
              className="border-[1px] border-black ml-[10px] p-1"
            />
          </div>
          <div className="form-control flex items-center justify-between">
            <label htmlFor="email" className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
              name="lastname"
              placeholder="Enter last name"
              className="border-[1px] border-black ml-[10px] p-1"
            />
          </div>

          <div className="form-control flex items-center justify-between">
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
          <div className=" form-control flex items-center justify-between">
            <label>Select Role:</label>

            <select
              value={roleValue}
              onChange={(event: any) => {
                setRoleValue(event.target.value);
              }}
              className="w-[190px] border border-1 border-[black] p-1"
            >
              {options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mt-0 flex items-center justify-between">
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
          <div className="form-control mt-6 flex justify-center ">
            <button
              id="signup"
              type="button"
              className="font-semibold cursor-pointer"
              disabled={loading}
              onClick={handleSignup}
            >
              {loading ? "Loading..." : "Signup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;

Signup.requireAuth = false;
Signup.noLayout = true;
