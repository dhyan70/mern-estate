import User from "../models/user.model.js"
import { errorhandler } from "../utils/error.js"
import bcrypt from 'bcryptjs'
import Listing from "../models/listing.model.js"
export const test =(req,res)=>{
 
    res.json({
        messsage:"successful"
    })
}

export const updateUser=async (req,res,next)=>{
    
    if(req.id !== req.params.id) return next(errorhandler(404 , 'update your own account'))
        try{
        if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password,10)
        }
        
        const user = await User.findByIdAndUpdate(req.params.id , {
            $set :{
                username : req.body.username,
                password : req.body.password,
                email: req.body.email,
                avatar:req.body.avatar,
            }
        },
        { new: true })
        res.status(200).json({user})
    }
    catch(e){
        next(e)
    }
}

export const deleteUser= async (req,res,next)=>{
    if(req.id !== req.params.id) return next(errorhandler(404 , 'delete your own account'))
        try{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted!');
        }catch(e){
            next(errorhandler(404,"error here"))
        }
}

export const getListing =async(req, res , next)=>{
    if(req.id  !== req.params.id) return next(errorhandler(404 , "show  your own account"))
        try{
        const listing =await Listing.find({ userRef : req.params.id })
        
    res.status(202).json(listing)
}catch(e){
    next(e)
}
}

export const getUserDetails=async(req,res,next)=>{
    try{
    const user = await User.findById(req.params.id)
    if(!user) return next(errorhandler(404,"owner not found"))
        res.status(200).json(user)
    }
catch(e){
next(e)
}
}