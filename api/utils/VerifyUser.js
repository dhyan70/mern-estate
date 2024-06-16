
import jwt from 'jsonwebtoken'
import { errorhandler } from './error.js'

export const verifyUser=(req,res,next)=>{
 const fulltoken = req.headers['authorization']

 
 try{
    const verify = jwt.verify( fulltoken , process.env.JWT_SECRET)  
    req.id = verify.id
    next()
  }catch(e){
    next(errorhandler(404,'Update your own account'))
  }

}