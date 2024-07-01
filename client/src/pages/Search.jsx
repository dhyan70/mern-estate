import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Listing from './Listing'
import Listings from '../Component/Listing'
const Search = () => {
    const [formData , setFormData ]= useState({
        searchTerm : '',
        type:'all',
        parking:false,
        furnished:false,
        sort: 'createdAt',
        order : 'desc',
        offer : false
    })
    const [listing , setListing] = useState([])
    const [showMore , setShowMore] = useState(false)
    const [loading , setLoading] = useState(false)
  
    useEffect(()=>{
      let params = new URLSearchParams(location.search);
    const searchTermFromUrl = params.get("searchTerm")
    const typeFromUrl = params.get("type")
    const offerFromUrl = params.get("offer")
    const parkingFromUrl = params.get("parking")
    const furnishedFromUrl = params.get("furnished")
    const orderFromUrl = params.get("order")
    const sortFromUrl = params.get("sort")

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setFormData({
        ...formData,
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }


      const getInfo =async()=>{
        setLoading(true)
        const searchQuery = params.toString();
        const response = await fetch(`http://localhost:3000/api/listing/search?${searchQuery}`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        });
        const data = await response.json();
        if(data.success == false){
          console.log(data.message)
        }
        console.log(data.length)
        if(data.length == 9){
          setShowMore(true)
        }else{
          setShowMore(false)
        }
        setLoading(false)
        setListing(data)
        
      }
      getInfo()
    },[location.search])

    const navigate = useNavigate()
    const onChangeHandler=(e)=>{
      if(e.target.id == 'searchTerm'){
        setFormData({...formData , searchTerm : e.target.value})
      }
        if(e.target.id == 'sale' || e.target.id == 'rent' || e.target.id== 'all'){
            setFormData({...formData , type:e.target.id})
        }
        if(e.target.id == 'offer'){
            setFormData({...formData , offer: e.target.checked})
        }
        if(e.target.id == 'parking'){
            setFormData({...formData , parking: e.target.checked})
        }
        if(e.target.id == 'furnished'){
            setFormData({...formData , furnished: e.target.checked})
        }
        if(e.target.id == 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setFormData({...formData , sort , order})
        }
    }

    console.log(listing)
const onSubmitHandler =(e)=>{
    e.preventDefault()
    const params = new URLSearchParams();
    params.set("searchTerm", searchTerm.value)
    params.set("type" , formData.type)
    params.set("offer" , formData.offer)
    params.set("parking" , formData.parking)
    params.set("furnished" , formData.furnished)
    params.set("sort" , formData.sort)
    params.set("order" , formData.order)
    const searchQuery = params.toString(); 
    navigate(`/search?${searchQuery}`);
}
const showMoreHandle =async()=>{
  const startingIndex = listing.length
  if(startingIndex == 9){
    setShowMore(true)
  const params = new URLSearchParams(location.search)
  params.set("startIndex" , startingIndex)
  const searchQuery = params.toString();
  console.log(searchQuery)
  const response = await fetch(`http://localhost:3000/api/listing/search?${searchQuery}`, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  });
  const data = await response.json();
  console.log(data)
  if(data.success == false){
    console.log(data.message)
  }
  setListing([...listing , ...data])
  if(data.length == 9) {
   setShowMore(true) 
  }else{
    setShowMore(false)
  }
}
}

  return (
    <div>
       <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              onChange={onChangeHandler}
              value={formData.searchTerm}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={onChangeHandler}
                checked={formData.type =='all'}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={onChangeHandler}
                checked={formData.type == 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={onChangeHandler}
                checked={formData.type == 'sale'}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={onChangeHandler}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={onChangeHandler}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={onChangeHandler}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
              onChange={onChangeHandler}
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
        {!loading && listing.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

        {listing.map((listing) => (
              <Listings key={listing._id} listing={listing} />
            ))}
             {showMore && (
            <button
              onClick={showMoreHandle}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Search
