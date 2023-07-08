import express from "express";
import connectDB from "@config/db";
import router from "./routes";
import { homeRoutes } from "@routes/home";
import appMiddleware from "@middlewares/appMiddleware";

const app = express();
const port = 8000;

// Use app middleware
appMiddleware(app)

// Connect to MongoDB
connectDB();

// Use router
app.use("/", homeRoutes);
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
