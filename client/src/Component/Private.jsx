import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
const Private = () => {
  const { currentUser} = useSelector((state)=>state.user)
  return (
    <div>
      {currentUser ?  <Outlet /> : <Navigate to='/signin' />}
    </div>
  )
}

export default Private
