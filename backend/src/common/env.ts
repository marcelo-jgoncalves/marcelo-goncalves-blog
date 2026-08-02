// A missing required env var should fail loudly at cold start, not surface
// later as `undefined` threaded through a DynamoDB call or a CORS header —
// by the time that failure is visible it's a confusing runtime symptom, not
// an obvious "the Lambda didn't start" error.
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
