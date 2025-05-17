import express from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { login, logout, signup } from "../controllers/auth.controller";

const authRoute = express.Router();
// register-->
//login-->
//logout-->
//resetPassword-->

authRoute.post("/register", signup);
authRoute.post("/login", authenticateUser, login);
authRoute.post("/logout", authenticateUser, logout);
authRoute.post("/reset-password");

export default authRoute;
