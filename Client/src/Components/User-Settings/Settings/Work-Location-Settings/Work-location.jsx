import React, { useState, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import './Work-location.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import axios from 'axios'
import SelectMul from 'react-dropdown-select'

function Location() {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [Hqrs, setHqrs] = useState('')
  const [location, setLocation] = useState([])
  const [smd, setSmd] = useState('')
  const [smd1, setSmd1] = useState('')
  const [smds, setSmds] = useState([])
  const [inst, setInst] = useState('')
  const [inst1, setInst1] = useState('')
  const [insts, setInsts] = useState([])
  const [hsmd, setHsmd] = useState(false)
  const [hinst, setHinst] = useState(false)
  const [userDetails, setUserDetails] = useState('');
  var bytes = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
  const auth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))[0];
  /*****************User All Detail Fetch Here*******************/
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        axios.get(`/user-details/${auth}`).then(async (resp) => {
          setUserDetails(resp.data);

          if ((resp.data.Hqrs == 1) && (resp.data.status == 1 || resp.data.status == 2 || resp.data.status == 3)) {
            const Inst = await axios.get(`/InstituteName/${resp.data.institute}`);
            setInst1(Inst.data)

          }
          else if (resp.data.Hqrs == 2) {
            const Smd = await axios.get(`/SmdName/${resp.data.Smdid}`);
            setSmd1(Smd.data)
          }

        })


        /*****************Location API Call************************/
        await axios.get('/location').then((res) => {
          setLocation(res.data)
        }).catch((err) => {
          console.log(err)
        })



      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  /*****************************************************************/

  /*******************Handle Location**********************/

  const handleLocation = async (e) => {

    setHqrs(e.target.value)
    if (e.target.value == 1) {
      setHinst(true)
      setHsmd(false)
      const Insts = await axios.get('/institute');
      setInsts(Insts.data)
    }
    else if (e.target.value == 2) {
      setHinst(false)
      setHsmd(true)
      const Smds = await axios.get('/smddetail')
      setSmds(Smds.data)
    }
    else {
      setHinst(false)
      setHsmd(false)
      setSmd('')
      setInst('')

    }

  }

  /************************************************************/

  /***********Handle SMD************/
  const handleSMD = async (e) => {
    if (!e.target.value) {
      setSmd('')
    }
    else {
      setSmd(e.target.value)
    }
  }

  const SubmitSMD = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!smd) {
      toast.error('Please Select SMD')
      setIsLoading(false)
    }
    else if (smd === smd1._id) {
      toast.error('SMD should be diffrent')
      setIsLoading(false)
    }
    else {
      if (window.confirm('Are you Sure to update Your SMD')) {
        try {
          const data = await axios.post('/updateSMD', { smd, smd1, auth, inst1 })
          if (data) {
            toast.success('SMD Updated successfully')
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
  /***********************************/

  /********************Handle Institute************************/

  const handleinstitute = (e) => {
    const INST = new Promise((res, rej) => {
      res(e._id)
    })
    INST.then(
      async function (value) {
        const data = await axios.get(`/SMD/${value}`)
        setSmd(data.data._id)
        setInst(value)
      }
    )
  }

  const Submitinst = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!inst) {
      toast.error('Please Select Institute')
      setIsLoading(false)
    }
    else if (inst === inst1._id) {
      toast.error('Selected Institute should be diffrent from Current Institute')
      setIsLoading(false)
    }
    else {
      if (window.confirm('Are you Sure to update Your Institute')) {
        try {
          const data = await axios.post('/updateInstitute', { smd, inst, inst1, auth, smd1 })
          if (data) {
            toast.success('Institute Updated successfully')
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

  /*************************************************************/
  return (
    <div className='us-main-section'>

      <div className='us-main-section-title'>
        Workplace
      </div>
      <div className='us-main-section-body'>
        <div className='ss-input-section'>
          <label className='ss-input-label' htmlFor='ss-current-smd'>Current location</label>
          {userDetails.Hqrs == 1 ?
            <p className='ss-current-smd' id='ss-current-smd'>- ICAR institute</p>
            :
            <p className='ss-current-smd' id='ss-current-smd'>- ICAR HQRS</p>
          }

        </div>
        <div className='ss-input-section'>
          <select name="division" onChange={(e) => handleLocation(e)} id="smd">
            <option value=''>--Select work place--</option>
            {
              location.map((res) =>
                <option value={res.id}>{res.name}</option>
              )
            }
          </select>
        </div>
      </div>
      {
        hsmd == true &&
        (
          <>
            <div className='us-main-section-title'>
              Change SMD
            </div>
            <div className='us-main-section-body'>
              <div className='ss-input-section'>
                <label className='ss-input-label' htmlFor='ss-current-smd'>Current SMD</label>
                <p className='ss-current-smd' id='ss-current-smd'>{smd1.name}</p>
              </div>
              <div className='ss-input-section'>
                <label className='ss-input-label' htmlFor='ss-smd-options'>New SMD</label>
                <select name='ss-smd-options' id='ss-smd-options' onChange={(e) => handleSMD(e)}>
                  <option value=''>Select SMD</option>
                  {
                    smds.map((res) =>
                      <option value={res._id}>{res.name}</option>
                    )
                  }
                </select>
              </div>
              <div className='ss-submit-section'>
                <button className='ss-submit-button' onClick={SubmitSMD}>Update SMD</button>
              </div>
            </div>
          </>
        )
      }

      {
        hinst == true &&
        (
          <>
            <div className='us-main-section-title'>
              Change institute
            </div>
            <div className='us-main-section-body'>
              <div className='ss-input-section'>
                <label className='ss-input-label' htmlFor='ss-current-institute'>Current institute</label>
                <p className='ss-current-institute' id='ss-current-institute'>{inst1.name}</p>
              </div>
              <div className='ss-input-section'>
                <label className='ss-input-label' htmlFor='ss-institute-options'>New institute</label>
                <Select
                  placeholder="Select Institute"
                  onChange={handleinstitute}
                  getOptionLabel={option => {
                    return option.name;
                  }}
                  getOptionValue={option => {
                    return option._id;
                  }}
                  options={insts}
                  className='ss-select-input'
                />

              </div>
              <div className='ss-submit-section'>
                <button className='ss-submit-button' onClick={Submitinst}>Update institute</button>
              </div>
            </div>
          </>
        )
      }



    </div>
  )
}

export default Location;