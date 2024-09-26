import React, { useState, useEffect, useReducer } from 'react';
import './profile.css';
import Sidebar from '../sidebar/sidebar';

import { NavLink, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import Cookies from 'js-cookie';
import axios from 'axios'
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js'
import { Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';

const capitalize = (str) => (
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
)

const Profile = () => {
  const [selectedMenu, setSelectedMenu] = useState('activity');
  const [userDetails, setUserDetails] = useState(null);
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState('');
  const [smd, setSmd] = useState('')
  const [mainG, setMainG]= useState('');
  const [institute, setInstitute] = useState('')
  var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
  const currentUserEmailFromCookies = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))[0]; 

  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const id = searchParams.get('id');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await axios.get(`/user-details/${currentUserEmailFromCookies}`);
        const currentUserResponse = await axios.get(`/user-details/${currentUserEmailFromCookies}`);
        setUserDetails(userResponse.data);
        setCurrentUserDetails(currentUserResponse.data)

        if(userResponse.data.Hqrs ==1)
        {
          const Smd = await axios.get(`/SmdName/${userResponse.data.Smdid}`);
          const Inst = await axios.get(`/InstituteName/${userResponse.data.institute}`)
          setSmd(Smd.data)
          setInstitute(Inst.data)
        }
        else if (userResponse.data.Hqrs == 2)
        {
          const Smd = await axios.get(`/SmdName/${userResponse.data.Smdid}`);
          setSmd(Smd.data)
        }
        // if(userResponse.data.status == 1)
        // {
        //   const Smd = await axios.get(`/SmdName/${userResponse.data.Smdid}`);
        // const Intrested = await axios.get(`/group/${currentUserEmailFromCookies}`)
        // const Main = await axios.get(`/MainGroup/${currentUserEmailFromCookies}`)

        // setGroup(Intrested.data)
        // setMainG(Main.data)
        // setSmd(Smd.data)  

        // }
        // else if(userResponse.data.status == 2)
        // {
        //   const Msmd = await axios.get('smd-group',{params:{id_1:userResponse.data.Smdid}})
        //   setSmd(Msmd.data.resp)
        //   setGroup(Msmd.data.rsp)
        // }       
       

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  },[]);

  const renderSelectedMenu = () => {
    switch (selectedMenu) {
      case 'activity': return <ActivitiesMenu userDetails={userDetails} currentUserDetails={currentUserDetails} />;
      case 'starred': return <StarredMenu userDetails={userDetails} currentUserDetails={currentUserDetails} />;
      case 'saved': return <SavedMenu userDetails={userDetails} currentUserDetails={currentUserDetails} />;
      default: return null;
    }
  }
  return (
    <div className="profile-main">
      <Sidebar />
      { !isLoading ?
        (
          <main>
            <section className='user-info-container'>
              <div className='profile-picture-container'>
                <Avatar />
              </div>
              {userDetails.Hqrs == 1 ?
              <>
              <div className='basic-info-container'>
                  <section className='basic-info-container-section'>
                    <p id='profile-user-name'>{capitalize(userDetails.name)}({userDetails.designation})</p>
                    <p id='profile-user-email'>{userDetails.email}</p>
                  </section>
                  <fieldset className='basic-info-container-section'>
                    <legend>Your SMD</legend>
                    <p id='profile-user-smdid'>{capitalize(smd.name)}</p>                  
                  </fieldset>
                  <fieldset className='basic-info-container-section'>
                    <legend>Your Institute</legend>                
                    <p id='profile-user-divisionid'>{capitalize(institute.name)}</p>
                  </fieldset>
                  {/* <fieldset className='basic-info-container-section'>
                    <legend>Interested Groups</legend>
                    <div className='basic-info-interested-tag-container'>
                      {group.map(interestedSubject => <InterestedTag data={interestedSubject.name} />)}
                    </div>
                  </fieldset> */}
                </div>
              </>
              :
              userDetails.Hqrs == 2  ?
              <>
              <div className='basic-info-container'>
                  <section className='basic-info-container-section'>
                    <p id='profile-user-name'>{capitalize(userDetails.name)}({userDetails.designation})</p>
                    <p id='profile-user-email'>{userDetails.email}</p>
                  </section>
                  <fieldset className='basic-info-container-section'>
                    <legend>Your SMD</legend>
                    <p id='profile-user-smdid'>{capitalize(smd.name)}</p>                    
                  </fieldset>
                  {/* <fieldset className='basic-info-container-section'>
                    <legend>Subjects</legend>
                    <div className='basic-info-interested-tag-container'>
                      {group.map(interestedSubject => <InterestedTag data={interestedSubject.name}/>)}
                    </div>
                  </fieldset> */}
                </div>
              </>
              :
              <>
              <div className='basic-info-container'>
                  <section className='basic-info-container-section'>
                  <p id='profile-user-name'>{capitalize(userDetails.name)}({userDetails.designation})</p>
                    <p id='profile-user-email'>{userDetails.email}</p>
                  </section>           
                </div>
             
              </>
                
              }
            </section>
            <section className='extra-info-container'>
              <section className='profile-menu-bar'>
                <button
                  onClick={() => { setSelectedMenu('activity') }}
                  className={selectedMenu == 'activity' || userDetails.email != currentUserDetails.email ? 'active' : ''}
                >
                  Activity
                </button>
                {/* <button
              onClick={() => { setSelectedMenu('saved') }}
              className={selectedMenu == 'saved' && 'active'}
            >
              Saved
            </button> */}
                {/* Below one should be more secure */}
                {userDetails.email == currentUserDetails.email &&
                  (<button
                    onClick={() => { setSelectedMenu('starred') }}
                    className={selectedMenu == 'starred' ? 'active' : ''}
                  >
                    Starred
                  </button>)
                }
              </section>
              <section className='profile-menu'>
                {/* If viewing somebody else's profile, only render the Activity menu */}
                {userDetails.email != currentUserDetails.email ? <ActivitiesMenu userDetails={userDetails} currentUserDetails={currentUserDetails} /> : renderSelectedMenu()}
              </section>
            </section>
          </main>
        )
        :
        (
          <div>Loading...</div>
        )
      }
    </div>
  )
}
// function InterestedTag({ data }) {
//   return(
//     <div className='interested-tag'>
//       <p>{data}</p>
//     </div>
//   )
// }

function ActivitiesMenu({ userDetails, currentUserDetails }) {
  const [selectedActivity, setSelectedActivity] = useState('questions');

  const renderSelectedActivity = () => {
    switch (selectedActivity) {
      case 'questions': return <QuestionsActivity userDetails={userDetails} currentUserDetails={currentUserDetails} />;
      case 'answers': return <AnswersActivity userDetails={userDetails} currentUserDetails={currentUserDetails} />;
      case 'replies': return <RepliesActivity userDetails={userDetails} currentUserDetails={currentUserDetails} />;
      default: return null;
    }
  }

  return (
    <div className='user-activities-main'>
      <section className='user-activity-bar'>
        <button
          onClick={() => { setSelectedActivity('questions') }}
          className={selectedActivity == 'questions' ? 'active' : ''}
        >
          Posts
        </button>
        <button
          onClick={() => { setSelectedActivity('answers') }}
          className={selectedActivity == 'answers' ? 'active' : ''}
        >
          Reply
        </button>
        {/* <button
          onClick={() => { setSelectedActivity('replies') }}
          className={selectedActivity == 'replies' ? 'active': ''}
        >
          Replies
        </button> */}
      </section>
      <section className='user-activity'>
        {renderSelectedActivity()}
      </section>
    </div>
  )
}
function QuestionsActivity({ userDetails, currentUserDetails }) {
  const [questionData, setQuestionData] = useState();
  const [currentUserStarredArray, setCurrentUserStarredArray] = useState();
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getAllUserQuestions() {
      try {
        const allQuestionsFromDB = await axios.get(`/user-questions-all/${userDetails.email}`);
        // Getting new data for updated starred questions, i.e. User might have updated starred questions while being in the starred menu so to reflect the changes here without reloading the page hence, getting new data.
        const currentUserNewData = await axios.get(`/user-details/${currentUserDetails.email}`)
        setCurrentUserStarredArray(currentUserNewData.data.starred);
        setQuestionData(allQuestionsFromDB.data);
      }
      catch (error) {
        console.error(error);
      }
    }
    getAllUserQuestions();
  }, [])

  return (
    <div className='user-activity-main'>
      <h3 className='user-activity-heading'>
        {questionData ?
          `${questionData.length} ${questionData.length == 1 ? 'Post' : 'Posts'}`
          :
          'Loading...'
        }
      </h3>
      <div className='search-bar'>
        <input
          name="searchItem"
          id="searchItem"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder='Search Posts'
        />
        <SearchIcon className='search-icon' />
      </div>
      <section className='user-activity-box-container'>
        {questionData &&
          (search == '' ?
            (
              questionData.map(question => (
                <Question
                  key={question._id}
                  data={question}
                  currentUserDetails={currentUserDetails}
                  isAlreadyStarred={currentUserStarredArray.includes(question._id) ? true : false}
                />
              ))
            ) : (
              questionData
                .filter((question) => question.title.toLowerCase().includes(search.toLowerCase()))
                .map(question => (
                  <Question
                    key={question._id}
                    data={question}
                    currentUserDetails={currentUserDetails}
                    isAlreadyStarred={currentUserStarredArray.includes(question._id) ? true : false}
                  />
                ))
            )
          )
        }
      </section>
    </div>
  )
}
function Question({ data, currentUserDetails, isAlreadyStarred }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(isAlreadyStarred);

  const setStarred = async () => {
    await axios.patch(`/set-starred/${data._id}/${currentUserDetails.email}`)
      .then(resp => { })
      .catch(error => console.log(error));
  };
  const removeStarred = async () => {
    await axios.patch(`/remove-starred/${data._id}/${currentUserDetails.email}`)
      .then(resp => { })
      .catch(error => console.log(error));
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

  const handeDelete = async (e) => {
    if (window.confirm('Please confirm deletion')) {
      axios.get(`/deletepost/${e}`)
        .then((resp) => {
          // Update state or fetch new data to trigger a re-render instead of reloading the page
          window.location.reload(false);
        })
        .catch(error => console.error(error));
    }
  };

  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }
  return (
    <div className='all-questions-container' key={data._id}>
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
        <NavLink to={`/view-question?id=${data._id}`}>{data?.title}</NavLink>
        <div>
          <div className='question-answer-body-text'>{isExpanded ? parse(data.body) : parse(truncate(data.body, 200))}</div>
        </div>

        <div className='author'>
          <NavLink className='author-details'>
            <Avatar />
            <p>{String(data?.auth).split('@')[0]}</p>
          </NavLink>
          <small>on {new Date(data?.created_at).toLocaleString().replace(/,/g, ' at ')}</small>
          {/* {currentUserDetails.status === 2 ? (
            <DeleteIcon className='react-button' onClick={(e) => { handeDelete(data._id) }} />
          ) : (
            <p></p>
          )} */}
        </div>
      </div>
    </div>
  )
}
function AnswersActivity({ userDetails, currentUserDetails }) {
  const [answerData, setAnswerData] = useState();
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getAllUserAnswers() {
      await axios.get(`/user-answers-all/${userDetails.email}`)
        .then(userAnswers => setAnswerData(userAnswers.data))
        .catch(err => console.log(err));
    }
    getAllUserAnswers();
  }, [])

  return (
    <div className='user-activity-main'>
      <h3 className='user-activity-heading'>
        {answerData ?
          `${answerData.length} ${answerData.length == 1 ? 'Reply' : 'Replies'}`
          :
          'Loading...'
        }
      </h3>
      <div className='search-bar'>
        <input
          name="searchItem"
          id="searchItem"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder='Search Replies'
        />
        <SearchIcon className='search-icon' />
      </div>
      <section className='user-activity-box-container'>
        {answerData &&
          (search == '' ?
            (
              answerData.map(answer => (
                <Answer key={answer._id} data={answer} currentUserDetails={currentUserDetails} />
              ))
            ) : (
              answerData
                .filter((answer) => answer.body.toLowerCase().includes(search.toLowerCase()))
                .map(answer => (
                  <Answer key={answer._id} data={answer} currentUserDetails={currentUserDetails} />
                ))
            )
          )
        }
      </section>
    </div>
  )
}
function Answer({ data, currentUserDetails }) {

  const [isExpanded, setIsExpanded] = useState(false)
  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  function handleDelete(e) {
    // Handle delete for answer here
  }

  return (
    <div className='user-question-box' key={data._id}>
      <div className='user-question-left'>
        {isExpanded ? <ExpandLessIcon onClick={toggleExpanded} /> : <ExpandMoreIcon onClick={toggleExpanded} />}
      </div>

      <div className='user-question'>
        {/* NEED: Question title here :) */}
        <NavLink to={`/view-question?id=${data.question_id}`}>Post: Click to view Post</NavLink>
        <div>
          <div>{isExpanded ? parse(data.body) : parse(truncate(data.body, 200))}</div>
        </div>

        <div className='user-author'>
          {/* {currentUserDetails.status == 2 ? (
            <DeleteIcon className='react-button' onClick={(e) => { handleDelete(data._id) }} />
          ) : (
            <p></p>
          )} */}
          <small>on {new Date(data?.created_at).toLocaleString().replace(/,/g, ' at ')}</small>
          <div className='user-author-details'>
            <Avatar className='user-avatar' />
            <small>{String(data?.auth).split('@')[0]}</small>
          </div>
        </div>
      </div>
    </div>
  )
}
function RepliesActivity() {
  return (
    <div>
      Replies
    </div>
  )
}
function StarredMenu({ userDetails, currentUserDetails }) {
  const [starredQuestions, setStarredQuestions] = useState(null);
  const [currentUserStarredArray, setCurrentUserStarredArray] = useState();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const getStarredItems = async () => {
      try {
        // Getting new data for updated starred questions, i.e. User might have updated starred questions while being in the question activity menu so to reflect the changes here without reloading the page hence, getting new data.
        const userNewDetails = await axios.get(`/user-details/${currentUserDetails.email}`);
        const starredQuestionsFromDB = await axios.get(`/user-starred-questions/${userDetails.email}`);

        setCurrentUserStarredArray(userNewDetails.data.starred);
        setStarredQuestions(starredQuestionsFromDB.data);
      } catch (error) {
        console.error(error);
      }
    };

    getStarredItems();
  }, []);

  return (
    <div className='starred-menu-main'>
      <h3 className='user-activity-heading'>{starredQuestions ? (`${starredQuestions.length} Starred ${starredQuestions.length == 1 ? 'post' : 'posts'}`) : 'Loading...'}</h3>
      <div className='search-bar'>
        <input
          name="searchItem"
          id="searchItem"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder='Search starred post'
        />
        <SearchIcon className='search-icon' />
      </div>
      <section>
        {starredQuestions &&
          (search == '' ?
            (starredQuestions.map(question => (
              <Question
                key={question._id}
                data={question}
                currentUserDetails={currentUserDetails}
                isAlreadyStarred={currentUserStarredArray.includes(question._id) ? true : false}
              />
            )))
            :
            (starredQuestions
              .filter((question) => question.title.toLowerCase().includes(search.toLowerCase()) || question.auth.slice(0, -12).toLowerCase().includes(search.toLowerCase()) || question.auth.toLowerCase()==search.toLowerCase() )
              .map(question => (
                <Question
                  key={question._id}
                  data={question}
                  currentUserDetails={currentUserDetails}
                  isAlreadyStarred={currentUserStarredArray.includes(question._id) ? true : false}
                />
              ))
            )
          )
        }
      </section>
    </div>
  )
}
function SavedMenu() {
  return (
    <div>
      Saved Menu
    </div>
  )
}
// Prop types validation checks
AnswersActivity.propTypes = {
  userDetails: PropTypes.object.isRequired,
  currentUserDetails: PropTypes.object.isRequired,
};
QuestionsActivity.propTypes = {
  userDetails: PropTypes.object.isRequired,
  currentUserDetails: PropTypes.object.isRequired,
};
Question.propTypes = {
  data: PropTypes.object.isRequired,
  currentUserDetails: PropTypes.object.isRequired,
  isAlreadyStarred: PropTypes.bool.isRequired,
};
Question.defaultProps = {
  isAlreadyStarred: false,
};
AnswersActivity.propTypes = {
  userDetails: PropTypes.object.isRequired,
  currentUserDetails: PropTypes.object.isRequired,
};
Answer.propTypes = {
  data: PropTypes.object.isRequired,
  currentUserDetails: PropTypes.object.isRequired,
};
StarredMenu.propTypes = {
  userDetails: PropTypes.object.isRequired,
  currentUserDetails: PropTypes.object.isRequired,
};

export default Profile