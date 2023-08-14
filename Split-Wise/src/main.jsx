import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Routes/Home/Home'
import Root from './Components/Root/Root'
import SignUp from './Routes/SignUp/SignUp'
import SignIn from './Routes/SignIn/SignIn'

const router=createBrowserRouter([
  {
    path: '/',
    element: <Root/>
  },
  {
    path: '/SignUp',
    element: <SignUp/>,
  },
  {
    path: '/SignIn',
    element: <SignIn />,
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
