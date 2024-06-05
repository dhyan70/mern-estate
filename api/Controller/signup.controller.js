import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { errorhandler } from "../utils/error.js"
export const signup=async (req,res,next)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    const hashedpassword = bcrypt.hashSync(password , 10)

    try{
    const UserModel =  await User.create({
        username  , email ,password:hashedpassword
    })
    return res.status(202).json({
        msg:"added to database"
    })
    }
    catch(error){
        next(error)
    }
    
}