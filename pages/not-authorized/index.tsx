import { supabaseClient } from "src/utility";

const NotAuthorized = () => {
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
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-red-500 mb-4">
          You are not authorized to access this page
        </p>
        <button
          onClick={() => {
            supabaseClient().auth.signOut();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;

NotAuthorized.requireAuth = false;
NotAuthorized.noLayout = true;
