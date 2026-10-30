import express from "express";
import { create_msg, get_msg } from "../controller/msg.js";
import auth from "../middleware/checkauth.js";

const router=express.Router();

router.post("/",create_msg);
router.get("/",get_msg);

export default router;


