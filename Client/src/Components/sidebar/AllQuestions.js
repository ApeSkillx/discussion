import React, { useEffect, useState } from 'react';
import './css/AllQuestions.css';
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import parse from 'html-react-parser';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import {Tooltip} from './Tooltip'
import CryptoJS from 'crypto-js'

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

const AllQuestions = ({ question }) => {
  const [search, setSearch] = useState('');
  // Initially kept null to prevent rendering data before it is fetched from DB
  const [currentUserDetailsFromDB, setCurrentUserDetailsFromDB] = useState(null);
  const [seen, setSeen] = useState(null);
  var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
  const email = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
 
  const currentUserEmailFromCookies  = email[0]
  useEffect(() => {
    async function getUser() {

      setInterval(async function () {

        await axios.get(`/user-details/${currentUserEmailFromCookies}`)
        .then((res) => {
          setCurrentUserDetailsFromDB(res.data)
          setSeen(res.data.message)
        })
        .catch((error) => console.error(error));    
      }, 1000);

     
    }
    getUser();
  }, []);
   
 
  
  

  let result = question?.map((resp) => { return resp });
  result.reverse();

  return (
    <div className='all-questions'>

      <div className='search-bar'>
        <input
          name="searchItem"
          id="searchItem"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder='Search posts'
        />
        <SearchIcon className='search-icon' />
      </div>
      { currentUserDetailsFromDB ?
        (search == '' ?
          <>
            {
              result.map((data, index) => (
                <Question
                  key={data._id}
                  data={data}
                  seen={seen}
                  currentUser={currentUserDetailsFromDB}
                  isAlreadyStarred={currentUserDetailsFromDB.starred.includes(data._id) ? true : false}
                />
              ))
            }
          </>
          :
          <>
            {
              result.filter((user) => user.title.toLowerCase().includes(search.toLowerCase()) || user.auth.toLowerCase().includes(search.toLowerCase()))
                .map((data, index) => (
                  <Question
                    key={data._id}
                    data={data}
                    seen={seen}
                    currentUser={currentUserDetailsFromDB}
                    isAlreadyStarred={currentUserDetailsFromDB.starred.includes(data._id) ? true : false}
                  />
                ))
            }            
          </>)
          :
          <div>Loading...</div>
      }

    </div>
  );
};

function Question({ data,seen,currentUser, isAlreadyStarred }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(isAlreadyStarred);

  const setStarred = async () => {
    await axios.patch(`/set-starred/${data._id}/${currentUser.email}`)
      .then(resp => { })
      .catch(error => console.error(error));
  };

  const removeStarred = async () => {
    await axios.patch(`/remove-starred/${data._id}/${currentUser.email}`)
      .then(resp => { })
      .catch(error => console.error(error));
  };

  const toggleStarred = () => {
    setIsStarred(prevIsStarred => {
      if (prevIsStarred) {
        removeStarred();
      } else {
        setStarred();
      }
      return !prevIsStarred;
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  }

  const handleDelete = async (e) => {
    if (window.confirm('Please confirm deletion')) {
      axios.get(`/deletepost/${e}`)
        .then((resp) => {
          // Update state or fetch new data to trigger a re-render instead of reloading the page 
          if(resp)
          {
            window.location.reload(false);
          }         
         
         
        })
        .catch(error => console.error(error));
    }
  };
  let isQuestionSeen = true;  
  const questionInUserMessages = seen?.find(obj=>obj.post_id === data._id); 
  if(questionInUserMessages){ // If question Id is in user's message in database. if not seen is taken as true
    isQuestionSeen = questionInUserMessages.seen;
  }
  return (
    
    
    <div className={`all-questions-container ${isQuestionSeen ? 'seen' : 'unseen'}`} key={data._id}>
      {

          console.log(seen.some(obj => obj.post_id === data._id && obj.seen === false))
       
        // console.log(seen.some(obj => obj._id === data._id))
       
      }
      <div className='all-questions-left'>
        <div className='all-options'>
          <p className='option-icon expand active'>
            {isExpanded ? <ExpandLessIcon onClick={toggleExpanded} /> : <ExpandMoreIcon onClick={toggleExpanded} />}
          </p>
          <p className='option-icon'>
            {isStarred ? <StarIcon onClick={toggleStarred} /> : <StarBorderIcon onClick={toggleStarred} />}
          </p>
        </div>
      </div>

      <div className='question-answer'>  
      {
        seen.some(obj => obj.post_id === data._id && obj.seen === true) ?
        <>
        <NavLink to={`/view-question?id=${data._id}`}>{data?.title}</NavLink>        
        <div>
          <div className='question-answer-body-text'>{isExpanded ? parse(data.body) : parse(truncate(data.body, 200))}</div>
        </div> 
        </>         
        :
       <>
        <NavLink to={`/view-question?id=${data._id}`}>{data?.title}</NavLink>        
        <div>
          <div className='question-answer-body-text'>{isExpanded ? parse(data.body) : parse(truncate(data.body, 200))}</div>
        </div> 
       </>

      }      
             
        <div className='author'>
          {/* <NavLink to={`/profile?id=${data.auth}`} className='author-details'>
            <Avatar />
            <p>{String(data?.auth).split('@')[0]}</p>
          </NavLink> */}
          {/* <NavLink className='author-details'>
        
          </NavLink> */}
          <Tooltip text={data?.auth}>
          <Avatar />
          {
            currentUser.email == data?.auth ?
            <p className='material-symbols-outlined'>You</p>
            :
            <p className='material-symbols-outlined'>{String(data?.auth).split('@')[0]}</p>
          }           
          </Tooltip>
          <small>on {new Date(data?.updated_at).toLocaleString().replace(/,/g, ' at ')}</small>
          {currentUser.status > 1 ? (
            <DeleteIcon className='react-button' onClick={(e) => { handleDelete(data._id) }} />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllQuestions;