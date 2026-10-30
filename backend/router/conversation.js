import express from "express";
import { create_conversation , get_conversation } from "../controller/conversation.js";

const router = express.Router();

router.post("/", create_conversation);
router.get("/", get_conversation);
// router.post("/login", handleUserLogin);
export default router;

