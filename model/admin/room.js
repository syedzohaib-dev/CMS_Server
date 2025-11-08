import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
        },
        roomType: {
            type: String,
            enum: ["Consultation", "Ward", "ICU", "Operation Theatre"],
            default: "Consultation",
        },
        status: {
            type: String,
            enum: ["Available", "Occupied", "Maintenance"],
            default: "Available",
        },
        timePerPatient: {
            type: String,
            default: "15 minutes",
        },
        availableFrom: {
            type: String,
            default: "10:00 AM",
        },
        availableTo: {
            type: String,
            default: "8:00 PM",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
