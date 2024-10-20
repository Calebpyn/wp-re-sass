import { useEffect, useState } from "react";
import axios from "axios";

//Icons
import { IoMdClose } from "react-icons/io";
import { IoMdSave } from "react-icons/io";

import { allowedUsers } from "../../types/MainFrameTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";

function Settings() {
  const { user, logout } = useAuth0();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allowedList, setAllowedList] = useState<allowedUsers[]>([]);

  const [newAccess, setNewAccess] = useState<string>("");

  //Get permission list
  const getPermissionList = async () => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/allowed`)
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
      });
    if (response) {
      setAllowedList(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPermissionList();
  }, []);

  const handleAccessDelete = async (email: string, id: string) => {
    if (email == user?.email) {
      alert("Cannot delete account in use");
    } else {
      setIsLoading(true);
      const response = await axios
        .delete(`${import.meta.env.VITE_REACT_APP_API_URL}/delete_access/${id}`)
        .catch((err) => {
          console.log(err, "axios error");
          alert("Something went wrong...");
        });
      if (response) {
        console.log(response);
      }
      getPermissionList();
      setIsLoading(false);
    }
  };

  const handlePostAccess = async () => {
    setIsLoading(true);
    const tempBody = {
      email: newAccess,
    };
    const response = await axios
      .post(`${import.meta.env.VITE_REACT_APP_API_URL}/new_access`, tempBody)
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
      });
    if (response) {
      console.log(response);
    }
    getPermissionList();
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full p-10">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="">
            <div className="flex flex-col justify-start gap-3">
              <span className="font-bold">Allowed accounts</span>
              <div className="flex flex-col gap-2">
                {allowedList.map((item: allowedUsers, idx) => (
                  <span
                    key={idx}
                    className="p-2 bg-zinc-50 rounded-sm flex justify-between items-center"
                  >
                    <span>{item.email}</span>
                    <span>
                      <span>
                        {item.is_admin ? (
                          <span className="text-zinc-400 font-light text-sm">
                            Admin can't be deleted
                          </span>
                        ) : (
                          <IoMdClose
                            className="hover:scale-110 tr cursor-pointer hover:text-red-500"
                            onClick={() =>
                              handleAccessDelete(item.email, item.id)
                            }
                          />
                        )}
                      </span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="my-2 flex gap-2">
              <input
                placeholder="New Access"
                className="border-[1px] border-black py-3 px-5 focus:outline-none"
                onChange={(e) => setNewAccess(e.target.value)}
              />
              <button
                className="bg-zinc-300 px-5 text-zinc-800 hover:bg-main-blue hover:text-white tr"
                onClick={() => handlePostAccess()}
              >
                <IoMdSave className="text-xl" />
              </button>
            </div>
          </div>
          <div className="flex justify-start items-center">
            <button
              className="bg-zinc-300 py-3 px-5 text-zinc-800 hover:bg-main-blue hover:text-white tr"
              onClick={() => logout()}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
