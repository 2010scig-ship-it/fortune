import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "결 — 나를 읽는 네 가지 시선",
  description: "사주, 이름, 타로, 손금의 관점을 한 흐름으로 잇는 자기성찰 리딩",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
