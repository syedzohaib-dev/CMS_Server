import express from "express";
import { bookAppointment, getAvailableSlots, getMyAppointments } from "../controllers/patientController/Appointment.js";

const router = express.Router();

// router.get("/slots", getAvailableSlots);
router.get("/slots", getAvailableSlots);
router.post("/book-appointment", bookAppointment);
router.get("/my-appointment", getMyAppointments);

export default router;
