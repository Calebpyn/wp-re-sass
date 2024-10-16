//Hooks
import { useContext, useEffect, useState } from "react";

//Icons
import { FaPlus } from "react-icons/fa6";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

//Components
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { DialogContext } from "../../App";

//Axios
import axios from "axios";

//Types
import PorpertyCard from "../common/PorpertyCard";
import NewProperty from "../Properties/NewProperty";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { propertyFetchType } from "../../types/PropertyInfoType";
import FilterDialog from "./Properties/FilterDialog";

//Properties types
type PropertyResponseType = {
  id: number;
  created_at: string;
  name: string;
  name_es: string;
  desc: string;
  desc_es: string;
  type: string;
  price: number;
  currency: string;
  images: string[];
  lat: string;
  lng: string;
  address: string;
  atts_en: Array<string>;
  atts_es: Array<string>;
};

export type filter = {
  clicked: boolean;
  name: string;
};

function Properties() {
  //States
  const [isLoading, setIsLoading] = useState<boolean>();

  const [newProperty, setNewProperty] = useState<boolean>(false);

  const [allProperties, setAllProperties] = useState<PropertyResponseType[]>(
    []
  );

  const [allPropertiesBU, setAllPropertiesBU] = useState<
    PropertyResponseType[]
  >([]);

  const [editingProperty, setEditingProperty] = useState<boolean>(false);

  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<filter[]>([
    {
      clicked: false,
      name: "For Sale",
    },
    {
      clicked: false,
      name: "For Rent",
    },
    {
      clicked: false,
      name: "AirBnB",
    },
  ]);

  const [search, setSearch] = useState<string>("");

  //Filters
  const handleFilters = () => {
    const filteredProperties = allPropertiesBU.filter((property) => {
      const activeFilters = filters
        .filter((filter) => filter.clicked)
        .map((filter) => filter.name);
      if (activeFilters.length === 0) {
        return true; // No filters selected, show all properties
      }
      return activeFilters.includes(property.type);
    });
    setAllProperties(filteredProperties);
  };

  const handleSearchV2 = () => {
    const searchTerm = search.toLowerCase().replace(/\s+/g, ""); // Clean and lower case the search term

    const filteredProperties = allPropertiesBU.filter((property) => {
      // Check for a match in either name or name_es
      const nameMatch = property.name.toLowerCase().includes(searchTerm);
      const nameEsMatch = property.name_es.toLowerCase().includes(searchTerm);

      return nameMatch || nameEsMatch; // Return true if either name matches the search term
    });

    setAllProperties(filteredProperties); // Set the state with the filtered properties
  };

  //Property Info State
  const [newPropertyInfo, setNewPropertyInfo] = useState<propertyFetchType>({
    id: "",
    name: "",
    name_es: "",
    desc: "",
    desc_es: "",
    type: "",
    price: "",
    currency: "",
    atts_es: [],
    atts_en: [],
    imgs: [],
    lat: null,
    lng: null,
    address: "",
  });

  //Getting all properties
  const getAllProperties = async () => {
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
      setAllPropertiesBU(response.data);
    }
    setIsLoading(false);
  };

  //Erase a property
  const eraseProperty = async (id: string) => {
    setIsLoading(true);

    const response = await axios
      .delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/delete_property_by_id/${id}`
      )
      .catch(() => {
        handleFailure("Cannot delete property.");
      });
    if (response) {
      handleSuccess("Property successfully deleted.");
    }

    setIsLoading(false);
    getAllProperties();
  };

  //Fetch properties
  useEffect(() => {
    getAllProperties();
  }, []);

  useEffect(() => {
    handleFilters();
  }, [filters]);

  useEffect(() => {
    handleSearchV2();
  }, [search]);

  // Access the context value and setter
  const context = useContext(DialogContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  //Success snackbar
  const [open, setOpen] = useState(false);

  const [snackbarMessage, setSnackBarMessage] = useState<any>(
    "Oops! Something went wrong..."
  );

  const [snackbarStatus, setSnackbarStatus] = useState<any>("error");

  const handleClick = () => {
    setOpen(true);
  };

  const handleSuccess = (message: string) => {
    setSnackBarMessage(message);
    setSnackbarStatus("success");
    handleClick();
    getAllProperties();
  };

  const handleFailure = (message: string) => {
    setSnackBarMessage(message);
    setSnackbarStatus("error");
    handleClick();
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

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : !newProperty ? (
        <div className="h-full w-full p-10">
          <div className="w-full">
            <div className="flex justify-between items-center w-full">
              <div>
                <button
                  className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr flex gap-5 items-center"
                  onClick={() => {
                    setNewProperty(true);
                    setNewPropertyInfo({
                      id: "",
                      name: "",
                      name_es: "",
                      desc: "",
                      desc_es: "",
                      type: "",
                      price: "",
                      currency: "",
                      atts_es: [],
                      atts_en: [],
                      imgs: [],
                      lat: null,
                      lng: null,
                      address: "",
                    });
                  }}
                >
                  <span>Add</span>
                  <FaPlus />
                </button>
              </div>
              <div className="flex justify-start items-center gap-5">
                <div className="relative">
                  <button
                    className="text-zinc-500 flex justify-center items-center"
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    {filterOpen ? (
                      <MdFilterAltOff className="hover:scale-105 text-xl tr hover:text-main-blue" />
                    ) : (
                      <MdFilterAlt className="hover:scale-105 text-xl tr hover:text-main-blue" />
                    )}
                  </button>
                  {filterOpen ? (
                    <FilterDialog filters={filters} setFilters={setFilters} />
                  ) : null}
                </div>

                <div className="border-b-[1px] w-[300px]">
                  <input
                    placeholder="Search"
                    className="focus:outline-none p-2 w-full"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
            </div>
            <div className="my-5 pl-3">
              <span className="text-sm text-zinc-500">My Properties</span>
            </div>
          </div>

          <div className="w-full pb-10 flex-wrap flex gap-5">
            {allProperties.map((item, idx) => (
              <PorpertyCard
                setEditingProperty={setEditingProperty}
                setNewProperty={setNewProperty}
                newPropertyInfo={newPropertyInfo}
                setNewPropertyInfo={setNewPropertyInfo}
                deleteById={eraseProperty}
                key={idx}
                id={item.id.toString()}
                name={item.name}
                name_es={item.name_es}
                desc={item.desc}
                desc_es={item.desc_es}
                type={item.type}
                price={item.price.toString()}
                currency={item.currency}
                atts_es={item.atts_es}
                atts_en={item.atts_en}
                imgs={item.images}
                lat={parseFloat(item.lat)}
                lng={parseFloat(item.lng)}
                address={item.address}
                displayOnly={true}
              />
            ))}
          </div>
        </div>
      ) : (
        <NewProperty
          setEditingProperty={setEditingProperty}
          editingProperty={editingProperty}
          setNewPropertyInfo={setNewPropertyInfo}
          newPropertyInfo={newPropertyInfo}
          setNewProperty={setNewProperty}
          handleSnackBar={handleSuccess}
        />
      )}

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
    </div>
  );
}

export default Properties;
