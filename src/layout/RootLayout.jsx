import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'

const RootLayout = () => {
  return (
   <>
   <ScrollToTop />
   <NavBar/>
   <Outlet/>
   </>
  )
}


export default RootLayout