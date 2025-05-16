import prisma from "../database/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async function (req, res) {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    throw new Error("fill the credentials");
  }

  try {
    // cheack if the user exiest or not
    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existing) {
      throw new Error("User already exist!");
    }

    const hashPass = await bcrypt.hash(password, 10);

    // create the user
    const user = await prisma.user.create({
      email,
      password: hashPass,
      firstname,
      lastname,
    });

    if (!user) {
      throw new Error("user not created");
    }

    // set the jwt token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    if (!token) {
      throw new Error("token not created");
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
      })
      .status(200)
      .json({ message: "user created successfull" });
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
  }
};
