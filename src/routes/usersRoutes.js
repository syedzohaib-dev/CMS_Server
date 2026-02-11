import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { ROLES } from "../constants/roles.js";
import { getUsersByRole, getSingleUser } from '../controllers/users/list.js'

const router = express.Router();

// admin only
router.get(
    "/",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    getUsersByRole
);

router.get(
    "/id",
    verifyToken,
    getSingleUser
);

export default router;