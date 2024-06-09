import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const httpStatus = {
  BAD_REQUEST: 400,
  EXPECTATION_FAILED: 417,
  OK: 200,
};

const extractKeycloakToken = (token: string) => {
  const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.KEYCLOAK_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;

  if (!publicKey || !clientId) {
    return {
      error:
        "keycloak [publicKey or clientId] configuration missing server-side",
    };
  }

  try {
    const decodedToken = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;
    if (decodedToken.azp !== clientId) {
      return {
        error: "Token not issued to bx",
      };
    }
    return {
      decodedToken,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: `Token verification failed: ${err.name} | ${err.message}`,
      };
    }
    return {
      error: `Token verification failed due to unknown reasons | ${err}`,
    };
  }
};

const generateSupabaseToken = (token: JwtPayload) => {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    return { error: "Supabase [jwtSecret] configuration missing server-side" };
  }

  const payload: { [key: string]: any } = {
    sub: token.sub,
    aud: "authenticated",
  };

  if (token.email) payload.email = token.email;
  if (token.role) {
    payload.role = token.role;
  } else if (token.realm_access.roles) {
    payload.roles = token.realm_access.roles;
  }

  try {
    const encodedToken = jwt.sign(payload, jwtSecret, { expiresIn: "8 hours" });
    return { encodedToken };
  } catch (err) {
    if (err instanceof Error) {
      return { error: `Token signing failed : ${err.name} | ${err.message}` };
    }
    return { error: `Token signing failed due to unknown reasons | ${err}` };
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: `${req.method} is not accepted`,
    });
  }

  const { token } = JSON.parse(req.body);

  if (!token) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: `token missing from the request body` });
  }

  const { decodedToken, error: decodedError } = extractKeycloakToken(token);

  if (!decodedToken) {
    return res
      .status(httpStatus.EXPECTATION_FAILED)
      .json({ error: decodedError });
  }

  const { encodedToken, error: encodedError } =
    generateSupabaseToken(decodedToken);

  if (!encodedToken) {
    return res
      .status(httpStatus.EXPECTATION_FAILED)
      .json({ error: encodedError });
  }

  return res.status(httpStatus.OK).json({ token: encodedToken });
};

export default handler;
