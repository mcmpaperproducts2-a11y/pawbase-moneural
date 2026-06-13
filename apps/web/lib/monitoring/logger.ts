type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, event: string, metadata: Record<string, unknown> = {}) {
  const payload = { event, ...metadata };
  if (level === "error") {
    console.error("[pawbase]", payload);
    return;
  }
  if (level === "warn") {
    console.warn("[pawbase]", payload);
    return;
  }
  console.info("[pawbase]", payload);
}
