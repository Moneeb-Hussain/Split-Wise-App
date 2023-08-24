import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Routes/Home/Home";
import Root from "./Components/Root/Root";
import SignUp from "./Routes/SignUp/SignUp";
import SignIn from "./Routes/SignIn/SignIn";
import UserDashBoard from "./Routes/UserDashBoard/UserDashBoard";
import ProtectedRuote from "./Routes/ProtectedRoute/ProtectedRoute";
import AddExpense from "./Routes/AddExpense/AddExpense";
import UserExpense from "./Routes/UserExpense/UserExpense";
import { useDispatch, useSelector } from "react-redux";
import { setUserAuthToken } from "./Slices/authSlice";
import { auth } from "./Firebase/Firebase";

export default function App() {

  const userAuthToken = useSelector((state) => state.auth.userAuthToken);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user?.displayName) dispatch(setUserAuthToken(true));
      }
    });
  }, [auth.currentUser?.displayName]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: userAuthToken ? <UserDashBoard /> : <Home />,
        },
        {
          path: "/",
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
          ],
        },
        {
          path: "signup",
          element: userAuthToken ? <UserDashBoard /> : <SignUp />,
        },
        {
          path: "signin",
          element: userAuthToken ? <UserDashBoard /> : <SignIn />,
        },
        {
          path: "*",
          element: userAuthToken ? <UserDashBoard /> : <SignIn />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
