import React from "react";
import axios from "axios";

function DisplayImages() {
  //Get all images Function
  const getImagesbyId = async (id: string) => {
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/all_images/${id}`)
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
      });
    if (response) {
    }
  };
  return (
    <div className="w-full h-full bg-black bg-opacity-25 absolute z-[99] flex justify-center items-center">
        <div>
            
        </div>
    </div>
);
}

export default DisplayImages;
