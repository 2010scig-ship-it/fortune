import { describe, expect, it, vi } from "vitest";
import nextConfig from "../../next.config";
import manifest from "../../app/manifest";
import { registerPwaServiceWorker, type PwaServiceWorkerContainer } from "../../src/pwa/registerServiceWorker";

describe("Phase 7 PWA configuration", () => {
  it("provides a standalone Korean manifest with install icons", () => {
    const result = manifest();
    expect(result.name).toBe("結 — 나를 읽는 네 가지 시선");
    expect(result.short_name).toBe("結");
    expect(result.display).toBe("standalone");
    expect(result.start_url).toBe("/");
    expect(result.theme_color).toBe("#102c21");
    expect(result.background_color).toBe("#f4efe4");
    expect(result.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192", type: "image/png" }),
      expect.objectContaining({ sizes: "512x512", type: "image/png", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
    ]));
  });

  it("registers the root service worker only in a secure supported context", async () => {
    const register = vi.fn(async () => ({ scope: "/" }));
    const container: PwaServiceWorkerContainer = { register };

    await expect(registerPwaServiceWorker(container, true)).resolves.toEqual({ scope: "/" });
    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/", updateViaCache: "none" });
    await expect(registerPwaServiceWorker(container, false)).resolves.toBeUndefined();
    await expect(registerPwaServiceWorker(undefined, true)).resolves.toBeUndefined();
    expect(register).toHaveBeenCalledTimes(1);
  });

  it("allows same-origin camera use and prevents service-worker caching", async () => {
    const headers = await nextConfig.headers?.();
    expect(headers).toBeDefined();
    const globalHeaders = headers?.find((entry) => entry.source === "/:path*")?.headers;
    const workerHeaders = headers?.find((entry) => entry.source === "/sw.js")?.headers;
    expect(globalHeaders).toContainEqual({ key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" });
    expect(workerHeaders).toContainEqual({ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" });
    expect(workerHeaders).toContainEqual({ key: "Service-Worker-Allowed", value: "/" });
  });
});
