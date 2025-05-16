import express from "express";

const authRoute = express.Router();
// register-->
//login-->
//logout-->
//resetPassword-->

authRoute.post("/register");
authRoute.post("/login");
authRoute.post("/logout");
authRoute.post("/reset-password");

export default authRoute;
