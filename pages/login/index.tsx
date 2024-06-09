import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect, useState } from "react";
import { authProvider, signInWithKeycloak } from "src/authProvider";

type LoggedIn =
  | {
      isLoggedIn: true;
      redirectTo: string;
    }
  | {
      isLoggedIn: false;
      error: string;
    };

const Login = () => {
  const [loggedIn, setLoggedIn] = useState<LoggedIn>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // clear URL fragment immediately
      const url = new URL(window.location.href);
      history.replaceState(null, "", window.location.pathname);

      const accessToken = new URLSearchParams(url.hash).get("access_token");
      const redirectTo = url.searchParams.get("to") || "/courses/list";

      // check if user is already logged in
      const { authenticated } = await authProvider.check();

      if (authenticated) {
        setLoggedIn({ isLoggedIn: true, redirectTo });
        return;
      }

      // if user is not logged in, process OR initiate authentication flow
      if (accessToken) {
        const res = await fetch("/api/exchangeToken", {
          method: "POST",
          body: JSON.stringify({
            token: accessToken,
          }),
        });
        const body = await res.json();
        if (res.ok) {
          nookies.set(null, "token", body.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          setLoggedIn({ isLoggedIn: true, redirectTo });
        } else {
          setLoggedIn({
            isLoggedIn: false,
            error: body.error,
          });
        }
      } else {
        signInWithKeycloak();
      }
    })();
  }, []);

  useEffect(() => {
    if (loggedIn?.isLoggedIn) router.replace(loggedIn.redirectTo);
  }, [loggedIn]);

  if (!loggedIn)
    return (
      <section className="flex justify-center align-center pt-[25%]">
        <div className="loader"></div>
      </section>
    );

  if (loggedIn.isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-bounce w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h2a1 1 0 011 1v0a1 1 0 011-1h10a1 1 0 011 1v0a1 1 0 011-1h2a1 1 0 011 1v0a1 1 0 01-1 1H5a1 1 0 00-1 1v15a1 1 0 001 1h14a1 1 0 001-1v-4m-9-4h4m0 0l-2-2m2 2l-2 2"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Redirecting to</h1>
          <p className="text-blue-500">{loggedIn.redirectTo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <img
            src={"https://i.imgur.com/hpX2V5d.jpeg"}
            alt="Sad cat"
            className="w-60 h-60 rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
        <p className="text-red-500 mb-4">{loggedIn.error}</p>
        <button
          onClick={() => router.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Login;

Login.requireAuth = false;
Login.noLayout = true;
