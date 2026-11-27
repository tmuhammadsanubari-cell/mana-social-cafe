// Event klik (PRD 17, FR-21). gtag hanya dimuat setelah pengunjung menekan "Setuju" (US-13),
// jadi tanpa persetujuan tidak ada yang dikirim atau disimpan.
interface AnalyticsScope {
  gtag?: (...args: unknown[]) => void;
}

export function trackEvent(scope: AnalyticsScope, name: string, params: Record<string, string>): void {
  scope.gtag?.("event", name, params);
}
