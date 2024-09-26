import React, { useState, useEffect, useReducer } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import './PasswordSettings.css';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import validator from 'validator'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';


function ChangePasswordSettings() {

  const navigate = useNavigate()
  /********************Current Password Checking*********************/
  let password;
  const [errorMessage, setErrorMessage] = useState('')
  const [errorpmessage, setErrorPmessage] = useState('')
  const [loading, setLoading] = useState(false);
  const [pblock, setPblock] = useState(false)
  var bytes = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
  const email = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))[0];

  const handCurrent = async (e) => {

    setLoading(true)
    e.preventDefault();

    password = e.target.value
    console.log(password)
    try {
      const resp = await axios.post('/checkpassword', {
        email,
        password
      }).then((resp) => {
        const UserName = [resp.data.userExist.email, resp.data.userExist.name]
        if (UserName) {
          setErrorMessage('')
          toast.success('Password is correct')
          setPblock(true)
        }
      })
    }
    catch (err) {
      // setError(err.response.data.err)
      setPblock(false)
      setErrorMessage(err.response.data.err)
      setLoading(false);
    }
  }
  /****************************************************************/

  const [user, setUSer] = useState({
    npassword: '', cpassword: ''
  })
  let name, value
  const handleInput = (e) => {
    name = e.target.name
    value = e.target.value
    setUSer({ ...user, [name]: value })
  }


  const handleSubmit = async (event) => {
    const { npassword, cpassword } = user

    setLoading(true)
    event.preventDefault();
    if (!npassword) {
      toast.error("Please enter the new password");
      setLoading(false);
    }
    else if (!cpassword) {
      toast.error("Please enter the confirm password");
      setLoading(false);
    }
    else if (!validator.isStrongPassword(npassword || cpassword, {
      minLength: 8, minLowercase: 1, maxLength: 24,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      toast.error("Password must have combination of uppercase letters, lowercase letters, numbers, and symbols.");
      setLoading(false);
    }
    else if (npassword != cpassword) {
      toast.error('New password and confirm password should be same')
      setLoading(false);
    }
    else {
      setErrorPmessage('')
      if (window.confirm('Please confirm to change current password')) {

        try {
          const resp = await axios.post('/ChangePassword',
            {
              email,
              cpassword

            }).then((resp) => {
              toast.success('Password successfully changed')
              navigate('/')
              setLoading(false)
            })
        }
        catch (err) {
          toast.error(err.response.data.err)
          setLoading(false);
        }


      }
      else {
        setLoading(false);
      }
    }
  }

  return (
    <div className='us-main-section'>
      <div className='us-main-section-title'>
        Change password
      </div>

      <div className='us-main-section-body'>
        <form className='change-password-form'>

          <div className='cp-input-section'>
            <label className='cp-input-label' for='us-cp-input-1' >Enter current password<sup style={{ color: "red" }}>&nbsp;*</sup></label>
            <input className='cp-input' disabled={pblock} autoComplete='off' id='us-cp-input-1' type='password' placeholder='Enter your current password' onChange={(e) => handCurrent(e)} />
            {pblock == true ? <span style={{
              fontWeight: 'bold', color: 'Green',
            }}>{errorMessage}</span>
              :
              <span style={{
                fontWeight: 'bold',
                color: 'red',
              }}>{errorMessage}</span>}
          </div>

          {
            pblock == true &&
            <>
              <div className='cp-input-section'>
                <label className='cp-input-label' for='us-cp-input-2'>New password<sup style={{ color: "red" }}>&nbsp;*</sup></label>
                <input className='cp-input' id='us-cp-input-2'
                  type='password'
                  name='npassword'
                  value={user.npassword}
                  onChange={handleInput}
                />
                <PasswordStrengthBar className='cp-input' password={user.npassword} />
              </div>

              <div className='cp-input-section'>
                <label className='cp-input-label' for='us-cp-input-3'>Confirm new password<sup style={{ color: "red" }}>&nbsp;*</sup></label>
                <input className='cp-input' id='us-cp-input-3'
                  type='password'
                  name='cpassword'
                  value={user.cpassword}
                  onChange={handleInput}
                />
                <PasswordStrengthBar className='cp-input' password={user.cpassword} />
              </div>

              <div className='cp-submit-section'>
                <div className='cp-error-message'>
                </div>
                <button className='cp-submit-button' type='submit' onClick={handleSubmit}>Change password</button>
              </div>
            </>
          }
        </form>
      </div>

    </div>
  )
}

function PasswordSettings() {
  return (
    <div className='user-settings-main'>
      <ChangePasswordSettings />
    </div>
  )
}

export default PasswordSettings;