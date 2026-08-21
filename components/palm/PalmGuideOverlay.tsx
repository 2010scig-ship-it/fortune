import type { PalmSide } from "../../src/application/palmFlow";

export function PalmGuideOverlay({ side, camera = false }: { readonly side: PalmSide; readonly camera?: boolean }) {
  return <div className={`palm-guide-visual${camera ? " camera-guide" : ""}`} aria-hidden="true">
    <svg className={side === "right" ? "right-hand" : undefined} viewBox="0 0 240 320" role="presentation">
      <path d="M74 281c-14-28-24-55-29-82-3-15 1-26 10-30 8-3 15 1 22 13l-12-76c-2-13 4-23 14-24 9-1 16 6 18 18l7 48-4-94c-1-14 6-23 17-23 10 0 17 8 18 22l3 89 5-87c1-13 9-21 19-20 11 1 17 10 16 24l-5 89 11-65c2-12 10-19 20-17 10 2 15 12 12 25l-17 94c-4 24-15 45-31 62-16 17-22 31-23 43H74Z"/>
      <path className="palm-guide-line" d="M83 204c30-22 61-24 94-7M88 227c28 12 56 11 84-3M111 167c11 31 16 60 15 88"/>
    </svg>
    <span>{side === "left" ? "LEFT PALM" : "RIGHT PALM"}</span>
  </div>;
}
