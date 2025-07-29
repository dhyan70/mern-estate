import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { FaBed, FaBath, FaMapMarkerAlt, FaParking } from "react-icons/fa";

const Mybookings = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [bookings, setBookings] = useState([{}])
    useEffect(() => {
        const getBookedListings = async () => {
            const response = await axios.get(`http://localhost:3000/api/user/getbookings/${currentUser.user._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                }
            });
            const data = await response.data;
            console.log(data.details)
            setBookings(data.details)

        }
        getBookedListings()
    }, [])
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            { bookings.length > 0 ? (bookings.map((item, idx) => (
               <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* <img
            src={item.imageUrls?.[0]}
            alt={item.name}
            className="h-64 w-full object-cover"
          /> */}
          <div className="p-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.listingid?.name}</h2>
            <p className="text-gray-600 mb-3">{item.listingid?.description}</p>

            <div className="text-sm text-gray-500 mb-4">
              <p><span className="font-semibold">Start Date:</span> {new Date(item.startDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">End Date:</span> {new Date(item.endDate).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
              <p><span className="font-semibold">Address:</span> {item.listingid?.address}</p>
              <p><span className="font-semibold">Type:</span> {item.listingid?.type}</p>
              <p><span className="font-semibold">Bedrooms:</span> {item.listingid?.bedrooms}</p>
              <p><span className="font-semibold">Bathrooms:</span> {item.listingid?.bathrooms}</p>
              <p><span className="font-semibold">Furnished:</span> {item.listingid?.furnished ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Parking:</span> {item.listingid?.parking ? 'Yes' : 'No'}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold text-green-600">
                ${item.listingid?.regularPrice}
              </span>
              {item.listingid?.offer && <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">Offer Available</span>}
            </div>
          </div>
        </div>
            ))): "no booking found "}
        </div>
    )
}
export default Mybookings