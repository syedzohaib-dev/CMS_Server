import express from "express";
import {
    getAdminProfile,
    updateAdminProfile,
    getAllDoctors,
    getAllPatients,
    getAllAppointments,
    // getAppointmentById,
    // updateAppointmentStatus,
    deleteAppointment,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    // getDashboardStats,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Admin profile
router.get("/profile", verifyAdmin, getAdminProfile);
router.put("/update-profile", verifyAdmin, updateAdminProfile);

// Doctor management
router.post("/add-doctor", verifyAdmin, addDoctor); // Complete

router.get("/doctors", verifyAdmin, getAllDoctors); // Complete
router.put("/update-doctor/:id", verifyAdmin, updateDoctor); // Complete
router.delete("/delete-doctor/:id", verifyAdmin, deleteDoctor); // pending

// Patient management
router.get("/patients", verifyAdmin, getAllPatients); //

// Appointment management
router.get("/appointments", verifyAdmin, getAllAppointments);
// router.get("/appointment/:id", verifyAdmin, getAppointmentById);
// router.put("/appointment/:id/status", verifyAdmin, updateAppointmentStatus);
router.delete("/appointment/:id", verifyAdmin, deleteAppointment);

// Dashboard stats
// router.get("/dashboard", verifyAdmin, getDashboardStats);

export default router;
