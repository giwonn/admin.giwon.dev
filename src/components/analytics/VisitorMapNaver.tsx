"use client";

import { useEffect, useRef, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  NavermapsProvider,
  useNavermaps,
  useMap,
  Circle,
} from "react-naver-maps";
import type { MapRendererProps } from "./MapRenderer";

const NCP_CLIENT_ID = "9ujc5qa4l3";

function MapContent({ locations, selectedIp }: MapRendererProps) {
  const navermaps = useNavermaps();
  const mapRef = useRef<naver.maps.Map | null>(null);
  const [infoWindow] = useState(
    () => new navermaps.InfoWindow({ content: "", borderWidth: 0, backgroundColor: "transparent", disableAnchor: true })
  );

  const maxVisits = Math.max(...locations.map((l) => l.visitCount), 1);

  useEffect(() => {
    if (!mapRef.current || !selectedIp) return;
    const loc = locations.find((l) => l.ipAddress === selectedIp);
    if (loc) {
      mapRef.current.panTo(new navermaps.LatLng(loc.latitude, loc.longitude));
      mapRef.current.setZoom(12, true);
    }
  }, [selectedIp, locations, navermaps]);

  function handleCircleMouseOver(loc: MapRendererProps["locations"][number], e: { coord: naver.maps.Coord }) {
    if (!mapRef.current) return;
    const locationText = [loc.city, loc.country].filter(Boolean).join(", ");
    infoWindow.setContent(`
      <div style="padding:8px 12px;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-size:12px;line-height:1.5">
        <div style="font-weight:600">${locationText}</div>
        <div>${loc.ipAddress}</div>
        <div>${loc.visitCount}회 방문</div>
      </div>
    `);
    infoWindow.open(mapRef.current, e.coord);
  }

  function handleCircleMouseOut() {
    infoWindow.close();
  }

  return (
    <NaverMap
      defaultCenter={{ lat: 37.4979, lng: 127.0276 }}
      defaultZoom={locations.length > 0 ? 7 : 11}
      ref={mapRef}
    >
      {locations.map((loc) => {
        const isSelected = loc.ipAddress === selectedIp;
        const radius = Math.max(500, Math.min(5000, (loc.visitCount / maxVisits) * 5000));

        return (
          <Circle
            key={loc.ipAddress}
            center={{ lat: loc.latitude, lng: loc.longitude }}
            radius={radius}
            fillColor={isSelected ? "#ef4444" : "#3b82f6"}
            fillOpacity={0.6}
            strokeColor={isSelected ? "#dc2626" : "#2563eb"}
            strokeWeight={isSelected ? 2 : 1}
            strokeOpacity={0.8}
            clickable={true}
            onMouseover={(e) => handleCircleMouseOver(loc, e)}
            onMouseout={handleCircleMouseOut}
          />
        );
      })}
    </NaverMap>
  );
}

export function VisitorMapNaver({ locations, selectedIp }: MapRendererProps) {
  return (
    <NavermapsProvider ncpKeyId={NCP_CLIENT_ID}>
      <MapDiv style={{ width: "100%", height: "100%" }}>
        <MapContent locations={locations} selectedIp={selectedIp} />
      </MapDiv>
    </NavermapsProvider>
  );
}
