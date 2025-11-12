import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Appointment from "../../model/patient/Appointment.js";

export const saveCheckup = async (req, res) => {
    try {
        // ✅ Verify token   
        const authHeader = req.headers.authorization;  
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const doctorId = decoded.id;

        const { appointmentId, problem, diagnosis, prescription, notes, followUpDate } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID format" });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.doctorId.toString() !== doctorId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized for this appointment" });
        }

        appointment.problem = problem || "";
        appointment.diagnosis = diagnosis || "";
        appointment.prescription = prescription || [];
        appointment.notes = notes || "";
        appointment.followUpDate = followUpDate || "";
        appointment.status = "Completed";

        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Checkup saved successfully",
            data: appointment,
        });
    } catch (error) {
        console.error("Error saving checkup:", error);
        res.status(500).json({
            success: false,
            message: "Server error saving checkup",
            error: error.message,
        });
    }
};
