import addDoctor from "../../model/admin/addDoctor.js";

// ✅ Get doctors available today
export const getTodayAvailableDoctors = async (req, res) => {
    try {
        // Get current weekday (e.g. "Monday")
        const today = new Date().toLocaleString("en-US", { weekday: "long" });

        // Find doctors whose availableDays include today
        const availableDoctors = await addDoctor.find({
            availableDays: { $in: [today] },
        });

        res.status(200).json({
            success: true,
            message: `Doctors available on ${today}`,
            count: availableDoctors.length,
            doctors: availableDoctors, 
        });
    } catch (error) {
        console.error("Error fetching today's doctors:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching today's available doctors",
        });
    }
};
