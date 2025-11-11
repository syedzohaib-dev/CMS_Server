import express from "express";
import { saveCheckup } from "../controllers/doctorController/checkup.js";

const router = express.Router();
 
// Doctor adds patient notes, prescription, etc.
router.post("/checkup", saveCheckup);  

export default router;
