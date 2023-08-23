import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Routes/Home/Home";
import Root from "./Components/Root/Root";
import SignUp from "./Routes/SignUp/SignUp";
import SignIn from "./Routes/SignIn/SignIn";
import UserDashBoard from "./Routes/UserDashBoard/UserDashBoard";
import ProtectedRuote from "./Routes/ProtectedRoute/ProtectedRoute";
import AddExpense from "./Routes/AddExpense/AddExpense";
import UserExpense from "./Routes/UserExpense/UserExpense";
import { auth } from "./Firebase/Firebase";

export default function App(){
const [userauth, setUserAuth] = useState(false);

useEffect(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserAuth(true);
    } else {
      setUserAuth(false);
    }
  });
}, [auth]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: userauth? <UserDashBoard />: <Home />,
      },
      {
        path: '/',
        element: <ProtectedRuote />,
        children: [
          {
            path: "/:uid",
            element: <UserDashBoard />,
          },
          {
            path: "/:uid/add-expense",
            element: <AddExpense />,
          },
          {
            path: "/:uid/user-expenses",
            element: <UserExpense />,
          },
        ]
      },
      {
        path: "signup",
        element: userauth? <UserDashBoard />:<SignUp />,
      },
      {
        path: "signin",
        element: userauth? <UserDashBoard />: <SignIn />,
      },
      {
        path: "*",
        element: userauth? <UserDashBoard />:<SignIn />
      }
    ],
  },
]);
return(
    <RouterProvider router={router} />
)
}