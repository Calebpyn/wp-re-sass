//Hooks
import React, { useEffect, useState } from "react";

//Components
import BasicInformation from "./NewProperty/BasicInformation";
import Images from "./NewProperty/Images";
import Maps from "./NewProperty/Maps";
import InfoReview from "./NewProperty/InfoReview";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

//Axios
import axios from "axios";

//Types
import { propertyFetchType } from "../../types/PropertyInfoType";

//Icons
import { IoMdClose } from "react-icons/io";

type NewPropertyType = {
  editingProperty: boolean;
  setEditingProperty: React.Dispatch<React.SetStateAction<boolean>>;
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
  setNewProperty: React.Dispatch<React.SetStateAction<boolean>>;
  handleSnackBar: (message: string) => void;
};

//Upload Property type
type uploadProperty = {
  id: string;
  name: string;
  desc: string;
  name_es: string;
  desc_es: string;
  type: string;
  price: string;
  currency: string;
  atts_en: Array<string>;
  atts_es: Array<string>;
  images: Array<string>;
  lat: number | null;
  lng: number | null;
  address: string | "";
};

const NewProperty: React.FC<NewPropertyType> = ({
  setNewProperty,
  handleSnackBar,
  setNewPropertyInfo,
  newPropertyInfo,
  editingProperty,
  setEditingProperty,
}) => {
  //Stages
  const [stageState, setStageState] = useState<number>(2);
  const stages = ["Basic Information", "Images", "Maps", "Porperty Review"];

  //Is Loading
  const [isLoading, setIsLoading] = useState<boolean>();

  //Hanlde uplooad property
  const handleUpload = async () => {
    setIsLoading(true);

    const tempBody: uploadProperty = {
      id: newPropertyInfo.id,
      name: newPropertyInfo.name,
      desc: newPropertyInfo.desc,
      name_es: newPropertyInfo.name_es,
      desc_es: newPropertyInfo.desc_es,
      type: newPropertyInfo.type,
      price: newPropertyInfo.price,
      currency: newPropertyInfo.currency,
      atts_en: newPropertyInfo.atts_en,
      atts_es: newPropertyInfo.atts_es,
      images: newPropertyInfo.imgs,
      lat: newPropertyInfo.lat,
      lng: newPropertyInfo.lng,
      address: newPropertyInfo.address,
    };

    const response = await axios
      .post(`${import.meta.env.VITE_REACT_APP_API_URL}/new_property`, tempBody)
      .catch(() => {
        setIsLoading(false);
        setSnackBarMessage("Something went wrong");
        handleClick();
        setSnackbarStatus("error");
      });
    if (response) {
      setIsLoading(false);
      setNewProperty(false);
      handleSnackBar("Property successfully uploaded.");
    } else {
      setIsLoading(false);
      setSnackBarMessage("Something went wrong");
      handleClick();
      setSnackbarStatus("error");
    }
  };

  //Hnalde Update property
  const handleUpdate = async () => {
    setIsLoading(true);

    const tempBody: uploadProperty = {
      id: newPropertyInfo.id,
      name: newPropertyInfo.name,
      desc: newPropertyInfo.desc,
      name_es: newPropertyInfo.name_es,
      desc_es: newPropertyInfo.desc_es,
      type: newPropertyInfo.type,
      price: newPropertyInfo.price,
      currency: newPropertyInfo.currency,
      atts_en: newPropertyInfo.atts_en,
      atts_es: newPropertyInfo.atts_es,
      images: newPropertyInfo.imgs,
      lat: newPropertyInfo.lat,
      lng: newPropertyInfo.lng,
      address: newPropertyInfo.address,
    };

    const response = await axios
      .put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/update_property/${
          tempBody.id
        }`,
        tempBody
      )
      .catch(() => {
        setIsLoading(false);
        setSnackBarMessage("Something went wrong");
        handleClick();
        setSnackbarStatus("error");
      });
    if (response) {
      setIsLoading(false);
      setNewProperty(false);
      handleSnackBar("Property successfully uploaded.");
    } else {
      setIsLoading(false);
      setSnackBarMessage("Something went wrong");
      handleClick();
      setSnackbarStatus("error");
    }
    setEditingProperty(false);
  };

  //Reset values
  useEffect(() => {
    if (!editingProperty) {
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
    }
    setStageState(0);
  }, []);

  //Snackbar
  const [snackbarMessage, setSnackBarMessage] = useState<any>(
    "Oops! Something went wrong..."
  );

  const [snackbarStatus, setSnackbarStatus] = useState<any>("error");

  const [open, setOpen] = useState(false);

  const handleClick = () => {
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

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="h-[100px] flex w-full items-center px-10 font-light gap-10 select-none">
        {stages.slice(0, stageState + 1).map((stage, idx) => (
          <span
            key={idx}
            className={`${
              idx == stageState ? "text-black" : "text-zinc-500"
            } tr hover:text-black cursor-pointer text-sm`}
            onClick={() => setStageState(idx)}
          >
            {stage}
          </span>
        ))}
      </div>
      <div className="w-full h-full overflow-y-auto">
        {stageState == 0 ? (
          <BasicInformation
            setNewPropertyInfo={setNewPropertyInfo}
            newPropertyInfo={newPropertyInfo}
          />
        ) : stageState == 1 ? (
          <Images
            setNewPropertyInfo={setNewPropertyInfo}
            newPropertyInfo={newPropertyInfo}
          />
        ) : stageState == 2 ? (
          <Maps
            setNewPropertyInfo={setNewPropertyInfo}
            newPropertyInfo={newPropertyInfo}
          />
        ) : (
          <InfoReview
            newPropertyInfo={newPropertyInfo}
            setNewPropertyInfo={setNewPropertyInfo}
          />
        )}
      </div>
      <div className="h-[100px] w-full px-10 flex items-center justify-between">
        <div className="flex gap-5">
          {stageState > 0 ? (
            <button
              className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr"
              onClick={() => {
                setStageState(stageState - 1);
              }}
            >
              Back
            </button>
          ) : null}

          {stageState == 3 ? (
            <button
              className="px-5 py-2 bg-main-blue text-white hover:bg-blue-700 tr"
              onClick={() => {
                if (editingProperty) {
                  handleUpdate();
                } else {
                  handleUpload();
                }
              }}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Save"
              )}
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr"
              onClick={() => {
                if (stageState == 0) {
                  if (
                    newPropertyInfo.atts_en.length !=
                    newPropertyInfo.atts_es.length
                  ) {
                    setSnackbarStatus("error");
                    setSnackBarMessage(
                      "Attributtes have to have the same lenght..."
                    );
                    handleClick();
                  } else {
                    if (stageState < 3) {
                      setStageState(stageState + 1);
                    }
                  }
                } else {
                  if (stageState < 3) {
                    setStageState(stageState + 1);
                  }
                }
              }}
            >
              Next
            </button>
          )}
        </div>
        <span className="">
          <button
            onClick={() => setNewProperty(false)}
            className="px-5 py-2 bg-zinc-200 hover:bg-red-600 hover:text-white tr"
          >
            Cancel
          </button>
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
    </div>
  );
};

export default NewProperty;
