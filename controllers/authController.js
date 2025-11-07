import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/auth/user.js";

// Signup controller
export const signup = async (req, res) => {
    try {
        const { name, email, password, role, gender, age } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: `Email already exists` });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            gender,
            age
        });

        res.status(201).json({ message: "Signup successful", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     secure: false,
        // });

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, name: user.name, role: user.role },
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. Token missing." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await User.findById(decoded.id).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Get User Error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        res.status(401).json({ message: "Invalid token." });
    }
};

export default { signup, login, getUser }