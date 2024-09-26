import React, { useState, useEffect, useRef } from "react";
import parse from 'html-react-parser';
import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { Avatar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './css/ManageQuestionsAnswers.css';
import axios from 'axios'

// NEED: questions from database
// const questions = [
//   {
//     _id: "someQuestionId",
//     title: "This is a question title",
//     body: "This is the question body",
//     auth: "Author",
//     subject: "Genetics & Plant Breeding",
//     member: [],
//     created_at: "2023-07-25T18:25:39.322+00:00"
//   },
//   {
//     _id: "someQuestionId2",
//     title: "This is a question title",
//     body: "This is the question body",
//     auth: "Author",
//     subject: "Genetics & Plant Breeding",
//     member: [],
//     created_at: "2023-07-25T18:25:39.322+00:00"
//   },
// ]
function Question(props) {
  const mainBodyRef = useRef(null);
  
  function handleDelete() {
    // Handle question deletion here
  }
  function handleEdit() {
    // Handle question edit here
  }
  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }
  return (
    <div className="main-question-answer-body" key={props._id} ref={mainBodyRef}>
      <div className='question-answer'>
        <span to={`/view-question?id=${props._id}`}>{props.title}</span>
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
          onClick={() => { handleEdit() }}
          onMouseEnter={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'var(--orange-peel-faded)'; }}
          onMouseLeave={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'white'; }}
        />
        <div className="flex-grow">
        </div>
        <DeleteIcon
          className="admin-button reject-button"
          onClick={() => { handleDelete() }}
          onMouseEnter={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'var(--red-crayola-bright-faded)'; }}
          onMouseLeave={(event) => { if(mainBodyRef) mainBodyRef.current.style.backgroundColor = 'white'; }}
        />
      </div>
    </div>
  )
}

function ManageQuestions() {

  const [smds, setSmds] = useState('')
  const [questions, setQuestions] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {

    axios.get('/SMD').then((resp) => {
      setSmds(resp)
    })

    axios.get('/all_question').then((resp)=>{
        setQuestions(resp)
    })

  }, []) 
  
  const [isSmdVisible, setSmdVisibility] = useState(false);
  function toggleSmdVisibility() {
    setSmdVisibility(!isSmdVisible);
  }
  const [isDivisionVisible, setDivisionVisibility] = useState(false);
  function toggleDivisionVisibility() {
    setDivisionVisibility(!isDivisionVisible);
  }

  const [selectedSmd, setSelectedSmd] = useState('All');
  function handleSelectedSmd(smd) {
    setSelectedSmd(smd);
    
    // console.log(selectedSmd)

    // INFO: This did not work because the state updates triggered by useState are asynchronous, and the updated values might not be immediately available within the same function scope. Since the state updates are batched and applied after the component re-renders, so the console.log inside the same function won't show the updated values.
    // NOTE: Use 'useEffect' hooks provided below (line '169' to '188') for their respective tasks :D
  }
  const [selectedDivisionOption, setSelectedDivisionOption] = useState('');
  function handleSelectedDivisionOption(division) {
    setSelectedDivisionOption(division);
    
    // console.log(selectedSmd)

    // INFO: This did not work because (explained in the comments of above function)
  }

  const [divisionOptions, setDivisionOptions] = useState([]);
  function handleDivisionOptions(divisions) {
    setDivisionOptions(divisions);
  }

  const [isSmdInitialRender, setIsSmdInitialRender] = useState(true);
  const [isDivisionInitialRender, setIsDivisionInitialRender] = useState(true);

  // ############################################################################### //
  // NOTE: Use this when you want to handle change in both selected smd and division
  // useEffect(() => {
  //   console.log(selectedSmd, selectedDivisionOption);
  // }, [selectedSmd, selectedDivisionOption]);
  
  // NOTE: Use this when you want to handle change in selected smd
  useEffect(() => {
    // INFO: These commented lines are to prevent the 'else part' from executing before the SMD selector is interacted with i.e. to prevent it from executing in initial render. i.e. If you don't want the 'else part' (console.log statement currently) execute two times on reload, uncomment these lines.
    // if(isSmdInitialRender){
    //     setIsSmdInitialRender(false);
    //   }
    //   else{
      
        // }
      }, [selectedSmd]);
      
  // NOTE: Use this when you want to handle change in selected division
  useEffect(() => {
    // INFO: These commented lines are to prevent the 'else part' from executing before the SMD selector is interacted with i.e. to prevent it from executing in initial render. i.e. If you don't want the 'else part' (console.log statement currently) execute two times on reload, uncomment these lines.
    // if(isDivisionInitialRender){
    //   setIsDivisionInitialRender(false);
    // }
    // else{
      console.log(selectedDivisionOption);
    // }
  }, [selectedDivisionOption]);
  // ############################################################################### //

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Sidebar />
      <div className="manage-question-answer-container">
        <div className="search-bar-container">
          <SearchBar value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search questions" />
        </div>
        <div className="options-container-box">
          <div className="option-selector">
            <div className="option-selector-title">
              -SMD:
            </div>
            <div className="selected-option" onClick={() => {
              toggleSmdVisibility();
              setDivisionVisibility(false);
            }}>
              <span>{selectedSmd}</span>
              {isSmdVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <div className={isSmdVisible ? "options-container active" : "options-container"}>
            {/* SUGGESTION: Add 'All' option as well to select all types of SMDs and Division */}
              {smds.data?.map((smd) => {
                return (
                  <span
                    key={smd._id}
                    className="option"
                    onClick={() => {
                      handleSelectedSmd(smd.name);
                      handleDivisionOptions(smd.division);
                      handleSelectedDivisionOption('');
                      setSmdVisibility(false);
                    }}
                  >
                    {smd.name}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="option-selector">
            <div className="option-selector-title">
              -Division:
            </div>
            <div className="selected-option" onClick={() => {
              toggleDivisionVisibility();
              setSmdVisibility(false);
            }}>
              <span>{selectedDivisionOption}</span>
              {isDivisionVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <div className={isDivisionVisible ? "options-container active" : "options-container"}>
              {
                divisionOptions.map((divisionOption) => {
                  return (
                    <span
                      key={divisionOption}
                      className="option"
                      onClick={() => {
                        handleSelectedDivisionOption(divisionOption);
                        setDivisionVisibility(false);
                      }}
                    >{divisionOption}</span>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className="question-answer-container">
          {

        selectedDivisionOption == '' ?

        search == '' ?

        questions?.data?.map((question) => {
          return (
            <Question
              key={question._id}
              title={question.title}
              body={question.body}
              auth={question.auth}
              subject={question.subject}
              created_at={question.created_at}
            />
          )
        })

        :
        questions?.data?.filter((subject)=>subject.title.includes(search) || subject.auth.includes(search) || subject.body.includes(search)).map((question)=>{
          return (
            <Question
              key={question._id}
              title={question.title}
              body={question.body}
              auth={question.auth}
              subject={question.subject}
              created_at={question.created_at}
            />
          )
        })   

        :

        search == '' ?

        questions?.data?.filter((subject)=>subject.subject.includes(selectedDivisionOption)).map((question)=>{
          return (
            <Question
              key={question._id}
              title={question.title}
              body={question.body}
              auth={question.auth}
              subject={question.subject}
              created_at={question.created_at}
            />
          )
        })

        :

        questions?.data?.filter((subject)=>subject.title.includes(search) || subject.auth.includes(search) || subject.body.includes(search)).map((question)=>{
          return (
            <Question
              key={question._id}
              title={question.title}
              body={question.body}
              auth={question.auth}
              subject={question.subject}
              created_at={question.created_at}
            />
          )
        })          
          
          }
          
        </div>
      </div>
    </div>
  )
}

export default ManageQuestions;