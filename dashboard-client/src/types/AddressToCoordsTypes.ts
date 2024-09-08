export type coordsType = {
  lat: number;
  lng: number;
};

export type componentType = {
  coords: coordsType | null;
  setCoords: React.Dispatch<React.SetStateAction<coordsType | null>>;
};
