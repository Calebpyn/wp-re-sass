//Components

//Types
import { propertyFetchType } from "../../../types/PropertyInfoType";
import ImageGridNewProperty from "./Images/ImageGridNewProperty";

//Porps type
type ImagesType = {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const Images: React.FC<ImagesType> = ({
  newPropertyInfo,
  setNewPropertyInfo,
}) => {
  return (
    <div className="w-full h-full px-10 flex justify-start items-start">
      <div className="w-full flex flex-col justify-start items-start gap-5">
        <ImageGridNewProperty
          newPropertyInfo={newPropertyInfo}
          setNewPropertyInfo={setNewPropertyInfo}
        />
      </div>
    </div>
  );
};

export default Images;
