// backend/src/functions/adminAuthorizer/index.ts
//
// Lambda Authorizer (REQUEST) que substitui o autorizador nativo
// COGNITO_USER_POOLS nas rotas /admin/* protegidas. Suporta 2 caminhos,
// deliberadamente, para permitir rollout sem downtime:
//
//   1. Cookie de sessão opaca (admin_session) — fluxo novo do BFF.
//   2. Authorization: Bearer <idToken do Cognito> — fluxo legado do Amplify
//      client-side, mantido até o admin (admin/src/services/api.ts) ser
//      migrado por completo para o cookie. Remover este fallback é um passo
//      de hardening explícito, futuro, não automático.
//
// Retorna uma policy Deny (não lança exceção) para credencial ausente/
// inválida — API Gateway responde 403 nesse caso (não 401); o client trata
// os dois como "sessão inválida" (ver admin/src/services/api.ts).
import { APIGatewayRequestAuthorizerHandler, APIGatewayAuthorizerResult } from "aws-lambda";
import { logger } from "../../common/logger";
import { verifyIdToken } from "../../common/cognitoJwt";
import { getSession, SESSION_COOKIE_NAME } from "../../common/adminSessionStore";
import { parseCookies } from "../../common/cookies";

function policy(principalId: string, effect: "Allow" | "Deny", resource: string): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [{ Action: "execute-api:Invoke", Effect: effect, Resource: resource }],
    },
  };
}

export const handler: APIGatewayRequestAuthorizerHandler = async (event) => {
  const headers = event.headers || {};
  const cookies = parseCookies(headers.Cookie || headers.cookie);
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (sessionId) {
    const session = await getSession(sessionId);
    if (session) {
      return policy(session.sub, "Allow", event.methodArn);
    }
    logger.warn("admin_authorizer_invalid_session", {});
    return policy("anonymous", "Deny", event.methodArn);
  }

  const authHeader = headers.Authorization || headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    try {
      const verified = await verifyIdToken(token);
      return policy(verified.sub, "Allow", event.methodArn);
    } catch {
      logger.warn("admin_authorizer_invalid_bearer", {});
      return policy("anonymous", "Deny", event.methodArn);
    }
  }

  return policy("anonymous", "Deny", event.methodArn);
};
