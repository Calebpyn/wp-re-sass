//Hooks
import { useContext, useEffect, useRef, useState } from "react";

//Axios
import axios from "axios";
import React from "react";

//Components
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

//Icons
import { IoMdClose } from "react-icons/io";
import { FaFileCirclePlus } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";

//Context
import { PageContext } from "../../App";

//Component Type
type UploadFilesType = {
  isNewProperty: boolean;
  handleReload?: () => void;
};

const UploadFiles: React.FC<UploadFilesType> = ({
  isNewProperty,
  handleReload,
}) => {
  // Access the context value and setter
  const context = useContext(PageContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { setCurrentPage } = context;

  //Refs
  const imageInput = useRef<any>();

  //Adding a new location
  const [addingLocation, setAddingLocation] = useState<boolean>(false);

  //Is Loading
  const [_isFolderLoading, setIsFolderLoading] = useState<boolean>(false);

  const [folders, setFolders] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [newFolder, setNewFolder] = useState<string>("");

  const [selectedFolder, setSelectedFolder] = useState<string>("root");

  //Selected Images
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  //Handle folders fetch
  const handleFolders = async () => {
    setIsFolderLoading(true);
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
        setFolders(response.data);
      } else {
        handleSnackbar("Failed to fetch data", "error");
      }
    } catch (err) {
      handleSnackbar("Failed to fetch data", "error");
    }
    setIsFolderLoading(false);
  };

  // Upload selected images
  const handleUploadImages = async () => {
    setIsLoading(true);

    if (!selectedFiles || selectedFiles.length === 0) {
      handleSnackbar("Select at least 1 file", "eror");
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
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/full_upload_image/${selectedFolder}/testhash`,
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
      handleReload!();
      console.log("Running image reload...");
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    handleSnackbar("Image(s) uploaded successfully", "success");
    setSelectedFiles([]);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFolders();
  }, []);

  //Drag and drop files
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

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
    <div className="w-full h-full flex flex-col p-10 font-light justify-center items-center">
      <CircularProgress />
    </div>
  ) : (
    <div
      className={`w-full h-full flex flex-col font-light justify-between ${
        isNewProperty ? "" : "p-10"
      }`}
    >
      <div className="w-full flex flex-col justify-start items-start gap-5">
        <span>Add new files</span>
        <span className="w-full flex justify-start items-start px-5 flex-col gap-5">
          <span className="flex justify-between items-center w-full">
            <span className="flex gap-5 items-center">
              <button
                className="px-5 py-2 bg-main-blue text-white hover:bg-blue-600 tr h-[45px]"
                onClick={() => {
                  imageInput.current.click();
                }}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="upload-input"
                  ref={imageInput}
                />
                Upload Files
              </button>

              <span className="px-5 bg-zinc-200 tr h-[45px] flex justify-center items-center cursor-pointer">
                <select
                  className="w-[120px] bg-transparent focus:outline-none"
                  onChange={(e) => {
                    setSelectedFolder(e.target.value);
                  }}
                  value={selectedFolder}
                >
                  <option>root</option>
                  {folders.map((item, idx) =>
                    item == "root" ? null : <option key={idx}>{item}</option>
                  )}
                </select>
              </span>

              <button
                className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr h-[45px]"
                onClick={() => setAddingLocation(!addingLocation)}
              >
                {addingLocation ? "Cancel" : "Add new folder"}
              </button>
            </span>

            <span>
              {selectedFiles.length > 0 ? (
                <span className="w-full flex justify-start items-start">
                  <button
                    className="px-5 py-2 bg-main-blue text-white hover:bg-blue-600 tr font-light h-[45px]"
                    onClick={() => handleUploadImages()}
                  >
                    {`Upload (${selectedFiles.length}) images`}
                  </button>
                </span>
              ) : null}
            </span>
          </span>
          <span className="flex items-start justify-start gap-5">
            {addingLocation ? (
              <input
                className="px-5 py-2 bg-white border-[1px] border-black focus:outline-none tr h-[45px]"
                onChange={(e) => setNewFolder(e.target.value)}
              />
            ) : null}
            {addingLocation ? (
              <button
                className="px-5 py-2 bg-main-blue text-white hover:bg-blue-600 tr h-[45px]"
                onClick={() => {
                  setFolders([...folders, newFolder]);
                  setSelectedFolder(newFolder);
                  setNewFolder("");
                  setAddingLocation(false);
                }}
              >
                Save
              </button>
            ) : null}
          </span>
          <span className="w-full flex justify-start items-start">
            <div
              className="w-[500px] h-[100px] border-[1px] border-dashed border-black rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={() => {
                imageInput.current.click();
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {selectedFiles.length == 0 ? (
                <span className="flex flex-col gap-2 select-none justify-center items-center text-zinc-500">
                  <span>Drop files here</span>
                  <FaFileCirclePlus />
                </span>
              ) : (
                <span className="flex flex-col gap-2 select-none justify-center items-center text-zinc-500">
                  <span>{`(${selectedFiles.length}) Files selected`}</span>
                  <FaFileCirclePlus />
                </span>
              )}
            </div>
          </span>
          {selectedFiles.length > 0 ? (
            <span className="w-[80%] flex-wrap gap-2 flex max-h-[250px] overflow-y-auto">
              {selectedFiles.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-zinc-100 text-[10px] font-light text-zinc flex justify-center items-center gap-2"
                >
                  <span>{item.name}</span>
                  <span
                    className="cursor-pointer hover:text-red-600 tr hover:scale-110"
                    onClick={() => {
                      const newItems = selectedFiles.filter(
                        (_, i) => i !== idx
                      );
                      setSelectedFiles(newItems);
                    }}
                  >
                    <MdOutlineClose className="text-[12px]" />
                  </span>
                </span>
              ))}
            </span>
          ) : null}
        </span>
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

      {isNewProperty ? null : (
        <div className="w-full flex justify-start items-start">
          <button
            className="px-5 py-2 bg-main-blue text-white hover:bg-blue-600 tr h-[45px]"
            onClick={() => setCurrentPage(5)}
          >
            All Files
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
