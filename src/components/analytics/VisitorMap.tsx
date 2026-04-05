"use client";

import { useEffect, useState } from "react";
import { getVisitorLocations, type VisitorLocation } from "@/actions/analytics";
import "leaflet/dist/leaflet.css";

interface VisitorMapProps {
  from: string;
  to: string;
}

export function VisitorMap({ from, to }: VisitorMapProps) {
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    locations: VisitorLocation[];
    selectedIp?: string | null;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);

  useEffect(() => {
    import("./VisitorMapLeaflet").then((mod) => {
      setMapComponent(() => mod.VisitorMapLeaflet);
    });
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      setIsLoading(true);
      try {
        const data = await getVisitorLocations(from, to);
        setLocations(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocations();
  }, [from, to]);

  return (
    <div id="map" className="space-y-6">
      {/* 지도 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">방문자 위치</h2>
        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100">
          {!MapComponent || isLoading ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              {isLoading ? "불러오는 중..." : "지도 로딩 중..."}
            </div>
          ) : (
            <MapComponent locations={locations} selectedIp={selectedIp} />
          )}
        </div>
      </div>

      {/* IP 리스트 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">접속 IP</h2>
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : locations.length === 0 ? (
          <div className="text-gray-400 text-center py-8">데이터가 없습니다</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="text-left py-2">IP</th>
                <th className="text-left py-2">위치</th>
                <th className="text-right py-2">방문수</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr
                  key={loc.ipAddress}
                  className={`border-b last:border-0 cursor-pointer transition-colors hover:bg-blue-50 ${
                    selectedIp === loc.ipAddress ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedIp(loc.ipAddress)}
                >
                  <td className="py-2 text-sm font-mono text-blue-600">{loc.ipAddress}</td>
                  <td className="py-2 text-sm text-gray-600">
                    {[loc.city, loc.country].filter(Boolean).join(", ") || "-"}
                  </td>
                  <td className="py-2 text-sm text-right font-medium">{loc.visitCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
