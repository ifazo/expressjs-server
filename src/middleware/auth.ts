import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

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
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message:
            "You are unauthorized; Token not provided or invalid format.",
        });
      }

      const token = authHeader.split(" ")[1];

      const verifiedUser = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as Secret,
      ) as JwtPayload;

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden user" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  };

export default auth;
