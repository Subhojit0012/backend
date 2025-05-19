import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoute from "./src/routers/auth.route.js"
import problemRoute from "./src/routers/problem.route.js";

app.use("/api/auth", authRoute);
app.use("/api/problem", problemRoute);

app.listen(PORT, () => {
  console.log(`Server running at: ${PORT}`);
});
