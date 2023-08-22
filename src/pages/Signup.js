import React, { useEffect, useState } from "react";
import loginImage from "../assets/login.svg";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from "react-redux";
import { createUser, googleLogin, toggleLoginSuccess, toggleUserCreateSuccess } from "../features/Auth/AuthSlice";
import { FaGoogle } from 'react-icons/fa'











const Signup = () => {





  const { handleSubmit, register, reset, control } = useForm();

  const password = useWatch({ control, name: "password" });

  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);




  useEffect(() => {
    if (
      password !== undefined &&
      password !== "" &&
      confirmPassword !== undefined &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password, confirmPassword]);



  const dispatch = useDispatch()
  const authStates = useSelector(state => state.auth)
  // console.log("State Before Sign Up: ", authStates);

  const { user, isLoading, isError, error } = authStates
  const { email, role} = authStates.user



  const onSubmit = (data) => {
    console.log(data);
    dispatch(createUser(data))
  };
  
  const handleLogInByGoogle = () => {
    dispatch(googleLogin())
  }








  

    //signup successful hole home page e navigate korbe
    useEffect(() => {
      if (!isLoading && email) {
        toast.success("Signup Successful...", { id: "SignUpUser" });
        // dispatch(toggleLoginSuccess())
        // dispatch(toggleUserCreateSuccess())
        reset();
        navigate('/')
      }
    }, [isLoading, isError, error, email]);
  
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
      <div className='lg:mt-24 md:mt-12 w-1/2 grid place-items-center'>
        <div className='bg-[#FFFAF4] grid place-items-center p-10 border-2 border-gray-400 rounded-md'>
          <h1 className='mb-6 font-medium text-2xl'>Sign up</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-3'>
              <div className='flex flex-col items-start'>
                <label htmlFor='email' className='ml-5'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  {...register("email")}
                />
              </div>

              <div className='flex flex-col items-start'>
                <label htmlFor='password' className='ml-5'>
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  {...register("password")}
                />
              </div>
              <div className='flex flex-col items-start'>
                <label htmlFor='confirm-password' className='ml-5'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirm-password'
                  {...register("confirmPassword")}
                />
              </div>
              <div className='!mt-8 '>
                <button
                  type='submit'
                  className='font-bold text-white py-3 rounded-full bg-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed'
                  disabled={disabled}
                >
                  Sign up
                </button>


                <button
                  onClick={handleLogInByGoogle}
                  className='mt-6 font-semibold border-2 border-gray-400 text-black hover:text-white py-2 rounded-full hover:border-teal-800 hover:bg-teal-800 w-full'
                >
                  <div className="flex justify-center items-center gap-x-2">
                    <FaGoogle className="text-xl"></FaGoogle>
                    <p>Sign Up With Google</p>
                  </div>
                </button>






              </div>
              <div>
                <p>
                  Already have an account?{" "}
                  <span
                    className='text-primary font-bold hover:underline cursor-pointer'
                    onClick={() => navigate("/login")}
                  >
                    Login
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

export default Signup;
