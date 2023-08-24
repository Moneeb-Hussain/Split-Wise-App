import {Outlet, useNavigate } from "react-router-dom";
import { auth } from '../../Firebase/Firebase';
import { useEffect, useState } from "react";

function ProtectedRuote() {

    const navigate =useNavigate()
    const [userAuth, setuserAuth] = useState(false)

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
            setuserAuth(true)
        } else {
        navigate("/SignIn")
        }
      });
  }, []);
  
  return (
    <>
     {userAuth && <Outlet/>}
    </>
  );
}

export default ProtectedRuote;