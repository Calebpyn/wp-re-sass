import {
  useContext,
} from "react";
import NavBar from "../common/NavBar";
import { PageContext } from "../../App";
import Home from "../dashboard/Home";
import Properties from "../dashboard/Properties";
import Settings from "../dashboard/Settings";
import Support from "../dashboard/Support";

// Define the context's type

function Dashboard() {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("Dashboard must be used within a PageContext.Provider");
  }

  const { currentPage } = context;

  return (
    <div className="w-full max-w-screen-2xl h-screen flex flex-col justify-start items-center">
      <NavBar />
      <div className="h-[100px]"></div>
      {currentPage === 1 && <Home />}
      {currentPage === 2 && <Properties />}
      {currentPage === 3 && <Settings />}
      {currentPage === 4 && <Support />}
    </div>
  );
}

export default Dashboard;
