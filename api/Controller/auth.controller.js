import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorhandler } from "../utils/error.js"
export const signup=async (req,res,next)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    console.log(email)
    const user = await User.findOne({email:email})
    if(user) return next(errorhandler(404 ,"This account exists"))
    const hashedpassword = bcrypt.hashSync(password , 10)
    try{
    const user =  await User.create({
        username  , email ,password:hashedpassword
    })
    const token = jwt.sign( {id :user._id} , process.env.JWT_SECRET)
     res.status(202).json({
        user,token
    })
    }
    catch(error){
        next(error)
    }
    
}

export const signin =async (req,res,next)=>{
const email = req.body.email
const password= req.body.password
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
    res
    .status(200)
    .json({user,token})
}catch(e){
    next(e)
}
}
export const google =async (req,res,next)=>{
    try{
    const email = req.body.email
    const user = await User.findOne({email:email})
    if(user){
        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET)
        res
        .status(200)
        .json({user,token})
    }else{
        return next(errorhandler(404,"this account does not exist"))
    }
}catch(e){
    next(e)
}   
}

export const signout=(req,res,next)=>{
  
        if(req.id !== req.params.id) return next(errorhandler(404 , 'delete your own account'))
            res.status(200).json('signout success!');
}

export const googleSignup =async (req,res,next)=>{
    try{
    const email = req.body.email
    const user = await User.findOne({email:email})
    
    if(user) return next(errorhandler(404 ,"This account exists"))
if(!user){
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
        res
        .status(200)
        .json({user,token})
    }
}catch(e){
    next(e)
}   
}