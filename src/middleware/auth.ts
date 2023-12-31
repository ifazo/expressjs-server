import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret, verify } from "jsonwebtoken";
import config from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "You are unauthorized" });
      }

      const verifiedUser = verify(
        token,
        config.jwt_secret_key as Secret
      ) as JwtPayload;

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        return res
          .status(401)
          .json({ success: false, message: "Forbidden user access request" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
