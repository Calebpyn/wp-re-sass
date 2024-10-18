//Hooks
import { useState } from "react";

//Icons
import { GrLanguage } from "react-icons/gr";

//Types
import { propertyFetchType } from "../../../types/PropertyInfoType";

//Components
import CarouselDisplay from "../../common/PropertyCard/CarouselDisplay";

type InfoReviewType = {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const InfoReview: React.FC<InfoReviewType> = ({ newPropertyInfo }) => {
  //Lang selection
  const [lang, setLang] = useState<string>("EN");

  //Number format
  function formatNumberWithCommas(num: number): string {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="w-full h-full px-10 flex justify-between items-start font-light relative">
      <div className="w-[50%] flex flex-col justify-start h-full">
        <div className="w-full flex flex-col justify-start">
          <span className="h-[50px]">
            {lang == "EN"
              ? newPropertyInfo.name
              : lang == "ES"
              ? newPropertyInfo.name_es
              : null}
          </span>

          <span className="h-[300px] w-full">
            <CarouselDisplay imgs={newPropertyInfo.imgs} width={500} />
          </span>

          <span className="py-3 flex flex-col justify-start gap-2">
            <span className="select-none">Attributes:</span>
            <span>
              {lang == "EN"
                ? newPropertyInfo.atts_en.map((att, idx) => (
                    <span
                      key={idx}
                      className="font-light text-sm text-zinc-500 mr-1"
                    >
                      {att} |
                    </span>
                  ))
                : lang == "ES"
                ? newPropertyInfo.atts_es.map((att, idx) => (
                    <span
                      key={idx}
                      className="font-light text-sm text-zinc-500 mr-1"
                    >
                      {att} |
                    </span>
                  ))
                : null}
            </span>
          </span>
        </div>

        <span className="py-3 flex flex-col justify-start gap-2">
          <span className="select-none">Address:</span>
          <span className="pl-5">{newPropertyInfo.address}</span>
        </span>

        <span className="flex w-full justify-between items-end mb-10">
          <span className="flex flex-col gap-2 items-start">
            <span className="select-none">Price:</span>
            <span className="ml-2">
              <span className="text-lg">
                {formatNumberWithCommas(parseFloat(newPropertyInfo.price))}
              </span>
              <span className="ml-1 text-xs">{newPropertyInfo.currency}</span>
            </span>
          </span>
          <span>{newPropertyInfo.type}</span>
        </span>
      </div>
      <div className="w-[50%] pl-10 h-full flex flex-col justify-start items-start">
        <span className="h-[7%]">Description:</span>

        <span className="pl-5 h-[70%] w-full overflow-y-auto whitespace-pre-wrap">
          {lang == "EN"
            ? newPropertyInfo.desc
            : lang == "ES"
            ? newPropertyInfo.desc_es
            : null}
        </span>

        <div className="rounded-full self-end mt-6">
          <button
            className="bg-main-blue rounded-full hover:scale-105 tr p-2 justify-center items-center text-white font-light flex gap-3 pr-3"
            onClick={() => {
              if (lang == "EN") {
                setLang("ES");
              } else if (lang == "ES") {
                setLang("EN");
              }
            }}
          >
            <GrLanguage className="text-3xl text-white" />
            {lang == "EN" ? "English" : lang == "ES" ? "Spanish" : null}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoReview;
