import { describe, expect, it } from "vitest";
import {
  birthDataFromProfile,
  createUserProfile,
  questionCategoryToTarot,
} from "../../src/application/readingFlow";

describe("reading flow profile", () => {
  it("normalizes a named profile and maps it to deterministic Saju input", () => {
    const profile = createUserProfile({
      name: "  김결  ",
      hanjaName: "  金結  ",
      birthDate: "1995-05-15",
      birthTime: "12:00",
      unknownBirthTime: false,
      gender: "female",
    }, () => "profile-1");

    expect(profile).toEqual({
      id: "profile-1",
      name: "김결",
      hanjaName: "金結",
      birthDate: "1995-05-15",
      birthTime: "12:00",
      unknownBirthTime: false,
      gender: "female",
    });
    expect(birthDataFromProfile(profile)).toEqual({
      date: "1995-05-15",
      time: "12:00",
      unknownBirthTime: false,
      calendarType: "solar",
      gender: "female",
      location: { country: "KR", city: "Seoul", timezone: "Asia/Seoul" },
    });
  });

  it("does not invent a birth time when the user marks it unknown", () => {
    const profile = createUserProfile({
      name: "김결",
      birthDate: "1995-05-15",
      birthTime: "12:00",
      unknownBirthTime: true,
      gender: "male",
    }, () => "profile-2");

    expect(profile.birthTime).toBeUndefined();
    expect(birthDataFromProfile(profile).time).toBeUndefined();
  });

  it("requires a name and maps self/free questions to general tarot context", () => {
    expect(() => createUserProfile({
      name: "  ",
      birthDate: "1995-05-15",
      birthTime: "12:00",
      unknownBirthTime: false,
      gender: "female",
    }, () => "profile-3")).toThrow("이름을 입력해 주세요.");
    expect(questionCategoryToTarot("self")).toBe("general");
    expect(questionCategoryToTarot("free")).toBe("general");
    expect(questionCategoryToTarot("wealth")).toBe("wealth");
  });
});
