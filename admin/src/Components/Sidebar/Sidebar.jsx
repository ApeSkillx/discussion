import React, {useEffect,useState} from 'react';
import { NavLink } from 'react-router-dom'
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import Cookies from 'js-cookie';
import axios from 'axios'

import './Sidebar.css';

function Sidebar() {

  const auth = (Cookies.get('45034583/45843958/985307')).split(',')
  

const [userstatus, setUserStatus] = useState('')

useEffect(()=>{
  
  axios.get(`/user-detail/${auth[0]}`).then((res)=>{ setUserStatus(res.data.status)})

  

},[])



  return(
    <div className="sidebar-container">
      <div classname="sidebar-options">       
        
        <div className="sidebar-option-category-container">
          <small className="sidebar-option-category">Manage</small>
          {
            userstatus == 2 && 

            <NavLink to="/authenticate-users" className="sidebar-option">
            <GroupsIcon />
            <p>Authenticate Users</p>
            </NavLink>
            
          }
         
          <NavLink to="/manage-users" className="sidebar-option">
            <GroupIcon />
            <p>Users</p>
          </NavLink>
          <NavLink to="/manage-questions" className="sidebar-option">
            <QuestionMarkIcon/>
            <p>Questions</p>
          </NavLink>
          <NavLink to="/manage-answers" className="sidebar-option">
            <QuestionAnswerIcon />
            <p>Answers</p>
          </NavLink>
          <NavLink to="/manage-replies" className="sidebar-option">
            <ReplyAllIcon />
            <p>Replies</p>
          </NavLink>
        </div>
        
      </div>
    </div>
  )
}

export default Sidebar;