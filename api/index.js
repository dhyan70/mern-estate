import express, { json } from 'express'
const app = express()
import mongoose from 'mongoose'
import Userrouter from './Routes/user.routes.js'
import Authrouter from './Routes/auth.routes.js'
import dotenv from 'dotenv'
dotenv.config()
app.use(express.json())
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("successful")
}).catch((e)=>{
    console.log("error connecting to database")
})

app.use("/api/user" , Userrouter )
app.use("/api/auth" , Authrouter )

app.use((err, req ,res , next)=>{
    const message = err.message
    const status = err.status || 500
    return res.status(status).json({
        success:false,
        status:status,
        message:message
    })
})



app.listen(3000 ,()=>{
    console.log("server running ")
})