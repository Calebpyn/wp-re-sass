import GridImageDisplay from "../common/GridImageDisplay";


function Home() {

  const dummy = (_images: Array<string>) => {
    console.log("No need for a setImagesParent function from home...")
  }

  return <div className="relative p-5">

    <GridImageDisplay height="500"/>

  </div>;
}

export default Home;
