import express from "express";
import { createUser, loginuser } from "../controller/user.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginuser);

export default router;
