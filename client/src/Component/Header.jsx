import React, { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('searchTerm', searchValue);
      const searchQuery = params.toString();
      navigate(`/search?${searchQuery}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get('searchTerm');
    if (value) {
      setSearchValue(value);
    }
  }, [location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Major</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <button onClick={handleClick}>
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        <ul className='flex gap-4 items-center relative'>
          <Link to='/' className='hidden sm:inline text-slate-700 hover:underline'>
            Home
          </Link>
          <Link to='/about' className='hidden sm:inline text-slate-700 hover:underline'>
            About
          </Link>
          {!currentUser && (
            <Link to='/signin' className='text-slate-700 hover:underline'>
              Signin
            </Link>
          )}

          {currentUser && (
            <div className='relative' ref={dropdownRef}>
              <img
                onClick={() => setDropdownOpen(true)}
                className='rounded-full h-8 w-8 object-cover cursor-pointer'
                src={currentUser.user?.avatar}
                alt='profile'
              />

              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50'>
                  <Link
                    to='/profile'
                    className='block px-4 py-2 hover:bg-slate-100 text-sm text-slate-700'
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to='/mybookmarks'
                    className='block px-4 py-2 hover:bg-slate-100 text-sm text-slate-700'
                    onClick={() => setDropdownOpen(false)}
                  >
                    Bookmarks
                  </Link>
                  <Link
                    to='/mybookings'
                    className='block px-4 py-2 hover:bg-slate-100 text-sm text-slate-700'
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                </div>
              )}
            </div>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
