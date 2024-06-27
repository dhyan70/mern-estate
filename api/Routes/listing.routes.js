import express from 'express'
import { verifyUser } from '../utils/VerifyUser.js'
import { createListing, deleteListing, getListingInfo, getistings, updateListing } from '../Controller/listing.controller.js'
const router = express.Router()

router.post("/create-listing"  , createListing)
router.delete("/delete/:id" ,verifyUser, deleteListing)
router.post("/update/:id" , verifyUser , updateListing)
router.get("/get/:id" , getListingInfo)
router.get("/search" , getistings)
export default router;