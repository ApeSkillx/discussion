import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import './css/index.css'
import Sidebar from './sidebar'
import CryptoJS from 'crypto-js'
import Main from './main'
import axios from 'axios'
import Cookies from 'js-cookie';

const capitalize = (str) => (
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
)

const Index = () => {
  // ============================================== //
  // Suggestion: put the code below in another file 
  // and then import it here, so other files using 
  // this same code can import it as well. 
  // This will improve reusability.
  // ================ This Code ================== //
  const userData = Cookies.get('auth');
  let auth;
  if (userData) {
    var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));   
    auth = data[0];
  }
  // ============================================== //

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentSubject = (queryParams.get('id') || 'index');

  // const decodedSubject = decodeURI(currentSubject);
  // const pageTitle = capitalize(
  //   (['index','all','home'].includes(decodedSubject.toLowerCase())) ? 'All Posts' : decodedSubject
  // );
  const [pageTitle, setPageTitle] = useState('');

  let [questions, setQuestions] = useState([]);
  let [status, setStatus] = useState('')
  useEffect(() => {
    async function getQuestionsForIndexPage() {
      const question_data = await axios.get(`/questions_for_index_page`,
        { params: { userEmail: auth, subject: currentSubject } })

      setPageTitle(
        capitalize(
          ['index', 'all', 'home'].includes(question_data.data.subject.toLowerCase()) ?
            'All Posts' : question_data.data.subject
        )
      );
      setQuestions(question_data.data.questions);
      setStatus(question_data.data.userStatus);
    }
    getQuestionsForIndexPage();
  }, [location])

  return (
    <div className='stack-index'>
      <div className='stack-index-content'>
        <Sidebar />
        <Main questions={questions} status={status} pageTitle={pageTitle} />
      </div>
    </div>
  )
}

export default Index