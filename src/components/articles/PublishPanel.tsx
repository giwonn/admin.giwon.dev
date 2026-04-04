"use client";

import { useState } from "react";

interface PublishPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishNow: () => Promise<void>;
  onSchedule: (publishedAt: string) => Promise<void>;
}

export function PublishPanel({ isOpen, onClose, onPublishNow, onSchedule }: PublishPanelProps) {
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      await onPublishNow();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) return;
    setIsScheduling(true);
    try {
      const publishedAt = `${scheduleDate}T${scheduleTime}:00`;
      await onSchedule(publishedAt);
    } finally {
      setIsScheduling(false);
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
          {/* 즉시 발행 */}
          <div>
            <button
              onClick={handlePublishNow}
              disabled={isPublishing}
              className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isPublishing ? "발행 중..." : "즉시 발행"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-400">또는</span>
            </div>
          </div>

          {/* 예약 발행 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">예약 발행</h3>
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
            <button
              onClick={handleSchedule}
              disabled={!scheduleDate || isScheduling}
              className="w-full px-4 py-2.5 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScheduling ? "예약 중..." : "예약 발행"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
