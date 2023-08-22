import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { googleLogin, userLogin } from "../features/Auth/AuthSlice";
import { FaGoogle } from 'react-icons/fa'






const Login = () => {


  const dispatch = useDispatch()
  const authStates = useSelector(state => state.auth)

  const { user, isLoading, isError, error} = authStates
  const { email, role} = authStates.user




  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();




  const onSubmit = (data) => {
    console.log(data);
    dispatch(userLogin(data))
  };

  const handleLogInByGoogle = () => {
    dispatch(googleLogin())
    // dispatch(toggleLoginSuccess())
  }



  //login successful hole home page e navigate korbe
  useEffect(() => {
    if (!isLoading && email) {
      toast.success("Login Successful...", { id: "LoginUser" });
      // dispatch(toggleLoginSuccess())
      reset();
      navigate('/')
    }
  }, [isLoading, email]);




 //kono error hole error show korbe
  useEffect(() => {
    if (isError) {
      toast.error(error)
    }
  }, [isError, error]);




  return (
    <div className='flex justify-center items-center'>
      <div className='md:mt-24 mt-10 w-1/2'>
        <img src={loginImage} className='flex md:h-[600px] h-full w-full' alt='' />
      </div>
      <div className='mt-16 w-1/2 grid place-items-center'>
        <div className='bg-[#FFFAF4] grid place-items-center p-10 border-2 border-gray-400 rounded-md'>
          <h1 className='mb-6 font-medium text-2xl'>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-3'>
              <div className='flex flex-col items-start'>
                <label htmlFor='email' className='ml-5'>
                  Email
                </label>
                <input type='email' {...register("email")} id='email' />
              </div>
              <div className='flex flex-col items-start'>
                <label htmlFor='password' className='ml-5'>
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  {...register("password")}
                />
              </div>

              {/* {
                isError &&
                <p className="text-red-600 text-start mt-3">{error}</p>
              } */}

              <div className='relative !mt-8'>
                <button
                  type='submit'
                  className='font-bold text-white py-3 rounded-full bg-primary hover:bg-purple-700 w-full'
                >
                  Login
                </button>

                <button
                  onClick={handleLogInByGoogle}
                  className='mt-4 font-semibold border-2 border-gray-400 text-black hover:text-white py-2 rounded-full hover:border-teal-800 hover:bg-teal-800 w-full'
                >
                  <div className="flex justify-center items-center gap-x-2">
                    <FaGoogle className="text-xl"></FaGoogle>
                    <p>Continue With Google</p>
                  </div>
                </button>

              </div>
              <div>
                <p>
                  Don't have an account?{" "}
                  <span
                    className='text-primary hover:underline font-bold cursor-pointer'
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
