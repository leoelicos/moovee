/** Registers the offline shell in production builds only (dev servers and tests stay SW-free). */
export function registerServiceWorker(
  nav: Navigator = navigator,
  enabled: boolean = import.meta.env.PROD
): Promise<ServiceWorkerRegistration | null> {
  if (!enabled || !('serviceWorker' in nav)) return Promise.resolve(null)
  return nav.serviceWorker.register('/sw.js').catch(() => null)
}
