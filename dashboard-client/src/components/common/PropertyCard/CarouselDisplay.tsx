//Hooks
import React, { useState } from "react";

//Icons
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { RiExternalLinkLine } from "react-icons/ri";

type CarouselDisplayType = {
  imgs: Array<string>;
  width: number;
};

const CarouselDisplay: React.FC<CarouselDisplayType> = ({ imgs, width }) => {
  //Selected image
  const [selectedImage, setSelectedImage] = useState<number>(0);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div
        className="w-full h-[90%] overflow-clip flex rounded-[3px] group relative cursor-pointer"
        onClick={() => {
          window.open(imgs[selectedImage], "_blank");
        }}
      >
        <div className="absolute w-full h-full bg-black z-10 opacity-0 group-hover:opacity-35 tr flex justify-center items-center">
          <RiExternalLinkLine className="text-white text-xl" />
        </div>
        <div
          className="h-full flex tr"
          style={{
            width: `${width * imgs.length}px`,
            translate: `-${100 * selectedImage}%`,
          }}
        >
          {imgs.map((img, idx) => (
            <div
              key={idx}
              style={{ backgroundImage: `url("${img}")` }}
              className="w-full h-full bg-cover flex-shrink-0 bg-center"
            ></div>
          ))}
        </div>
      </div>
      <div className="h-[10%] w-full flex justify-between items-center px-2">
        <span
          className="hover:scale-110 tr text-zinc-500 hover:text-zinc-800 cursor-pointer"
          onClick={() => {
            if (selectedImage == 0) {
              setSelectedImage(imgs.length - 1);
            } else {
              setSelectedImage(selectedImage - 1);
            }
          }}
        >
          <IoIosArrowBack />
        </span>

        <span className="flex items-center gap-2">
          {imgs.map((_, idx) => (
            <div
              className={`h-[5px] w-[5px] bg-zinc-300 rounded-full hover:scale-105 tr hover:bg-zinc-800 cursor-pointer`}
              onClick={() => setSelectedImage(idx)}
              key={idx}
              style={{
                backgroundColor: `${idx == selectedImage ? "#1E1E1E" : ""}`,
              }}
            ></div>
          ))}
        </span>

        <span
          className="hover:scale-110 tr text-zinc-500 hover:text-zinc-800 cursor-pointer max-w-[50%] overflow-x-auto"
          onClick={() => {
            if (selectedImage == imgs.length - 1) {
              setSelectedImage(0);
            } else {
              setSelectedImage(selectedImage + 1);
            }
          }}
        >
          <IoIosArrowForward />
        </span>
      </div>
    </div>
  );
};

export default CarouselDisplay;
