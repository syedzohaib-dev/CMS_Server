import Appointment from "../../model/patient/Appointment.js";
import jwt from "jsonwebtoken";

export const getPatientStats = async (req, res) => {
    try {
        // 🟩 Token check
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id;

        // 🟩 Total appointments (all)
        const totalAppointments = await Appointment.countDocuments({ patientId });

        // 🟩 Completed (Visits)
        const completedVisits = await Appointment.countDocuments({
            patientId,
            status: "Completed",
        });

        // 🟩 Notes (if no model yet, return 0)
        const doctorNotes = 0;

        // 🟩 Send response
        res.status(200).json({
            success: true,
            message: "Patient stats fetched successfully",
            data: {
                totalAppointments,
                doctorNotes,
                completedVisits,
            },
        });
    } catch (error) {
        console.error("Get Patient Stats Error:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error fetching patient stats" });
    }
};
