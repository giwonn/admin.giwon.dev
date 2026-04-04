"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import type { VisitorLocation } from "@/actions/analytics";

interface VisitorMapLeafletProps {
  locations: VisitorLocation[];
}

export function VisitorMapLeaflet({ locations }: VisitorMapLeafletProps) {
  const maxVisits = Math.max(...locations.map((l) => l.visitCount), 1);

  return (
    <MapContainer
      center={[36.5, 127.5]}
      zoom={6}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <CircleMarker
          key={loc.ipAddress}
          center={[loc.latitude, loc.longitude]}
          radius={Math.max(5, Math.min(20, (loc.visitCount / maxVisits) * 20))}
          fillColor="#3b82f6"
          fillOpacity={0.6}
          stroke={true}
          color="#2563eb"
          weight={1}
        >
          <Tooltip>
            <div className="text-xs">
              <div className="font-medium">{[loc.city, loc.country].filter(Boolean).join(", ")}</div>
              <div>{loc.ipAddress}</div>
              <div>{loc.visitCount}회 방문</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
