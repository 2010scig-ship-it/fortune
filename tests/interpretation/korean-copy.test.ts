import { describe, expect, it } from "vitest";
import { calculateSajuCore } from "../../src/engine/saju/index";
import { getSewoon } from "../../src/engine/saju/sewoon";
import { interpretSaju } from "../../src/interpretation/saju/index";

describe("Korean interpretation copy", () => {
  it("does not expose placeholder particles or internal implementation wording", () => {
    const core = calculateSajuCore({
      date: "1995-05-15",
      time: "12:00",
      calendarType: "solar",
      gender: "female",
      location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
    });
    const result = interpretSaju({ core, sewoon: getSewoon(2026) });
    const text = Object.values(result.categories).flat().map((point) => point.text).join(" ");

    expect(text).not.toMatch(/[이가은는을를]\([가는를]\)/);
    expect(text).not.toMatch(/표면 글자|표면 천간|테마로 해석|년간·월간·시간|십성|재성|의학적 결핍|본기|원자료/);
    expect(text).toContain("계산된 글자를 목·화·토·금·수로 나누어 보면");
    expect(text).toContain("사주에서 보는 2026년의 흐름은 입춘부터 이듬해 입춘 직전까지 이어집니다.");
  });
});
