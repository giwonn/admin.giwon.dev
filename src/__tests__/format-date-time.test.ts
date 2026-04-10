import { describe, it, expect } from "vitest";
import { formatDateTime } from "@/lib/format-date-time";

describe("formatDateTime", () => {
  it("ISO 날짜 문자열을 yyyy.MM.dd HH:mm 형식으로 변환한다", () => {
    expect(formatDateTime("2026-04-10T14:30:00")).toBe("2026.04.10 14:30");
  });

  it("한 자리 월/일/시/분도 앞에 0을 붙인다", () => {
    expect(formatDateTime("2026-01-05T03:07:00")).toBe("2026.01.05 03:07");
  });

  it("자정은 00:00으로 표시한다", () => {
    expect(formatDateTime("2026-04-10T00:00:00")).toBe("2026.04.10 00:00");
  });
});
