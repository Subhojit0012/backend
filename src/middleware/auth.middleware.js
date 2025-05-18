"use strict";

import jwt from "jsonwebtoken";
import prisma from "../database/db";

/*
    -get token from header or cookie
    -authenticate the user by the token
    -create a user object
    -create a request object and assigne the user object to it
    -call next function
*/
export const authenticateUser = async function (req, res, next) {
  const token = req.cookies?.token || req.headers?.authorization.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).json({
        message: "invalid token",
      });
    }

    const decode = jwt.decode(token);

    if (!decode) {
      return res.status(400).json({
        message: "Decode failed",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    req.userId = user;

    next();
  } catch (error) {
    throw error;
  }
};

export const checkAdmin = async function (req, res, next) {
  const id = req.userId;

  if (!id) {
    return res.status(400).json({ id: id });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(400).json({ user: user });
    }
    
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error check for admin role", error });
  }
};
