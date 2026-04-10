export type PresetKey = "today" | "yesterday" | "week" | "month" | "custom";

export function getPresetRange(key: Exclude<PresetKey, "custom">): { from: Date; to: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  switch (key) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    }
    case "week": {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { from: weekAgo, to: today };
    }
    case "month": {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { from: monthAgo, to: today };
    }
  }
}

export function detectPreset(from: Date, to: Date): PresetKey {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const f = new Date(from);
  f.setHours(0, 0, 0, 0);
  const t = new Date(to);
  t.setHours(0, 0, 0, 0);

  if (f.getTime() === today.getTime() && t.getTime() === today.getTime()) return "today";

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (f.getTime() === yesterday.getTime() && t.getTime() === yesterday.getTime()) return "yesterday";

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (f.getTime() === weekAgo.getTime() && t.getTime() === today.getTime()) return "week";

  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  if (f.getTime() === monthAgo.getTime() && t.getTime() === today.getTime()) return "month";

  return "custom";
}
