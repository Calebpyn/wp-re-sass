//Hooks
import { useContext } from "react";

//Context
import { PageContext } from "../../App";

//Icons
import { MdHome } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { GoFileSubmodule } from "react-icons/go";

function NavBar() {
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
    <div className="w-[200px] top-0 h-full flex flex-col p-10 justify-between items-center left-0 shadow-lg fixed bg-main-blue z-[9999] text-white text-opacity-40">
      <div className="flex flex-col justify-start items-end w-full">
        <span className="font-black mb-10 text-3xl text-white">LOGO</span>

        <span className="flex gap-10 font-light flex-col justify-start items-end">
          <span
            className={` tr cursor-pointer flex gap-2 items-center  ${
              currentPage == 1
                ? "scale-105 text-white"
                : "hover:scale-105 hover:text-white"
            }`}
            onClick={() => changePage(1)}
          >
            <span>Home</span>
            <MdHome className="text-xl" />
          </span>
          <span
            className={` tr cursor-pointer flex gap-2 items-center ${
              currentPage == 2
                ? "scale-105 text-white"
                : "hover:scale-105 hover:text-white"
            }`}
            onClick={() => changePage(2)}
          >
            <span>Properties</span>
            <MdDashboardCustomize className="text-xl" />
          </span>
          <span
            className={` tr cursor-pointer flex gap-2 items-center ${
              currentPage == 5
                ? "scale-105 text-white"
                : "hover:scale-105 hover:text-white"
            }`}
            onClick={() => changePage(5)}
          >
            <span>My Files</span>
            <FaImages className="text-xl" />
          </span>
          <span
            className={` tr cursor-pointer flex gap-2 items-center ${
              currentPage == 6
                ? "scale-105 text-white"
                : "hover:scale-105 hover:text-white"
            }`}
            onClick={() => changePage(6)}
          >
            <span>Upload Files</span>
            <GoFileSubmodule className="text-xl" />
          </span>
        </span>
      </div>

      <span className="flex w-full justify-end flex-col gap-3 items-end select-none">
        <span
          className={` tr cursor-pointer flex gap-2 items-center ${
            currentPage == 3
              ? "scale-105 text-white"
              : "hover:scale-105 hover:text-white"
          }`}
          onClick={() => changePage(3)}
        >
          <span>Settings</span>
          <IoIosSettings className="text-xl" />
        </span>
        {/* <span
          className="hover:scale-105 tr cursor-pointer hover:text-blue-900"
          onClick={() => changePage(4)}
        >
          Support
        </span> */}

        <span className="flex flex-col gap-1 items-end">
          <span className="text-xs flex gap-1">
            <span>Version</span>
            <span>{import.meta.env.VITE_REACT_APP_VERSION}</span>
          </span>
          <span className="text-xs">BlancSpace 2024</span>
        </span>
      </span>
    </div>
  );
}

export default NavBar;
