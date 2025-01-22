import express from "express";
import dotenv from "dotenv";

// database connection
import connectMongoDB from "./db/connectMongoDB.js";

//route imports
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
