export const REFRESH_INTERVAL_OPTIONS = [
  { value: 10_000, label: "10 seconds" },
  { value: 20_000, label: "20 seconds" },
  { value: 30_000, label: "30 seconds" },
  { value: 60_000, label: "1 minute" },
] as const;

export type RefreshIntervalMs =
  (typeof REFRESH_INTERVAL_OPTIONS)[number]["value"];

export const DEFAULT_REFRESH_INTERVAL_MS: RefreshIntervalMs = 30_000;
