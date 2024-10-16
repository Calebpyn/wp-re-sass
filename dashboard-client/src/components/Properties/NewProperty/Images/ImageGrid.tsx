import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

//Icons
import { CiImageOff } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { GrCheckboxSelected } from "react-icons/gr";

//Types
import { propertyFetchType } from "../../../../types/PropertyInfoType";

//Image Type
export type image = {
  isClicked: boolean;
  url: string;
};

type ImageGridType = {
  height: string;
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const ImageGrid: React.FC<ImageGridType> = ({
  height,
  setNewPropertyInfo,
  newPropertyInfo,
}) => {
  //Images state
  const [images, setImages] = useState<image[]>([]);

  //loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //image display state
  const [singleDisplay, setSingleDisplay] = useState<boolean>(false);

  //Selected image for display
  const [selectedImage, setSelectedImage] = useState<string>("");

  //Selecting state
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  //Selected Images
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  //Refs
  const hiddenInput = useRef<HTMLInputElement>(null);

  //Handle Hidden input click
  const handleClickInput = () => {
    hiddenInput.current!.click();
  };

  //Get all images for display
  const handleAllImages = async () => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/all_bucket_images`)
      .catch((err) => {
        console.log(err, "Axios error");
      });
    if (response) {
      const dummy = response.data.map((item: image) => {
        if (newPropertyInfo.imgs.includes(item.url)) {
          return { ...item, isClicked: true };
        }
        return item;
      });
      setImages(dummy);
    } else {
      alert("Something went wrong, contact support...");
    }
    setIsLoading(false);
    if (newPropertyInfo.imgs.length > 0) {
      setIsSelecting(true);
    } else {
      setIsSelecting(false);
    }
    setSelectedFiles(null);
  };

  // Handle image click
  const handleImageClick = (idx: number) => {
    setImages((prevImages) =>
      prevImages.map((img, i) =>
        i === idx ? { ...img, isClicked: !img.isClicked } : img
      )
    );
  };

  useEffect(() => {
    setNewPropertyInfo({
      ...newPropertyInfo,
      imgs: images.filter((item) => item.isClicked).map((item) => item.url),
    });
  }, [images]);

  // Upload selected images
  const handleUploadImages = async () => {
    setIsLoading(true);
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    // Function to generate a unique filename
    const generateUniqueFilename = () => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15); // Generate a random string
      return `${timestamp}_${randomString}_asset`;
    };

    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      const formData = new FormData();
      const uniqueFilename = generateUniqueFilename();

      formData.append("file", file, uniqueFilename); // Append file with unique name

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/upload_image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set correct content type
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error uploading file:", error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log("Upload successful:", results);
      handleAllImages(); // Refresh the image list after upload
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    setIsLoading(false);
  };

  //Init
  useEffect(() => {
    handleAllImages();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-5">
      <div className="flex justify-start items-center gap-5">
        <input
          type="file"
          multiple
          onChange={(e) => setSelectedFiles(e.target.files)}
          id="upload-input"
          className="hidden"
          ref={hiddenInput}
        />
        <label htmlFor="upload-input">
          <button
            className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 transition-all font-light"
            onClick={() => handleClickInput()}
          >
            Upload Images
          </button>
        </label>
        {selectedFiles && (
          <button
            onClick={handleUploadImages}
            className="px-5 py-2 bg-main-blue text-white hover:bg-blue-700 transition-all flex justify-center items-center relative font-light"
          >
            <span className="absolute self-center items-center pt-1">
              {isLoading ? (
                <CircularProgress color="inherit" size="19px" />
              ) : null}
            </span>
            <span style={{ color: `${isLoading ? "transparent" : "white"}` }}>
              Upload Selected {`(${selectedFiles.length})`}
            </span>
          </button>
        )}
      </div>
      <div
        className="border-[1px] border-zinc-200 w-[80%] flex justify-center items-center"
        style={{ height: `${height}px` }}
      >
        {singleDisplay ? (
          <div className="absolute w-screen h-full z-[999] flex justify-center items-center">
            <div className="flex flex-col items-center bg-white p-5 rounded-sm gap-2 shadow-2xl">
              <span className="w-full flex justify-end">
                <IoCloseOutline
                  className="text-2xl hover:text-red-400 tr cursor-pointer"
                  onClick={() => setSingleDisplay(false)}
                />
              </span>
              <div>
                <img src={selectedImage} className="max-h-[500px]" />
              </div>
            </div>
          </div>
        ) : null}
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="flex flex-col justify-start items-center w-full h-full">
            <div className="w-full border-b-[1px] border-zinc-200 flex justify-end items-center p-2 gap-3">
              <button
                className={`px-5 py-2 transition-all font-light ${
                  isSelecting
                    ? "bg-zinc-200 hover:bg-zinc-400"
                    : "bg-main-blue text-white hover:bg-blue-700"
                }`}
                onClick={() => {
                  if (isSelecting) {
                    setIsSelecting(false);
                  } else {
                    setIsSelecting(true);
                  }
                }}
              >
                {isSelecting ? "Cancel" : "Select"}
              </button>
            </div>
            {images.length == 0 ? (
              <div className="flex flex-col justify-center items-center w-full h-full select-none">
                <span>
                  <CiImageOff className="text-7xl text-zinc-500" />
                </span>
                <span>Upload images</span>
              </div>
            ) : (
              <div className="flex flex-col justify-start items-start h-full w-full p-3 pb-14">
                <div
                  className="grid w-full overflow-y-auto"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(105px, 1fr))",
                  }}
                >
                  {images!.map((image: image, idx) => (
                    <div
                      key={idx}
                      className={`relative w-[105px] h-[105px] bg-zinc-400 bg-cover cursor-pointer bg-center mb-2 tr ${
                        isSelecting ? "hover:scale-90" : "hover:scale-105"
                      } ${isSelecting && image.isClicked ? "scale-90" : ""}`}
                      style={{ backgroundImage: `url(${image.url})` }}
                      onClick={() => {
                        if (isSelecting) {
                          handleImageClick(idx);
                        } else {
                          setSelectedImage(image.url);
                          setSingleDisplay(true);
                        }
                      }}
                    >
                      <div
                        className={`absolute inset-0 bg-black opacity-0 flex justify-center items-center ${
                          isSelecting && image.isClicked ? "opacity-50" : ""
                        } tr`}
                      >
                        <GrCheckboxSelected className="text-xl text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <span className="font-light text-xs text-zinc-300">
        {/* {`(${images.length})`} Items selected */}
      </span>
    </div>
  );
};

export default ImageGrid;
