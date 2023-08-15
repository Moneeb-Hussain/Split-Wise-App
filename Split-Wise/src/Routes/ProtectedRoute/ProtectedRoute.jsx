import { Navigate, Outlet, useOutletContext } from "react-router-dom";

function ProtectedRuote() {
  const [authe, setauth] = useOutletContext()

  return (
    <>
      {authe ? <Outlet /> : <Navigate to="/SignIn" />}
    </>
  );
}

export default ProtectedRuote;