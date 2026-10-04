import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User, type UserDocument } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    token = req.cookies.token;
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    const decoded = jwt.verify(token as string, env.JWT_SECRET);
    const user = await User.findById(
      (decoded as { userId: string }).userId,
    ).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
