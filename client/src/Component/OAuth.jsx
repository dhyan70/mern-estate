import React from 'react'
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { app } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { signInFailure , signInSuccess } from '../Redux/User/UserSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const OAuth = () => {
  const navigate = useNavigate()
  const dispatch= useDispatch()
  useEffect(() => {
    dispatch(signInFailure(null))
  },[]);
  
    const onclickHandle=async (e)=>{
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const result =await signInWithPopup(auth, provider)
        try{
        const response = await fetch("http://localhost:3000/api/auth/google", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name : result.user.displayName,
            email: result.user.email,
            photo:result.user.photoURL
          }),
        });
        const res = await response.json()
        if(res.success==false){
          console.log(res.message)
          dispatch(signInFailure(res.message))
        }else{
          localStorage.setItem("token" , res.token)
        console.log(res)
          navigate("/")
          dispatch(signInSuccess(res))
        }
      }catch(error){
        console.log(error)
         dispatch(signInFailure(error.message))
      }
    }
  return (
    <div>
     
       <button  onClick={onclickHandle}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-[490px]'>
      Continue with google
    </button>
    </div>
  )
}

export default OAuth
