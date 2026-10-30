import express  from "express";

import LLMRespose from "../LLM/model.js";

const router=express.Router();

router.post("/",LLMRespose);
// router.get("/",get_msg);

export default router;

