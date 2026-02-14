import User from '../../../model/auth/user.js';
import mongoose from 'mongoose';

export const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.isActive === true) {
            return res.status(400).json({
                success: false,
                message: "User is already activated"
            });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
