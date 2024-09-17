import { useContext } from "react";
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
    <div className="w-full max-w-screen-2xl flex flex-col justify-start items-center">
      <NavBar />
      <div className="h-[100px]"></div>
      {currentPage == undefined || currentPage == 1 ? <Home /> : null}
      {currentPage === 2 ? <Properties /> : null}
      {currentPage === 3 ? <Settings /> : null}
      {currentPage === 4 ? <Support /> : null}
    </div>
  );
}

export default Dashboard;
