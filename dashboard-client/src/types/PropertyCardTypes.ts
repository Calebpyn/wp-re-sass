export type componentType = {
  id: number;
  name_en: string;
  name_es: string;
  images: string[];
  desc_en: string;
  desc_es: string;
  atts: atts[];
  price: number;
  currency: string;
};

type atts = {
  id: string;
  created_at: string;
  es: string;
  en: string;
  fk_property: number;
};
