import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        specialization: { type: String, required: true },
        degree: { type: String, required: true },
        experience: { type: String, required: true }, 
        age: { type: Number, required: true },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        availableDays: { type: String, required: true }, // e.g. Mon - Fri
        startTime: { type: String, required: true }, // e.g. 10 AM
        endTime: { type: String, required: true }, // e.g. 4 PM
        role: { type: String, required: true },
        profileImgURL: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
