import { useContext, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

import { TbHomePlus } from "react-icons/tb";
import { Button, CircularProgress } from "@mui/material";
import { DialogContext } from "../../App";

import { FaEdit } from "react-icons/fa";

import axios from "axios";
import { att, propertyDisplayType } from "../../types/PropertyInfoType";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Property Name", width: 200 },
  { field: "name_es", headerName: "Property Name (Español)", width: 200 },
  { field: "desc", headerName: "Description", width: 200 },
  { field: "desc_es", headerName: "Description (Español)", width: 200 },
  { field: "atts_es", headerName: "Attributes (Español)", width: 200 },
  { field: "atts_en", headerName: "Attributes", width: 200 },
  { field: "type", headerName: "Rent or Sale", width: 100 },
  { field: "price", headerName: "Price", width: 100 },
  { field: "currency", headerName: "Currency", width: 100 },
];

function Properties() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const getAtts = (atts: att[], code: string) => {
    if (code == "es") {
      return atts.map((att) => att.es).join(",");
    } else if (code == "en") {
      return atts.map((att) => att.en).join(",");
    }
  };

  const [rows, setRows] = useState<propertyDisplayType[]>([]);

  const [canErase, setCanErase] = useState<boolean>(false);
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
      let tempData: propertyDisplayType[] = [];
      for (let i = 0; i < response.data.length; i++) {
        let tempObject: propertyDisplayType = {
          id: response.data[i].id,
          name: response.data[i].name,
          name_es: response.data[i].name_es,
          desc: response.data[i].desc,
          desc_es: response.data[i].desc_es,
          type: response.data[i].type,
          price: response.data[i].price,
          currency: response.data[i].currency,
          atts_en: getAtts(response.data[i].atts, "en")!,
          atts_es: getAtts(response.data[i].atts, "es")!,
          images: response.data[i].images,
        };
        tempData.push(tempObject);
      }

      setRows(tempData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  // Access the context value and setter
  const context = useContext(DialogContext);

  if (!context) {
    // Handle the case where the context is undefined (outside provider)
    throw new Error("SomeComponent must be used within a PageContext.Provider");
  }

  const { isDialogOpen, setIsDialogOpen } = context;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (selectionModel.length > 0) {
      setCanErase(true);
    } else {
      setCanErase(false);
    }
  }, [selectionModel]);

  //Erase selection
  const eraseSelection = async () => {
    setIsLoading(true);
    for (let i = 0; i < selectionModel.length; i++) {
      const response = await axios
        .delete(
          `${import.meta.env.VITE_REACT_APP_API_URL}/delete_property/${
            selectionModel[i]
          }`
        )
        .catch((err) => {
          console.log(err, "axios error");
          alert("Something went wrong...");
        });
      console.log(response);
    }
    setIsLoading(false);
    getAllProperties();
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center relative">
      {isDialogOpen ? <div></div> : null}
      <div className="w-full h-[100px] flex justify-center items-center">
        <div className="w-[80%] flex justify-between items-center gap-2">
          <div className="gap-2 flex items-center">
            <Button
              variant="contained"
              className="flex items-center"
              onClick={() => {
                setIsEditing(false);
                setIsDialogOpen(true);
              }}
            >
              Add Property
              <TbHomePlus className="ml-2 text-xl" />
            </Button>

            <Button
              variant="contained"
              className="flex items-center"
              onClick={() => {
                setIsEditing(true);
                setIsDialogOpen(true);
              }}
            >
              Edit Property
              <FaEdit className="ml-2 text-lg" />
            </Button>
          </div>
          <div className="">
            {canErase ? (
              <Button
                variant="contained"
                className="flex items-center"
                color="error"
                onClick={() => {
                  eraseSelection();
                }}
              >
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="w-[80%] h-[600px]">
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <CircularProgress />
            </div>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={selectionModel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Properties;
