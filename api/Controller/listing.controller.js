import Listing from "../models/listing.model.js"
import { errorhandler } from "../utils/error.js"

export const createListing =async (req,res,next)=>{
try{
    const list = await Listing.create(req.body)
    return res.status(201).json({
        success:true,
        list
    })
}catch(e){
    next(e)
}
}


export const deleteListing =async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorhandler(404, 'Listing not found!'));
  }
  if (req.id !== listing.userRef) {
    return next(errorhandler(401, 'You can only delete your own listings!'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
    
}

export const updateListing =async(req,res,next)=>{
  const listing = await Listing.findById(req.params.id)
  if(!listing){
  return  next(errorhandler(404,"listing does not exist"))
  }
  if(listing.userRef != req.id){
    return next(errorhandler(404,"update your own account"))
  }
  try{
    const listUpdateDone =await  Listing.findByIdAndUpdate(req.params.id , req.body, { new: true })
    res.status(200).json(listUpdateDone)
  }catch(e){
    next(e)
  }

}

export const getListingInfo=async(req,res,next)=>{
  try{
  const listing =  await Listing.findById(req.params.id)
  if(!listing){
   return next(errorhandler(404,"listing not found"))
  }
  res.status(200).json(listing)
}catch(e){
  next(e)
}
 
}

export const getistings =async(req,res,next)=>{
  try{
  let offer = req.query.offer
  let parking = req.query.parking
  let furnished = req.query.furnished
  const searchTerm = req.query.searchTerm || ''
  let type = req.query.type
  const limit = parseInt(req.query.limit) || 9
  const startIndex = parseInt(req.query.startIndex) || 0;


  if(offer === undefined || offer === 'false'){
    offer = { $in: [ true, false ] } 
  }

  if(parking === undefined || parking === 'false'){
    parking = { $in: [ true, false ] } 
  } 

  if(furnished === undefined || furnished === 'false'){
    furnished = { $in: [ true, false ] } 
  }
  
  if(type === undefined || type === 'all'){
    type = { $in: [ 'rent', 'sale' ] } 
  }


  const sort = req.query.sort || 'createdAt'
  const order = req.query.order  || 'desc'

  const listing = await Listing.find({
    name: { $regex:searchTerm, $options: 'i' },
    offer,
   furnished,
   parking,
   type
  }).limit(limit)
  .sort({[sort] :order})
  .skip(startIndex)
  res.status(200).json(listing)
}catch(e){
  next(errorhandler(404,"backend error"))
}
}