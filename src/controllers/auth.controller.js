import prisma from "../database/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async function (req, res) {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    throw new Error("fill the credentials");
  }

  /*
  -- first find if the user already exiest or not
  -- hash the password 
  -- create the user
  -- create token and set to cookie
  */
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

export const login = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  /*
  -- try to find the user
  -- if not found then return a message that the user is not found
  -- if found the update the isLoggedIn field in User schema
  -- set token to a cookie
  -- --
  -- if not work throw an error
  */
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        isLoggedin: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Please go to Sign-up!",
      });
    } else if (user.isLoggedin) {
      return res.status(300).json({ message: "User already logged in" });
    }

    const loggedIn = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isLoggedin: true,
      },
      select: {
        isLoggedin: true,
        id: true,
      },
    });

    if (!loggedIn.isLoggedin) {
      return res.status(400).json({ message: "Filed to update the login" });
    }

    return res
      .status(200)
      .json({ message: "User logged-in successfull!" }, user);
  } catch (error) {
    throw error;
  }
};

export const logout = async function (req, res) {
  const { id } = req.userId;

  if (!id) {
    return res.status(400).json({ message: "Failed to get the user Id" });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isLoggedin: false,
      },
    });

    return res
      .status(200)
      .clearCookie("token")
      .json({ message: "User logged out" });
  } catch (error) {
    throw error;
  }
};
