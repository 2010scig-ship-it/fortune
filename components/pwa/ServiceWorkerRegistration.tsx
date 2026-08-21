"use client";

import { useEffect } from "react";
import { registerPwaServiceWorker } from "../../src/pwa/registerServiceWorker";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const container = "serviceWorker" in navigator ? navigator.serviceWorker : undefined;
    void registerPwaServiceWorker(container, window.isSecureContext).catch(() => undefined);
  }, []);
  return null;
}
