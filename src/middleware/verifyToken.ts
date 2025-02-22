import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface DecodedToken extends JwtPayload {
  id: string;
}

const verifyToken = (authHeader: string): DecodedToken | null => {
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET_KEY as Secret;

  try {
    const decodedToken = jwt.verify(token, secret) as DecodedToken;
    return decodedToken;
  } catch (error) {
    throw new Error("Unauthorized: Invalid token.");
  }
};

export default verifyToken;
