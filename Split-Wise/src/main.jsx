import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Routes/Home/Home";
import Root from "./Components/Root/Root";
import SignUp from "./Routes/SignUp/SignUp";
import SignIn from "./Routes/SignIn/SignIn";
import UserDashBoard from "./Routes/UserDashBoard/UserDashBoard";
import ProtectedRuote from "./Routes/ProtectedRoute/ProtectedRoute";
import AddExpense from "./Routes/AddExpense/AddExpense";
import UserExpense from "./Routes/UserExpense/UserExpense";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/',
        element: <ProtectedRuote />,
        children: [
          {
            path: "user/:uid",
            element: <UserDashBoard />,
          },
          {
            path: "/user/:uid/Add-Expense",
            element: <AddExpense />,
          },
          {
            path: "/user/:uid/User-Expenses",
            element: <UserExpense />,
          },
        ]
      },
      {
        path: "/user/signup",
        element: <SignUp />,
      },
      {
        path: "/user/signin",
        element: <SignIn />,
      },
      {
        path: "*",
        element: <SignIn />
      }
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
