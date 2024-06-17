import Listing from "../models/listing.model.js"

export const createListing =async (req,res,next)=>{
try{
    const list = await Listing.create(req.body)
    res.status(201).json({
        success:true,
        list
    })
}catch(e){
    next(e)
}
}