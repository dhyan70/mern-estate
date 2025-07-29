import express from 'express'
import { verifyUser } from '../utils/VerifyUser.js'
import { createListing, deleteListing, getistings, updateListing,getBookMark,getListingInfo, checkout, checkPaymentStatus } from '../Controller/listing.controller.js'
const router = express.Router()

router.post("/create-listing"  , createListing)
router.delete("/delete/:id" ,verifyUser, deleteListing)
router.post("/update/:id" , verifyUser , updateListing)
router.get("/get/:id" , getListingInfo)
router.get("/getforupdate/:id" , getListingInfo)
router.get("/checkPaymentStatus" , checkPaymentStatus )
router.get("/search" , getistings)
router.post("/checkout" , checkout)
export default router;