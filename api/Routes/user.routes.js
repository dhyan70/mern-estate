import express from 'express'
const router = express.Router()
import { test } from '../Controller/user.controller.js'
router.get("/test" , test)
export default router
