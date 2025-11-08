import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/auth/user.js";
import addDoctor from "../model/admin/addDoctor.js";

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
// export const login = async (req, res) => {
//     try {
//         const { email, password, } = req.body;

//         // Check if doctor exists
//         const doctor = await addDoctor.findOne({ email });
//         if (!doctor) {
//             return res.status(404).json({ message: "Doctor not found" });
//             const validPassword = await bcrypt.compare(password, doctor.password);
//             if (!validPassword)
//                 return res.status(401).json({ message: "Invalid password" });

//             const token = jwt.sign(
//                 { id: user._id, role: doctor.role },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "1h" }
//             );
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });

//             const validPassword = await bcrypt.compare(password, user.password);
//             if (!validPassword)
//                 return res.status(401).json({ message: "Invalid password" });

//             const token = jwt.sign(
//                 { id: user._id, role: user.role },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "1h" }
//             )
//         }



//         // res.cookie("token", token, {
//         //     httpOnly: true,
//         //     sameSite: "lax",
//         //     secure: false,
//         // });
//         if (user) {
//             res.status(200).json({
//                 message: "Login successful",
//                 user: { id: user._id, name: user.name, role: user.role },
//                 token,
//             });
//         } else {
//             res.status(200).json({
//                 message: "Login successful",
//                 doctor,
//                 token,
//             });
//         }


//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Pehle User collection me check karo (admin / patient)
        let account = await User.findOne({ email });
        let accountType = "user";

        // 2️⃣ Agar User me nahi mila, Doctor collection me check karo
        if (!account) {
            account = await addDoctor.findOne({ email });
            accountType = "doctor";
        }

        // 3️⃣ Agar dono me nahi mila
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // 4️⃣ Password verify
        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // 5️⃣ JWT token create
        const token = jwt.sign(
            { id: account._id, role: account.role || accountType },
            process.env.JWT_SECRET,
            { expiresIn: "7h" }
        );

        // 6️⃣ Response return
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

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Pehle user collection check karo
        let account = await User.findById(decoded.id).select("-password");

        // ✅ Agar user collection me nahi mila to doctor collection check karo
        if (!account) {
            account = await addDoctor.findById(decoded.id).select("-password");
        }

        // ✅ Agar dono me nahi mila
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

export default { signup, login, getUser }