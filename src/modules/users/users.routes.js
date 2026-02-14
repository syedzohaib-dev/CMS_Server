import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { verifyRole } from "../../middleware/verifyRole.js";
import { ROLES } from "../../constants/roles.js";
import { getUsersByRole, getSingleUser } from './controllers/list.js'
import { deleteUser } from './controllers/delete.js'
import { deactivateUser } from "./controllers/deactivate.js";
import { activateUser } from "./controllers/activate.js";

const router = express.Router();

// admin only
router.get(
    "/",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    getUsersByRole
);

router.get(
    "/:id",
    verifyToken,
    getSingleUser
);
router.put(
    "/deactivate/:id",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    deactivateUser
);
router.put(
    "/activate/:id",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    activateUser
);

router.delete(
    "/delete/:id",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    deleteUser
);
export default router;