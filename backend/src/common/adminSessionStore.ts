// backend/src/common/adminSessionStore.ts
//
// Sessão de servidor do painel admin (BFF) — o cookie httpOnly que o browser
// recebe carrega só o `session_id` (opaco, sem significado próprio); este
// arquivo é a fonte de verdade real da sessão, guardada na tabela
// admin_sessions (TTL best-effort, expiração real checada aqui via
// `expires_at`, nunca confiando só no TTL do DynamoDB).

import { GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { dynamo } from "./dynamodb";

const TABLE_NAME = process.env.ADMIN_SESSIONS_TABLE;

// Mesma janela de validade do id_token do Cognito (token_validity_units
// access/id = 60 minutos, infra/modules/cognito/main.tf) — não há refresh
// silencioso nesta versão; a sessão expira junto com o token que a originou,
// exigindo novo login (SRP) via Amplify no client.
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
