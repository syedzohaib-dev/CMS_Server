import express from "express";
import {
    getAdminProfile,
    updateAdminProfile,
    getAllPatients,
    getAllAppointments,
    // getAppointmentById,
    // updateAppointmentStatus,
    deleteAppointment,

    // getDashboardStats,
} from "../controllers/adminController.js";

import {
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
} from '../controllers/adminController/doctor.js'

import {
    addRoom,
    getRooms,
} from '../controllers/adminController/room.js'
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { getAdminOverview } from "../controllers/adminController/adminOverview.js";

const router = express.Router();

// Admin Overview
router.get("/overview", getAdminOverview);

// Admin profile
router.get("/profile", verifyAdmin, getAdminProfile);
router.put("/update-profile", verifyAdmin, updateAdminProfile);

// Doctor management
router.post("/add-doctor", verifyAdmin, addDoctor); // Complete
router.get("/doctors", getAllDoctors); // Complete
router.put("/update-doctor/:id", verifyAdmin, updateDoctor); // Complete
router.delete("/delete-doctor/:id", verifyAdmin, deleteDoctor); // Complete

// room managment
router.post("/rooms/add-room", verifyAdmin, addRoom); // pending
router.get("/rooms/get", verifyAdmin, getRooms); // pending

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
