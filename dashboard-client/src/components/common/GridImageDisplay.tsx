import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, {  useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { CiImageOff } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";


//Image Type
type image = {
  isClicked: boolean;
  url: string;
};

type GridImageDisplayType = {
  height: string;
};

const GridImageDisplay: React.FC<GridImageDisplayType> = ({
  height,
}) => {
  //Images state
  const [images, setImages] = useState<image[]>([]);

  //loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Dialog state
  const [isDialog, setIsDialog] = useState<boolean>(false);

  //image display state
  const [singleDisplay, setSingleDisplay] = useState<boolean>(false);

  //Selected image for display
  const [selectedImage, setSelectedImage] = useState<string>("");

  //Selecting state
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  //Selected Images
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  //Get all images for display
  const handleAllImages = async () => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/all_bucket_images`)
      .catch((err) => {
        console.log(err, "Axios error");
      });
    if (response) {
      setImages(response.data)
    } else {
      alert("Something went wrong, contact support...");
    }
    setIsLoading(false);
    setIsSelecting(false);
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

  // Handle Delete Selection
  const handleDeleteSelection = async () => {
    const selectedImages = images.filter((img) => img.isClicked);
    const filenames = selectedImages.map((img) => img.url.split("/").pop());

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/delete_images`,
        {
          filenames,
        }
      );
      setImages(images.filter((img) => !img.isClicked)); // Remove deleted images from the UI
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

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
    <div
      className="border-[1px] border-zinc-200 w-[700px] rounded-md flex justify-center items-center"
      style={{ height: `${height}px` }}
    >
      {isDialog ? (
        <div className="absolute w-screen h-full z-[999] flex justify-center items-center">
          <div className="flex flex-col items-center bg-white p-5 rounded-sm gap-2 shadow-2xl">
            <span className="text-center text-sm text-zinc-700 select-none">
              This action cannot be undone.
            </span>
            <div className="flex gap-4">
              <Button variant="contained" onClick={() => setIsDialog(false)}>
                CANCEL
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleDeleteSelection();
                  handleAllImages();
                  setIsDialog(false);
                }}
              >
                DELETE
              </Button>
            </div>
          </div>
        </div>
      ) : null}
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
          <div className="w-full h-[50px] border-b-[1px] border-zinc-200 flex justify-end items-center px-3 gap-3">
            {isSelecting ? (
              <IoTrashOutline
                className="hover:text-red-500 tr cursor-pointer"
                onClick={() => {
                  setIsDialog(true);
                }}
              />
            ) : null}
            <Button
              onClick={() => {
                if (isSelecting) {
                  setIsSelecting(false);
                } else {
                  setIsSelecting(true);
                }
              }}
              variant={isSelecting ? "contained" : "outlined"}
            >
              {isSelecting ? "CANCEL" : "SELECT"}
            </Button>
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="hidden"
              id="upload-input"
            />
            <label htmlFor="upload-input">
              <Button variant="contained" component="span">
                UPLOAD
              </Button>
            </label>
            {selectedFiles && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUploadImages}
              >
                UPLOAD SELECTED {`(${selectedFiles.length})`}
              </Button>
            )}
          </div>
          {images.length == 0 ? (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <span>
                <CiImageOff className="text-7xl text-zinc-500" />
              </span>
              <span>Upload images</span>
            </div>
          ) : (
            <div className="flex flex-col justify-start items-center h-full w-full p-3">
              <div className="grid grid-cols-6 gap-3">
                {images!.map((image: image, idx) => (
                  <div
                    key={idx}
                    className={`relative w-[105px] h-[105px] bg-zinc-400 bg-cover cursor-pointer bg-center tr ${
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
                      className={`absolute inset-0 bg-black opacity-0 ${
                        isSelecting && image.isClicked ? "opacity-50" : ""
                      } tr`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GridImageDisplay;
