import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getPresetRange, detectPreset } from "@/lib/date-range-presets";

describe("getPresetRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("today는 오늘 날짜를 from/to 모두 반환한다", () => {
    const { from, to } = getPresetRange("today");
    expect(from).toEqual(new Date("2026-04-10T00:00:00"));
    expect(to).toEqual(new Date("2026-04-10T00:00:00"));
  });

  it("yesterday는 전날 날짜를 from/to 모두 반환한다", () => {
    const { from, to } = getPresetRange("yesterday");
    expect(from).toEqual(new Date("2026-04-09T00:00:00"));
    expect(to).toEqual(new Date("2026-04-09T00:00:00"));
  });

  it("week은 7일 전부터 오늘까지 반환한다", () => {
    const { from, to } = getPresetRange("week");
    expect(from).toEqual(new Date("2026-04-03T00:00:00"));
    expect(to).toEqual(new Date("2026-04-10T00:00:00"));
  });

  it("month는 한달 전부터 오늘까지 반환한다", () => {
    const { from, to } = getPresetRange("month");
    expect(from).toEqual(new Date("2026-03-10T00:00:00"));
    expect(to).toEqual(new Date("2026-04-10T00:00:00"));
  });
});

describe("detectPreset", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("오늘~오늘이면 today를 반환한다", () => {
    const result = detectPreset(
      new Date("2026-04-10T00:00:00"),
      new Date("2026-04-10T00:00:00"),
    );
    expect(result).toBe("today");
  });

  it("전날~전날이면 yesterday를 반환한다", () => {
    const result = detectPreset(
      new Date("2026-04-09T00:00:00"),
      new Date("2026-04-09T00:00:00"),
    );
    expect(result).toBe("yesterday");
  });

  it("7일전~오늘이면 week을 반환한다", () => {
    const result = detectPreset(
      new Date("2026-04-03T00:00:00"),
      new Date("2026-04-10T00:00:00"),
    );
    expect(result).toBe("week");
  });

  it("한달전~오늘이면 month를 반환한다", () => {
    const result = detectPreset(
      new Date("2026-03-10T00:00:00"),
      new Date("2026-04-10T00:00:00"),
    );
    expect(result).toBe("month");
  });

  it("프리셋에 해당하지 않으면 custom을 반환한다", () => {
    const result = detectPreset(
      new Date("2026-01-01T00:00:00"),
      new Date("2026-02-15T00:00:00"),
    );
    expect(result).toBe("custom");
  });
});
