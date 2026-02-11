import express from "express";
import {
    getAdminProfile,
    updateAdminProfile,
    getAllPatients,
    getAllAppointments,
    deleteAppointment,
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

router.get("/overview", getAdminOverview);

router.get("/profile", verifyAdmin, getAdminProfile);
router.put("/update-profile", verifyAdmin, updateAdminProfile);

router.post("/add-doctor", verifyAdmin, addDoctor);
router.get("/doctors", getAllDoctors);
router.put("/update-doctor/:id", verifyAdmin, updateDoctor);
router.delete("/delete-doctor/:id", verifyAdmin, deleteDoctor);

router.post("/rooms/add-room", verifyAdmin, addRoom);
router.get("/rooms/get", verifyAdmin, getRooms);

router.get("/patients", verifyAdmin, getAllPatients);

router.get("/appointments", verifyAdmin, getAllAppointments);
router.delete("/appointment/:id", verifyAdmin, deleteAppointment);

export default router;
