import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useState } from "react";
import { format } from "date-fns";

import { FaBed, FaBath, FaMapMarkerAlt, FaParking } from "react-icons/fa";

const Mybookings = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [bookings, setBookings] = useState([{}])
    useEffect(() => {
        const getBookedListings = async () => {
            const response = await fetch(`http://localhost:3000/api/user/getbookings/${currentUser.user._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                },
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log(data.details)
            setBookings(data.details)

        }
        getBookedListings()
    }, [])
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {bookings.map((item, idx) => (
                <div
                    key={item._id || idx}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                    {/* Image Carousel */}
                    <div className="w-full h-64 overflow-hidden bg-gray-100">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                            <img
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No image available
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {item.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                            <FaMapMarkerAlt className="inline mr-1 text-red-500" />
                            {item.address}
                        </p>

                        <div className="flex gap-4 text-gray-700 text-sm mb-2">
                            <p><FaBed className="inline mr-1" /> {item.bedrooms} beds</p>
                            <p><FaBath className="inline mr-1" /> {item.bathrooms} baths</p>
                            {item.parking && <p><FaParking className="inline mr-1" /> Parking</p>}
                        </div>

                        <p className="text-gray-700 mb-2">
                            <strong>Furnished:</strong> {item.furnished ? "Yes" : "No"}
                        </p>

                        <p className="text-gray-500 mb-2 text-sm">
                            {item.description}
                        </p>

                        <div className="text-blue-700 font-medium mb-2">
                            {item.offer && (
                                <span>
                                    <del className="text-gray-400 mr-2">${item.regularPrice}</del>
                                    ${item.discountPrice} <span className="text-sm text-green-600">(Offer)</span>
                                </span>
                            )}
                            {!item.offer && <span>${item.regularPrice}</span>}
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>
                                <strong>Booked by:</strong> {item.name}
                            </p>
                            <p>
                                <strong>Start:</strong>{" "}
                                {item.startDate}
                            </p>
                            <p>
                                <strong>End:</strong>{" "}
                                {item.endDate}
                            </p>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}
export default Mybookings