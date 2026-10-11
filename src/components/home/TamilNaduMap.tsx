// src/components/home/TamilNaduMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  id: string;
  name: string;
  district: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

export default function TamilNaduMap({ locations }: { locations: Location[] }) {
  const center: [number, number] = [10.9, 78.5];

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white" style={{ height: "520px" }}>
      <MapContainer center={center} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={icon}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-bold text-brand-green">{loc.name}</p>
                <p className="text-xs text-neutral-600">{loc.district} District</p>
                {loc.description && <p className="text-sm mt-1 text-neutral-700">{loc.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}