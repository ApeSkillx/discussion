import React, {useRef} from 'react';
import parse from 'html-react-parser';
import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { Avatar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './css/ManageQuestionsAnswers.css'

const replies = [
  {
    _id: "someId",
    replied_to: "64c013b493b6f8d6e655d2b1",
    text: "This is reply body text",
    auth: "Author of this reply",
    created_at: "2023-07-26T17:49:54.625+00:00",
    replies: [
      // Nested replies for the first reply (if any)
      {
        _id: "nestedReplyId1",
        replied_to: "someId", // ID of the parent reply
        text: "This is a nested reply",
        auth: "Author of the nested reply",
        created_at: "2023-07-26T17:49:54.625+00:00",
        replies: [] // More nested replies can be added here
      },
    ],
  },
  {
    _id: "someOtherId",
    replied_to: "64c02eee93b6f8d6e655d32b",
    text: "This is another reply",
    auth: "Author of this reply",
    created_at: "2023-07-26T17:49:54.625+00:00",
    replies: [],
  },
];

function Reply(props){
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

function ManageReplies() {
  return(
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <Sidebar />
      <div className="manage-question-answer-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search replies" />
        </div>
        <div className="question-answer-container">
          {replies.map((reply) => {
            return(
              <Reply
                key = {reply._id}
                body = {reply.text}
                auth = {reply.auth}
                created_at = {reply.created_at}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ManageReplies;