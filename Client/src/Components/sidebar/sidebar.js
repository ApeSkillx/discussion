import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import './css/sidebar.css';

import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  // Responsiveness handling
  const responsiveSidebarWidth = 580;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarVisible, setIsSidebarVisible] = useState(windowWidth > responsiveSidebarWidth);

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const closeSidebar = () => {
    if (windowWidth <= responsiveSidebarWidth) {
      setIsSidebarVisible(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsSidebarVisible(window.innerWidth > responsiveSidebarWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Authorization
  const userData = Cookies.get('auth');
  let auth;
  if (userData) {
    const bytes = CryptoJS.AES.decrypt(userData, 'secret key 123');
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    auth = data[0];
  }

  // Content fetching
  const [ssmd, setSsmd] = useState([]);
  console.log(ssmd);

  const [institute, setInstitute] = useState('');
  const [group, setGroup] = useState('');
  const [mainG, setMainG] = useState('');
  const [detail, setDetail] = useState('');
  const [smd, setSmd] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailResponse = await axios.get(`/user-detail/${auth}`);
        setDetail(userDetailResponse.data);

        const groupResponse = await axios.get(`/group/${auth}`);
        setGroup(groupResponse.data);

        const mainGroupResponse = await axios.get(`/MainGroup/${auth}`);
        setMainG(mainGroupResponse.data);

        if (detail.Hqrs === 1) {
          if (detail.status === 1) {
            const instNameResponse = await axios.get(`/InstituteName/${detail.institute}`);
            setInstitute(instNameResponse.data);
          } else if (detail.status === 2 || detail.status === 3) {
            const smdNameResponse = await axios.get(`/SmdName/${detail.Smdid}`);
            setSmd(smdNameResponse.data);
          }
        } else if (detail.Hqrs === 2) {
          const smdNameResponse = await axios.get(`/SmdName/${detail.Smdid}`);
          setSmd(smdNameResponse.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (auth) {
      fetchData();
    }
  }, [auth, detail]);

  // Components
  const SidebarOption = ({ title, icon, optionId }) => (
    <NavLink to={`/?id=${optionId}`} className='sidebar-option' onClick={closeSidebar}>
      {icon}
      <p>{title}</p>
    </NavLink>
  );

  return (
    <>
      <div className={`sidebar-open-button ${!isSidebarVisible ? 'active' : ''}`} onClick={toggleSidebar}>
        <MenuIcon />
      </div>
      <div className={`sidebar-container ${isSidebarVisible ? 'active' : ''}`}>
        <div className='sidebar-options'>
          <div className='sidebar-option-category-container sidebar-option-top'>
            <SidebarOption optionId={'Home'} title='Home' icon={<HomeIcon />} />
            <div className={`sidebar-close-button ${windowWidth <= responsiveSidebarWidth ? 'active' : ''}`} onClick={toggleSidebar}>
              <CloseIcon />
            </div>
          </div>

          {/* Render additional sidebar options based on detail */}
          {detail.Hqrs === 1 && (
            <>
              {detail.status === 1 && (
                <>
                  <div className='sidebar-option-category-container'>
                    <small className="sidebar-option-category">Institute</small>
                    <SidebarOption optionId={institute._id} title={institute.name} icon={<PeopleIcon />} />
                  </div>
                  <div className='sidebar-option-category-container'>
                    <small className="sidebar-option-category">Main Discipline</small>
                    <SidebarOption optionId={mainG._id} title={mainG.name} icon={<PeopleIcon />} />
                  </div>
                  <div className='sidebar-option-category-container'>
                    <small className="sidebar-option-category">Interested Disciplines</small>
                    {group.data?.map(resp => (
                      <SidebarOption optionId={resp._id} title={resp.name} icon={<PeopleIcon />} key={resp.name} />
                    ))}
                  </div>
                </>
              )}
              {(detail.status === 2 || detail.status === 3) && (
                <>
                  <div className='sidebar-option-category-container'>
                    <small className="sidebar-option-category">SMD</small>
                    <SidebarOption optionId={smd._id} title={smd.name} icon={<PeopleIcon />} />
                  </div>
                  <div className='sidebar-option-category-container'>
                    <small className="sidebar-option-category">Main Discipline</small>
                    <SidebarOption optionId={mainG._id} title={mainG.name} icon={<PeopleIcon />} />
                  </div>
                  <div className='sidebar-option-category-container'>
                    <small className="sidebar-option-category">Interested Disciplines</small>
                    {group.data?.map(resp => (
                      <SidebarOption optionId={resp._id} title={resp.name} icon={<PeopleIcon />} key={resp.name} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {detail.Hqrs === 2 && (
            <>
              <div className='sidebar-option-category-container'>
                <small className="sidebar-option-category">SMD</small>
                <SidebarOption optionId={smd._id} title={smd.name} icon={<PeopleIcon />} />
              </div>
              <div className='sidebar-option-category-container'>
                <small className="sidebar-option-category">Main Discipline</small>
                <SidebarOption optionId={mainG._id} title={mainG.name} icon={<PeopleIcon />} />
              </div>
              <div className='sidebar-option-category-container'>
                <small className="sidebar-option-category">Interested Disciplines</small>
                {group.data?.map(resp => (
                  <SidebarOption optionId={resp._id} title={resp.name} icon={<PeopleIcon />} key={resp.name} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
