//Components
import AddressToCoords from "../../common/AddressToCoords";

//Types
import { propertyFetchType } from "../../../types/PropertyInfoType";

//Props type
type MapsType = {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const Maps: React.FC<MapsType> = ({ newPropertyInfo, setNewPropertyInfo }) => {
  return (
    <div className="w-full h-full px-10 flex justify-start items-start">
      <AddressToCoords
        newPropertyInfo={newPropertyInfo}
        setNewPropertyInfo={setNewPropertyInfo}
      />
    </div>
  );
};

export default Maps;
