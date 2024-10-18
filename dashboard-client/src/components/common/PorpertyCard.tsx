//Hooks
import React, { useState } from "react";

//Components
import CarouselDisplay from "./PropertyCard/CarouselDisplay";

//Icons
import { MdOutlineMoreHoriz } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { TbBrandAirbnb } from "react-icons/tb";
import { propertyFetchType } from "../../types/PropertyInfoType";
import { GrLanguage } from "react-icons/gr";

type PropertyCardProps = propertyFetchType & {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
  setNewProperty: React.Dispatch<React.SetStateAction<boolean>>;

  setEditingProperty: React.Dispatch<React.SetStateAction<boolean>>;

  displayOnly: boolean;
  deleteById: (id: string) => void;
};

const PorpertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  imgs,
  desc,
  atts_en,
  price,
  currency,
  type,
  displayOnly,
  desc_es,
  name_es,
  address,
  atts_es,
  lat,
  lng,
  deleteById,
  setNewPropertyInfo,
  setNewProperty,
  setEditingProperty,
}) => {
  //Open desc
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //Delete pop up
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  //lang state
  const [lang, setLang] = useState<string>("EN");

  //Number format
  function formatNumberWithCommas(num: number): string {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="border-[1px] border-sec-gray w-[350px] shadow-md p-5 select-none relative flex flex-col justify-between">
      <div className="flex flex-col">
        <span className="w-full flex justify-between items-center">
          <span>{lang == "EN" ? name : lang == "ES" ? name_es : null}</span>

          {displayOnly ? (
            <span className="flex gap-3 text-sm items-center">
              <button
                className="hover:scale-105 tr hover:text-main-blue font-light"
                onClick={() => {
                  setNewPropertyInfo({
                    name: name,
                    address: address,
                    atts_en: atts_en,
                    atts_es: atts_es,
                    currency: currency,
                    desc: desc,
                    desc_es: desc_es,
                    id: id,
                    imgs: imgs,
                    lat: lat,
                    lng: lng,
                    name_es: name_es,
                    price: price,
                    type: type,
                  });
                  setEditingProperty(true);
                  setNewProperty(true);
                }}
              >
                edit
              </button>
              <button
                className="hover:scale-105 tr hover:text-red-600 font-light"
                onClick={() => setIsDeleteOpen(true)}
              >
                delete
              </button>

              <button
                className="hover:scale-105 tr hover:text-main-blue font-light"
                onClick={() => {
                  if (lang == "EN") {
                    setLang("ES");
                  } else if (lang == "ES") {
                    setLang("EN");
                  }
                }}
              >
                <GrLanguage />
              </button>
            </span>
          ) : null}
        </span>

        <div className="w-full h-[300px] mt-5">
          <CarouselDisplay imgs={imgs} width={350} />
        </div>

        <div className="flex flex-col items-center mt-5">
          <div
            className={`w-full tr ${
              isOpen ? "h-auto" : "max-h-[150px]"
            } font-light relative overflow-clip`}
          >
            <div
              className={`absolute bg-gradient-to-b from-transparent ${
                isOpen ? "to-transparent" : "to-white"
              } w-full h-full flex flex-col justify-end items-end`}
            ></div>
            <span className="whitespace-pre-wrap">
              {lang == "EN" ? desc : lang == "ES" ? desc_es : null}
            </span>
          </div>
        </div>
        <span className="w-full flex justify-end">
          <span
            className="text-xs font-light bg-zinc-200 rounded-full p-1 text-zinc-600 hover:scale-110 tr cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <IoIosClose className="text-base" />
            ) : (
              <MdOutlineMoreHoriz />
            )}
          </span>
        </span>

        <div className="w-full mt-2">
          <span className="w-full flex-wrap select-none">
            {lang == "EN"
              ? atts_en.map((att, idx) => (
                  <span
                    key={idx}
                    className="font-light text-xs text-zinc-500 mr-1"
                  >
                    {att} |
                  </span>
                ))
              : lang == "ES"
              ? atts_es.map((att, idx) => (
                  <span
                    key={idx}
                    className="font-light text-xs text-zinc-500 mr-1"
                  >
                    {att} |
                  </span>
                ))
              : null}
          </span>
        </div>
      </div>

      <span className="mt-1 font-light flex justify-between items-center">
        <span className="flex gap-2">
          <span>{formatNumberWithCommas(parseFloat(price))}</span>

          <span>{currency}</span>
        </span>

        {type == "AirBnB" ? (
          <span className="rounded-full text-white bg-airbnb-red p-1 px-3 flex gap-2 items-center">
            {type}
            <TbBrandAirbnb />
          </span>
        ) : (
          <span className="bg-zinc-100 rounded-full p-1 px-3">{type}</span>
        )}
      </span>

      {isDeleteOpen ? (
        <div className="absolute w-full h-full backdrop-blur-sm bg-white bg-opacity-55 top-0 left-0 flex justify-center items-center z-20">
          <div className="w-[60%] flex flex-col justify-center items-center bg-white p-5">
            <span className="w-full text-center font-light text-xs">
              Are you sure you want to delete this property?
              <span className="text-red-900"> This action can't be undone</span>
            </span>
            <span className="flex items-center gap-5 mt-2 font-light">
              <button
                className="border-main-blue border-[1px] px-3 py-1 rounded-[3px] hover:text-white hover:bg-main-blue tr cursor-pointer"
                onClick={() => {
                  setEditingProperty(false);
                  setIsDeleteOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="border-red-900 border-[1px] px-3 py-1 rounded-[3px] hover:text-white hover:bg-red-900 tr cursor-pointer"
                onClick={() => {
                  deleteById(id);
                }}
              >
                Delete
              </button>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PorpertyCard;
