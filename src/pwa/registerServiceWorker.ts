export interface PwaServiceWorkerContainer {
  register(scriptUrl: string, options: RegistrationOptions): Promise<unknown>;
}

export async function registerPwaServiceWorker(
  container: PwaServiceWorkerContainer | undefined,
  secureContext: boolean,
): Promise<unknown | undefined> {
  if (!secureContext || container === undefined) return undefined;
  return container.register("/sw.js", { scope: "/", updateViaCache: "none" });
}
