import Listing from "../models/listing.model.js"
import { errorhandler } from "../utils/error.js"
import User from "../models/user.model.js"
import Stripe from "stripe";
const stripe = new Stripe('sk_test_51PAtIpSGvUnCcH38ZgzRzfIQ4xEw5fyy0vb8w0ARjZWU84oPBIzkN5xivt7mlTHBGJGrpIeloiqJ3MZrbwRRaqBL00stQDAfcf');
export const createListing = async (req, res, next) => {
  try {
    const list = await Listing.create(req.body)
    return res.status(201).json({
      success: true,
      list
    })
  } catch (e) {
    next(e)
  }
}


export const checkout = async (req, res, next) => {
  console.log("in checkout")
  const { listingId, nights,userid,startDate,endDate } = req.body
  console.log(req.body)
  try {
    const user = await User.findById(userid)
    const listing = await Listing.findById(listingId)
    if (!listing) return next(errorhandler(404, 'Listing not found please try again'))

    const product = await stripe.products.create({
      name: listing.name,
      description: listing.description
    })
    const totalAmount = listing.regularPrice * nights * 100;

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: totalAmount, // Convert to cents
      currency: 'usd',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: price.id,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/mybookings`,
      cancel_url: `http://localhost:5173/listing/${listingId}`,
    });

     user.paymentDetails.push({
      listingid:listingId,
      name: user.username,
      startDate:startDate,
      endDate:endDate
     })
     await user.save();

     console.log("insert done" , user)
    res.status(200).json({ url: session.url });
  }
  catch (err) {
    next(err)
  }

}

export const deleteListing = async (req, res, next) => {
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

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    return next(errorhandler(404, "listing does not exist"))
  }
  if (listing.userRef != req.id) {
    return next(errorhandler(404, "update your own account"))
  }
  try {
    const listUpdateDone = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(listUpdateDone)
  } catch (e) {
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

export const getBookMark = async (req, res, next) => {
  const { userId, listingIdforbackend } = req.query;

  try {
    const listing = await Listing.findById(listingIdforbackend)

    if (!listing) {
      return next(errorhandler(404, "listing not found"))
    }
    console.log("User ID:", userId, "Listing ID:", listingIdforbackend);

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = userDetails.bookmarks.includes(listingIdforbackend)

    if (isBookmarked) {
      return res.status(200).json({ bookmarked: true, listingDetails: listing });
    } else {
      return res.status(200).json({ bookmarked: false, listingDetails: listing });
    }

  } catch (err) {
    console.error("Error checking bookmark:", err);
    return res.status(500).json({ error: "Server error" });
  }

}




export const getAllMybookmarks = async (req, res, next) => {
  const { userId } = req.query
  console.log("id is ", userId)
  const userBookMarkedListings = await User.findById(userId).populate("bookmarks");
  if (!userBookMarkedListings) return res.status(404).json("NO bookmarks")
  console.log(userBookMarkedListings.bookmarks)
  res.status(200).json(userBookMarkedListings.bookmarks)


}

export const getistings = async (req, res, next) => {
  try {
    let offer = req.query.offer
    let parking = req.query.parking
    let furnished = req.query.furnished
    const searchTerm = req.query.searchTerm || ''
    let type = req.query.type
    const limit = parseInt(req.query.limit) || 9
    const startIndex = parseInt(req.query.startIndex) || 0;


    if (offer === undefined || offer === 'false') {
      offer = { $in: [true, false] }
    }

    if (parking === undefined || parking === 'false') {
      parking = { $in: [true, false] }
    }

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [true, false] }
    }

    if (type === undefined || type === 'all') {
      type = { $in: ['rent', 'sale'] }
    }


    const sort = req.query.sort || 'createdAt'
    const order = req.query.order || 'desc'

    const listing = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type
    }).limit(limit)
      .sort({ [sort]: order })
      .skip(startIndex)
    res.status(200).json(listing)
  } catch (e) {
    next(errorhandler(404, "backend error"))
  }
}