import axios from "axios";
import { useEffect, useState } from "react";
import { componentType } from "../../types/PropertyCardTypes";
import PropertyCard from "./PropertyCard";

function LastProperties() {
  const [_, setIsLoading] = useState<boolean>(false);

  const [lastTen, setLastTen] = useState<componentType[]>([]);

  const handleLastTen = async () => {
    setIsLoading(true);
    const response = await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/last_ten_properties`)
      .catch((err) => {
        console.log(err, "Axios error");
      });
    if (response) {
      setLastTen(response.data);
    } else {
      alert("Something went wrong, contact support...");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleLastTen();
  }, []);

  return (
    <div className="border-[1px] border-zinc-200 rounded-md w-[400px] h-[500px]">
      <div className="h-[50px] border-b-[1px] border-zinc-200 flex justify-start items-center px-3">
        <span className="font-bold">Last 10 Properties</span>
      </div>

      <div className="p-3 w-full h-full overflow-y-auto">
        {lastTen.map((item, idx) => (
          <PropertyCard
            atts={item.atts}
            currency={item.currency}
            desc_en={item.desc_en}
            desc_es={item.desc_en}
            id={item.id}
            images={item.images}
            name_en={item.name_en}
            name_es={item.name_es}
            price={item.price}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}

export default LastProperties;
