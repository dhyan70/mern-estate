import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from "react-redux";
import ContactToOwner from "../Component/ContactToOwner";
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,

  FaMapMarkerAlt,
  FaParking,

} from 'react-icons/fa';
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user)
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false)
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const params = useParams();
  const listingId = params.listingId;
  useEffect(() => {
    // const getListing = async () => {
    //   try {
    //     setLoading(true);
    //     const listingId = params.listingId;
    //     const response = await axios.get(`http://localhost:3000/api/listing/get/${listingId}`, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       }
    //     })

    //     const data = await response.data
    //     console.log(data) //listing details
    //     if (data.success == false) {
    //       setError(true);
    //       setLoading(false);
    //     }
    //     setError(false);
    //     setLoading(false);
    //     setListing(data);
    //   } catch (e) {
    //     setLoading(false);
    //     setError(true);
    //     setLoading(false);
    //   }
    // };
    const checkBookmark = async () => {
      console.log("this is called")
      const listingId = params.listingId;
      try {
        const res = await axios.get(`http://localhost:3000/api/bookmarks/getbookmark`, {
          params: {
            userId: currentUser.user._id,
            listingIdforbackend: listingId,
          },
          headers: {
            "Content-Type": "application/json",
          }
        })
        if (res.data.bookmarked) {
          setListing(res.data.listingDetails)

          setBookmarked(true);
        } else {
          setListing(res.data.listingDetails)
          setBookmarked(false);

        }
      } catch (err) {
        console.log(err)
      }
    }
    checkBookmark();
  }, []);

  const handleBookmark = async () => {

    try {
      const response = await axios.post(
        "http://localhost:3000/api/bookmarks/addremove",
        {
          userId: currentUser.user._id,
          listingId: listing._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setBookmarked(true);
      } else {
        setBookmarked(false);
      }
    } catch (err) {
      console.error("Failed to bookmark:", err);
    }
  };



  return (
    <main className="bg-gray-50 min-h-screen py-6">
      {loading && <p className="text-center my-7 text-2xl text-gray-600">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl text-red-600">Something went wrong!</p>}

      {listing && !loading && !error && (
        <div className="max-w-5xl mx-auto">
          <Swiper navigation className="rounded-xl overflow-hidden shadow-md">
            {listing.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[450px] bg-center bg-cover"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-6 space-y-5">
            <div className="flex justify-between items-start">
              <p className="text-2xl font-semibold text-gray-800">
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice?.toLocaleString('en-US')
                  : listing.regularPrice?.toLocaleString('en-US')}
                {listing.type === 'rent' && <span className="text-sm text-gray-600">/month</span>}
              </p>
              <button onClick={handleBookmark} className="text-red-500 text-2xl">
                {bookmarked ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
                </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                }
              </button>
            </div>

            <p className="flex items-center gap-2 text-gray-600 text-sm font-medium">
              <FaMapMarkerAlt className="text-green-600" />
              {listing.address}
            </p>

            <div className="flex gap-3 flex-wrap">
              <span className="bg-blue-700 text-white text-sm px-4 py-1 rounded-full">
                {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              {listing.offer && (
                <span className="bg-green-700 text-white text-sm px-4 py-1 rounded-full">
                  {parseInt(
                    ((+listing.regularPrice - +listing.discountPrice) / +listing.regularPrice) * 100
                  )}
                  % OFF
                </span>
              )}
            </div>

            <p className="text-gray-700 text-base">
              <span className="font-semibold text-gray-900">Description:</span> {listing.description}
            </p>

            <ul className="text-gray-800 font-medium text-sm flex flex-wrap gap-4 sm:gap-6">
              <li className="flex items-center gap-2">
                <FaBed className="text-indigo-600" />
                {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
              </li>
              <li className="flex items-center gap-2">
                <FaBath className="text-pink-500" />
                {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
              </li>
              <li className="flex items-center gap-2">
                <FaParking className="text-yellow-600" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-2">
                <FaChair className="text-purple-600" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {currentUser && currentUser.user._id !== listing.userRef && !contact && (
              <div className="gap-y-4 gap-x-4">
                <button
                  onClick={() => setContact(true)}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg uppercase tracking-wide transition"
                >
                  Contact landlord
                </button>

                <Link to={`/bookingDetails`}>
                  <button
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg uppercase tracking-wide transition"
                  >
                    Book the Property
                  </button>
                </Link>
              </div>
            )}

            {currentUser && contact && (
              <div className="pt-4">
                <ContactToOwner listing={listing} />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );

};

export default Listing;
