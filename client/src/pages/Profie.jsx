import React, { useState  , useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useRef } from "react";
import { getStorage,ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../../firebase';
import { updateFailure , updateSuccess , deleteFailure , deleteSuccess , ErrorUpdate } from '../Redux/User/UserSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Profie = () => {
  const {currentUser , error } = useSelector((state)=>state.user)
  const reference = useRef();
  const [file , setFile] = useState(undefined)
  const [error2 , setError2] = useState(false)
  const [filePerc, setFilePerc] = useState(0);
const [formData , setFormData] = useState({})
const [update , setUpdate] = useState("")
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
            console.log('File available at', downloadURL);
            setFormData({...formData , avatar :downloadURL})
          });
        }
  )
}
// updating user 
const onsubmitHandle=async (e)=>{
  e.preventDefault();
  const id = currentUser.user._id
  try{
    const response = await fetch(`http://localhost:3000/api/user/update/${id}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify(formData),
    });
    
    const res = await response.json()
    if(res.success=== false){
     return  dispatch(updateFailure(res.message))
    }
    setUpdate("Updated Successfully")
    dispatch(updateSuccess(res))
  }
  catch(e){
dispatch(updateFailure(e.message))
  }

}

const handleChange=(e)=>{
  setFormData({...formData , [e.target.id] : e.target.value })
}
  console.log(currentUser)


  
// deleting user
  const handleDeleteUser =async (e)=>{
    e.preventDefault();
  const id = currentUser.user._id
  try{
    const response = await fetch(`http://localhost:3000/api/user/delete/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify(formData),
    });
    
    const res = await response.json()
    if(res.success=== false){
     return  dispatch(deleteFailure(res.message))
    }
    localStorage.removeItem("token")
    dispatch(deleteSuccess())
    navigate("/")
  }
  catch(e){
dispatch(deleteFailure(e.message))
  }
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
  <span className='text-red-600 font-semibold'>{error ? error : null}</span>
  <span className='text-green-700 font-semibold'>{update ? update :  null}</span>

    </div>
    </div>
  )
}

export default Profie
