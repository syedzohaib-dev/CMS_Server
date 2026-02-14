import User from "../../../model/user.js";
import bcrypt from "bcryptjs";

export const patientSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, gender } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender,
            role: "patient",
        });

        res.status(201).json({
            message: "Patient registered successfully",
            data: patient
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const adminCreateDoctor = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            age,
            gender,
            specialization,
            degree,
            experience,
            availableDays,
            startTime,
            endTime,
        } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender,
            role: "doctor",
            doctorProfile: {
                specialization,
                degree,
                experience,
                availableDays,
                startTime,
                endTime,
            },
        });

        res.status(201).json({
            message: "Doctor created successfully",
            data: doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
