import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "../components/pwa/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "결 — 나를 읽는 네 가지 시선",
  description: "사주, 이름, 타로, 손금의 관점을 한 흐름으로 잇는 자기성찰 리딩",
  applicationName: "結",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "結",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#102c21",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}<ServiceWorkerRegistration/></body></html>;
}
