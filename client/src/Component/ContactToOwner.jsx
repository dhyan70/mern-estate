import { list } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ContactToOwner = ({listing}) => {
    console.log(listing)
  const [landlord , setLandlord] = useState({})
const [message , setMessage] = useState("")
  const onChange=(e)=>{
    setMessage(e.target.value)
  }
    useEffect(()=>{
        const getInfo =async()=>{
            try{
            const id = listing.userRef
            const response = await fetch(`http://localhost:3000/api/user/${id}`, {
                method: "GET", 
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token")
                },
                body: JSON.stringify(),
              });
              const data = await response.json();
              if(data.success == false){
                console.log("error in backend ")
              }
              setLandlord(data)
            }catch(e){
                
            }
        }
        getInfo()
    },[listing.userRef])
    console.log(landlord)
  return (
    <div>
     {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </div>
  )
}
export default ContactToOwner
