import React, { useState  , useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useRef } from "react";
import { getStorage,ref, uploadBytesResumable, getDownloadURL, list } from "firebase/storage";
import { app } from '../../firebase';
import { updateFailure , updateSuccess , deleteFailure , deleteSuccess , ErrorUpdate } from '../Redux/User/UserSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Profie = () => {
  const {currentUser , error } = useSelector((state)=>state.user)
  const reference = useRef();
  const [file , setFile] = useState(undefined)
  const [error2 , setError2] = useState(false)
  const [filePerc, setFilePerc] = useState(0);
  const [listing , setListing] = useState([])
const [formData , setFormData] = useState({})
const [update , setUpdate] = useState("")
// const [delErr , setDelErr] = useState(null)
// const [listingError , setshowListingError] = useState(null) 
const navigate = useNavigate()
const dispatch = useDispatch()
  useEffect(()=>{
    if(file){
      handleFileUpload(file)}
  },[file])

  useEffect(() => {
    dispatch(updateFailure(null))
  },[]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress))
      },
        (error) => {
          setError2(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            
            setFormData({...formData , avatar :downloadURL})
          });
        }
  )
}
// updating user 
const onsubmitHandle=async (e)=>{
  e.preventDefault();
  const id = currentUser.user._id
  
     await axios.post(`http://localhost:3000/api/user/update/${id}`, 
      formData, 
      {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
    }).then((response)=>{
      const res = response.data
      setUpdate("Updated Successfully")
    return dispatch(updateSuccess(res))
    }).catch((err)=>{
      const res= err.response.data
      if(res.success === false){
        return  dispatch(updateFailure(res.message))
      }
    })
}

const handleChange=(e)=>{
  setFormData({...formData , [e.target.id] : e.target.value })
}
  


  
// deleting user
  const handleDeleteUser =async (e)=>{
    e.preventDefault();
  const id = currentUser.user._id
  // deleting the user

     await axios.delete(`http://localhost:3000/api/user/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      }
    }).then((response)=>{
      localStorage.removeItem("token")
    dispatch(deleteSuccess())
    navigate("/")
    }).catch((err)=>{
      const res = err.response.data
      if(res.success=== false){
       dispatch(deleteFailure(res.message))
       }
    })
  }


// signout
const handleSignOut=async (e)=>{
  const id = currentUser.user._id
  try{
    localStorage.removeItem("token")
    dispatch(deleteSuccess())
    navigate("/")
  }
  catch(e){
dispatch(deleteFailure(e.message))
  }
}
const handleShowListings=async(e)=>{
e.preventDefault()
const id = currentUser.user._id
try{
//axios  get listing
  const response = await axios.get(`http://localhost:3000/api/user/listing/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  })
  
  const res = await response.data
  if(res.success == false){
   return  setshowListingError("error in showing listing")
  }
  setListing(res)
}catch(e){
  setshowListingError(e.message)
}
}

const handleListingDelete=async (id)=>{
  try{
  //axios delete listing
  
  const response = await axios.delete(`http://localhost:3000/api/listing/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  })
  const res = await response.data
  if(res.success == false){
    setDelErr("error in deletion")
  }
  setListing(listing.filter((item)=> item._id != id))
}catch(e){
  setDelErr("error in deleting the listt")
}
}
  return (
    <div>
        <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={onsubmitHandle}  className='flex flex-col gap-4' >
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={reference} hidden accept="image/*" />
      <img
          src={  formData.avatar || currentUser.user?.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          onClick={()=>reference.current.click()}
          onChange={(e)=>handleChange(e)}
        />
         <p className='text-sm self-center'>
        {error2 ? (<span className='text-red-700'>Error Image upload (image must be less than 2 mb)</span>) : (filePerc >0 && filePerc<100 ? <span>uploading {filePerc}%</span> : filePerc == 100  ?(<span  className='text-green-700'>image successfully uploaded!</span>) :"" )}
         </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.user?.username}
          onChange={(e)=>handleChange(e)}
          id='username'
          className='border p-3 rounded-lg'
          
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.user?.email}
          onChange={(e)=>handleChange(e)}
          className='border p-3 rounded-lg'
          
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={(e)=>handleChange(e)}
        />
        <button
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          Submit
        </button>
        <Link 
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
    

      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
  <span className='text-red-600 font-semibold'>{error ? error : null}</span>
  <span className='text-green-700 font-semibold'>{update ? update :  null}</span>
  {listing && listing.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {listing.map((item) => (
            <div
              key={item._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${item._id}`}>
                <img
                  src={item.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${item._id}`}
              >
                <p>{item.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(item._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${item._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
    </div>
    
  )
}

export default Profie
