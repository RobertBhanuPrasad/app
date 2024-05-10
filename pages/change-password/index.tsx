import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "src/utility";

const ChangePassword = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const router = useRouter();

  const supabase = supabaseClient();
  useEffect(() => {
    supabase.auth
      .getUser()
      .then((userData) => setEmail(userData.data.user?.email));
  }, []);

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert("Something went wrong while changing password : " + error.message);
    } else {
      const { count, error } = await supabase
        .from("first_time_users")
        .delete({ count: "exact" })
        .eq("alloted_uuid", data.user.id);

      if (count === 1) {
        router.replace("/courses/list");
      } else {
        // when /change-password is added as a functionality this check needs to be changed
        alert(
          "Something went wrong while changing password. Try again after some time"
        );
      }
    }
  };

  return (
    <div className="login flex min-h-screen bg-neutral justify-center items-center ">
      <div className="card w-[300px] bg-base-100 px-4 py-8 shadow-xl">
        <div className="px-4">
          <h1 className="text-[20px] font-bold text-center">
            Change your password
          </h1>
          <h1 className="text-[14px] text-center mb-10">
            Enter a new password below
          </h1>
        </div>
        <form
          className="card-body pt-2 space-y-[10px]"
          onSubmit={async (ev) => {
            ev.preventDefault();
          }}
        >
          <div className="form-control flex justify-between items-center mb-10">
            <label htmlFor="email" className="label">
              <span className="label-text text-[darkblue]">{email}</span>
            </label>
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
          <div className="form-control pt-6 flex justify-center">
            <button
              type="button"
              className="btn font-semibold"
              onClick={handleSubmit}
            >
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;

ChangePassword.requireAuth = true;
ChangePassword.noLayout = true;
