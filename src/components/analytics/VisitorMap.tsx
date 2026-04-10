"use client";

import { useEffect, useState } from "react";
import { getVisitorLocations, getIpAccessHistory, type VisitorLocation, type IpAccessHistory } from "@/actions/analytics";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";

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
  const [modalIp, setModalIp] = useState<string | null>(null);
  const [accessHistory, setAccessHistory] = useState<IpAccessHistory[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

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
    setModalIp(ip);
    setIsModalLoading(true);
    try {
      const data = await getIpAccessHistory(ip, from, to);
      setAccessHistory(data);
    } catch {
      setAccessHistory([]);
    } finally {
      setIsModalLoading(false);
    }
  }

  function closeModal() {
    setModalIp(null);
    setAccessHistory([]);
  }

  const modalLocation = modalIp ? locations.find((l) => l.ipAddress === modalIp) : null;

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

      {/* IP 리스트 */}
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

      {/* 접속 이력 모달 */}
      {modalIp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeModal}>
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold font-mono">{modalIp}</h3>
                {modalLocation && (
                  <p className="text-sm text-gray-500">
                    {[modalLocation.city, modalLocation.country].filter(Boolean).join(", ") || "-"}
                  </p>
                )}
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 본문 */}
            <div className="overflow-y-auto p-4">
              {isModalLoading ? (
                <div className="text-gray-400 text-center py-8">불러오는 중...</div>
              ) : accessHistory.length === 0 ? (
                <div className="text-gray-400 text-center py-8">접속 이력이 없습니다</div>
              ) : (
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
              )}
            </div>

            {/* 푸터 */}
            {!isModalLoading && accessHistory.length > 0 && (
              <div className="border-t px-4 py-3 text-sm text-gray-500 text-right">
                총 {accessHistory.length}건
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${d} ${h}:${min}`;
}
