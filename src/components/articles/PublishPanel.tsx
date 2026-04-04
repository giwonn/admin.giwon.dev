"use client";

import { useState } from "react";

interface PublishPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (publishedAt: string | undefined, hidden: boolean, password: string | null) => Promise<void>;
  defaultPublishedAt?: string;
  defaultHidden?: boolean;
  defaultPassword?: string | null;
}

export function PublishPanel({
  isOpen,
  onClose,
  onSave,
  defaultPublishedAt,
  defaultHidden = false,
  defaultPassword = null,
}: PublishPanelProps) {
  const [useSchedule, setUseSchedule] = useState(!!defaultPublishedAt && new Date(defaultPublishedAt) > new Date());
  const [scheduleDate, setScheduleDate] = useState(() => {
    if (defaultPublishedAt) {
      return defaultPublishedAt.slice(0, 10);
    }
    return "";
  });
  const [scheduleTime, setScheduleTime] = useState(() => {
    if (defaultPublishedAt) {
      return defaultPublishedAt.slice(11, 16) || "09:00";
    }
    return "09:00";
  });
  const [hidden, setHidden] = useState(defaultHidden);
  const [password, setPassword] = useState(defaultPassword ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const publishedAt = useSchedule && scheduleDate
        ? `${scheduleDate}T${scheduleTime}:00`
        : undefined;
      const pwd = password.trim() || null;
      await onSave(publishedAt, hidden, pwd);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">발행 설정</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* 발행 시간 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useSchedule"
                checked={useSchedule}
                onChange={(e) => setUseSchedule(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="useSchedule" className="text-sm font-medium text-gray-700">
                예약 발행
              </label>
            </div>
            {useSchedule && (
              <div className="space-y-2 pl-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">날짜</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">시간</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            {!useSchedule && (
              <p className="text-xs text-gray-400 pl-6">체크하지 않으면 즉시 발행됩니다.</p>
            )}
          </div>

          {/* 숨김 토글 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hidden"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="hidden" className="text-sm font-medium text-gray-700">
              숨김 처리
            </label>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">비밀번호 (선택)</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">비워두면 비밀번호 없이 접근 가능합니다.</p>
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={isSaving || (useSchedule && !scheduleDate)}
            className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </>
  );
}
