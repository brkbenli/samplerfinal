import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../photos/logo.png';
import { ImHome } from 'react-icons/im';
import { FaWpexplorer } from 'react-icons/fa';
import { FaHeartCirclePlus } from 'react-icons/fa6';
import axios from 'axios';

const Navbar = () => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      axios.get('http://localhost:8081/login').then((response) => {
        if (response.data.loggedIn) {
          setLoggedIn(true);
          setUsername(response.data.user[0].name);
        } else {
          setLoggedIn(false);
          setUsername('');
        }
        setLoading(false);
      });
    }, 1000); // 1000 milliseconds = 1 second
  
    // Cleanup function to clear the timeout if the component unmounts before the timeout finishes
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8081/logout').then(() => {
      setLoggedIn(false);
      setUsername('');
    });
  };

  return (
    <div className='bg-black text-white flex items-center justify-between px-3 pt-3 py-3'>
      {/* Left Side */}
      <div>
        <img src={logo} alt='' className='w-40' />
      </div>
      <div className='flex items-center justify-center absolute inset-x-0'>
        <ul className='flex items-center px-0'>
          <li>
            <Link to='/home'>
              <ImHome className='w-20 h-8 text-white' />
            </Link>
          </li>
          <li>
            <Link to='/explore'>
              <FaWpexplorer className='w-20 h-8 text-white'/>
            </Link>
          </li>
          <li>
            <Link to='/favourites'>
              <FaHeartCirclePlus className='w-20 h-8 text-white' />
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Side */}
      <div className='z-10'>
        {loading ? (
          <div>Loading...</div>
        ) : loggedIn ? (
          <div className='bg-white py-1.5 px-3 mr-1'>
            <span className='text-black font-bold'>{username}</span>
            <Link to='/home'
              onClick={handleLogout}
              className='ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded'
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className='bg-white py-1.5 px-3 mr-2'>
            <Link to='/login' className='text-black font-bold'>
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;