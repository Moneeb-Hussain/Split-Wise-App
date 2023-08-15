import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Routes/Home/Home";
import Root from "./Components/Root/Root";
import SignUp from "./Routes/SignUp/SignUp";
import SignIn from "./Routes/SignIn/SignIn";
import UserDashBoard from "./Routes/UserDashBoard/UserDashBoard";
import ProtectedRuote from "./Routes/ProtectedRoute/ProtectedRoute";

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
          }
        ]
      },
      {
        path: "/user/SignUp",
        element: <SignUp />,
      },
      {
        path: "/user/SignIn",
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
