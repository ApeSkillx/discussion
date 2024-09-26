import React, { useState, useEffect, useRef } from 'react';
import './css/header.css';
import logo from '../images/logo.png';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import CryptoJS from 'crypto-js'
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

  if (Cookies.get('auth')) {
    var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
    auth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));      
  }

  const logout = () => {
    toggleDropdown();
    const singout = new Promise(async (res, rej) => {
      res(Cookies.remove('auth'))
    })
    singout.then((out) => {
      toast.success('Logout Sucessfully')
      navigate('/auth')
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

          <Link to="/index" >
            <img id='header-logo' src={logo} alt="" />
          </Link>

        </div>
        <div className='header-center'>
          <h1 className='header-title'><font style={{ color: '#006633' }}>Discussion Forum</font></h1>
          <h2 className='header-title2-l'><font style={{ color: '#006633' }}>ICAR (Indian Council of Agricultural Research)</font></h2>
          <h2 className='header-title2-m'><font style={{ color: '#006633' }}>Indian Council of Agricultural Research</font></h2>
          <h2 className='header-title2-s'><font style={{ color: '#006633' }}>I.C.A.R.</font></h2>
        </div>
        {
          auth ?
            <div className='header-right'>
              <div className='header-profile-icon' onClick={toggleDropdown} ref={profileIconRef}>
                <Avatar />                
              </div>
              <div className={`header-dropdown ${isDropdownVisible && 'active'}`} ref={dropdownRef}>
                <NavLink
                  to={{
                    pathname: '/profile',
                  }}
                  className='header-dropdown-item'
                  onClick={toggleDropdown}
                  id='header-profile-icon'
                // to={`/profile?id=${auth[0]}`}
                // onClick={(e) => {
                //   e.preventDefault();
                //   navigate(`/profile?id=${auth[0]}`);
                // }}
                >              
                  <PersonIcon />
                  {auth[1].toUpperCase()}
                </NavLink>
                <NavLink
                  to={{
                    pathname: '/settings',
                  }}
                  className='header-dropdown-item' onClick={toggleDropdown}>
                  <SettingsIcon />
                  Settings
                </NavLink>
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