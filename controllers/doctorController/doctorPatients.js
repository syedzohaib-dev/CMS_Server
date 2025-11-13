import Appointment from "../../model/patient/Appointment.js";
import User from "../../model/auth/user.js";
import jwt from "jsonwebtoken";

export const getDoctorPatients = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const doctorId = decoded.id; 

        const appointments = await Appointment.find({ doctorId })
            .populate("patientId", "name age gender") 
            .sort({ date: 1, time: 1 });

        if (appointments.length === 0) {  
            return res.status(200).json({
                success: true,
                message: "No patients found for this doctor",
                patients: [],
            });
        }

        
        const patientsData = appointments.map((a, i) => ({
            srNo: i + 1,
            patientName: a.patientId?.name,
            age: a.patientId?.age,
            gender: a.patientId?.gender,
            doctorName: a.doctorName,
            department: a.patientId?.department || "N/A",
            time: a.time,
            status: a.status,  
            date: a.date,
        }));

        res.status(200).json({
            success: true,
            total: patientsData.length,
            patients: patientsData,
        });
    } catch (error) {
        console.error("Get Doctor Patients Error:", error);
        res.status(500).json({ message: "Server error fetching doctor patients" });
    }
};
