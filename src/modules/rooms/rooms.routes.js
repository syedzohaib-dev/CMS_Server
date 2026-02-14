import express from "express";
import { verifyRole } from '../../middleware/verifyRole.js'
import { verifyToken } from '../../middleware/verifyToken.js'
import { ROLES } from '../../constants/roles.js'


const router = express.Router();

router.post(
    "/add",
    verifyRole(ROLES.ADMIN),
    
);
router.get(
    "/rooms/get",
    verifyRole(ROLES.ADMIN),
    
);

export default router;









