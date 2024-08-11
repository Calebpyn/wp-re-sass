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
import { supabase } from "../../db/supabase";
import CarouselDialog from "./CarouselDialog";

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

  const typeOptions = [
    { id: 1, value: "For Sale" },
    { id: 2, value: "For Rent" },
    { id: 3, value: "AirBnB" },
  ];

  const currencyOptions = [
    { id: 1, value: "US" },
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

    const tempPaths: string[] = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        const { data, error } = await supabase.storage
          .from("property_images")
          .upload(`public/image${generateRandomKey(10)}`, images[i]);

        if (error) {
          console.error("Error uploading image:", error.message);
        } else if (data) {
          const response1 = supabase.storage
            .from("property_images")
            .getPublicUrl(data.path);
          tempPaths.push(response1!.data.publicUrl);
        }
      }
    }

    for (let i = 0; i < propertyInfo.images.length; i++) {
      const { data, error } = await supabase.storage
        .from("property_images")
        .remove([propertyInfo.images[i]]);

      if (error) {
        console.error("Error uploading image:", error.message);
      } else if (data) {
        console.log(data)
      }
    }

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
      images: tempPaths,
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

  const [images, setImages] = useState<any>([]);

  //POST FUNCTION
  const handlePost = async () => {
    setIsLoading(true);
    const tempPaths: string[] = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        const { data, error } = await supabase.storage
          .from("property_images")
          .upload(`public/image${generateRandomKey(10)}`, images[i]);

        if (error) {
          console.error("Error uploading image:", error.message);
        } else if (data) {
          const response1 = supabase.storage
            .from("property_images")
            .getPublicUrl(data.path);
          tempPaths.push(response1!.data.publicUrl);
        }
      }
    }

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
      images: tempPaths,
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
          name_es: allProperties[i].name_es,
          name: allProperties[i].name,
          desc: allProperties[i].desc,
          desc_es: allProperties[i].desc_es,
          type: allProperties[i].type,
          price: allProperties[i].price,
          currency: allProperties[i].currency,
          atts_en: getAtts(allProperties[i].atts, "en")!,
          atts_es: getAtts(allProperties[i].atts, "es")!,
          images: allProperties[i].images,
        });
        setPropertyInfo({
          name_es: allProperties[i].name_es,
          name: allProperties[i].name,
          desc: allProperties[i].desc,
          desc_es: allProperties[i].desc_es,
          type: allProperties[i].type,
          price: allProperties[i].price,
          currency: allProperties[i].currency,
          atts_en: getAtts(allProperties[i].atts, "en")!,
          atts_es: getAtts(allProperties[i].atts, "es")!,
          images: allProperties[i].images,
        });
        return;
      }
    }
  };

  function generateRandomKey(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const [imagesDialog, setImagesDialog] = useState<boolean>(false);

  const close = () => {
    setImagesDialog(false);
  };

  return (
    <div className="w-full h-full bg-black bg-opacity-25 absolute z-[99] flex justify-center items-center">
      {imagesDialog ? (
        <CarouselDialog close={close} imgArray={selectedProperty.images} />
      ) : null}
      <div className="bg-white shadow-xl p-10 rounded-sm">
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
        <div className="my-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
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
          <Button onClick={() => setImagesDialog(!imagesDialog)}>Images</Button>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyDialog;
