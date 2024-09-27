import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DialogContext } from "../../App";

import axios from "axios";
//Types
import {
  att,
  propertyDisplayType,
  propertyFetchType,
  propertyInfoType,
} from "../../types/PropertyInfoType";
import React from "react";
import { addPropertyDialog } from "../../types/AddPropertyDialogType";
import CarouselDialog from "./CarouselDialog";
import { CiImageOff } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import AddressToCoords from "./AddressToCoords";
import { coordsType } from "../../types/AddressToCoordsTypes";

type image = {
  isClicked: boolean;
  url: string;
};

const AddPropertyDialog: React.FC<addPropertyDialog> = ({
  getAllProperties,
  editProperty,
}) => {
  const [propertyInfo, setPropertyInfo] = useState<propertyInfoType>({
    name: "",
    desc: "",
    name_es: "",
    desc_es: "",
    type: "",
    price: "",
    currency: "",
    atts_en: "",
    atts_es: "",
    images: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Access the context value and setter
  const context = useContext(DialogContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { setIsDialogOpen } = context;

  // Handeling image grid

  // coords state
  const [coords, setCoords] = useState<coordsType | null>(null);

  //image display state
  const [singleDisplay, setSingleDisplay] = useState<boolean>(false);

  //Selected image for display
  const [selectedImage, setSelectedImage] = useState<string>("");

  //Selecting state
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  //Selected Images
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [gridImages, setGridImages] = useState<image[]>([]);

  const handleImages = async () => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/all_bucket_images`)
      .catch((err) => {
        console.log(err, "Axios error");
      });
    if (response) {
      setGridImages(response.data);
    } else {
      alert("Something went wrong, contact support...");
    }
    setIsLoading(false);
    setIsSelecting(false);
    setSelectedFiles(null);
  };

  // Handle image click
  const handleImageClick = (idx: number) => {
    setGridImages((prevImages) =>
      prevImages!.map((img, i) =>
        i === idx ? { ...img, isClicked: !img.isClicked } : img
      )
    );
  };

  const handleAlreadySelected = (images: string[]) => {
    // First, reset all objects' isClicked to false
    const resetImages = gridImages!.map((img) => ({
      ...img,
      isClicked: false,
    }));

    // Then, set isClicked to true for the selected images
    const updatedImages = resetImages.map((img) => {
      const isSelected = images.some((selectedImg) => selectedImg === img.url);
      return isSelected ? { ...img, isClicked: true } : img;
    });

    setGridImages(updatedImages);
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
      handleImages(); // Refresh the image list after upload
      handleAlreadySelected(selectedProperty.images);
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    setIsLoading(false);
  };

  // Handeling image grid

  const typeOptions = [
    { id: 1, value: "For Sale" },
    { id: 2, value: "For Rent" },
    { id: 3, value: "AirBnB" },
  ];

  const currencyOptions = [
    { id: 1, value: "USD" },
    { id: 2, value: "MX" },
  ];

  const handleType = (event: SelectChangeEvent) => {
    setPropertyInfo({
      ...propertyInfo,
      type: event.target.value as string,
    });
  };

  const handleCurrency = (event: SelectChangeEvent) => {
    setPropertyInfo({
      ...propertyInfo,
      currency: event.target.value as string,
    });
  };

  //Property List and selection
  const [selectedProperty, setSelectedProperty] = useState<propertyDisplayType>(
    {
      id: "",
      name: "",
      desc: "",
      name_es: "",
      desc_es: "",
      type: "",
      price: "",
      currency: "",
      atts_en: "",
      atts_es: "",
      images: [],
    }
  );

  const [allProperties, setAllProperties] = useState<propertyFetchType[]>([]);

  const getAllPropertiesInnerCall = async () => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/all_properties`)
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
        setIsLoading(false);
      });
    if (response) {
      setAllProperties(response.data);
      setIsLoading(false);
    }
  };

  //Update property function
  const updateProperty = async () => {
    setIsLoading(true);

    const tempImageSelection: string[] = gridImages
      .filter((image: image) => image.isClicked) // Filter images where isClicked is true
      .map((image: image) => image.url); // Map the filtered images to their URLs

    let atts_es = propertyInfo.atts_es.split(",");
    let atts_en = propertyInfo.atts_en.split(",");
    if (atts_en.length != atts_es.length) {
      alert("Number of attributes should have the same lenght");
      setIsLoading(false);
      return;
    }

    const temporalAtts: att[] = [];

    for (let i = 0; i < atts_es.length; i++) {
      let tempAtt: att = {
        es: atts_es[i],
        en: atts_en[i],
      };
      temporalAtts.push(tempAtt);
    }

    const tempBody = {
      name: propertyInfo.name,
      desc: propertyInfo.desc,
      name_es: propertyInfo.name_es,
      desc_es: propertyInfo.desc_es,
      type: propertyInfo.type,
      price: propertyInfo.price,
      currency: propertyInfo.currency,
      atts: temporalAtts,
      images: tempImageSelection,
      lat: coords?.lat,
      lng: coords?.lng,
    };

    const response = await axios
      .put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/update_property/${
          selectedProperty.id
        }`,
        tempBody
      )
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
      });
    if (response) {
      getAllProperties();
      setIsLoading(false);
      setIsDialogOpen(false);
    } else {
      alert("Something went wrong");
      setIsLoading(false);
    }
  };

  //POST FUNCTION
  const handlePost = async () => {
    setIsLoading(true);

    const tempImageSelection: string[] = gridImages
      .filter((image: image) => image.isClicked) // Filter images where isClicked is true
      .map((image: image) => image.url); // Map the filtered images to their URLs

    let atts_es = propertyInfo.atts_es.split(",");
    let atts_en = propertyInfo.atts_en.split(",");
    if (atts_en.length != atts_es.length) {
      alert("Number of attributes should have the same lenght");
      setIsLoading(false);
      return;
    }

    const temporalAtts: att[] = [];

    for (let i = 0; i < atts_es.length; i++) {
      let tempAtt: att = {
        es: atts_es[i],
        en: atts_en[i],
      };
      temporalAtts.push(tempAtt);
    }

    const tempBody = {
      name: propertyInfo.name,
      desc: propertyInfo.desc,
      name_es: propertyInfo.name_es,
      desc_es: propertyInfo.desc_es,
      type: propertyInfo.type,
      price: propertyInfo.price,
      currency: propertyInfo.currency,
      atts: temporalAtts,
      images: tempImageSelection,
      lat: coords?.lat,
      lng: coords?.lng,
    };

    const response = await axios
      .post(`${import.meta.env.VITE_REACT_APP_API_URL}/new_property`, tempBody)
      .catch((err) => {
        console.log(err, "axios error");
        alert("Something went wrong...");
      });
    if (response) {
      getAllProperties();
      setIsLoading(false);
      setIsDialogOpen(false);
    } else {
      setIsLoading(false);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (editProperty) {
      getAllPropertiesInnerCall();
    }
    handleImages();
  }, []);

  const getAtts = (atts: att[], code: string) => {
    if (code == "es") {
      return atts.map((att) => att.es).join(",");
    } else if (code == "en") {
      return atts.map((att) => att.en).join(",");
    }
  };

  const handleIdSelection = (id: string) => {
    for (let i = 0; i < allProperties.length; i++) {
      if (allProperties[i].id == id) {
        setSelectedProperty({
          id: allProperties[i].id,
          name_es: allProperties[i].name_es ?? "",
          name: allProperties[i].name ?? "",
          desc: allProperties[i].desc ?? "",
          desc_es: allProperties[i].desc_es ?? "",
          type: allProperties[i].type,
          price: allProperties[i].price,
          currency: allProperties[i].currency,
          atts_en: getAtts(allProperties[i].atts, "en")! ?? "",
          atts_es: getAtts(allProperties[i].atts, "es")! ?? "",
          images: allProperties[i].images,
        });
        setPropertyInfo({
          name_es: allProperties[i].name_es ?? "",
          name: allProperties[i].name ?? "",
          desc: allProperties[i].desc ?? "",
          desc_es: allProperties[i].desc_es ?? "",
          type: allProperties[i].type,
          price: allProperties[i].price,
          currency: allProperties[i].currency,
          atts_en: getAtts(allProperties[i].atts, "en")! ?? "",
          atts_es: getAtts(allProperties[i].atts, "es")! ?? "",
          images: allProperties[i].images,
        });
        setCoords({
          lat: allProperties[i].lat ?? "",
          lng: allProperties[i].lng ?? "",
        });
        handleAlreadySelected(allProperties[i].images);
        return;
      }
    }
  };

  const [imagesDialog, setImagesDialog] = useState<boolean>(false);

  const close = () => {
    setImagesDialog(false);
  };

  return (
    <div className="w-full h-screen shadow-2xl absolute z-[99] flex justify-center items-center">
      {imagesDialog ? (
        <CarouselDialog close={close} imgArray={selectedProperty.images} />
      ) : null}
      <div className="bg-white shadow-xl rounded-sm max-h-[670px] pt-5">
        <div className="overflow-y-auto h-[580px] pt-5 px-10">
          {editProperty ? (
            <div className="w-full mb-2">
              <FormControl>
                <InputLabel id="property_id_label">Id</InputLabel>
                <Select
                  required
                  id="property_id"
                  labelId="property_id_label"
                  label="Id"
                  onChange={(e) => handleIdSelection(e.target.value)}
                  style={{ width: "200px" }}
                  value={selectedProperty.id || ""}
                >
                  {allProperties.map((item: propertyFetchType) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.id} - {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <TextField
              required
              id="name"
              label="Name (English)"
              variant="outlined"
              style={{ width: "200px" }}
              onChange={(e) => {
                setPropertyInfo({
                  ...propertyInfo,
                  [e.target.id]: e.target.value,
                });
              }}
              value={propertyInfo.name}
            />
            <TextField
              required
              id="name_es"
              label="Name (Español)"
              variant="outlined"
              style={{ width: "200px" }}
              onChange={(e) => {
                setPropertyInfo({
                  ...propertyInfo,
                  [e.target.id]: e.target.value,
                });
              }}
              value={propertyInfo.name_es}
            />
            <FormControl>
              <InputLabel id="property_type_label">Type</InputLabel>
              <Select
                required
                id="property_type"
                labelId="property_type_label"
                label="Type"
                onChange={handleType}
                style={{ width: "120px" }}
                value={propertyInfo.type || ""}
              >
                {typeOptions.map((item) => (
                  <MenuItem value={item.value} key={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="mt-2 gap-2 flex flex-row w-full">
              <TextField
                required
                id="desc"
                label="Description (English)"
                multiline
                rows={4}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setPropertyInfo({
                    ...propertyInfo,
                    [e.target.id]: e.target.value,
                  });
                }}
                value={propertyInfo.desc}
              />

              <TextField
                required
                id="desc_es"
                label="Description (Español)"
                multiline
                rows={4}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setPropertyInfo({
                    ...propertyInfo,
                    [e.target.id]: e.target.value,
                  });
                }}
                value={propertyInfo.desc_es}
              />
            </div>
            <div>
              <span className="text-zinc-500 font-light text-sm">
                Attributes should be separated by a comma.
              </span>
            </div>
            <div className="mt-2 gap-2 flex flex-row w-full">
              <TextField
                required
                id="atts_en"
                label="Attributes (English)"
                multiline
                rows={4}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setPropertyInfo({
                    ...propertyInfo,
                    [e.target.id]: e.target.value,
                  });
                }}
                value={propertyInfo.atts_en}
              />
              <TextField
                required
                id="atts_es"
                label="Attributes (Español)"
                multiline
                rows={4}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setPropertyInfo({
                    ...propertyInfo,
                    [e.target.id]: e.target.value,
                  });
                }}
                value={propertyInfo.atts_es}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full mt-2">
            <TextField
              required
              id="price"
              label="Price"
              variant="outlined"
              type="number"
              style={{ width: "200px" }}
              onChange={(e) => {
                setPropertyInfo({
                  ...propertyInfo,
                  [e.target.id]: e.target.value,
                });
              }}
              value={propertyInfo.price}
            />
            <FormControl>
              <InputLabel id="currency_label">Currency</InputLabel>
              <Select
                required
                id="currency"
                labelId="currency_label"
                label="Currency"
                onChange={handleCurrency}
                style={{ width: "120px" }}
                value={propertyInfo.currency || ""}
              >
                {currencyOptions.map((item) => (
                  <MenuItem value={item.value} key={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="my-2 flex flex-col">
            {isLoading ? (
              <CircularProgress />
            ) : (
              <div className="border-[1px] border-zinc-200 w-[700px] rounded-md flex justify-center items-center h-[400px]">
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
                    {gridImages!.length == 0 ? (
                      <div className="flex flex-col justify-center items-center w-full h-full">
                        <span>
                          <CiImageOff className="text-7xl text-zinc-500" />
                        </span>
                        <span>Upload images</span>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-start items-center h-full w-full p-3 pb-14">
                        <div className="grid grid-cols-6 gap-3 overflow-y-scroll">
                          {gridImages!.map((image: image, idx) => (
                            <div
                              key={idx}
                              className={`relative w-[105px] h-[105px] bg-zinc-400 bg-cover cursor-pointer bg-center tr ${
                                isSelecting
                                  ? "hover:scale-90"
                                  : "hover:scale-105"
                              } ${
                                isSelecting && image.isClicked ? "scale-90" : ""
                              }`}
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
                                  isSelecting && image.isClicked
                                    ? "opacity-50"
                                    : ""
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
            )}
          </div>
          <div>
            <AddressToCoords coords={coords} setCoords={setCoords} />
          </div>
        </div>
        <div className="h-[70px] px-10">
          <div className="mt-2 flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="contained"
                onClick={() => {
                  if (editProperty) {
                    updateProperty();
                  } else {
                    handlePost();
                  }
                }}
              >
                {isLoading ? <CircularProgress color="inherit" /> : "Save"}
              </Button>
              <Button variant="outlined" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
            {editProperty ? (
              <Button onClick={() => setImagesDialog(!imagesDialog)}>
                Images
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyDialog;
