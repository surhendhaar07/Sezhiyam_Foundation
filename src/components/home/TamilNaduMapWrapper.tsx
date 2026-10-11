// src/components/home/TamilNaduMapWrapper.tsx
"use client";

import dynamic from "next/dynamic";

interface Location {
  id: string;
  name: string;
  district: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

const TamilNaduMap = dynamic(() => import("./TamilNaduMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-500" style={{ height: "520px" }}>
      Loading map…
    </div>
  ),
});

export default function TamilNaduMapWrapper({ locations }: { locations: Location[] }) {
  return <TamilNaduMap locations={locations} />;
}