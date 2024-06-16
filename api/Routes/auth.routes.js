import express from "express";
import { google, signout, signup } from '../Controller/auth.controller.js'
import { signin } from "../Controller/auth.controller.js";
import { verifyUser } from "../utils/VerifyUser.js";

const router = express.Router()

router.post("/signup" , signup)
router.post("/signin" , signin)
router.post("/google" , google)
router.post("/signout", verifyUser, signout)
export default router;