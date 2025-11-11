import express from "express";
import { signup, login, getUser, getAllUser, } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getuser", getUser);
router.get("/getalluser", getAllUser);

export default router;
