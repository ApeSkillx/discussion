import React, { useState, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'
import './DesignationSettings.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import axios from 'axios'

function Designation() {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false); 
  var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
  const auth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))[0];   
  const [userdetail, setUserDetail] = useState('')
  const [designations, setDesigantions] = useState([])
  const [designation1, setDesignation1] = useState('')
  const [designation, setDesignation] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        axios.get(`/user-details/${auth}`).then(async(resp)=>{

          setUserDetail(resp.data)
         
          const Desig = await axios.get(`/designation/${resp.data.Hqrs}`);
            
          setDesigantions(Desig.data.designation)          
         
        })
           

        /*****************Location API Call************************/
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleDesignation = async(e)=>{
      const value = e.target.value.split(',')
     setStatus(value[0])
     setDesignation(value[1])
         }

  const submit = async (e)=>{

    e.preventDefault()
    setIsLoading(true)
    if (!status) {
      toast.error('Please select designation')
      setIsLoading(false)
    }
    else
    {
      if (window.confirm('Are you Sure to update designation')) {
        try {
          const data = await axios.post('/updateDesignation', {status,designation,auth})
          if (data) {
            toast.success('Designation updated successfully')
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
              Change designation
            </div>
            <div className='us-main-section-body'>
              <div className='ss-input-section'>
                <label className='ss-input-label' htmlFor='ss-current-institute'>Current designation</label>
                <p className='ss-current-institute' id='ss-current-institute'>- {userdetail.designation}</p>
              </div>
              <div className='ss-input-section'>
                <label className='ss-input-label' htmlFor='ss-institute-options'>New designation</label>
                <select name='ss-smd-options' id='ss-smd-options' onChange={(e) => handleDesignation(e)}>
                  <option value=''>Select designation</option>
                  {
                    designations.map((res) =>
                      <option value={[res.id,res.name]}>{res.name}</option>
                    )
                  }
                </select>
              </div>
              <div className='ss-submit-section'>
                <button className='ss-submit-button' onClick={submit}>Update designation</button>
              </div>
            </div>
   </div>
  )
}

export default Designation;