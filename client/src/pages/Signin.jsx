import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { signInFailure , signInSuccess } from '../Redux/User/UserSlice'
import { useSelector , useDispatch } from 'react-redux'
import { useEffect } from 'react'
import OAuth from '../Component/OAuth'
const Signin = () => {

const [formData , setFormData] = useState({})
const { error }  = useSelector((state) => state.user)
const navigate = useNavigate();

const dispatch = useDispatch()

useEffect(() => {
  dispatch(signInFailure(null))
},[]);

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const submitHandler=async (e)=>{
    try{
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/signin",
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json()
      console.log(res)
      if(res.success== false){
        dispatch(signInFailure(res.message))
        
      }else{
        localStorage.setItem("token" , res.token)
        dispatch(signInSuccess(res))
        navigate("/")
      }
    }
    catch(e){
      dispatch(signInFailure(e.message))
    }
  }

  return (
    <div>
       <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4' >
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
        <OAuth />
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
