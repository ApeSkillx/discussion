import React, { useState, useEffect } from 'react'
import Img from './logo.png'
import './index.css'
import Content from './content'
import './captcha'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import PasswordStrengthBar from 'react-password-strength-bar';
import validator from 'validator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'
import Select from 'react-dropdown-select'
import Select_S from 'react-select'

const Index = () => {
  const navigate = useNavigate()

  let myPromise = new Promise((resolve, reject) => {
    const auth = Cookies.get('auth')
    resolve(auth)
  })
  myPromise.then(
    async function (value) {
      if (value) {
        navigate('/')
      }

    }
  )

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [register, setRegister] = useState(false)
  const [login, setLogin] = useState(false)
  const [user, setUSer] = useState({
    name: '', email: '', password: '', cpassword: ''
  })
  let name, value
  const handleInput = (e) => {

    name = e.target.name
    value = e.target.value

    setUSer({ ...user, [name]: value })

    if (user.name) {
      if (/^[A-Za-z\s]*$/.test(user.name) == false) {
        setError("Please Enter Name only in Alphabats Format");
      }
      else {
        setError("");
      }
    }


  }



  function validateEmail(email) {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email) === false || !(email.split('@')[1] === 'icar.gov.in')) {
      return false;
    } else return true;
  }


  /****************Handle Designation and Status********************************/
  const [designation, setDesignation] = useState('')
  const [status, setStatus] = useState('')

  const handldesignation = (e) => {

    if (!e.target.value) {
      setStatus('')
      setDesignation('')
    }
    else {
      const val = e.target.value.split(',')
      setStatus(val[0])
      setDesignation(val[1])
    }

  }
  /***************************************************/


  /// Registration button function call here
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { name, email, password, cpassword } = user

    if (!name) {
      setError("Please Enter Your Name");
      setLoading(false);
    }
    else if (/^[A-Za-z\s]*$/.test(name) == false) {
      setError("Please Enter Name only in Alphabats Format");
      setLoading(false);
    }
    else if (intrested.length > 4) {
      setError("Maximum 4 Interested Disciplines Allowed");
      setLoading(false);
    }
    else if (intrested.includes(Divisionid)) {
      setError("Interested Discipline should be diffrent from main Discipline");
      setLoading(false);
    }
    else if (!Divisionid) {
      setError("Please Select Main Discipline");
      setLoading(false);
    }
    else if (!password || !cpassword) {
      setError("Please Enter Password and Confirm Password");
      setLoading(false);
    }
    else if (!Hqrs) {
      setError("Please Select Working Place");
      setLoading(false);
    }
    else if (!designation) {
      setError("Please Select Your Designation");
      setLoading(false);
    }
    else if (!Smdid) {
      setError("Please Select Institute/SMD");
      setLoading(false);
    }
    else if (!validator.isStrongPassword(password || cpassword, {
      minLength: 8, minLowercase: 1, maxLength: 24,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      setError("The password does not meet the requirements of the password rules");
      setLoading(false);
    }
    else if (!(password === cpassword)) {
      setError("Password is not Matched");
      setLoading(false);
    }
    else {

      // console.log(institute,Smdid,Hqrs,intrested,Divisionid)

      if (window.confirm('Please confirm for Register')) {
        try {
          const resp = await axios.post('/Signup',
            {
              name,
              email,
              Divisionid,
              Smdid,
              institute,
              password,
              status,
              intrested,
              designation,
              Hqrs

            }).then((resp) => {
              toast.success('Registration Sucessfully')
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
  /*******************Handle Login Page button*************************/
  const handleLogin = async (e) => {
    const { email, password } = user
    e.preventDefault()
    if (!email || !password) {
      setError("Something missing");
      setLoading(false);
    }
    else if (!validateEmail(email)) {
      setError("Email is not in valid format");
      setLoading(false);
    }
    else {
      try {
        const resp = await axios.post('/Signin', {
          email,
          password
        }).then((resp) => {
          const ciphertext = [resp.data.userExist.email, resp.data.userExist.name]

          var UserName = CryptoJS.AES.encrypt(JSON.stringify(ciphertext), 'secret key 123').toString();

          let myPromise = new Promise((resolve, reject) => {

            setTimeout(() => resolve(Cookies.set('auth', UserName)), 500)
            // resolve(sessionStorage.setItem('username',UserName))
          })
          myPromise.then(
            async function () {
              if (resp.data.userExist.status == 1) {
                toast.success('Login successfully')
                navigate('/index')
              }
              else {
                toast.success('Login successfully')
                navigate('/index')

              }


            }
          )

        })
      }
      catch (err) {

        // setError(err.response.data.err)

        toast.error(err.response.data.err)

        setLoading(false);
      }
    }
  }

  const [Smd, setSmd] = useState([])
  const [Smdid, setSmdid] = useState('')
  const [subject, setSubject] = useState([])
  const [location, setLocation] = useState([])
  const [institutes, setInstitutes] = useState([])
  const [desig, setDesig] = useState([])
  const [Division, setDivision] = useState([])
  const [Divisionid, setDivisionid] = useState('')
  const [enable, setEnable] = useState(true)


  //Here We fetch the SMD division data from server 
  useEffect(() => {
    async function getSubject() {
      await axios.get('/subject').then((res) => {
        setSubject(res.data)
      }).catch((err) => {
        console.log(err)
      })

    }
    async function getInstitute() {
      await axios.get('/institute').then((res) => {
        setInstitutes(res.data)
      }).catch((err) => {
        console.log(err)
      })

    }
    async function getSmd() {
      await axios.get('/smddetail').then((res) => {
        setSmd(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
    async function getLocation() {
      await axios.get('/location').then((res) => {
        setLocation(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
    getLocation()
    getSmd()
    getInstitute()
    getSubject()
  }, [])

  /************handle SMD*************/
  const handleSmd = (e) => {
    setSmdid(e.target.value)
  }

  /************************************/
  /***************handle Subject which is as Division****************/

  const handleDivision = (e) => {
    setDivisionid(e._id)
    console.log(e._id)
  }

  /*******************************************************************/

  /**********handle Location*************/
  const [hideI, setHideI] = useState(true)
  const [hideSmd, setHideSmd] = useState(true)
  const [Hqrs, setHqrs] = useState('')
  const handleLocation = (e) => {
    setHqrs(e.target.value)
    setStatus('')
    setDesignation('')

    if (e.target.value == 1) {
      location.filter((dsg) => dsg.id.includes(e.target.value)).map((data, index) => {
        setDesig(data.designation)
      })
      setEnable(false)
      setHideI(false)
      setHideSmd(true)
      setSmdid('')
      setInstitute('')

    }
    else if (e.target.value == 2) {
      location.filter((dsg) => dsg.id.includes(e.target.value)).map((data, index) => {
        setDesig(data.designation)
      })
      setEnable(false)
      setHideSmd(false)
      setHideI(true)
      setSmdid('')
      setInstitute('')
    }
    else {
      setEnable(true)
      setDesig([])
      setHideSmd(true)
      setHideI(true)
      setSmdid('')
      setInstitute('')


    }
  }

  /**************************************/
  const [institute, setInstitute] = useState('')

  const handleInstitute = (e) => {
    const INST = new Promise((res, rej) => {
      res(e._id)
    })
    INST.then(
      async function (value) {
        const data = await axios.get(`/SMD/${value}`)
        setSmdid(data.data._id)
        setInstitute(e._id)
      }
    )
  }
  /****************Select Intrested Subjects*********************/
  let options = []

  Division?.map((resp) => {
    options.push(resp)
  })
  let intrested = []

  const [values, setValues] = useState([])

  values.map((resp) => {
    intrested.push(resp._id)
  })

  /********************************************/

  const [verify, setVerify] = useState(false)
  const [pverify, setPverify] = useState(false)
  const [otps, setOtps] = useState('')
  const [respassword, setRespassword] = useState(false)
  const [resmail, setResmail] = useState(false)
  const [demail, setDemail] = useState(false)
  const [dpassword, setDpassword] = useState(false)

  const Getotp = async (e) => {

    const { email } = user

    e.preventDefault()
    setLoading(true)

    if (!email) {
      toast.error('Please enter your email')
      setLoading(false);

    }
    else if (!validateEmail(email)) {
      toast.error('Email is not in valid format')
      setLoading(false);
    }
    else {
      try {

        const data = await axios.post('/SendOtp', {
          email
        }).then((resp) => {
          toast.success('Please Check your Email')
          setResmail(true)
          setVerify(true)
        })

      }
      catch (err) {
        toast.error(err.response.data.err)
        setLoading(false);
      }

    }
  }

  const Resotp = async (e) => {

    const { email } = user

    try {
      const data = await axios.post('/Resotp', {
        email,
      }).then((resp) => {
        toast.success('OTP Resend Successfully')
      })
    }
    catch (err) {
      toast.error(err.response.data.err)
      setLoading(false);
    }


  }

  const Verifyotp = async (e) => {

    const { otp, email } = user

    try {
      const data = await axios.post('/VerifyOtp', {
        otp,
        email,

      }).then((resp) => {
        toast.success('Right OTP')
        setDemail(true)
        setLoading(false);
      })
    }
    catch (err) {
      toast.error(err.response.data.err)
      setLoading(false);
    }
  }


  /**********************Forget Password************************/

  const GetPassword = async (e) => {

    const { email } = user

    e.preventDefault()
    setLoading(true)

    if (!email) {
      toast.error('Please enter your email')
      setLoading(false);

    }
    else if (!validateEmail(email)) {
      toast.error('Email is not in valid format')
      setLoading(false);
    }
    else {
      try {

        const data = await axios.post('/SendPassword', {
          email
        }).then((resp) => {
          toast.success('Please Check your Email')
          setRespassword(true)
          setPverify(true)
        })

      }
      catch (err) {
        toast.error(err.response.data.err)
        setLoading(false);
      }

    }
  }

  const ResPassword = async (e) => {

    const { email } = user
    try {
      const data = await axios.post('/Resotp', {
        email,
      }).then((resp) => {
        toast.success('OTP Resend Successfully')
      })
    }
    catch (err) {
      toast.error(err.response.data.err)
      setLoading(false);
    }

  }


  const VerifyPassword = async (e) => {

    const { otp, email } = user

    try {
      const data = await axios.post('/VerifyOtp', {
        otp,
        email,

      }).then((resp) => {
        toast.success('Right OTP')
        setDpassword(true)
        setLoading(false);
      })
    }
    catch (err) {
      toast.error(err.response.data.err)
      setLoading(false);
    }
  }


  const handlePassword = async (event) => {
    const { password, cpassword, email } = user

    setLoading(true)
    event.preventDefault();
    if (!password || !cpassword) {
      setError("Please Enter the New password and Confirm Password");
      setLoading(false);
    }
    else if (!validator.isStrongPassword(password || cpassword, {
      minLength: 8, minLowercase: 1, maxLength: 24,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      setError("The password does not meet the requirements of the password rules");
      setLoading(false);
    }
    else if (password != cpassword) {
      setError('New Password and Confirm Password should be same')
      setLoading(false);
    }
    else {
      setError('')
      if (window.confirm('Please confirm to change Password')) {
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


  /**************************************************************/

  return (
    <div className='auth'>
      <Helmet>
        <title>Discussion Forum | Auth</title>
      </Helmet>
      <div className='auth-container'>
        <Content />
        <div className='auth-login-container'>

          <div className='ICAR-Sign'>
            <img src={Img} alt="" style={{ height: "150px" }} />
          </div>
          {
            login ? (
              <>
                <div className='input-field'>
                  <p>ICAR Email (xxx@icar.gov.in)<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                  <input disabled={dpassword} type="email" name='email' autoComplete='off'
                    value={user.email}
                    onChange={handleInput}
                    placeholder='xxx@icar.gov.in' />
                </div>
                {
                  respassword == false ?
                    <>
                      <button style={{ marginTop: "20px" }} onClick={GetPassword}>
                        Get OTP
                      </button>
                    </>
                    :
                    dpassword == false &&
                    <>
                      <button style={{ marginTop: "20px" }} onClick={ResPassword}>
                        Resent OTP
                      </button>
                    </>
                }
                {
                  dpassword == false ?

                    pverify == true &&
                    <>
                      <div className='input-field'>
                        <p>Enter OTP <sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input name='otp' type="password" autoComplete='off'
                          value={user.otp}
                          onChange={handleInput}
                          placeholder='Please Enter OTP' />
                      </div>
                      <button style={{ marginTop: "20px" }} onClick={VerifyPassword}>
                        Verify OTP
                      </button>
                    </>
                    :
                    <>
                      <div className='input-field'>
                        <p> New Password<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input name='password' type="password" autoComplete='off'
                          value={user.password}
                          onChange={handleInput}
                          placeholder='Enter the password' />
                        <PasswordStrengthBar className='cp-input' password={user.password} />
                      </div>
                      <div className='input-field'>
                        <p>Confirm Password<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input type="password" name='cpassword' autoComplete='off'
                          value={user.cpassword}
                          onChange={handleInput}
                          placeholder='Enter the Confirm password' />
                        <PasswordStrengthBar className='cp-input' password={user.cpassword} />
                      </div>
                      <button style={{ marginTop: "20px" }} onClick={handlePassword}>
                        {loading ? "Change..." : "Change Password"}
                      </button>
                    </>
                }

              </>
            )
              :
              register ? (<>

                <div className='input-field'>
                  <p>ICAR Email (xxx@icar.gov.in)<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                  <input disabled={demail} type="email" name='email' autoComplete='off'
                    value={user.email}
                    onChange={handleInput}
                    placeholder='xxx@icar.gov.in' />
                </div>
                {
                  resmail == false ?

                    <>
                      <button style={{ marginTop: "20px" }} onClick={Getotp}>
                        Get OTP
                      </button>
                    </>
                    :
                    demail == false &&
                    <>
                      <button style={{ marginTop: "20px" }} onClick={Resotp}>
                        Resent OTP
                      </button>
                    </>
                }

                {
                  demail == false ?

                    verify == true &&
                    <>
                      <div className='input-field'>
                        <p>Enter OTP<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input type="password" name='otp' autoComplete='off'
                          value={user.otp}
                          onChange={handleInput}
                          placeholder='Please Enter OTP' />
                      </div>
                      <button style={{ marginTop: "20px" }} onClick={Verifyotp}>
                        Verify OTP
                      </button>
                    </>

                    :

                    <>

                      <div className='input-field'>
                        <p>Name<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input type="text" name='name' autoComplete='off'
                          value={user.name}
                          onChange={handleInput}
                          placeholder='Enter your full name' />
                      </div>
                      <div className='input-field'>
                        <p>Select Work Place<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <select name="division" onChange={(e) => handleLocation(e)} id="smd">
                          <option value=''>--Select Work Place--</option>
                          {
                            location.map((res) =>
                              <option value={res.id}>{res.name}</option>
                            )
                          }
                        </select>
                      </div>
                      {
                        enable == false &&
                        (
                          <div className='input-field'>
                            <p>Select Your Designation<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                            <select name="division" onChange={(e) => handldesignation(e)} id="smd">
                              <option value=''>--Select Designation--</option>
                              {
                                desig.map((resp) =>
                                  <option value={[resp.id, resp.name]}>{resp.name}</option>
                                )
                              }
                            </select>
                          </div>

                        )
                      }

                      {
                        hideI == false &&
                        (
                          <div className='input-field'>
                            <p>Select Institute<sup style={{ color: "red" }}>&nbsp;*</sup></p>

                            <Select_S
                              placeholder="Select Institute"
                              onChange={handleInstitute}
                              getOptionLabel={option => {
                                return option.name;
                              }}
                              getOptionValue={option => {
                                return option._id;
                              }}
                              options={institutes}
                            />
                          </div>


                        )
                      }
                      {
                        hideSmd == false &&
                        (
                          <div className='input-field'>
                            <p>Select SMD<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                            <select onChange={(e) => { handleSmd(e) }} id="division">
                              <option value=''>--Select SMD--</option>
                              {
                                Smd.map((resp) =>
                                  <option value={resp._id}>{resp.name}</option>
                                )
                              }
                            </select>
                          </div>
                        )
                      }
                      <div className='input-field'>
                        <p>Select Main Discipline<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <Select_S
                          placeholder="Select Main Discipline"
                          onChange={handleDivision}
                          getOptionLabel={option => {
                            return option.name;
                          }}
                          getOptionValue={option => {
                            return option._id;
                          }}
                          options={subject}
                        />
                      </div>
                      <div className='input-field'>
                        <p>Select Interested Disciplines (optional)</p>
                        <Select
                          name='select'
                          options={values.length > 3 ? values : subject}
                          labelField='name'
                          valueField='name'
                          multi
                          onChange={values =>
                            setValues(values)
                          }
                        />
                      </div>

                      <div className='input-field'>
                        <p>Password<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input name='password' type="password" autoComplete='off'
                          value={user.password}
                          onChange={handleInput}
                          placeholder='Enter the password' />
                        <PasswordStrengthBar className='cp-input' password={user.password} />
                      </div>
                      <div className='input-field'>
                        <p>Confirm Password<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                        <input type="password" name='cpassword' autoComplete='off'
                          value={user.cpassword}
                          onChange={handleInput}
                          placeholder='Enter the Confirm password' />
                        <PasswordStrengthBar className='cp-input' password={user.cpassword} />
                      </div>
                      <button style={{ marginTop: "20px" }} onClick={handleRegister}>
                        {loading ? "Registering..." : "Register"}
                      </button>
                    </>
                }

              </>
              )

                : (

                  <>
                    <div className='input-field'>
                      <p>Email (xxx@icar.gov.in)<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                      <input type="email" name='email' autoComplete='off'
                        value={user.email}
                        onChange={handleInput}
                      />
                    </div>
                    <div className='input-field'>
                      <p>Password<sup style={{ color: "red" }}>&nbsp;*</sup></p>
                      <input type="password" name='password' autoComplete='off'
                        value={user.password}
                        onChange={handleInput}
                      />
                    </div>

                    <button style={{ marginTop: "20px" }} onClick={handleLogin}>
                      {loading ? "Logging in..." : "Login"}
                    </button>

                  </>
                )}
          {
            !register &&
            <p onClick={() => setLogin(!login) || setVerify(false) || setDemail(false) || setResmail(false) || setUSer({ name: '', email: '', division: '', password: '', cpassword: '' }) || setError(false)
            } style={{
              marginTop: '10px',
              textAlign: 'center',
              // color:'#0095ff',
              color: 'var(--secondary-color-forlink)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}>{login ? 'Login' : 'Forgot Password'}?</p>
          }
          {
            !login &&
            <p onClick={() => setRegister(!register) || setPverify(false) || setRespassword(false) || setDpassword(false) || setUSer({ name: '', email: '', division: '', password: '', cpassword: '' }) || setError(false)
            } style={{
              marginTop: '10px',
              textAlign: 'center',
              // color:'#0095ff',
              color: 'var(--secondary-color-forlink)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}>{register ? 'Login' : 'Register'}?</p>}
          <div id="company">
            {error !== "" && (
              <p
                style={{
                  color: "red",
                  fontSize: "14px",
                }}
              >
                {error}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>

  )
}

export default Index