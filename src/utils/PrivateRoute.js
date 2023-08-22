import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/reusable/Loading";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {


  const location = useLocation();
  
  const { isLoading, user } = useSelector((state) => state.auth)
  const { email } = useSelector((state) => state.auth.user)
  const { pathname } = useLocation();



  if (isLoading) {
    return <Loading />;
  }

  // if (!isLoading && !email) {
  //   return <Navigate to='/login' state={{ path: pathname }} />;
  // }

  // return children;

  if (email) {
    return children;
  }
  return <Navigate to='/login' state={{ from: location }} replace></Navigate>
};

export default PrivateRoute;
