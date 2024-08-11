//Description: Image carousel, height and width as props, recives an array as image input

//Icons
import { IoIosArrowBack } from "react-icons/io";
import { BsDot } from "react-icons/bs";

//Imports
import { useState } from "react";

export type carouselType = {
    imgArray: Array<string>
    width: string
    height: string
}

const Carousel: React.FC<carouselType> = ({ imgArray, width, height }) => {
  //Carousel position state
  const [carouselPosition, setCarouselPosition] = useState<number>(0);

  //Carousel logic go right
  const goRight = () => {
    if (carouselPosition == parseInt(width) * (imgArray.length - 1)) {
      setCarouselPosition(0);
    } else {
      setCarouselPosition(carouselPosition + parseInt(width));
    }
  };
  //Carousel logic go left
  const goLeft = () => {
    if (carouselPosition == 0) {
      setCarouselPosition(parseInt(width) * (imgArray.length - 1));
    } else {
      setCarouselPosition(carouselPosition - parseInt(width));
    }
  };
  //Carousel logic go to an especific index.
  const gotTo = (idx: number) => {
    setCarouselPosition(parseInt(width)*idx)
  }

  return (
    <div
      className="flex flex-col justify-between items-center"
      style={{ maxWidth: `${width}px`, height: `${parseInt(height) + 30}px` }}
    >
      <div
        className="bg-black overflow-hidden flex"
        style={{ maxWidth: `${width}px`, height: `${height}px` }}
      >
        <div
          className={`flex tr`}
          style={{ maxWidth: `${parseInt(width) * imgArray.length}` , translate: `-${carouselPosition}px`}}
        >
          {imgArray.map((img, idx) => (
            <div
              key={idx}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url(${img})`,
              }}
              className="bg-cover bg-center"
            >
              <div className="w-full h-full flex justify-between items-center text-white text-4xl">
                <IoIosArrowBack
                  className="cursor-pointer hover:scale-110 tr"
                  onClick={() => goLeft()}
                />
                <IoIosArrowBack
                  className="rotate-180 cursor-pointer hover:scale-110 tr"
                  onClick={() => goRight()}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-[30px] flex justify-center items-center">
        {imgArray.map((_, idx) => (
          <BsDot
            key={idx}
            className={
              carouselPosition / parseInt(width) == idx
                ? "text-xl tr text-black cursor-pointer"
                : "tr text-zinc-400 cursor-pointer hover:scale-150"
            }
            onClick={() => gotTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
