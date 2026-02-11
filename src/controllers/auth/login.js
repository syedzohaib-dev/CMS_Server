import jwt from "jsonwebtoken";
import User from '../../model/auth/user.js'
import bcrypt from 'bcryptjs'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            data: user,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
