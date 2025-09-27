import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
   <>
   <NavBar/>
   <Outlet/>
{/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla voluptate nam suscipit ducimus dignissimos, ad corporis doloremque sint maxime placeat, omnis a praesentium ipsam in rerum totam optio nihil aspernatur! */}
   </>
  )
}

export default RootLayout