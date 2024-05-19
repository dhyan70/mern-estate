import express from 'express'
const app = express()


import Userrouter from './Routes/user.routes.js'

app.use("/api/user" , Userrouter )
app.listen(3000 ,()=>{
    console.log("server running  ")
})