import React, { useState  , useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useRef } from "react";
import { getStorage,ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../../firebase';
const Profie = () => {
  const {currentUser } = useSelector((state)=>state.user)
  const reference = useRef();
  const [file , setFile] = useState(undefined)
  const [error , setError] = useState(false)
  const [filePerc, setFilePerc] = useState(0);
const [formData , setFormData] = useState({})

  useEffect(()=>{
    if(file){
      handleFileUpload(file)}
  },[file])

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

          setError(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setFormData({...formData , avatar :downloadURL})
          });
        }
  )
}

  
  return (
    <div>
        <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form  className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={reference} hidden accept="image/*" />
      <img
          src={  formData.avatar || currentUser.user.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          onClick={()=>reference.current.click()}
        />
         <p className='text-sm self-center'>
        {error ? (<span className='text-red-700'>Error Image upload (image must be less than 2 mb)</span>) : (filePerc >0 && filePerc<100 ? <span>uploading {filePerc}%</span> : filePerc == 100  ?(<span  className='text-green-700'>image successfully uploaded!</span>) :"" )}
         </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.user.username}
          id='username'
          className='border p-3 rounded-lg'
          
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.user.email}
          className='border p-3 rounded-lg'
          
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          Submit
        </button>
      
      </form>
  
    </div>
    </div>
  )
}

export default Profie
