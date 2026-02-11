import User from "../../model/auth/user.js";

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        // validation
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }

        if (!["doctor", "patient"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const users = await User.find({ role })
            .select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;

        // validation
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required",
            });
        }

        const users = await User.findById(id)
            .select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};