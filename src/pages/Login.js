import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { googleLogin, toggleLoginSuccess, userLogin } from "../features/Auth/AuthSlice";
import { FaGoogle } from 'react-icons/fa'






const Login = () => {


  const dispatch = useDispatch()
  const authStates = useSelector(state => state.auth)

  const { email, isLoading, isError, error, loginSuccess} = authStates




  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    dispatch(userLogin(data))
  };


  useEffect(() => {
    if (!isLoading && loginSuccess) {
      toast.success("Login Successful...", { id: "LoginUser" });
      dispatch(toggleLoginSuccess())
      reset();
    }
    if (!isLoading && isError) {
      toast.error(error, { id: "LoginUser" })
    }
  }, [isLoading, loginSuccess, isError, error]);


  //login successful hole home page e navigate korbe
  useEffect(() => {
    if (!isLoading && email) {
      navigate('/')
    }
  }, [isLoading, email]);




  const handleLogInByGoogle = () => {
    dispatch(googleLogin())
  }





  return (
    <div className='flex justify-center items-center'>
      <div className='md:mt-24 mt-10 w-1/2'>
        <img src={loginImage} className='flex md:h-[600px] h-full w-full' alt='' />
      </div>
      <div className='w-1/2 grid place-items-center'>
        <div className='bg-[#FFFAF4] rounded-lg grid place-items-center p-10'>
          <h1 className='mb-10 font-medium text-2xl'>Login</h1>
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
              <div className='relative !mt-8'>
                <button
                  type='submit'
                  className='font-bold text-white py-3 rounded-full bg-primary w-full'
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
                    className='text-primary hover:underline cursor-pointer'
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
