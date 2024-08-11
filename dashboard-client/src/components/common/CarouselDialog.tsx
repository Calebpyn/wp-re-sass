import React from "react";
import Carousel from "./Carousel";
import { IoClose } from "react-icons/io5";

export type carouselDialogType = {
  imgArray: Array<string>;
  close: () => void;
};

const CarouselDialog: React.FC<carouselDialogType> = ({ imgArray, close }) => {
  return (
    <div className="w-full h-full bg-black bg-opacity-25 absolute z-[99] flex justify-center items-center flex-col">
      <div className="bg-white shadow-xl p-10 rounded-sm">
        <div className="w-full flex justify-end items-center pb-5">
          <span>
            <IoClose
              className="hover:scale-110 tr text-xl cursor-pointer hover:text-zinc-400 "
              onClick={() => close()}
            />
          </span>
        </div>
        <Carousel height="400" width="400" imgArray={imgArray} />
      </div>
    </div>
  );
};

export default CarouselDialog;
