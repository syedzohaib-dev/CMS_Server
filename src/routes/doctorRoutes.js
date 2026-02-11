import express from "express";
import { saveCheckup } from "../controllers/doctorController/checkup.js";
import { getTodayAvailableDoctors } from "../controllers/doctorController/CurrentDoctor.js";
import { getDoctorOverview } from "../controllers/doctorController/overview.js";
import { getDoctorProfile } from "../controllers/doctorController/profile.js";
import { getDoctorPatients } from "../controllers/doctorController/doctorPatients.js";

const router = express.Router();

router.post("/checkup", saveCheckup);

router.get("/today-doctors", getTodayAvailableDoctors);

router.get("/overview", getDoctorOverview);


router.get("/profile", getDoctorProfile);
 
router.get("/patients", getDoctorPatients);



export default router;
