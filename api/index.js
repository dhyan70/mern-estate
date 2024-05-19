import express from 'express'
const app = express()
import mongoose from 'mongoose'
import Userrouter from './Routes/user.routes.js'

import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("successful")
}).catch((e)=>{
    console.log("error connecting to database")
})

app.use("/api/user" , Userrouter )
app.listen(3000 ,()=>{
    console.log("server running ")
})