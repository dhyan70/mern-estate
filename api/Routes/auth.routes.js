import express from "express";
import { signup } from '../Controller/signup.controller.js'


const router = express.Router()

router.post("/signup" , signup)

export default router;