// backend/src/functions/adminSession/index.ts
//
// Backend For Frontend (BFF) de sessão do admin. O SRP (login) continua
// acontecendo 100% no browser via Amplify — a senha nunca chega a esta
// Lambda (decisão de manter ALLOW_USER_SRP_AUTH, ver infra/modules/cognito).
// O que este handler faz é trocar o idToken já obtido pelo Amplify (mantido
// só em memória no client, nunca persistido) por uma sessão opaca revogável:
//   POST   /admin/session -> body {idToken} -> valida contra o Cognito,
//          cria sessão em admin_sessions, devolve Set-Cookie httpOnly
//   GET    /admin/session -> lê o cookie, confere a sessão, devolve {email}
//   DELETE /admin/session -> apaga a sessão (logout), limpa o cookie
import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../../common/logger";
import { verifyIdToken } from "../../common/cognitoJwt";
import { createSession, getSession, deleteSession, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "../../common/adminSessionStore";
import { parseCookies } from "../../common/cookies";

const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";

const baseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

// Secure exige HTTPS (sempre verdadeiro atrás do CloudFront); SameSite=Strict
// dispensa token CSRF porque app e API são a mesma origem (proxy same-origin
// via CloudFront do admin, path /admin/*) — ver infra/modules/admin/cloudfront.tf.
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
      const parsed = JSON.parse(body);
      const idToken = parsed?.idToken;
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
