import bcrypt from "bcryptjs";
import Doctor from "../../model/admin/addDoctor.js";

export const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            specialization,
            degree,
            experience,
            age,
            gender,
            availableDays,
            startTime,
            endTime,
            profileImgURL
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !specialization ||
            !degree ||
            !experience ||
            !age ||
            !gender ||
            !availableDays ||
            !startTime ||
            !endTime ||
            !profileImgURL
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doctor = await Doctor.create({
            name,
            email,
            password: hashedPassword,
            specialization,
            degree,
            experience,
            age,
            gender,
            availableDays,
            startTime,
            endTime,
            role: 'doctor',
            profileImgURL
        });

        res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor
        });
    } catch (error) {
        console.error("Add Doctor Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, failed to add doctor",
        });
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No doctors found",
            });
        }

        res.status(200).json({
            success: true,
            count: doctors.length,
            message: "Doctors fetched successfully",
            doctors,
        });
    } catch (error) {
        console.error("Get All Doctors Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching doctors",
        });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            password,
            specialization,
            degree,
            experience,
            age,
            gender,
            availableDays,
            startTime,
            endTime,
            profileImgURL
        } = req.body;

        // Find doctor by ID
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            doctor.password = await bcrypt.hash(password, salt);
        }

        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.specialization = specialization || doctor.specialization;
        doctor.degree = degree || doctor.degree;
        doctor.experience = experience || doctor.experience;
        doctor.age = age || doctor.age;
        doctor.gender = gender || doctor.gender;
        doctor.availableDays = availableDays || doctor.availableDays;
        doctor.startTime = startTime || doctor.startTime;
        doctor.endTime = endTime || doctor.endTime;
        doctor.profileImgURL = profileImgURL || doctor.profileImgURL

        await doctor.save();

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            doctor,
        });
    } catch (error) {
        console.error("Update Doctor Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating doctor",
        });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        await Doctor.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully",
        });
    } catch (error) {
        console.error("Delete Doctor Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting doctor",
        });
    }
};