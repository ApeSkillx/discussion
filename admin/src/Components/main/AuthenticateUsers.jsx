import React, {useEffect, useState, useRef} from "react";
import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { Avatar } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import "./css/UserContainer.css";
import axios from 'axios'
  import 'react-toastify/dist/ReactToastify.css';

// This is a sample array of json objects,
// ! WARNING: Keep the const name 'users', or change it everywhere in this code ;)
// NEED: Requests from database
// let users = [ // ( Find users with 'status == 0' )?
  
// ]

function User(props){
  const mainBodyRef = useRef(null);
 
  const handleApproval = async (e)=>{
    
    if (window.confirm('Please Confirm for Activate Account')) {
      axios.get(`/approve/${e}`).then((resp) => {                      
          window.location.reload(false);
      });
    }    
  }

  const handleRejection = (e)=>{   
    if (window.confirm('Please Confirm for delete Account')) {
      axios.get(`/disapprove/${e}`).then((resp) => {                      
          window.location.reload(false);
      });
    }   
         }
         
  return(
    <div className="user-container" key={props.id} ref={mainBodyRef}>
      <div className="user-profile-picture-container">
        {/* must be 120px X 120px */}
        { props.profilePicture ? <img src={props.profilePicture} className="user-profile-picture" /> : <Avatar className="user-profile-picture" /> }
      </div>
      <div className="user-info-container">
        <p className="user-info">Name: {props.name.toUpperCase()}</p>
        <p className="user-info">Email: {props.email}</p>
        <p className="user-info">Subject: {props.Smdid.toUpperCase()}</p>
        <p className="user-info">Division: {props.Divisionid.toUpperCase()}</p>
        
      </div>
      <div className="admin-buttons">
        <CheckIcon 
          className="admin-button approve-button"
          // onClick={(e)=>{handleApproval()}}
          onClick={(e) => { handleApproval(props.id)}} 
          onMouseEnter={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'var(--primary-faded-color)'; }}
          onMouseLeave={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'white'; }}
        />
        <div className="flex-grow"></div>
        <ClearIcon 
          className="admin-button reject-button"
          onClick={(e)=>{handleRejection(props.id)}}
          onMouseEnter={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'var(--red-crayola-bright-faded)'; }}
          onMouseLeave={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'white'; }}
        />
      </div>
    </div>
  )
}

function AuthenticateUsers() {
  
  const [users, setUsers] = useState('') 

  useEffect(()=>{

    axios.post('/unauthenticate').then((resp)=>{
      setUsers(resp)
  })
  },[])

  const [search, setSearch] = useState('')  

    return(
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <Sidebar />
      <div className="users-main-container">
        <div className="search-bar-container">
          <SearchBar value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search users"/>
        </div>
        <div className="users-container">
          {
            search == '' ? 
              
            users.data?.map((user)=>{             
              
              return(
                <User
                  id={user._id} 
                  name={user.name}
                  email={user.email}
                  Smdid={user.Smdid}
                  Divisionid={user.Divisionid}               
                />
              )
            })
            :
            users.data?.filter((user)=>user.name.includes(search)).map(filterName=>{              
              return(               
                <User
                  id={filterName._id} 
                  name={filterName.name}
                  email={filterName.email}
                  Smdid={filterName.Smdid}
                  Divisionid={filterName.Divisionid}               
                />                
              )
            })}
          
        </div>
      </div>
    </div>
  )
}

export default AuthenticateUsers;