
import React, { useEffect  , useState} from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import Listings from '../Component/Listing';
import axios from 'axios';
const Home = () => {
  const [offerListing  , setOfferListing] = useState([])
  const [rentListing  , setRentisting] = useState([])
  const [saleListing  , setSaleListing] = useState([])
  const [error , setError] = useState(false)
  SwiperCore.use([Navigation]);

  useEffect(()=>{
    const getOfferInfo =async()=>{
      setError(false)
       await axios.get("http://localhost:3000/api/listing/search?offer=true&limit=4", {
        headers: {
          "Content-Type": "application/json",
        }
      }).then(response => {
        setError(false)
        const data = response.data;
        setOfferListing(data)
      })
      .catch((error) => {
        setError(true)
        const res= error.response.data
        if(res.success === false) {
          setError(error.response.data.message)
          console.log(error.response.data.message)
        }
      });
    }
    getOfferInfo()

    const rentInfo=async()=>{
      const response = await fetch("http://localhost:3000/api/listing/search?type=rent&limit=4", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });
      const data = await response.json();
      if(data.success == false){
        setError(true)
      }
      setError(false)
      setRentisting(data)
    }
    rentInfo()

    const saleInfo=async()=>{
      const response = await fetch("http://localhost:3000/api/listing/search?type=sale&limit=4", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });
      const data = await response.json();
      if(data.success == false){
        setError(true)
      }
      setError(false)
      setSaleListing(data)
    }
    saleInfo()
    

  },[])

  


  return (
   
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
         key={listing._id}
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className='max-w-8xl mx-auto p-3 flex flex-col gap-2 my-10 '>
        {offerListing && offerListing.length > 0 && (
          <div className=''>
            <div className='my-6 text-center'>
              <h2 className='text-2xl font-semibold text-slate-600 '>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline ' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-6 w-full justify-center '>
              {offerListing.map((listing) => (
                <Listings listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className=''>
            <div className='my-6 text-center'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4 justify-center'>
              {rentListing.map((listing ) => (
                <Listings listing={listing} key={listing._id}  />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div >
            <div className='my-6 text-center'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4 justify-center'>
              {saleListing.map((listing) => (
               <Listings  listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    
    </div>
  );
}

export default Home
