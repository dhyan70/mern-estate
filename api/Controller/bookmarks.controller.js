import User from '../models/user.model.js'
import Listing from '../models/listing.model.js'
export const addBookmark = async (req, res, next) => {
    const { userId, listingId } = req.body
    try {
        const listing =await  Listing.findById(listingId)
        if (!listing) return next(errorhandler(404, "Listing not found"))

        const users = await User.findById(userId)
        if (!userId) return next(errorhandler(404, "User not found"))
        if (users.bookmarks.includes(listingId)) {
            users.bookmarks.pull(listingId);
            await users.save();
            return res.status(200).json({ success: false, listingId:listingId })
        } 
         if (!Array.isArray(users.bookmarks)) {
            users.bookmarks = [];
        }
        //1st time
        users.bookmarks.push(listingId);

        await users.save();

        return res.status(200).json({ success: true, listingId:listingId });
    }
    catch (err) {
        next(err)
    }
}