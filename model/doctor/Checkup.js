import mongoose from "mongoose";

const checkupSchema = new mongoose.Schema(
    {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
        problem: String,
        diagnosis: String,
        prescription: [
            {
                medicine: String,
                dosage: String,
                duration: String,
            },
        ],
        notes: String,
        followUpDate: String,
    },
    { timestamps: true }
);

export default mongoose.model("Checkup", checkupSchema);
