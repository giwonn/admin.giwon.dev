"use client";

import { useEffect, useState } from "react";
import type { VisitorLocation } from "@/actions/analytics";
import "leaflet/dist/leaflet.css";

interface MiniVisitorMapProps {
  locations: VisitorLocation[];
}

export function MiniVisitorMap({ locations }: MiniVisitorMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    locations: VisitorLocation[];
  }> | null>(null);

  useEffect(() => {
    import("./MiniVisitorMapLeaflet").then((mod) => {
      setMapComponent(() => mod.MiniVisitorMapLeaflet);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
        지도 로딩 중...
      </div>
    );
  }

  return <MapComponent locations={locations} />;
}
