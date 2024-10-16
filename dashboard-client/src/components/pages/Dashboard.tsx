//Hooks
import { useContext } from "react";

//Context
import { PageContext } from "../../App";

//Components
import NavBar from "../common/NavBar";
import Home from "../dashboard/Home";
import Properties from "../dashboard/Properties";
import Settings from "../dashboard/Settings";
import Support from "../dashboard/Support";
import InfoBar from "../common/InfoBar";
import UploadFiles from "../dashboard/UploadFiles";
import ImagesPage from "../dashboard/ImagesPage";

function Dashboard() {
  //Context
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("Dashboard must be used within a PageContext.Provider");
  }

  const { currentPage } = context;

  return (
    <div className="w-full pl-[200px] h-screen">
      <NavBar />
      <div className="w-full h-full flex flex-col justify-start relative pt-[100px]">
        <InfoBar />
        {currentPage == undefined || currentPage == 1 ? <Home /> : null}
        {currentPage === 2 ? <Properties /> : null}
        {currentPage === 3 ? <Settings /> : null}
        {currentPage === 4 ? <Support /> : null}
        {currentPage === 5 ? <ImagesPage /> : null}
        {currentPage === 6 ? <UploadFiles isNewProperty={false} /> : null}
      </div>
    </div>
  );
}

export default Dashboard;
