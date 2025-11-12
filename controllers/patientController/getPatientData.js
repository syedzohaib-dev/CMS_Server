import User from "../../model/auth/user.js";
import jwt from "jsonwebtoken";

export const getPatientData = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const patient = await User.findById(decoded.id).select("-password");
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.status(200).json({
            success: true,
            message: "Patient data fetched successfully",
            patient,
        });
    } catch (error) {
        console.error("Get Patient Data Error:", error);
        res.status(500).json({ message: "Server error fetching patient data" });
    }
};
