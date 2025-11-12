import express from "express";
import { bookAppointment, getAvailableSlots, getMyAppointments } from "../controllers/patientController/Appointment.js";
import { getPatientStats } from "../controllers/patientController/overview.js";
import { getPatientData } from "../controllers/patientController/getPatientData.js";

const router = express.Router();

router.get("/slots", getAvailableSlots);
router.post("/book-appointment", bookAppointment);
router.get("/my-appointment", getMyAppointments);
router.get("/stats", getPatientStats);
router.get("/get-data", getPatientData)


export default router;
