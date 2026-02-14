import mongoose from "mongoose";
import User from "../src/model/auth/user.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

await User.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
);

console.log("Migration completed");
process.exit();
