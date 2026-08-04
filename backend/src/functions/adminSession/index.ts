//
// Backend For Frontend (BFF) for the admin session. SRP (login) still
// happens 100% in the browser via Amplify: the password never reaches
// this Lambda (ALLOW_USER_SRP_AUTH is kept, see infra/modules/cognito).
// What this handler does is exchange the idToken already obtained by
// Amplify (kept only in client memory, never persisted) for a revocable
// opaque session:
//   POST   /admin/session -> body {idToken} -> validates against Cognito,
//          creates a session in admin_sessions, returns Set-Cookie httpOnly
//   GET    /admin/session -> reads the cookie, checks the session, returns {email}
//   DELETE /admin/session -> deletes the session (logout), clears the cookie
import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../../common/logger";
import { verifyIdToken } from "../../common/cognitoJwt";
import { createSession, getSession, deleteSession, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "../../common/adminSessionStore";
import { parseCookies } from "../../common/cookies";
import { requireEnv } from "../../common/env";
import { parseJsonBody } from "../../common/httpBody";

// No "*" fallback here: this endpoint always pairs Allow-Origin with
// Allow-Credentials: true below, and browsers reject that combination for
// credentialed requests outright: a missing env var must fail loudly
// (cookie-based login breaks immediately, in an obvious way) rather than
// silently serve a wildcard the browser will refuse anyway.
const ADMIN_ORIGIN = requireEnv("ADMIN_ORIGIN");

const baseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

// Secure requires HTTPS (always true behind CloudFront); SameSite=Strict
// removes the need for a CSRF token because app and API are the same origin
// (same-origin proxy via the admin's CloudFront, path /admin/*), see infra/modules/admin/cloudfront.tf.
function cookieHeader(sessionId: string | null, maxAgeSeconds: number): string {
  const value = sessionId ?? "";
  return `${SESSION_COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const requestId = context.awsRequestId;
  const { httpMethod, headers: reqHeaders, body } = event;

  if (httpMethod === "OPTIONS") {
    return { statusCode: 200, body: "", headers: baseHeaders };
  }

  try {
    if (httpMethod === "POST") {
      if (!body) {
        return { statusCode: 400, body: JSON.stringify({ message: "Body é obrigatório" }), headers: baseHeaders };
      }
      const parsed = parseJsonBody(body);
      if (parsed === undefined || typeof parsed !== "object" || parsed === null) {
        return { statusCode: 400, body: JSON.stringify({ message: "Corpo JSON inválido" }), headers: baseHeaders };
      }
      const idToken = (parsed as Record<string, unknown>).idToken;
      if (!idToken || typeof idToken !== "string") {
        return { statusCode: 400, body: JSON.stringify({ message: "idToken é obrigatório" }), headers: baseHeaders };
      }

      let verified;
      try {
        verified = await verifyIdToken(idToken);
      } catch {
        logger.warn("admin_session_invalid_token", { requestId });
        return { statusCode: 401, body: JSON.stringify({ message: "Token inválido" }), headers: baseHeaders };
      }

      const session = await createSession(verified.sub, verified.email, verified.username);
      logger.info("admin_session_created", { requestId, sub: verified.sub });

      return {
        statusCode: 200,
        body: JSON.stringify({ email: session.email, username: session.username }),
        headers: { ...baseHeaders, "Set-Cookie": cookieHeader(session.session_id, SESSION_TTL_SECONDS) },
      };
    }

    const cookies = parseCookies(reqHeaders?.Cookie || reqHeaders?.cookie);
    const sessionId = cookies[SESSION_COOKIE_NAME];

    if (httpMethod === "GET") {
      if (!sessionId) {
        return { statusCode: 401, body: JSON.stringify({ message: "Sem sessão" }), headers: baseHeaders };
      }
      const session = await getSession(sessionId);
      if (!session) {
        return { statusCode: 401, body: JSON.stringify({ message: "Sessão expirada" }), headers: baseHeaders };
      }
      return { statusCode: 200, body: JSON.stringify({ email: session.email, username: session.username }), headers: baseHeaders };
    }

    if (httpMethod === "DELETE") {
      if (sessionId) await deleteSession(sessionId);
      logger.info("admin_session_deleted", { requestId });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Logout ok" }),
        headers: { ...baseHeaders, "Set-Cookie": cookieHeader(null, 0) },
      };
    }

    return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }), headers: baseHeaders };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("admin_session_error", { requestId, httpMethod, error: message });
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error", requestId }), headers: baseHeaders };
  }
};
