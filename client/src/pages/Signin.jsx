import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Signin = () => {

const [error , setError] = useState(null)
const [formData , setFormData] = useState({})
const navigate = useNavigate();

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const submitHandler=async (e)=>{
    try{
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json()
      if(res.success== false){
        setError(res.message)
      }else{
        navigate("/")
      }
    }
    catch(e){
      setError(e)
    }
  }

  return (
    <div>
       <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
        Submit 
        </button>
        
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/signup'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error ? <p className='text-red-500 mt-5'>{error}</p> : null}
    </div>
    </div>
  )
}

export default Signin
