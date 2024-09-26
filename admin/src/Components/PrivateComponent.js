import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie';


const PrivateComponent = () => {
            
   const auth = Cookies.get('45034583/45843958/985307')

  return auth?<Outlet/>: <Navigate to='/Sigin'/>
  
}

export default PrivateComponent