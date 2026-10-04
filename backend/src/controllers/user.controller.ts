import { type Request, type Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const signJWTAccessToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const setCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExists.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = signJWTAccessToken(isUserExists._id.toString());
    setCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: isUserExists._id,
        email: isUserExists.email,
        name: isUserExists.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Authentication server error",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Email, password, and name are required",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const token = signJWTAccessToken(newUser._id.toString());
    setCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration server error",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  return res.status(200).json({
    message: "Logout successful",
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    user: req.user,
  });
};
