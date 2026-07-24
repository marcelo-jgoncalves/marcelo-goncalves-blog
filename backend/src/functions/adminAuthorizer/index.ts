// backend/src/functions/adminAuthorizer/index.ts
//
// Lambda Authorizer (REQUEST) que substitui o autorizador nativo
// COGNITO_USER_POOLS nas rotas /admin/* protegidas. Só o cookie de sessão
// opaca (admin_session) é aceito — o fallback Authorization Bearer (fluxo
// legado do Amplify client-side, usado durante o rollout do BFF) foi
// removido em 2026-07-24 depois de confirmar em produção que o fluxo novo
// funciona ponta a ponta (dashboard carregando com dados reais, sem
// erro). Reduz superfície de ataque: só um mecanismo de autenticação
// aceito, não dois.
//
// Retorna uma policy Deny (não lança exceção) para credencial ausente/
// inválida — API Gateway responde 403 nesse caso (não 401); o client trata
// os dois como "sessão inválida" (ver admin/src/services/api.ts).
import { APIGatewayRequestAuthorizerHandler, APIGatewayAuthorizerResult } from "aws-lambda";
import { logger } from "../../common/logger";
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

  return policy("anonymous", "Deny", event.methodArn);
};
