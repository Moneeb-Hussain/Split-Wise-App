import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import { Outlet } from 'react-router-dom'

export default function Root() {
  const [authe, setauth] = useState(false);
  return (
    <div>
      <NavBar/>
      <Outlet context={[authe, setauth]}/>
    </div>
  )
}
