import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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

export const signin =async (req,res,next)=>{
const email = req.body.email
const password = req.body.password

try{
const validuser = await User.findOne({
    email:email
})
if(!validuser){ 
    return next(errorhandler(404 , "Email Not Found"))}
const validpass =  bcrypt.compareSync(password,validuser.password)
if(!validpass){
    return next(errorhandler(404 , "Wrong Password"))}

    const token = jwt.sign( {id :validuser._id} , process.env.JWT_SECRET)
    res.cookie("access_token" , token , {httpOnly:true} ).status(200).json({validuser})
}
catch(error){
    next(error)
}


}
