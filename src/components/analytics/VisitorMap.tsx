"use client";

import { useEffect, useState } from "react";
import { getVisitorLocations, getIpAccessHistory, type VisitorLocation, type IpAccessHistory } from "@/actions/analytics";
import { formatDateTime } from "@/lib/format-date-time";
import "leaflet/dist/leaflet.css";
import { ArrowLeft } from "lucide-react";

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
  const [accessHistory, setAccessHistory] = useState<IpAccessHistory[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

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

  async function handleIpClick(ip: string) {
    setSelectedIp(ip);
    setIsDetailLoading(true);
    try {
      const data = await getIpAccessHistory(ip, from, to);
      setAccessHistory(data);
    } catch {
      setAccessHistory([]);
    } finally {
      setIsDetailLoading(false);
    }
  }

  function handleBack() {
    setSelectedIp(null);
    setAccessHistory([]);
  }

  const selectedLocation = selectedIp ? locations.find((l) => l.ipAddress === selectedIp) : null;

  return (
    <div id="map" className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">접속 IP</h2>

      {/* 지도 */}
      <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100 mb-6">
        {!MapComponent || isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            {isLoading ? "불러오는 중..." : "지도 로딩 중..."}
          </div>
        ) : (
          <MapComponent locations={locations} selectedIp={selectedIp} />
        )}
      </div>

      {/* IP 목록 또는 상세 이력 */}
      {isLoading ? (
        <div className="text-gray-400 text-center py-8">불러오는 중...</div>
      ) : locations.length === 0 ? (
        <div className="text-gray-400 text-center py-8">데이터가 없습니다</div>
      ) : selectedIp ? (
        /* 상세 이력 */
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h3 className="text-base font-semibold font-mono">{selectedIp}</h3>
              {selectedLocation && (
                <p className="text-sm text-gray-500">
                  {[selectedLocation.city, selectedLocation.country].filter(Boolean).join(", ") || "-"}
                  {" · "}
                  {selectedLocation.visitCount}회 방문
                </p>
              )}
            </div>
          </div>

          {isDetailLoading ? (
            <div className="text-gray-400 text-center py-8">불러오는 중...</div>
          ) : accessHistory.length === 0 ? (
            <div className="text-gray-400 text-center py-8">접속 이력이 없습니다</div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="text-left py-2">페이지</th>
                    <th className="text-left py-2">위치</th>
                    <th className="text-right py-2">접속 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {accessHistory.map((item, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 text-sm truncate max-w-[200px]" title={item.path}>
                        {item.path}
                      </td>
                      <td className="py-2 text-sm text-gray-600">
                        {[item.city, item.country].filter(Boolean).join(", ") || "-"}
                      </td>
                      <td className="py-2 text-sm text-right text-gray-600 whitespace-nowrap">
                        {formatDateTime(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-sm text-gray-500 text-right">
                총 {accessHistory.length}건
              </div>
            </>
          )}
        </div>
      ) : (
        /* IP 목록 */
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
                className="border-b last:border-0 cursor-pointer transition-colors hover:bg-blue-50"
                onClick={() => handleIpClick(loc.ipAddress)}
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
  );
}
