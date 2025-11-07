import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["patient", "doctor"],
            default: "patient",
        },
        gender: { type: String, required: true },
        age: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
