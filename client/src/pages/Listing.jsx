import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  

const Listing = () => {
    SwiperCore.use([Navigation]);
    const {currentUser } = useSelector((state)=>state.user)  
    const [error, setError] = useState(false);
    const [contact, setContact] = useState(false)
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    const getListing = async () => {
      try {
        setLoading(true);
        const listingId = params.listingId;
        const response = await fetch(`http://localhost:3000/api/listing/get/${listingId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(),
          }
        );
        const data = await response.json();
        console.log(data)
        if (data.success == false) {
          setError(true);
          setLoading(false);
        }
        setError(false);
        setLoading(false);
        setListing(data);
      } catch (e) {
        setLoading(false);
        setError(true);
        setLoading(false);
      }
    };
    getListing();
  }, []);

console.log(listing.imageUrls)
  return (
    <main>
      {loading ? <p className="text-center my-7 text-2xl">Loading...</p> : null}
      {error ? (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      ) : null}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
             {listing.imageUrls?.map((url)=>(
                <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
             ))}
          </Swiper>
        </div>
        
      )}
    <div className='flex flex-col max-w-max mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice?.toLocaleString('en-US')
                : listing.regularPrice?.toLocaleString('en-US')}{listing.type === 'rent'&&'/month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

          {currentUser && currentUser.user._id != listing.userRef && !contact &&(
           
           <button
           onClick={()=>setContact(true)}
            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
          >
            Contact landlord
          </button>
          )
          }
          {currentUser && contact &&(
            <ContactToOwner listing={listing}/>
          )}
          </div>
       
    </main>
  );
};

export default Listing;
