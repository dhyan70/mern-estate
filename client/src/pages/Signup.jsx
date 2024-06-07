import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import OAuth from '../Component/OAuth'
export default function Signup  () {

const [FormData , Setformdata] = useState({})
const [error , setError ] = useState(null)
const navigate = useNavigate();

const handlechange =(e)=>{
  Setformdata({
    ...FormData,
    [e.target.id] : e.target.value
  })
}

const submitHandler=async (e)=>{
  e.preventDefault();
  try{
  const response = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(FormData),
    });
    const data = await response.json();
    if(data.success == false){
      setError(data.message)
      return
    }else{
      console.log(data)
      navigate("/")
    }
    
  }
  catch(error){
    setError(error.message)
  }
}


  return (
    <div>
      <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form   onSubmit={submitHandler} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handlechange}
          />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handlechange}
          />

        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password' 
          onChange={handlechange}
          />

        <button
          className='bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Submit
        </button>
        <OAuth />
       
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/signin'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error ? <p className='text-red-500 mt-5'>{error}</p> : null}
    </div>
    </div>
  )
}

