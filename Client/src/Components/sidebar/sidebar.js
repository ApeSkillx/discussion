import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Axios from 'axios';
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie';
import './css/sidebar.css';

import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


const sidebar = () => {
  // Responsiveness handling
  const responsive_sidebar_width = 580;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarVisible, setIsSidebarVisible] = windowWidth <= responsive_sidebar_width ? useState(false) : useState(true);

  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }
  function closeSidebar() {
    if (windowWidth <= responsive_sidebar_width) {
      setIsSidebarVisible(false);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      (window.innerWidth <= responsive_sidebar_width) ? setIsSidebarVisible(false) : setIsSidebarVisible(true);
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
    var bytes = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    auth = data[0];
  }

  // Content fetching
  const [ssmd, setSsmd] = useState([]);
  const [institute, setInstitute] = useState('');
  const [seenPost, setSeenPost] = useState('')
  const [group, setGroup] = useState('');
  const [mainG, setMainG] = useState('');
  const [detail, setDetail] = useState('');
  const [smd, setSmd] = useState('');
  useEffect(() => {
    let userDetails = new Promise(async (resolve, reject) => {

      setInterval(async function () {       
        const response = await Axios.get(`/user-detail/${auth}`);
      setSeenPost(response.data.message)
      resolve(response.data);
      }, 1000);

      
    });

    userDetails.then(
      async function (value) {
        async function getGroup() {
          await Axios
            .get(`/group/${auth}`)
            .then(res => {
              // console.log('Group: ',res.data);
              setGroup(res)
            })
            .catch(err => console.error(err));
        }
        async function getMain() {
          await Axios
            .get(`/MainGroup/${auth}`)
            .then(res => {
              // console.log('MainG: ',res.data);
              setMainG(res.data)
            })
            .catch(err => console.error(err));
        }
        getGroup();
        getMain();
        setDetail(value);

        if (value.Hqrs == 1) {
          if (value.status == 1) {
            const Inst_Name = await Axios.get(`/InstituteName/${value.institute}`);
            // console.log('Institute: ',Inst_Name);
            setInstitute(Inst_Name.data);
          }
          else if (value.status == 2 || value.status == 3) {
            const Smd_Name = await Axios.get(`/SmdName/${value.Smdid}`);
            // console.log('Smd1 : ',Smd_Name.data);
            setSmd(Smd_Name.data);

          }
        }
        else if (value.Hqrs == 2) {
          const Smd_Name = await Axios.get(`/SmdName/${value.Smdid}`);
          // console.log('Smd2 : ',Smd_Name.data);
          setSmd(Smd_Name.data);
        }
      },
      function (error) {
        console.error(error);
      }
    );
  }, []);

  let seenQuestion = [];
  for (let i = 0; i < seenPost.length; i++) {
    if (seenPost[i].seen === false) {
      seenQuestion = [...seenQuestion, seenPost[i]];
    }
  }



  // Components
  function SidebarOption({ title, icon, optionId, seenQuestionLength }) {
    return (
      // <NavLink to={`/?subject=${encodeURI(title)}`} className='sidebar-option'>
      <NavLink to={`/?id=${optionId}`} className='sidebar-option' onClick={closeSidebar}>
        {seenQuestionLength > 0 &&
          <span className={`sidebar-notification-badge size-${String(seenQuestionLength).length}`}>
            {seenQuestionLength > 99 ? '99+' : seenQuestionLength}
          </span>
        }
        {icon}
        <p>{title}</p>
      </NavLink>
    )
  }
  return (
    <>
      <div className={`sidebar-open-button ${!isSidebarVisible ? 'active' : ''}`} onClick={toggleSidebar}>
        <MenuIcon />
      </div>
      <div className={`sidebar-container ${isSidebarVisible ? 'active' : ''}`}>
        <div className='sidebar-options'>

          <>
            {/*
      
      "sidebar-options" structure: 
      ---------------------------------<=="sidebar-options"
      |                               |
      |  ,,,,,,,,,,,,,,,,,,,,,,,,,,,<=="sidebar-option-category-container"
      |  | ----------------------- |  |
      |  | |Title for category 1 |<=="sidebar-option-category"
      |  | ----------------------- |  |
      |  | ----------------------- |  |
      |  | | sidebar-option 1    |<=="sidebar-option"
      |  | ----------------------- |  |
      |  | ----------------------- |  |
      |  | | sidebar-option 2    | |  |
      |  | ----------------------- |  |
      |  | ...                     |  |
      |  | ...                     |  |
      |  | ----------------------- |  |
      |  | | sidebar-option n    | |  |
      |  | ----------------------- |  |
      |  ```````````````````````````  |
      |  ,,,,,,,,,,,,,,,,,,,,,,,,,,,  |
      |  | ----------------------- |  |
      |  | |Title for category 2 | |  |
      |  | ----------------------- |  |
      |  | ...                     |  |
      |  | ...                     |  |
      |  | ----------------------- |  |
      |  | | sidebar-option n    | |  |
      |  | ----------------------- |  |
      |  ```````````````````````````  |
      |  ...                          |
      |  ...                          |
      |  ,,,,,,,,,,,,,,,,,,,,,,,,,,,  |
      |  | ----------------------- |  |
      |  | |Title for category n | |  |
      |  | ----------------------- |  |
      |  | ...                     |  |
      |  | ...                     |  |
      |  | ----------------------- |  |
      |  | | sidebar-option n    | |  |
      |  | ----------------------- |  |
      |  ```````````````````````````  |
      |                               |
      ---------------------------------

      */}
          </>

          <div className='sidebar-option-category-container sidebar-option-top'>
            <SidebarOption optionId={'Home'} title='Home' icon={<HomeIcon />} seenQuestionLength={seenQuestion.length} />

            <div className={`sidebar-close-button ${(windowWidth <= responsive_sidebar_width) ? 'active' : ''}`} onClick={toggleSidebar}>

              <CloseIcon />
            </div>
          </div>

          {
            detail.Hqrs == 1 &&
            (
              detail.status == 1 ?
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
                    {group.data?.map((resp) =>
                      <SidebarOption optionId={resp._id} title={resp.name} icon={<PeopleIcon />} key={resp.name} />
                    )}
                  </div>
                </>
                :
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
                    {group.data?.map((resp) =>
                      <SidebarOption optionId={resp._id} title={resp.name} icon={<PeopleIcon />} key={resp.name} />
                    )}
                  </div>
                </>
            )

          }
          {
            detail.Hqrs == 2 &&
            (
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
                  {group.data?.map((resp) =>
                    <SidebarOption optionId={resp._id} title={resp.name} icon={<PeopleIcon />} key={resp.name} />
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>
    </>
  )
}



export default sidebar