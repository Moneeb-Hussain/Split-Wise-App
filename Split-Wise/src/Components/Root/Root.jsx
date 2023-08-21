import React from 'react'
import NavBar from '../NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Root() {
  return (
    <div>
      <NavBar/>
      <ToastContainer />
      <Outlet/>
    </div>
  )
}
