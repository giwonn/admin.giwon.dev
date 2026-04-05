"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { VisitorLocation } from "@/actions/analytics";
import { useEffect } from "react";

interface VisitorMapLeafletProps {
  locations: VisitorLocation[];
  selectedIp?: string | null;
}

function FlyToSelected({ locations, selectedIp }: { locations: VisitorLocation[]; selectedIp?: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedIp) return;
    const loc = locations.find((l) => l.ipAddress === selectedIp);
    if (loc) {
      map.flyTo([loc.latitude, loc.longitude], 12, { duration: 0.8 });
    }
  }, [selectedIp, locations, map]);

  return null;
}

export function VisitorMapLeaflet({ locations, selectedIp }: VisitorMapLeafletProps) {
  const maxVisits = Math.max(...locations.map((l) => l.visitCount), 1);

  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={locations.length > 0 ? 6 : 11}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected locations={locations} selectedIp={selectedIp} />
      {locations.map((loc) => (
        <CircleMarker
          key={loc.ipAddress}
          center={[loc.latitude, loc.longitude]}
          radius={Math.max(5, Math.min(20, (loc.visitCount / maxVisits) * 20))}
          fillColor={loc.ipAddress === selectedIp ? "#ef4444" : "#3b82f6"}
          fillOpacity={0.6}
          stroke={true}
          color={loc.ipAddress === selectedIp ? "#dc2626" : "#2563eb"}
          weight={loc.ipAddress === selectedIp ? 2 : 1}
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
