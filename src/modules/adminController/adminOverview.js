import addDoctor from "../../model/admin/addDoctor.js";
import Appointment from "../../model/patient/Appointment.js";
import User from "../../model/auth/user.js";
import Room from "../../model/admin/room.js";
import dayjs from "dayjs";

export const getAdminOverview = async (req, res) => {
    try {
        const totalDoctors = await addDoctor.countDocuments();

        const totalPatients = await User.countDocuments({ role: "patient" });

        const totalRooms = await Room.countDocuments(); 

        const today = dayjs().format("YYYY-MM-DD");
        const todayAppointments = await Appointment.countDocuments({ date: today });

        res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data: {
                totalDoctors,
                totalPatients,
                totalRooms,
                todayAppointments,
            },
        });
    } catch (error) {
        console.error("Admin Overview Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching overview data" });
    }
};
