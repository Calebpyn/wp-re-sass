import GridImageDisplay from "../common/GridImageDisplay";
import LastProperties from "../common/LastProperties";

function Home() {
  return (
    <div className="relative p-5 h-full w-full">
      <div className="flex justify-around items-center w-full h-full">
        <LastProperties />

        <GridImageDisplay height="500" />
      </div>
    </div>
  );
}

export default Home;
