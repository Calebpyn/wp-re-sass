//Auth0
import { useAuth0 } from "@auth0/auth0-react";
//Navigate
import { useNavigate } from "react-router-dom";

function AuthContainer() {
  //Auth0
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  //Navigate
  const navigate = useNavigate();

  return (
    <div className="p-5 shadow-lg">
      <span>GV BAJA REALTY ADMIN DASHBOARD</span>
      {isAuthenticated ? (
        <div>
          <div className="flex flex-col justify-start gap-8 py-8 w-full">
            <button
              className="w-full bg-blue-900 shadow-md text-white py-1 hover:scale-105 tr"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Go to dashboard
            </button>
            <button
              className="w-full bg-blue-900 shadow-md text-white py-1 hover:scale-105 tr"
              onClick={() => logout()}
            >
              Log Out
            </button>
          </div>

          <div className="text-sm w-full flex justify-end">
            Need{" "}
            <a className="ml-1 text-blue-600 hover:cursor-pointer hover:text-violet-800 tr">
              help
            </a>
            ?
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col justify-start gap-8 py-8 w-full">
            <button
              className="w-full bg-blue-900 shadow-md text-white py-1 hover:scale-105 tr"
              onClick={() => {
                loginWithRedirect();
              }}
            >
              Access
            </button>
          </div>

          <div className="text-sm w-full flex justify-end">
            Need{" "}
            <a className="ml-1 text-blue-600 hover:cursor-pointer hover:text-violet-800 tr">
              help
            </a>
            ?
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthContainer;
