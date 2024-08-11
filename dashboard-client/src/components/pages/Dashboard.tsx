import { useContext } from "react";
import NavBar from "../common/NavBar";
import { PageContext } from "../../App";
import Home from "../dashboard/Home";
import Properties from "../dashboard/Properties";
import Settings from "../dashboard/Settings";
import Support from "../dashboard/Support";

function Dashboard() {
  // Access the context value and setter
  const context = useContext(PageContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { currentPage } = context;

  return (
    <div className="w-full max-w-screen-2xl h-screen flex flex-col justify-start items-center">
      <NavBar />
      <div className="h-[100px]"></div>
      {currentPage == 1 ? (
        <Home />
      ) : currentPage == 2 ? (
        <Properties />
      ) : currentPage == 3 ? (
        <Settings />
      ) : currentPage == 4 ? (
        <Support />
      ) : (
        <Home />
      )}
    </div>
  );
}

export default Dashboard;
