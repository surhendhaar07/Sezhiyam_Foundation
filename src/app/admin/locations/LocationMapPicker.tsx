// src/app/admin/locations/LocationMapPicker.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

// Component that listens to map clicks and reports back
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component that recenters the map when lat/lng props change externally
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function LocationMapPicker({
  latitude,
  longitude,
  onChange,
}: Props) {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-brand-cream-dark shadow-sm" style={{ height: "380px" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={7}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={latitude} lng={longitude} />
        <ClickHandler onClick={onChange} />
        <Marker
          position={[latitude, longitude]}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const pos = marker.getLatLng();
              onChange(pos.lat, pos.lng);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}