import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/auth/user.js";
import addDoctor from "../model/admin/addDoctor.js";

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let account = await User.findOne({ email });
        let accountType = "user";

        if (!account) {
            account = await addDoctor.findOne({ email });
            accountType = "doctor";
        }

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: account._id, role: account.role || accountType },
            process.env.JWT_SECRET,
            { expiresIn: "7h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: account._id,
                name: account.name,
                email: account.email,
                role: account.role || accountType,
            },
            token,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "Access denied. No token provided." });

        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Access denied. Token missing." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let account = await User.findById(decoded.id).select("-password");

        if (!account) {
            account = await addDoctor.findById(decoded.id).select("-password");
        }

        if (!account) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: account,
        });
    } catch (error) {
        console.error("Get User Error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        res.status(401).json({ message: "Invalid token." });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "Access denied. No token provided." });

        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Access denied. Token missing." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let allUser = await User.find({ role: 'patient' }).select("-password");

        if (!allUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            allUser
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