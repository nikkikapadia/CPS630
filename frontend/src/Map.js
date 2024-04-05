import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
//import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

// Display google map based on specified lat and lng
const MapComponent = ({ selectedLocation }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDNeK_2XCQL6gnYQ7Ej1yuQtIBig5pOJz8"
    });
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);
    if (loadError) return "Error";
    if (!isLoaded) return "Maps";

    return (
        <div style={{ marginTop: "20px" }}>
            <GoogleMap
                mapContainerStyle={{
                    height: "300px",
                }}
                center={selectedLocation}
                zoom={13}
                onLoad={onMapLoad}
            >
                <MarkerF
                    position={selectedLocation}
                    icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
                />
            </GoogleMap>
        </div>
    );
};

export default MapComponent;