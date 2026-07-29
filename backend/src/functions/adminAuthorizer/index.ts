//
// Lambda Authorizer (REQUEST) that replaces the native COGNITO_USER_POOLS
// authorizer on protected /admin/* routes. Only the opaque session cookie
// (admin_session) is accepted — the Authorization Bearer fallback (legacy
// Amplify client-side flow, used during the BFF rollout) was removed after
// confirming in production that the new flow works end to end. Reduces
// attack surface: only one authentication mechanism accepted, not two.
//
// Returns a Deny policy (doesn't throw) for a missing/invalid credential —
// API Gateway responds 403 in that case (not 401); the client treats both
// as "invalid session" (see admin/src/services/api.ts).
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
