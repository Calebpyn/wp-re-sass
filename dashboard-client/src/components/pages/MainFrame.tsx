//Import
import { useEffect, useState } from "react";
//Permissions list

//Auth0
import { useAuth0 } from "@auth0/auth0-react";
//Components
import Dashboard from "./Dashboard";
import NotAuthPage from "./NotAuthPage";

//Axios
import axios from "axios";
import { CircularProgress } from "@mui/material";

function MainFrame() {
  //Auth0
  const { isAuthenticated, user } = useAuth0();

  //Internal Permission
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  //Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        getPermissionList(user);
      }
    }
  }, [isAuthenticated, user]);

  //Get permission list
  const getPermissionList = async (user: any) => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/allowed`)
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
      });
    if (response) {
      let allowedUsers: string[] = [];
      for (let i = 0; i < response.data.length; i++) {
        allowedUsers.push(response.data[i].email);
      }
      setIsAllowed(allowedUsers.includes(user.email!));
    }
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : isAuthenticated && user?.email_verified && isAllowed ? (
        <Dashboard />
      ) : (
        <NotAuthPage />
      )}
    </div>
  );
}

export default MainFrame;
