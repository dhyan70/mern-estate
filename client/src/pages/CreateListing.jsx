import React, { useState } from 'react'

import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const CreateListing = () => {
  const [files , setFiles] = useState([])
  const [error , setError] = useState(null)
  const {currentUser } = useSelector((state)=>state.user)
  const [success , setSuccess] = useState("")
  const [errorD ,setDError] = useState("")
  const navigate = useNavigate()
  const [formData , setFormData ]= useState({
    imageUrls : [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
})
const [imageError , setImageError] = useState(null)
const [catchError , setCatchError] = useState(null)
  const onchangeEvent=(e)=>{
    setFiles( e.target.files)
  }
  

const handleImageSubmit=()=>{

if(files.length > 0 && files.length + formData.imageUrls.length <7 ){
  const promise = []
  for(let i=0 ; i< files.length ;i++){
    promise.push(storage(files[i]))
  }
  Promise.all(promise).then((url)=>{
       setFormData({
        ...formData, 
        imageUrls: formData.imageUrls.concat(url)
      })
    }).catch((e)=>{
      setCatchError('Image upload failed (2 mb max per image)')
    })
}else{
  setImageError("please select 6 or less image")
}
}


const storage =(file)=>{
  return new Promise((resolve , reject)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL)
          resolve(downloadURL)
        });
      }
    );
  })
}
const handleRemoveImage = (index) => {
   setFormData({
    ...formData,
    imageUrls : formData.imageUrls.filter((url,id)=> id != index)
   })
}

const onChangeHandler =(e)=>{
  if(e.target.id == 'sale' || e.target.id == 'rent'){
    setFormData({
      ...formData,
      type : e.target.id
    })
  }
  if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
    setFormData({
      ...formData,
      [e.target.id] : e.target.checked,
    })
  }
  if (
    e.target.type === 'number' ||
    e.target.type === 'text' ||
    e.target.type === 'textarea'
  ) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
}
const onSubmitHandler=async(e)=>{
  e.preventDefault() 
  if (formData.imageUrls.length < 1)
    return setError('You must upload at least one image');
  if(+formData.discountPrice > +formData.regularPrice) return setDError("Discount Price is more than regualr price")
  try{
  const response = await fetch("http://localhost:3000/api/listing/create-listing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...formData,
      userRef: currentUser.user._id,
    }),
  });
  const res = await response.json();
  console.log(res)
  if(res.success == false){
    setError(res.message)
  }
  setSuccess("SuccessFully Listed")
  navigate(`/listing/${res.list._id}`);

  console.log(res.list._id)

}catch(e){
  console.log(e)
  setError(e)
}

}

  return (
    <div>
       <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={onChangeHandler}
            checked ={formData.address}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={onChangeHandler}
            checked ={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={onChangeHandler}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={onChangeHandler}
                checked = {formData.type == 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={onChangeHandler}
                checked = {formData.type == 'rent'}
             
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={onChangeHandler}
                checked = {formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={onChangeHandler}
                checked = {formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={onChangeHandler}
                checked = {formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={onChangeHandler}
                
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={onChangeHandler}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={onChangeHandler}
              />
              <div className='flex flex-col items-center'>
              {formData.type=='rent' ? <p>Regualr price ($/month)</p> :  <p>Regualr price ($)</p>}
              </div>
            </div>
           
              {formData.offer ? <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={onChangeHandler}
                />
                <div className='flex flex-col items-center'>
                {formData.type=='rent' ? <p>Discounted price ($/month)</p> :  <p>Discounted price ($)</p>}
                  
                </div>
              </div> : null}
          
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
            onChange={(e)=>onchangeEvent(e)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              onClick={handleImageSubmit}  
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              Upload
            </button>
          </div>
          <p className='text-red-700 text-sm'>
          {imageError ? <span className='text-rose-700'>{imageError}</span> : null}
          {catchError ? <span className='text-rose-700'>{catchError}</span> : null}
          </p>
       
         {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
          
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            
          >
            Submit
          </button>
         {error ? <span className='text-red-600 font-semibold'>{error}</span> : null}
         {success ? <span className='text-green-700 font-semibold'>{success}</span> : null }
         {errorD ? <span className='text-red-600 font-semibold'>{errorD}</span> : null}
        </div>
      </form>
    </main>
 
    </div>
  )
}

export default CreateListing
