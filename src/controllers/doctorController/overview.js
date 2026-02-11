import Appointment from "../../model/patient/Appointment.js";
import User from "../../model/auth/user.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

export const getDoctorOverview = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const doctorId = decoded.id;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID missing in token" });
        }

        const uniquePatients = await Appointment.distinct("patientId", { doctorId });
        const totalPatients = uniquePatients.length;

        const today = dayjs().format("YYYY-MM-DD");
        const todayAppointments = await Appointment.countDocuments({
            doctorId,
            date: today,
        });

        const pendingNotes = await Appointment.countDocuments({
            doctorId,
            status: "Pending",
        });

        const totalSlots = todayAppointments * 0.25;
        const availableHours = `${Math.max(0, 8 - totalSlots).toFixed(1)} hrs`;

        res.status(200).json({
            success: true,
            message: "Doctor overview fetched successfully",
            data: {
                totalPatients,
                todayAppointments,
                pendingNotes,
                availableHours,
            },
        });
    } catch (error) {
        console.error("Doctor Overview Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching overview data",
        });
    }
};
