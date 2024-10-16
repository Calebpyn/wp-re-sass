//Hooks
import React from "react";

//Types
import { propertyFetchType } from "../../../types/PropertyInfoType";

type BasicInformationType = {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const BasicInformation: React.FC<BasicInformationType> = ({
  setNewPropertyInfo,
  newPropertyInfo,
}) => {
  //Set atts as an array
  const handleaAtts = (code: string, atts_string: string) => {
    if (code == "ES") {
      setNewPropertyInfo({
        ...newPropertyInfo,
        atts_es: atts_string.split(","),
      });
    } else if (code == "EN") {
      setNewPropertyInfo({
        ...newPropertyInfo,
        atts_en: atts_string.split(","),
      });
    }
  };

  return (
    <div className="w-full h-full px-10 flex justify-start items-start">
      <div className="pl-5 w-full flex flex-col gap-5">
        <span className="w-full flex gap-5">
          <span className="flex flex-col w-[40%] gap-2">
            <span className="font-light">
              Name <span className="text-zinc-500">(English)</span>:
            </span>
            <input
              className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
              onChange={(e) => {
                setNewPropertyInfo({
                  ...newPropertyInfo,
                  name: e.target.value,
                });
              }}
              value={newPropertyInfo.name}
            ></input>
          </span>
          <span className="flex flex-col w-[40%] gap-2">
            <span className="font-light">
              Name <span className="text-zinc-500">(Spanish)</span>:
            </span>
            <input
              className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
              onChange={(e) => {
                setNewPropertyInfo({
                  ...newPropertyInfo,
                  name_es: e.target.value,
                });
              }}
              value={newPropertyInfo.name_es}
            ></input>
          </span>
        </span>

        <span className="w-full flex gap-5">
          <span className="flex flex-col w-[25%] gap-2">
            <span className="font-light">Type</span>
            <span className="focus:outline-none border-[1px] border-black px-3 py-2 w-full">
              <select
                className="w-full focus:outline-none"
                onChange={(e) => {
                  setNewPropertyInfo({
                    ...newPropertyInfo,
                    type: e.target.value,
                  });
                }}
                value={newPropertyInfo.type}
              >
                <option>Other</option>
                <option>For Sale</option>
                <option>For Rent</option>
                <option>AirBnB</option>
              </select>
            </span>
          </span>
          <span className="flex flex-col w-[25%] gap-2">
            <span className="font-light">Price</span>
            <input
              type="number"
              className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
              onChange={(e) => {
                setNewPropertyInfo({
                  ...newPropertyInfo,
                  price: e.target.value,
                });
              }}
              value={newPropertyInfo.price}
            ></input>
          </span>
          <span className="flex flex-col w-[25%] gap-2">
            <span className="font-light">Currency</span>
            <span className="focus:outline-none border-[1px] border-black px-3 py-2 w-full">
              <select
                value={newPropertyInfo.currency}
                className="w-full focus:outline-none"
                onChange={(e) => {
                  setNewPropertyInfo({
                    ...newPropertyInfo,
                    currency: e.target.value,
                  });
                }}
              >
                <option>Other</option>
                <option>USD</option>
                <option>MXN</option>
              </select>
            </span>
          </span>
        </span>

        <span className="w-full flex gap-5">
          <span className="flex flex-col w-[40%] gap-2">
            <span className="font-light">
              Description <span className="text-zinc-500">(English)</span>:
            </span>
            <textarea
              value={newPropertyInfo.desc}
              className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
              onChange={(e) => {
                setNewPropertyInfo({
                  ...newPropertyInfo,
                  desc: e.target.value,
                });
              }}
            ></textarea>
          </span>
          <span className="flex flex-col w-[40%] gap-2">
            <span className="font-light">
              Description <span className="text-zinc-500">(Spanish)</span>:
            </span>
            <textarea
              value={newPropertyInfo.desc_es}
              className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
              onChange={(e) => {
                setNewPropertyInfo({
                  ...newPropertyInfo,
                  desc_es: e.target.value,
                });
              }}
            ></textarea>
          </span>
        </span>

        <span className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex gap-5">
            <span className="flex flex-col w-[40%] gap-2">
              <span className="font-light">
                Attributes <span className="text-zinc-500">(English)</span>:
              </span>
              <textarea
                className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
                onChange={(e) => {
                  handleaAtts("EN", e.target.value);
                }}
                value={newPropertyInfo.atts_en.join()}
              ></textarea>
            </span>
            <span className="flex flex-col w-[40%] gap-2">
              <span className="font-light">
                Attributes <span className="text-zinc-500">(Spanish)</span>:
              </span>
              <textarea
                className="focus:outline-none border-[1px] border-black px-3 py-2 w-full"
                onChange={(e) => {
                  handleaAtts("ES", e.target.value);
                }}
                value={newPropertyInfo.atts_es.join()}
              ></textarea>
            </span>
          </div>
          <span className="text-xs text-zinc-500">
            Attributes should be separated by a comma.
          </span>
        </span>
      </div>
    </div>
  );
};

export default BasicInformation;
