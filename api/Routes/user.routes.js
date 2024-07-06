import express from 'express'
const router = express.Router()
import { deleteUser, getUserDetails, test } from '../Controller/user.controller.js'
import { updateUser } from '../Controller/user.controller.js'
import { verifyUser } from '../utils/VerifyUser.js'
import { getListing } from '../Controller/user.controller.js'

router.get("/test" , test)
router.put('/update/:id' , verifyUser, updateUser)
router.delete('/delete/:id' , verifyUser, deleteUser)
router.get('/listing/:id' ,verifyUser, getListing)
router.get('/:id'  , verifyUser,getUserDetails)
export default router
