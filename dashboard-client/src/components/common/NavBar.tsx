import { useContext } from "react";
import { PageContext } from "../../App";

function NavBar() {
  // Access the context value and setter
  const context = useContext(PageContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { setCurrentPage } = context;

  const changePage = (value: number) => {
    setCurrentPage(value); // Example of changing the page number
  };

  return (
    <div className="w-full h-[100px] flex justify-between items-center px-10 shadow-lg fixed bg-white z-[9999]">
      <span className="font-black">GV BAJA REALTY ADMIN DASHBOARD</span>

      <span className="flex gap-10 font-light">
        <span
          className="hover:scale-105 tr cursor-pointer hover:text-blue-900"
          onClick={() => changePage(1)}
        >
          Home
        </span>
        <span
          className="hover:scale-105 tr cursor-pointer hover:text-blue-900"
          onClick={() => changePage(2)}
        >
          Properties
        </span>
        <span
          className="hover:scale-105 tr cursor-pointer hover:text-blue-900"
          onClick={() => changePage(3)}
        >
          Settings
        </span>
        <span
          className="hover:scale-105 tr cursor-pointer hover:text-blue-900"
          onClick={() => changePage(4)}
        >
          Support
        </span>
      </span>
    </div>
  );
}

export default NavBar;
