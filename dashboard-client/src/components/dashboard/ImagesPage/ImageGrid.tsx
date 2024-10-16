//Hooks
import React, { useContext, useEffect, useRef, useState } from "react";

//Axios
import axios from "axios";

//Components
import {
  Alert,
  Button,
  CircularProgress,
  circularProgressClasses,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

//Icons
import { IoMdClose } from "react-icons/io";
import { GrCheckboxSelected } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";
import { FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import { MdHideImage } from "react-icons/md";

//Context
import { PageContext } from "../../../App";

//Types
import { propertyFetchType } from "../../../types/PropertyInfoType";

//Fetching types
export type ImageData = {
  id: number;
  created_at: string;
  org_id: string;
  image_url: string;
  storage_id: string;
  image_location: string;
};

export type ImageWithClientData = ImageData & {
  isClicked: boolean;
};

//Component props type
type ImageGridType = {
  newPropertyInfo?: propertyFetchType;
  setNewPropertyInfo?: React.Dispatch<React.SetStateAction<propertyFetchType>>;
  isNewProperty: boolean;
};

const ImageGrid: React.FC<ImageGridType> = ({
  newPropertyInfo,
  setNewPropertyInfo,
  isNewProperty,
}) => {
  // Access the context value and setter
  const context = useContext(PageContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { currentPage, setCurrentPage } = context;

  //States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [images, setImages] = useState<ImageWithClientData[]>([]);
  const [folder, setFolder] = useState<string>("root");
  const [foldersList, setFoldersList] = useState<string[]>([]);
  const [isImagesLoading, setIsImagesloading] = useState<boolean>(false);
  const [singleDisplay, setSingleDisplay] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  //Handle click outside of the image display
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSingleDisplay(false); // Close the modal
      }
    };

    // Attach the listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setSingleDisplay]);

  //Get all images
  const handleAllImages = async () => {
    try {
      const response = await axios
        .get(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/get_images/testhash/${folder}`
        )
        .catch((err) => {
          console.log(err, "Axios error");
        });
      if (response) {
        setImages(
          response.data.map((item: any) => ({
            ...item,
            isClicked: false,
          }))
        );
      } else {
        handleSnackbar("Failed to fetch data", "error");
      }
    } catch (err) {
      handleSnackbar("Failed to fetch data", "error");
    }
  };

  //Bring all folders
  const handleFolders = async () => {
    setIsLoading(true);
    try {
      const response = await axios
        .get(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/get_image_locations/testhash`
        )
        .catch((err) => {
          console.log(err, "Axios error");
        });
      if (response) {
        setFoldersList(response.data);
        if (response.data.includes(folder)!) {
          setFolder("root");
        }
      } else {
        handleSnackbar("Failed to fetch data", "error");
      }
    } catch (err) {
      handleSnackbar("Failed to fetch data", "error");
    }
    setIsLoading(false);
  };

  // Handle deleting images
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      let imagesToDeleteClicked: ImageWithClientData[] = images.filter(
        (item) => item.isClicked === true
      );

      // Wait for all delete requests to finish before proceeding
      await Promise.all(
        imagesToDeleteClicked.map(async (item) => {
          return axios.delete(
            `${import.meta.env.VITE_REACT_APP_API_URL}/delete_image/testhash`,
            { data: item }
          );
        })
      );

      // After deletions, reload images and folders
      await handleAllImages();
      await handleFolders();

      handleSnackbar("Selection deleted successfully", "success");
      setIsSelecting(false);
    } catch (err) {
      handleSnackbar("Failed to delete data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image click
  const handleImageClick = (idx: number) => {
    setImages((prevImages) =>
      prevImages.map((img, i) =>
        i === idx ? { ...img, isClicked: !img.isClicked } : img
      )
    );
  };

  //Set new property info on images chnage
  useEffect(() => {
    if (isNewProperty) {
      setNewPropertyInfo!({
        ...newPropertyInfo!,
        imgs: images.map((item) => item.image_url),
      });
    }
  }, [images]);

  //Init component
  useEffect(() => {
    setIsLoading(true);
    handleAllImages();
    handleFolders();
    setIsLoading(false);
  }, [currentPage]);

  //Call handle all images on folder change
  useEffect(() => {
    setIsImagesloading(true);
    handleAllImages();
    setIsImagesloading(false);
  }, [folder]);

  //SNACKBAR
  const [snackbarMessage, setSnackBarMessage] = useState<any>(
    "Oops! Something went wrong..."
  );

  const [snackbarStatus, setSnackbarStatus] = useState<any>("error");

  const [open, setOpen] = useState(false);

  const handleSnackbar = (message: string, type: string) => {
    setSnackBarMessage(message);
    setSnackbarStatus(type);
    setOpen(true);
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <IoMdClose />
      </IconButton>
    </React.Fragment>
  );

  return isLoading ? (
    <div className="flex w-full h-full justify-center items-center">
      <CircularProgress />
    </div>
  ) : (
    <div className="w-full h-full flex justify-start items-start flex-col font-light relative">
      <div className="w-full flex flex-col justify-start items-start">
        <span>My Images</span>
        <span className="w-full flex justify-between p-5">
          <span className="px-5 bg-zinc-200 tr h-[45px] flex justify-center items-center cursor-pointer">
            <select
              className="w-[120px] bg-transparent focus:outline-none"
              onChange={(e) => {
                setFolder(e.target.value);
              }}
            >
              <option>root</option>
              {foldersList.map((item, idx) =>
                item == "root" ? null : <option key={idx}>{item}</option>
              )}
            </select>
          </span>

          {isSelecting ? (
            <span className="flex gap-5 items-center">
              {!isNewProperty ? (
                <button
                  className="px-5 py-2 bg-red-600 text-white hover:bg-red-500 tr h-[45px] font-light flex gap-5 items-center"
                  onClick={() => handleDelete()}
                >
                  <span>Delete</span>
                  <FaTrashAlt />
                </button>
              ) : null}
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
      </div>
      <div className="w-full h-[80%] flex p-5 pt-0">
        <div className="flex flex-col justify-start items-start h-full w-full border-[1px] border-black">
          {isImagesLoading ? (
            <CircularProgress />
          ) : images.length == 0 ? (
            <span className="w-full h-full flex justify-center items-center">
              <span className="flex flex-col justify-center items-center gap-3 font-light">
                <span className="">This folder is empty</span>
                <span className="text-3xl text-zinc-400">
                  <MdHideImage />
                </span>
                <span>
                  <button
                    className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr h-[45px]"
                    onClick={() => setCurrentPage(6)}
                  >
                    Add Files
                  </button>
                </span>
              </span>
            </span>
          ) : (
            <div
              className="w-full overflow-y-auto grid p-3 gap-2"
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
                      setSelectedImage(image.image_url);
                      setSingleDisplay(true);
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Set position to bottom-right
      >
        <Alert
          onClose={handleClose}
          severity={snackbarStatus}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {singleDisplay ? (
        <div className="absolute w-full h-full z-[999] flex justify-center items-center">
          <div
            className="flex flex-col items-center bg-white p-5 rounded-sm gap-2 shadow-2xl"
            ref={modalRef}
          >
            <span className="w-full flex justify-between items-center">
              <FaExternalLinkAlt
                className="text-base hover:text-main-blue tr cursor-pointer"
                onClick={() => {
                  window.open(selectedImage, "_blank");
                }}
              />
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
    </div>
  );
};

export default ImageGrid;
