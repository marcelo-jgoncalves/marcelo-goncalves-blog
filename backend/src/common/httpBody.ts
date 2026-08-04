// A malformed request body is a client error: without this, JSON.parse
// would throw into a handler's generic catch-all and surface as a 500,
// polluting the 5xx-based availability SLI with what is really a 400.
//
// Returns `unknown`, not a generic <T>: a generic here only casts the
// parsed value, it doesn't prove the JSON actually has that shape. Callers
// must narrow the result themselves (typeof checks or a Zod schema).
export function parseJsonBody(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}
