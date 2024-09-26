import React, {useState, useEffect} from 'react'
import './index.css'
import Sidebar from '../sidebar/sidebar'
import Main from './mainquestion'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie';
const Index = () => {

  const [questiondata, setQuestionData] = useState()
  
  const userData = Cookies.get('auth')
  let auth =''
  if(userData)
  {
    var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
    const data  = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));  
    auth = data[0]  
  }

  let search = window.location.search
  const params =new URLSearchParams(search)
  const id = params.get('id')

  useEffect(()=>{
    async function getQuestionDetails()
    {
      await axios.get(`/Question-detail/${id}`).then((resp) =>{
          
        
        setQuestionData(resp.data)
      })
      .catch((err)=>{
        console.log(err)
      })

    }
    getQuestionDetails()
   
  },[])

  const [group, setGroup] = useState('')

  useEffect(()=>{
    async function getGroup()
    {
      await axios.get(`/group/${auth}`).then((res)=>{        
         
          setGroup(res.data)
        
      }).catch((err)=>{
        console.log(err)
      })
    }
    getGroup()
  },[])  



  
 

   return (
    <div className='stack-index'>
            
               
      {
        questiondata?.map((_id,index)=>(
          <>
            <div key={index}className='stack-index-content'>
            <Sidebar Subject={group}/>
            <Main details={_id}/>

            </div>   
       
          </>
        ))
      }
        
          
        
            
       
            
          
       
    </div>
  )
}

export default Index