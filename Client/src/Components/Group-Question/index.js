import React, {useState, useEffect} from 'react'
import './css/index.css'
import Sidebar from '../sidebar/sidebar'
import Main from './main'
import axios from 'axios'


const Index = () => {

    let search = window.location.search
  let params =new URLSearchParams(search)
  let id = params.get('id')
      
  console.log(id)


 const auth = sessionStorage.getItem('username')
 const [group, setGroup] = useState('')

  useEffect(()=>{
    async function getGroup()
    {
      await axios.get(`/group/${auth}`).then((res)=>{        
         
          setGroup(res)
        
      }).catch((err)=>{
        console.log(err)
      })
    }
    getGroup()
  },[])  
  
  return (
    <div className='stack-index'>

        <div className='stack-index-content'>
            <Sidebar group={group}/>
            <Main g_id={id}/>
        </div>
    </div>
  )
}

export default Index