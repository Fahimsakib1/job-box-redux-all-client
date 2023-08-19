import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toggleLogOutSuccess, userLogOut } from "../../features/Auth/AuthSlice";
import { toast } from "react-hot-toast";








const Navbar = () => {

  const navigate = useNavigate()
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const authStates = useSelector(state => state.auth);
  const { email, isLoading, isError, error, logOutSuccess } = authStates


  const  handleLogOut = () => {
    dispatch(userLogOut())
  }


  useEffect(() => {
    
    if(!isLoading && logOutSuccess) {
      toast.success("Logout Successful...", {id: "LogOut"});
      dispatch(toggleLogOutSuccess())
      navigate('/login')
    }
    if(!isLoading && isError) {
      toast.error(error, {id: "LogOut"})
    }
  }, [isLoading, logOutSuccess, isError, error]);




  return (
    <nav
      className={` shadow-2xl py-2 fixed w-full z-[999] ${pathname === "/" ? null : "bg-white"
        }`}
    >
      <ul className='mb-4 max-w-7xl mx-auto flex gap-y-2 gap-x-8 h-full justify-center items-center'>
        
        <li className='flex-auto font-semibold text-2xl'>
          <Link to='/'>JobBox</Link>
        </li>

        <li>
          {
            email && <p>Welcome, {email}</p>
          }
        </li>

        <li>
          <Link className='hover:text-primary' to='/jobs'>
            Jobs
          </Link>
        </li>

        <li>
          {
            email ?
              <>
                <Link onClick={handleLogOut}
                  className='text-red-600 border border-red-600  py-1 rounded-md hover:border-red-600 hover:text-white hover:bg-red-600 px-2 hover:px-4 transition-all cursor-pointer'
                >
                  Logout
                </Link>
              </>
              :
              <>
                <Link
                  className='border border-black px-2 py-1 rounded-md hover:border-primary hover:text-white hover:bg-primary hover:px-4 transition-all cursor-pointer'
                  to='/login'
                >
                  Login
                </Link>
              </>
          }
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
