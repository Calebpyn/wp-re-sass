import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { componentType, coordsType } from "../../types/AddressToCoordsTypes";

//Map styles
const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

//Initial location
const center: coordsType = {
  lat: 31.857777777778,
  lng: -116.60583333333,
};

const AddressToCoords: React.FC<componentType> = ({ coords, setCoords }) => {
  //Load the map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env
      .VITE_REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const [markerPosition, setMarkerPosition] = useState<coordsType | null>(null);

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
        const { results } = result;
        if (results && results[0]) {
          const location = results[0].geometry.location.toJSON();
          setMarkerPosition(location);
          mapRef.current?.setCenter(results[0].geometry.location);
          setCoords({
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
    if (coords) {
      const lat = parseFloat(coords.lat.toString());
      const lng = parseFloat(coords.lng.toString());
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition({ lat, lng });
      } else {
        console.error("Invalid coords received:", coords);
      }
    }
  }, [coords]);

  //If not loaded
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <div className="w-full flex justify-start gap-5 p-2 items-center">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter a location"
          className="py-2 px-3 border-[1px] border-zinc-400 rounded-sm"
        />
        <button
          onClick={handleGeocode}
          className="py-2 flex justify-center items-center bg-blue-500 text-white rounded-sm w-[100px] shadow-sm"
        >
          Geocode
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition || center}
        zoom={10}
        onLoad={onMapLoad}
      >
        {markerPosition && <MarkerF position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

// Wrap the component with React.memo
export default React.memo(AddressToCoords, (prevProps, nextProps) => {
  if (prevProps.coords === nextProps.coords) return true;

  if (prevProps.coords && nextProps.coords) {
    return (
      prevProps.coords.lat === nextProps.coords.lat &&
      prevProps.coords.lng === nextProps.coords.lng
    );
  }

  return (
    prevProps.coords === nextProps.coords &&
    prevProps.setCoords === nextProps.setCoords
  );
});
