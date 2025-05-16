import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running at: ${PORT}`);
});
