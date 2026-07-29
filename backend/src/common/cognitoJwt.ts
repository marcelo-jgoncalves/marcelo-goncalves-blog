//
// Verifies Cognito ID Tokens against the User Pool's public JWKS — requires
// no IAM permission (it's a public HTTPS call, with internal key caching
// done by aws-jwt-verify itself). Used in 2 places: adminSession (login:
// exchanges the idToken from Amplify's client-side SRP for an opaque
// session) and adminAuthorizer (legacy fallback: Authorization Bearer,
// kept during the admin's transition to the cookie flow).

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
