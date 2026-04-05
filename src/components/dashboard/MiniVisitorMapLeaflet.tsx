"use client";

import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import type { VisitorLocation } from "@/actions/analytics";

interface Props {
  locations: VisitorLocation[];
}

export function MiniVisitorMapLeaflet({ locations }: Props) {
  const maxVisits = Math.max(...locations.map((l) => l.visitCount), 1);

  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={locations.length > 0 ? 6 : 11}
      className="h-full w-full"
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((loc) => (
        <CircleMarker
          key={loc.ipAddress}
          center={[loc.latitude, loc.longitude]}
          radius={Math.max(4, Math.min(12, (loc.visitCount / maxVisits) * 12))}
          fillColor="#3b82f6"
          fillOpacity={0.6}
          stroke={true}
          color="#2563eb"
          weight={1}
        />
      ))}
    </MapContainer>
  );
}
