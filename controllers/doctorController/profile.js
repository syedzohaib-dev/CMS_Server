import jwt from "jsonwebtoken";
import addDoctor from "../../model/admin/addDoctor.js";

export const getDoctorProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const doctor = await addDoctor.findById(decoded.id).select("name email specialization role degree experience age gender availableDays startTime endTime profileImgURL");

        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        res.status(200).json({ success: true, doctor });
    } catch (error) {
        console.error("Get Doctor Profile Error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};
