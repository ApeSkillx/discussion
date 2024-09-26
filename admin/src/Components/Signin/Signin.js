import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';
import './Signin.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme();

export default function SignIn() {


  const navigate = useNavigate()

  let myPromise = new Promise((resolve,reject)=>{
    const auth = Cookies.get('45034583/45843958/985307')
    resolve(auth)
  })
  myPromise.then(
    async function(value)
    {
        if(value)
        {                              
            navigate('/')
        }               
        
    }
        )  

 
    const [loading, setLoading] = useState(false);   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    function validateEmail(email) {
      const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(email) === false || !(email.split('@')[1] === 'icar.gov.in')) {
        return false;
      } else return true;
    }

    
  const handleSubmit = async (event) => {

    event.preventDefault(); 
    setLoading(true)
    if(!email || !password )
        {
          toast.error('Plese Fill the field')
            setLoading(false);
        }
    else if(!validateEmail(email))
    {
      toast.error('Email is not in Valid Formate')
      setLoading(false);
    }
    else
    {    

      try{
        const resp = await axios.post('/SignAdmin', {
            email,
            password
        }).then((resp)=>{

          const UserName = [resp.data.userExist.email,resp.data.userExist.name,resp.data.userExist._id]  
          // const expirationTime = new Date(new Date().getTime() + 6000000); 

          
          let myPromise = new Promise((resolve,reject)=>{
            setTimeout(() => resolve(Cookies.set('45034583/45843958/985307',UserName)), 500)               
           
        })
          myPromise.then(
            ()=>
            {
                toast.success('Login successfully')           
                 navigate('/') 
            }
                )            
        })
        }
        catch(err) {                    
          toast.error(err.response.data.err)
          setLoading(false);
        }
    }      
    
  
  };

  return (
    <div class='signin-bg'>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: '32px',
              borderRadius: '10px',
              backgroundColor: '#313338',
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5" sx={{ color: '#F2F3F5' }}>
              Sign in
            </Typography>
            {/* <Typography component="h1" variant="h5" sx={{ color: '#F2F3F5' }}>
              Welcome back admin!
            </Typography>
            <Typography component="h2" variant="h6" sx={{ color: '#F2F3F5' }}>
              Sign in
            </Typography> */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                // label="Email Address"
                placeholder="Email Address *"
                name="email"
                value={email}
                autoComplete="email"
                autoFocus
                onChange={(e)=>{setEmail(e.target.value)}}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#1E1F22' },
                    '&:hover fieldset': { borderColor: '#1E1F22' },
                    '&.Mui-focused fieldset': { borderColor: '#1E1F22' },
                  },
                }}
                InputLabelProps={{
                  style: { color: '#B5BAC1' },
                }}
                InputProps={{
                  style: { color: '#F2F3F5', backgroundColor: '#1E1F22' },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                // label="Password"
                placeholder="Password *"
                type="password"
                id="password"
                value={password}
                autoComplete="current-password"
                onChange={(e)=>{setPassword(e.target.value)}}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#1E1F22' },
                    '&:hover fieldset': { borderColor: '#1E1F22' },
                    '&.Mui-focused fieldset': { borderColor: '#1E1F22' },
                  },
                }}
                InputLabelProps={{
                  style: { color: '#B5BAC1' },
                }}
                InputProps={{
                  style: { color: '#F2F3F5', backgroundColor: '#1E1F22' },
                }}
              />          
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3,
                  mb: 2,
                  p: 2,
                  backgroundColor: '#006633',
                  '&:hover': { backgroundColor: '#02773d' },
                }}
              >  
              {loading ? "Logging in..." : "Login"}
              </Button>            
            </Box>
          </Box>       
        </Container>     
      </ThemeProvider>
    </div>
  );
}