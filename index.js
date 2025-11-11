import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'

const app = express();

dotenv.config();
// middlewares
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://cms-server-one.vercel.app'
        ],
        credentials: true,
        methods: ['GET', "POST", "PUT", "DELETE"],
        allowedHeaders: ["content-type", "Authorization"],
    })
)
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/doctor', doctorRoutes);


// connect mongoose
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // mongoose options if needed
        });
        console.log("MongoDB connected");
        const port = process.env.PORT || 5000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
        console.error("DB connection error:", err);
    }
};
start();

// example route
app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Clinic backend running" });
});
