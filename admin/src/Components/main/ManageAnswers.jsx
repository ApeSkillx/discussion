import React, {useState,useEffect,useRef} from "react";
import parse from 'html-react-parser';
import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { Avatar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './css/ManageQuestionsAnswers.css';
import axios from 'axios'

// NEED: Answers from database
const answers=[
  {
    _id: "someAnswerId",
    body: "This is the answer body",
    auth: "Kisan",
    created_at: "2023-07-25T18:25:39.322+00:00"
  },
  {
    _id: "someAnswerId2",
    body: "This is the answer body",
    auth: "Somebody",
    created_at: "2023-07-25T18:25:39.322+00:00"
  },
]

function Answer(props){
  const mainBodyRef = useRef(null);
  
  function handleDelete(){
    // Handle user deletion here
  }
  function handleEdit(){
    // Handle user timeout (temporary ban) here
  }
  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }
  return(
    <div className="main-question-answer-body" key={props._id} ref={mainBodyRef}>
      <div className='question-answer'>
        <div style={{ width: '90%', marginBottom: '16px' }}>
          <div>{parse(truncate(props.body, 200))}</div>
        </div>
        <div className='author'>
          <small>on {new Date(props.created_at).toLocaleString().replace(/,/g, ' at ')}</small>
          <div className='author-details'>
            <Avatar className='profile-picture' />
            <p>{String(props.auth).split('@')[0]}</p>
          </div>
        </div>
      </div>
      <div className="admin-buttons-short">
        <EditIcon
          className="admin-button edit-button"
          onClick={()=>{handleEdit()}}
          onMouseEnter={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'var(--orange-peel-faded)'; }}
          onMouseLeave={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'white'; }}
        />
        <div className="flex-grow">
        </div>
        <DeleteIcon 
          className="admin-button reject-button"
          onClick={()=>{handleDelete()}}
          onMouseEnter={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'var(--red-crayola-bright-faded)'; }}
          onMouseLeave={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'white'; }}
        />
      </div>
    </div>
  )
}

function ManageAnswers() { 

  return(
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <Sidebar />
      <div className="manage-question-answer-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search answers" />
        </div>
        <div className="question-answer-container">
          {answers.map((answer) => {
            return(
              <Answer
                key = {answer._id}
                body = {answer.body}
                auth = {answer.auth}
                created_at = {answer.created_at}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ManageAnswers;