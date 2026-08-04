//
// Server-side session for the admin panel (BFF): the httpOnly cookie the
// browser receives carries only the `session_id` (opaque, no meaning of its
// own); this file is the real source of truth for the session, stored in
// the admin_sessions table (best-effort TTL, real expiration checked here
// via `expires_at`, never relying only on DynamoDB's TTL).

import { GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { dynamo } from "./dynamodb";

const TABLE_NAME = process.env.ADMIN_SESSIONS_TABLE;

// Same validity window as Cognito's id_token (token_validity_units
// access/id = 60 minutes, infra/modules/cognito/main.tf): no silent
// refresh in this version; the session expires along with the token that
// created it, requiring a new login (SRP) via Amplify on the client.
export const SESSION_TTL_SECONDS = 60 * 60;
export const SESSION_COOKIE_NAME = "admin_session";

export interface AdminSession {
  session_id: string;
  sub: string;
  email: string;
  username: string;
  expires_at: number; // epoch seconds
}

export async function createSession(sub: string, email: string, username: string): Promise<AdminSession> {
  const session: AdminSession = {
    session_id: randomUUID(),
    sub,
    email,
    username,
    expires_at: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  await dynamo.send(new PutCommand({ TableName: TABLE_NAME, Item: session }));
  return session;
}

export async function getSession(sessionId: string): Promise<AdminSession | null> {
  const result = await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { session_id: sessionId } }));
  if (!result.Item) return null;
  const session = result.Item as AdminSession;
  if (session.expires_at < Math.floor(Date.now() / 1000)) return null;
  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await dynamo.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { session_id: sessionId } }));
}
