//Hooks
import React, { useState, useRef, useEffect } from "react";

//Google api
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

//Types
import { propertyFetchType } from "../../types/PropertyInfoType";

//Map styles
const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

type coordsNoAddress = {
  lat: number;
  lng: number;
};

const center: coordsNoAddress = {
  lat: 0,
  lng: 0,
};

//Prop type
type componentType = {
  newPropertyInfo: propertyFetchType;
  setNewPropertyInfo: React.Dispatch<React.SetStateAction<propertyFetchType>>;
};

const AddressToCoords: React.FC<componentType> = ({
  newPropertyInfo,
  setNewPropertyInfo,
}) => {
  //Load the map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env
      .VITE_REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  //Marker position
  const [markerPosition, setMarkerPosition] = useState<coordsNoAddress | null>(
    null
  );

  //Location added
  const [geoCodeState, setGeoCodeState] = useState<boolean>(false);

  //Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  //Add event listener
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        geocode({ location: event.latLng.toJSON() });
      }
    });
  };

  //Process the location
  const geocode = (request: google.maps.GeocoderRequest) => {
    const geocoder = new google.maps.Geocoder();
    geocoder
      .geocode(request)
      .then((result) => {
        setGeoCodeState(true);
        const { results } = result;
        if (results && results[0]) {
          const location = results[0].geometry.location.toJSON();
          setMarkerPosition(location);
          mapRef.current?.setCenter(results[0].geometry.location);
          setNewPropertyInfo({
            ...newPropertyInfo,
            lat: location.lat,
            lng: location.lng,
          });
        }
      })
      .catch((e) => {
        alert("Geocode failed due to: " + e);
      });
  };

  //Handle address
  const handleGeocode = () => {
    const address = inputRef.current?.value;
    if (address) {
      geocode({ address });
    }
  };

  useEffect(() => {
    if (newPropertyInfo.lat && newPropertyInfo.lng) {
      const lat = parseFloat(newPropertyInfo.lat.toString());
      const lng = parseFloat(newPropertyInfo.lng.toString());
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition({ lat, lng });
      } else {
        console.error(
          "Invalid coords received:",
          newPropertyInfo.lat,
          newPropertyInfo.lng
        );
      }
    }
  }, [newPropertyInfo]);

  //If not loaded
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-[70%]">
      <div className="w-full flex justify-start gap-5 mb-5">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter a location"
          className="py-2 px-3 border-[1px] border-black focus:outline-none w-full"
          value={newPropertyInfo.address}
          onChange={(e) =>
            setNewPropertyInfo({
              ...newPropertyInfo,
              address: e.target.value,
            })
          }
        />
        <button
          onClick={handleGeocode}
          className="px-5 py-2 bg-zinc-200 hover:bg-zinc-400 tr w-[150px]"
        >
          Locate
        </button>
      </div>

      {geoCodeState ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition || center}
          zoom={10}
          onLoad={onMapLoad}
        >
          {markerPosition && <MarkerF position={markerPosition} />}
        </GoogleMap>
      ) : (
        <span className="text-sm text-zinc-500">
          Map will display when the address is located.
        </span>
      )}
    </div>
  );
};

export default AddressToCoords;

// // Wrap the component with React.memo
// export default React.memo(AddressToCoords, (prevProps, nextProps) => {
//   if (prevProps.coords === nextProps.coords) return true;

//   if (prevProps.coords && nextProps.coords) {
//     return (
//       prevProps.coords.lat === nextProps.coords.lat &&
//       prevProps.coords.lng === nextProps.coords.lng
//     );
//   }

//   return (
//     prevProps.coords === nextProps.coords &&
//     prevProps.setCoords === nextProps.setCoords
//   );
// });
