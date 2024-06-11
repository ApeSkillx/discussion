import React, { useState, useEffect } from 'react';
import './SettingsSidebar.css';
import { NavLink } from 'react-router-dom';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MarkunreadMailboxOutlinedIcon from '@mui/icons-material/MarkunreadMailboxOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function SettingsSidebar() {
  // Responsiveness Handling
  const responsive_ss_width = 768;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarVisible, setIsSidebarVisible] = windowWidth <= responsive_ss_width ? useState(false) : useState(true);
  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }
  function closeSidebar() {
    if(windowWidth <= responsive_ss_width) {      
      setIsSidebarVisible(false);
    }
  }
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      (window.innerWidth <= responsive_ss_width) ? setIsSidebarVisible(false) : setIsSidebarVisible(true);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Components
  function SettingsSidebarItem({ link, icon, title }) {
    const linkTo = (`${link}`.slice(0, 1) == '/') ? `${link}`.slice(1) : `${link}`;
    return (
      <NavLink to={`/settings/${linkTo}`} className='settings-sidebar-section-item' onClick={closeSidebar}>
        {icon}
        <p>{`${title}`}</p>
      </NavLink>
    )
  }

  return (
    <>
      <div className={`ss-open-button ${!isSidebarVisible ? 'active' : ''}`} onClick={toggleSidebar}>
        <MenuIcon />
      </div>
      <div className={`settings-sidebar ${isSidebarVisible ? 'active' : ''}`}>

        <div className={`ss-close-button ${(windowWidth <= responsive_ss_width) ? 'active' : ''}`} onClick={toggleSidebar}>
          <CloseIcon />
        </div>

        <div className='settings-sidebar-section'>
          <div className='settings-sidebar-section-title'>
            <p>Access</p>
          </div>
          <div className='settings-sidebar-section-items'>
            <SettingsSidebarItem link='password' icon={<GppMaybeIcon />} title='Password' />
          </div>
        </div>

        <div className='settings-sidebar-section'>
          <div className='settings-sidebar-section-title'>
            <p>Occupational preferences</p>
          </div>
          <div className='settings-sidebar-section-items'>
            <SettingsSidebarItem link='subject' icon={<PeopleOutlinedIcon />} title='Interested disciplines' />
            <SettingsSidebarItem link='work-place' icon={<LocationOnIcon />} title='Workplace' />
            <SettingsSidebarItem link='designation' icon={<MarkunreadMailboxOutlinedIcon />} title='Designation' />
          </div>
        </div>

      </div>
    </>
  )
}

export default SettingsSidebar;