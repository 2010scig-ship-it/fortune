import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "結 — 나를 읽는 네 가지 시선",
    short_name: "結",
    description: "사주, 이름, 타로, 손금의 관점을 한 흐름으로 잇는 자기성찰 리딩",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f4efe4",
    theme_color: "#102c21",
    lang: "ko-KR",
    categories: ["lifestyle"],
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "새 리딩", short_name: "리딩", description: "새로운 통합 리딩 시작", url: "/", icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }] },
      { name: "Journal", short_name: "Journal", description: "저장한 리딩 다시 보기", url: "/journal", icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
