// src/aws-lex-config.ts
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";
import { fetchAuthSession } from "aws-amplify/auth";

const REGION = "eu-west-1";
const IDENTITY_POOL_ID = "eu-north-1:38d23317-b63d-48f2-9843-96f2f074adc0";

export const createlexClient = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || "";
  return new LexRuntimeV2Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: "eu-north-1" }),
      identityPoolId: IDENTITY_POOL_ID,
      logins: token
        ? { [`cognito-idp.eu-north-1.amazonaws.com/${import.meta.env.VITE_USER_POOL_ID}`]: token }
        : {},
    }),
  });
};

export const BOT_ID = "SXBWFT2LU0";
export const BOT_ALIAS_ID = "TSTALIASID";
export const LOCALE = "en_GB";
export const SESSION_ID = () => `session-${crypto.randomUUID()}`;