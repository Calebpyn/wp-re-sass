export type propertyInfoType = {
  name: string;
  name_es: string;
  desc: string;
  desc_es: string;
  type: string;
  price: string;
  currency: string;
  atts_en: string;
  atts_es: string;
  images: Array<string>;
};

export type att = {
  es: string;
  en: string;
};

export type propertyDisplayType = {
  id: string;
  name: string;
  name_es: string;
  desc: string;
  desc_es: string;
  type: string;
  price: string;
  currency: string;
  atts_en: string;
  atts_es: string;
  images: Array<string>;
};

export type propertyFetchType = {
  id: string;
  name: string;
  name_es: string;
  desc: string;
  desc_es: string;
  type: string;
  price: string;
  currency: string;
  atts_es: Array<string>;
  atts_en: Array<string>;
  imgs: Array<string>;
  lat: number | null;
  lng: number | null;
  address: string;
};
