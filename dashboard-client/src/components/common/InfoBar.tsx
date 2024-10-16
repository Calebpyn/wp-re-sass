//Auth 0
import { useAuth0 } from "@auth0/auth0-react";

//Hooks
import { useContext, useState } from "react";

//Icons
import { FaUserEdit } from "react-icons/fa";

//Context
import { PageContext } from "../../App";

function InfoBar() {
  //User info
  const { user } = useAuth0();

  //User Info state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Access the context value and setter
  const context = useContext(PageContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { currentPage, setCurrentPage } = context;

  const changePage = (value: number) => {
    setCurrentPage(value); // Example of changing the page number
  };

  return (
    <div className="w-full h-[100px] flex justify-between items-center p-10 border-b-[1px] fixed top-0 right-0 bg-white pl-[200px] z-50 font-light">
      <span className="ml-10">
        {currentPage == 1
          ? "Home"
          : currentPage == 2
          ? "Properties"
          : currentPage == 3
          ? "Settings"
          : currentPage == 5
          ? "My Files"
          : currentPage == 6
          ? "Upload Files"
          : null}
      </span>
      <span
        className="p-3 bg-sec-gray rounded-[10px] border-[1px] border-black flex justify-between items-center gap-10 hover:bg-zinc-300 tr cursor-pointer relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex flex-col items-start">
          <span className="text-sm">{user?.name}</span>
          <span className="text-[10px]">{user?.email}</span>
        </span>
        <span className="overflow-clip rounded-full w-[45px] h-[45px]">
          <img src={user?.picture} />
        </span>
      </span>

      <div
        className={`absolute bottom-0 right-0 top-full w-[300px] mr-5 z-50 mt-3 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="bg-white w-full shadow-lg p-5 flex flex-col gap-5 justify-start items-center">
          <span className="flex flex-col justify-center items-center w-full">
            <span className="text-sm">{user?.name}</span>
            <span className="text-xs">{user?.email}</span>
          </span>
          <span className="w-full flex justify-center items-center">
            <span className="overflow-clip rounded-full w-[65px] h-[65px] relative group">
              <div className="absolute z-50 bg-black w-full h-full bg-opacity-0 hover:bg-opacity-15 cursor-pointer tr"></div>
              <img src={user?.picture} />
              <span className="py-1 bg-zinc-200 hover:text-black tr absolute bottom-0 w-full flex justify-center items-center">
                <FaUserEdit className="text-zinc-500 ml-1" />
              </span>
            </span>
          </span>

          <span className="flex w-full justify-center items-center gap-4">
            <button
              className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr"
              onClick={() => changePage(3)}
            >
              Settings
            </button>
            <button className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr">
              Support
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
