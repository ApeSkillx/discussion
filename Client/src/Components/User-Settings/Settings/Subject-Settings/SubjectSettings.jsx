import React, { useState, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import './SubjectSettings.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import Select from 'react-select'
import axios from 'axios'
import SelectMul from 'react-dropdown-select'

function Change() {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  let subject = []
  const [subject2, setSubject2] = useState([])
  const [subject1, setSubject1] = useState([])
  const [subjects, setSubjects] = useState([])
  var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
  const auth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))[0]; 
 
  /*****************User All Detail Fetch Here*******************/
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/user-details/${auth}`);
        setUserDetails(userResponse.data);
    
        const subject = await axios.get(`/group/${auth}`)
        const subjects = await axios.get('/subject')       
        setSubject2(userResponse.data.intrested)
        setSubjects(subjects.data)
        setSubject1(subject.data)       

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  /*****************************************************************/

  const [values, setValues] = useState([])
  values.map((resp) => { 
    subject.push(resp._id)   
      })

  const handleSubmit = async (e) => {
    
    e.preventDefault()
    setIsLoading(true)

    // if (subject.length < 1) {
    //   toast.error('Please Select Intrested Disciplines')
    //   setIsLoading(false)
    // }
    
    if (subject.includes(userDetails.Divisionid)) {
      toast.error('You should select different subject from main disciplines')
      setIsLoading(false)
    }
    else if (subject.length > 4) {
      toast.error('You should select only 4 disciplines')
      setIsLoading(false)
    }
    else {
      if (window.confirm('Are you Sure to update Your interested disciplines')) {
        try {   
          
          const data = await axios.post('/updateSubject', { subject, subject2, auth })

          if (data) {
            toast.success('Intrested disciplines updated successfully')
            navigate('/')
            setIsLoading(false)
          }
        }
        catch (err) {
          toast.error(err.response.data.err)
          setIsLoading(false);
        }

      }
      else {
        setIsLoading(false);
      }
    }
  }
  return (
    <div className='us-main-section'>
      <div className='us-main-section-title'>
        Change interested disciplines
      </div>
      <div className='us-main-section-body'>
        <div className='ss-input-section'>
          <label className='ss-input-label' htmlFor='ss-current-smd'>Current interested disciplines</label>
          <ul className='ss-current-subjects' id='ss-current-subjects'>
            {
              subject1.map(subject => (
                <li className='ss-current-subject'>{`- ${subject.name}`}</li>
              ))
            }
          </ul>
        </div>
        <div className='ss-input-section'>
          <label className='ss-input-label' htmlFor='ss-smd-options'>Select new interested disciplines<sup style={{color: "red"}}>&nbsp;*</sup></label>
          {
            subject2.length>0 &&
            (
            <Select
              name='Select intrested discipline'
              isMulti   
              tabSelectsValue={subjects.filter((data) => subject2.includes(data._id))}           
              defaultValue={subjects.filter((data) => subject2.includes(data._id))}
              options={values.length > 3 ? values : subjects}
              getOptionLabel={option => {
                return option.name;
              }}
              getOptionValue={option => {
                return option._id;
              }}
              onChange={values =>
                setValues(values)
              }
              className='ss-select-input'
            />        
            )
          }
          {
             subject2.length<1 &&
             (
               <Select
               name='Select intrested discipline'
               isMulti             
               options={values.length > 3 ? values : subjects}
               getOptionLabel={option => {
                 return option.name;
               }}
               getOptionValue={option => {
                 return option._id;
               }}
               onChange={values =>
                 setValues(values)
               }
               className='ss-select-input'
             />
 
             ) 
          }
        </div>
        <div className='ss-submit-section'>
          <button className='ss-submit-button' onClick={handleSubmit}>Change disciplines</button>
        </div>
      </div>
   </div>
  )
}

export default Change;