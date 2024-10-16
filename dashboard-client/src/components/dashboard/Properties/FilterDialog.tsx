import React, { useState } from "react";
import { filter } from "../Properties";

type FilterDialogType = {
  filters: filter[];
  setFilters: React.Dispatch<React.SetStateAction<filter[]>>;
};

const FilterDialog: React.FC<FilterDialogType> = ({ filters, setFilters }) => {
  // Toggle clicked state
  const toggleClicked = (index: number) => {
    setFilters((prevFilters: filter[]) =>
      prevFilters.map((filter, i) =>
        i === index
          ? { ...filter, clicked: !filter.clicked } // Toggle clicked value
          : filter
      )
    );
  };

  return (
    <div className="absolute top-0 right-full bg-white shadow-lg flex flex-col items-start p-1 gap-2 z-20 mr-3">
      {filters.map((item, idx) => (
        <span
          className="w-full text-nowrap px-2 py-1 flex justify-start gap-3 items-center"
          key={idx}
        >
          <span
            className="h-[20px] w-[20px] border-[1px] p-[2px] border-black cursor-pointer flex justify-center items-center"
            onClick={() => toggleClicked(idx)}
          >
            {item.clicked ? (
              <span className="w-full h-full bg-main-blue"></span>
            ) : null}
          </span>
          <span>{item.name}</span>
        </span>
      ))}
    </div>
  );
};

export default FilterDialog;
