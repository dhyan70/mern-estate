import { text } from "express";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username :{
        typeof: String,
        required:true,
        unique:true,
    },
    password:{
        typeof: String,
        required:true,
    }, 
    email:{
        typeof:String,
        required:true,
        unique:true
    }

}, {
    timestamps :true
})

const user = mongoose.model('UserInfo' , userSchema )

export default user;