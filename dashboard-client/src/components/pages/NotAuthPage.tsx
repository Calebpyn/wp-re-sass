//Auth0
import { useAuth0 } from "@auth0/auth0-react";

import React from "react";

//React Roter
import { useNavigate } from "react-router-dom";

function NotAuthPage() {
  //Navigate
  const navigate = useNavigate();

  //Auth0
  const { logout } = useAuth0();

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-start justify-start">
        <span className="font-black">Not Allowed</span>
        <span>
          Please log in with a correct email address or contact{" "}
          <a className="text-blue-700 tr hover:text-purple-600 cursor-pointer">
            support
          </a>
          .
        </span>
        <div className="w-full flex justify-start mt-2">
          <button
            className="bg-blue-900 px-4 py-1 text-white rounded-md shadow-sm hover:scale-105 cursor-pointer tr"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotAuthPage;
