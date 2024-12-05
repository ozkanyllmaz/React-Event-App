import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  // Örnek olarak, harita merkezini İstanbul'a koyuyoruz.
  

  const position = [41.0082, 28.9784]; // İstanbul
  const zoom = 13; // Haritanın başlangıç zoom seviyesini belirliyoruz.

  // Harita üzerinde gösterilecek işaretçilerin listesi
  const locations = [
    { id: 1, name: "Place A", lat: 41.0082, lng: 28.9784 },
    { id: 2, name: "Place B", lat: 41.0151, lng: 28.9792 },
  ];

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
