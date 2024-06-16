import express from 'express'
const router = express.Router()
import { deleteUser, test } from '../Controller/user.controller.js'
import { updateUser } from '../Controller/user.controller.js'
import { verifyUser } from '../utils/VerifyUser.js'

router.get("/test" , test)
router.post('/update/:id' , verifyUser, updateUser)
router.delete('/delete/:id' , verifyUser, deleteUser)


export default router
