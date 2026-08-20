import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { RWS_DECK } from "../../src/engine/tarot/deck";
import { tarotCardImagePath } from "../../src/ui/tarotCardImage";

describe("tarot card image mapping", () => {
  it("maps all 78 cards onto unique local image paths", () => {
    const paths = RWS_DECK.map(({ id }) => tarotCardImagePath(id));
    expect(paths).toHaveLength(78);
    expect(new Set(paths).size).toBe(78);
    expect(paths.every((path) => path.startsWith("/tarot-cards/") && path.endsWith(".jpg"))).toBe(true);
    expect(paths.every((path) => existsSync(join(process.cwd(), "public", path)))).toBe(true);
  });

  it("uses the canonical Rider-Waite file codes", () => {
    expect(tarotCardImagePath("major-12-hanged-man")).toBe("/tarot-cards/ar12.jpg");
    expect(tarotCardImagePath("minor-cups-knight")).toBe("/tarot-cards/cu12.jpg");
    expect(tarotCardImagePath("minor-pentacles-king")).toBe("/tarot-cards/pe14.jpg");
  });

  it("rejects unknown IDs instead of showing the wrong card", () => {
    expect(() => tarotCardImagePath("unknown-card")).toThrow(RangeError);
  });
});
