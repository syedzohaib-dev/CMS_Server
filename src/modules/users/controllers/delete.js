import User from '../../../model/auth/user.js'
import mongoose from 'mongoose';


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await user.deleteOne()

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }

}