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
    const user =  await User.create({
        username  , email ,password:hashedpassword
    })
    return res.status(202).json({
        user
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
const user = await User.findOne({
    email:email
})
if(!user){ 
    return next(errorhandler(404 , "Email Not Found"))}
const validpass =  bcrypt.compareSync(password,user.password)
if(!validpass){
    return next(errorhandler(404 , "Wrong Password"))}

    const token = jwt.sign( {id :user._id} , process.env.JWT_SECRET)
    res.cookie("access_token" , token , {httpOnly:true} ).status(200).json({user})
}
catch(error){
    next(error)
}
}


export const google =async (req,res,next)=>{
    try{
    const email = req.body.email
    const user = await User.findOne({email:email})
    if(user){
        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET)
        res.cookie("access_token" , token, {httpOnly : true}).status(200).json({user})
    }else{
        const email = req.body.email
        const photo = req.body.photo
        const username = req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4)
        

        const password =  Math.random().toString(36).slice(-8) +Math.random().toString(36).slice(-8);

        const encryptedPassword = bcrypt.hashSync(password, 10)
        const user = await User.create({
            username : username,
            password : encryptedPassword,
            email : email,
            avatar :photo
        })
        const token =jwt.sign({id : user._id} , process.env.JWT_SECRET)
        res.cookie("access_token" , token, {httpOnly : true}).status(200).json({user})
    }
}catch(e){
    next(e)
}
     
}