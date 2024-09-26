import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import logo from './logo.png';
import { Link, NavLink } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import { ToastContainer ,toast} from 'react-toastify';
import Cookies from 'js-cookie';

import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((dropdownRef.current && profileIconRef.current) && (!dropdownRef.current.contains(event.target) && !profileIconRef.current.contains(event.target)) ) {
        // Click occurred outside the dropdown, so close it
        setDropdownVisible(false);
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate() 

  let auth  
  
  if (Cookies.get('45034583/45843958/985307'))
  {
    const detail = Cookies.get('45034583/45843958/985307')
    auth = detail.split(',')
  }
  
  const logout = () => {
    toggleDropdown();
    const singout = new Promise (async(res,rej)=>{  
    res(Cookies.remove('45034583/45843958/985307'))
    })
    singout.then((out)=>{         
     toast.success('Logout Sucessfully')
     navigate('/Sigin')
    })
 
} 


  return (    
    <header>
      <ToastContainer
            position='top-center'
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
      <div className='header-container'>
        <div className='header-left'>
          <Link to="/" >
            <img src={logo} alt="" />
          </Link>
          <h3>       </h3>
        </div>
        <div className='header-center'>
          <h1 className='header-title'><font style={{color:'#006633'}}>Discussion Forum</font></h1>
          <h2 className='header-title2'><font style={{color:'#006633'}}>ICAR (Indian Council Of Agricultural Research)</font></h2>
        </div>       
        {
          auth ?
          <div className='header-right'>
          <div className='header-profile-icon' onClick={toggleDropdown} ref={profileIconRef}>
                <Avatar />
              </div>
              <div className={`header-dropdown ${isDropdownVisible && 'active'}`} ref={dropdownRef}>
                {/* <NavLink
                  to={{
                    pathname: '/profile',
                  }}
                  className='header-dropdown-item'
                  onClick={toggleDropdown}
                // to={`/profile?id=${auth[0]}`}
                // onClick={(e) => {
                //   e.preventDefault();
                //   navigate(`/profile?id=${auth[0]}`);
                // }}
                >
                  <PersonIcon />
                  Profile
                </NavLink>
                <NavLink
                  to={{
                    pathname: '/settings',
                  }}
                  className='header-dropdown-item' onClick={toggleDropdown}>
                  <SettingsIcon />
                  Settings
                </NavLink> */}
                <div className='header-dropdown-item' onClick={logout}>
                  <LogoutIcon />
                  Log out
                </div>
              </div>
          </div> 
          :
          <p></p>
        }
      </div>
    </header>
  );
}

export default Header;