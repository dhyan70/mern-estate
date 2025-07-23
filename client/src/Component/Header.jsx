import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate()
  const handleClick = (e) => {
    e.preventDefault()
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("searchTerm", searchValue)
      const searchQuery = params.toString();
      navigate(`/search?${searchQuery}`)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get("searchTerm")
    if (value) {
      setSearchValue(value)
    }
  }, [location.search])

  
  return (
    <div>
      <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-500'>Major</span>
              <span className='text-slate-700'>Estate</span>
            </h1>
          </Link>
          <form
            className='bg-slate-100 p-3 rounded-lg flex items-center'
          >
            <input onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              type='text'
              placeholder='Search...'
              className='bg-transparent focus:outline-none w-24 sm:w-64'
            />
            <button onClick={handleClick}>
              <FaSearch className='text-slate-600' />
            </button>
          </form>
          <ul className='flex gap-4'>
            <Link to='/'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>
                Home
              </li>
            </Link>
            <Link to='/about'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>
                About
              </li>
            </Link>
            <Link to='/signin'>
              <li className=' text-slate-700 hover:underline'> {currentUser ? null : "Signin"}</li>
            </Link>
            <Link to="/profile">
              {currentUser ? <img className='rounded-full h-7 w-7 object-cover mr-[50px]' src={currentUser.user?.avatar}></img> : null}
            </Link>
            <Link to='/mybookmarks'>
              {currentUser ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
                : null}
            </Link>
          </ul>
        </div>

      </header>

    </div>
  )
}

export default Header
