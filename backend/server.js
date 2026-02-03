import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import logRoutes from "./routes/logRoutes.js";


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
    res.send("Secure Backup API Running...")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})