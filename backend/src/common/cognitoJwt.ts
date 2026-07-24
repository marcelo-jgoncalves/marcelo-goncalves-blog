// backend/src/common/cognitoJwt.ts
//
// Verificação de ID Token do Cognito contra o JWKS público do User Pool —
// não requer nenhuma permissão IAM (é uma chamada HTTPS pública, com cache
// interno de chaves feito pelo próprio aws-jwt-verify). Usado em 2 lugares:
// adminSession (login: troca o idToken vindo do SRP client-side do Amplify
// por uma sessão opaca) e adminAuthorizer (fallback legado: Authorization
// Bearer, mantido durante a transição do admin pro fluxo de cookie).

import { CognitoJwtVerifier } from "aws-jwt-verify";

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

const verifier = userPoolId && clientId
  ? CognitoJwtVerifier.create({ userPoolId, tokenUse: "id", clientId })
  : null;

export interface VerifiedIdToken {
  sub: string;
  email: string;
  username: string;
}

export async function verifyIdToken(token: string): Promise<VerifiedIdToken> {
  if (!verifier) {
    throw new Error("COGNITO_USER_POOL_ID/COGNITO_CLIENT_ID não configurados");
  }
  const payload = await verifier.verify(token);
  const username = payload["cognito:username"];
  return {
    sub: payload.sub,
    email: typeof payload.email === "string" ? payload.email : "",
    username: typeof username === "string" ? username : payload.sub,
  };
}
