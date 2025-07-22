import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import Listings from "../Component/Listing";
const Mybookmarks =()=>{
    const {currentUser} = useSelector((state) => state.user)
    const [currentBookmarks , setCurrentBookMarks] = useState([])
      const [loading, setLoading] = useState(true);

    useEffect(()=>{
       const getAllMyBookmarks =async ()=>{
             try {
        const res = await axios.get("http://localhost:3000/api/bookmarks/mybookmarks", {
          params: {
            userId: currentUser.user._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data && Array.isArray(res.data)) {
          setCurrentBookMarks(res.data);
        } else {
          setCurrentBookMarks([]); // fallback
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
        }
        getAllMyBookmarks()
    },[currentUser])
    console.log(currentBookmarks)
    return (
            <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">My Bookmarks</h2>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading bookmarks...</p>
      ) : currentBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBookmarks.map((listing) => (
          <Listings listing={listing} key={listing._id}  />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 mt-10">
          No listings found in your bookmarks.
        </p>
      )}
    </div>
    )
}
export default Mybookmarks;