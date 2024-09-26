import React from 'react'
import { NavLink } from 'react-router-dom'
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AllQuestions from './AllQuestions';
import './css/main.css'


const main = ({ questions, status, pageTitle }) => {

  return (
    <div className='main'>
      <div className='main-container'>
        <div className='main-top'>
          <h2 id='main-page-title' style={{ "color": "var(--secondary-color)" }}>{pageTitle}</h2>
          <NavLink to="/add-question">
            <button id='create-post-button'>Create Post</button>
          </NavLink>
        </div>

        <div className='questions'>

          <div className='question'>

            <AllQuestions question={questions} />

          </div>

        </div>

      </div>
    </div>
  )
}

export default main