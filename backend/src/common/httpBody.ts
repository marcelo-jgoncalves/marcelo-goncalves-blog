// A malformed request body is a client error: without this, JSON.parse
// would throw into a handler's generic catch-all and surface as a 500,
// polluting the 5xx-based availability SLI with what is really a 400.
export function parseJsonBody<T = unknown>(body: string): T | undefined {
  try {
    return JSON.parse(body) as T;
  } catch {
    return undefined;
  }
}
