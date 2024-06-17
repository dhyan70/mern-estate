import express from 'express'
import { verifyUser } from '../utils/VerifyUser.js'
import { createListing } from '../Controller/listing.controller.js'
const router = express.Router()

router.post("/create-listing"  , createListing)

export default router;