//Components
import UploadFiles from "../../../dashboard/UploadFiles";
import { CircularProgress } from "@mui/material";

//Types
import { propertyFetchType } from "../../../../types/PropertyInfoType";

//Functions
import {
  handleAllFolders,
  handleAllImages,
} from "../../../../functions/Images/APIRequests";

//Hooks
import { useEffect, useState } from "react";

//Icons
import { GrCheckboxSelected } from "react-icons/gr";
import { FaExternalLinkAlt } from "react-icons/fa";

//Types
import { ImageWithClientData } from "../../../dashboard/ImagesPage/ImageGrid";

//Props type
type ImageGridNewPropertyType = {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const ImageGridNewProperty: React.FC<ImageGridNewPropertyType> = ({
  newPropertyInfo,
  setNewPropertyInfo,
}) => {
  //States
  const [images, setImages] = useState<ImageWithClientData[]>([]);
  const [folder, setFolder] = useState<string>("root");
  const [isSelecting, setIsSelecting] = useState<boolean>(true);
  const [folderList, setFolderList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullReload, setIsFullReload] = useState<boolean>(false);

  const handleImagesFunctionCall = async () => {
    const imagesResponse = await handleAllImages(folder);
    if (imagesResponse == "err") {
      console.log("Error manager pending...");
      setIsLoading(false);
      setIsFullReload(false);
    } else {
      setIsFullReload(false);
      setIsLoading(false);
      setImages(
        imagesResponse.map((img: ImageWithClientData) =>
          newPropertyInfo.imgs.includes(img.image_url)
            ? { ...img, isClicked: true }
            : img
        )
      );
    }
  };

  const handleFoldersFunctionCall = async () => {
    const foldersResponse = await handleAllFolders();

    if (foldersResponse == "err") {
      console.log("Error manager pending...");
      setIsLoading(false);
      setIsFullReload(false);
    } else {
      setFolderList(foldersResponse);
      setIsLoading(false);
      setIsFullReload(false);
    }
  };

  //Call both fetch
  const handleFullReload = () => {
    setIsFullReload(true);
    handleImagesFunctionCall();
    handleFoldersFunctionCall();
  };

  // Handle image click
  const handleImageClick = (idx: number) => {
    if (images[idx].isClicked == false) {
      setNewPropertyInfo({
        ...newPropertyInfo,
        imgs: [...newPropertyInfo.imgs, images[idx].image_url],
      });
    } else {
      setNewPropertyInfo({
        ...newPropertyInfo,
        imgs: [
          ...newPropertyInfo.imgs.filter(
            (img) => !(img == images[idx].image_url)
          ),
        ],
      });
    }

    setImages((prevImages) =>
      prevImages.map((img, i) =>
        i === idx ? { ...img, isClicked: !img.isClicked } : img
      )
    );
  };

  //Init component
  useEffect(() => {
    setIsLoading(true);
    handleImagesFunctionCall();
    handleFoldersFunctionCall();
  }, []);

  //Reload images on folder change
  useEffect(() => {
    setIsLoading(true);
    handleImagesFunctionCall();
  }, [folder]);

  return isFullReload ? (
    <div className="w-full flex justify-cenetr items-center h-full flex-col gap-5">
      <CircularProgress />
    </div>
  ) : (
    <div className="w-full flex justify-start items-start flex-col gap-5">
      <UploadFiles isNewProperty={true} handleReload={handleFullReload} />

      <div className="w-full flex flex-col items-start gap-5">
        <span className="">Select Images</span>

        {isLoading ? (
          <div className="w-full h-[200px] flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="w-full px-5 flex flex-col gap-5">
            <span className="w-full flex justify-start gap-5">
              <span className="px-5 bg-zinc-200 tr h-[45px] flex justify-center items-center cursor-pointer">
                <select
                  className="w-[120px] bg-transparent focus:outline-none"
                  onChange={(e) => {
                    setFolder(e.target.value);
                  }}
                  value={folder}
                >
                  <option>root</option>
                  {folderList.map((item, idx) =>
                    item == "root" ? null : <option key={idx}>{item}</option>
                  )}
                </select>
              </span>

              <span>
                {isSelecting ? (
                  <span className="flex gap-5 items-center">
                    <button
                      className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr h-[45px] font-light"
                      onClick={() => setIsSelecting(!isSelecting)}
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    className="px-5 py-2 bg-main-blue text-white hover:bg-blue-600 tr h-[45px]"
                    onClick={() => setIsSelecting(!isSelecting)}
                  >
                    Select
                  </button>
                )}
              </span>
            </span>
            <div
              className="w-full border-[1px] border-black overflow-y-auto grid p-3 gap-2 min-h-[170px]"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))",
              }}
            >
              {images!.map((image: ImageWithClientData, idx) => (
                <div
                  key={idx}
                  className={`relative w-[105px] h-[105px] bg-zinc-400 bg-cover cursor-pointer bg-center mb-2 tr ${
                    isSelecting ? "hover:scale-90" : "hover:scale-105"
                  } ${isSelecting && image.isClicked ? "scale-90" : ""}`}
                  style={{ backgroundImage: `url(${image.image_url})` }}
                  onClick={() => {
                    if (isSelecting) {
                      handleImageClick(idx);
                    } else {
                      window.open(image.image_url, "_blank");
                    }
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-black opacity-0 flex justify-center items-center ${
                      isSelecting && image.isClicked
                        ? "bg-opacity-50 opacity-100"
                        : ""
                    } tr`}
                  >
                    <GrCheckboxSelected className="text-xl text-white" />
                  </div>

                  {!isSelecting ? (
                    <div className="absolute w-full h-full bg-black flex justify-center items-center opacity-0 hover:opacity-30 tr">
                      <FaExternalLinkAlt className="text-xl text-white" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGridNewProperty;
