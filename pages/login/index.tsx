import { fetchStaticDBData } from "@components/PreFetchStaticApi";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { useState } from "react";
import { supabaseClient } from "src/utility";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const supabase = supabaseClient();

  const handleLogin = async () => {
  // storing static db data in local storage 
    const staticDataFromDB = await fetchStaticDBData()
    localStorage.setItem("staticDataFromDB",JSON.stringify(staticDataFromDB))

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("heyy error", error, data);

    if (data?.session) {
      nookies.set(null, "token", data.session.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      const { count, error } = await supabase
        .from("first_time_users")
        .select("*", { count: "exact", head: true })
        .eq("alloted_uuid", data.user.id);
      console.log(count);
      if (count === 1) {
        router.replace("/change-password");
      } else {
        router.replace("/courses/list");
      }
    }
  };
  return (
    <div className="login flex min-h-screen bg-neutral justify-center items-center ">
      <div className="absolute top-6 right-6 font-medium">Beta 1.0</div>
      <div className="card w-[350px] bg-base-100 px-4 py-8 shadow-xl">
        <div className="px-4">
          <h1 className="text-[32px] font-bold text-center my-5">LOGIN</h1>
        </div>
        <form
          className="card-body pt-2 space-y-[10px]"
          onSubmit={async (ev) => {
            ev.preventDefault();
          }}
        >
          <div className="form-control flex items-center">
            <label htmlFor="email" className="label w-1/4">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              name="email"
              placeholder="Enter email"
              className="border-[1px] border-black ml-[5px] p-1 w-3/4"
              onKeyUp={(e) => (e.key === "Enter" ? handleLogin() : null)}
            />
          </div>

          <div className="form-control mt-0 pb-3 flex items-center">
            <label htmlFor="password" className="label w-1/4">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              name="password"
              placeholder="Enter password"
              className="border-[1px] border-black ml-[5px] p-1 w-3/4"
              onKeyUp={(e) => (e.key === "Enter" ? handleLogin() : null)}
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

        {/* <div>
          If not registered then?{" "}
          <span
            onClick={() => {
              router.push("/register");
            }}
            className="font-semibold"
          >
            Register
          </span>
        </div> */}
      </div>
    </div>
  );
};
export default Login;

Login.requireAuth = false;
Login.noLayout = true;
