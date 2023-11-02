import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";

const signJwt = (payload: JwtPayload, expiresIn: string): string => {
  const secret = config.jwt_secret_key as Secret;
  const result = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return result;
};

const verifyJwt = (token: string): JwtPayload => {
  const secret = config.jwt_secret_key as Secret;
  const result = jwt.verify(token, secret) as JwtPayload;
  return result;
};

export { signJwt, verifyJwt };
