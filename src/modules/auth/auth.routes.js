import express from "express";
import { patientSignup, adminCreateDoctor } from "./controllers/signup.js";
import { login } from "./controllers/login.js";
import { verifyRole } from '../../middleware/verifyRole.js'
import { verifyToken } from '../../middleware/verifyToken.js'
import { ROLES } from '../../constants/roles.js'


const router = express.Router();

router.post("/signup", patientSignup);
router.post("/login", login);
router.post(
    "/admin/create-doctor",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    adminCreateDoctor
);


export default router;
