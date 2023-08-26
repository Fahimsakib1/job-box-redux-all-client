import React, { useState } from "react";
import { useSelector } from "react-redux";
import JobCard from "../../components/reusable/JobCard";
import Loading from "../../components/reusable/Loading";
import { useLocation } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useUserAppliedJobsQuery } from "../../features/Job/JobAPI";







const AppliedJobs = () => {


  const { register, reset, control } = useForm();
  const selectedRadio = useWatch({ control, name: "radioGroup" });


  const { pathname } = useLocation()
  // console.log("Pathname: ", pathname);

  const user = useSelector((state) => state.auth.user);
  // console.log("User:", user);



  
  let appliedJobContent;

  const [filterValue, setFilterValue] = useState('')
  const handleRadioClick = (value) => {
    // console.log('Selected radio value:', value);
    setFilterValue(value)
  };

  const details = {
    email: user?.email,
    filterValue: filterValue
  }



  //ei khane data chara onno name diye destructure korle kaj korbe na
  const { data, isLoading, isSuccess, isError, error } = useUserAppliedJobsQuery(user?.email, { pollingInterval: 500 })
  // console.log("Applied Data:", data?.data);










  







  if (isLoading) {
    return <Loading />;
  }







  return (
    <div>
      {
        data?.data?.length > 1

          ?
          <>
            <h1 className='text-center text-xl py-5 text-bold'>Applied Jobs By <span className="font-semibold text-blue-600">{user?.firstName}</span></h1>

            <div className=" my-6">
              <form>
                <div className='font-semibold flex justify-center items-center gap-8'>

                  <div>
                    <input
                      type='radio'
                      name="radioGroup"
                      id='filterByDate'
                      {...register("filter")}
                      value='filterByDate'
                      onClick={() => handleRadioClick('filterByDate')}
                    />
                    <label className='ml-2 text-lg' for='filterByDate'>
                      Filter By Date
                    </label>
                  </div>

                  <div>
                    <input
                      type='radio'
                      name="radioGroup"
                      id='filterCancel'
                      {...register("filter")}
                      value='filterCancel'
                      onClick={() => handleRadioClick('filterCancel')}
                    />
                    <label className='ml-2 text-lg' for='filterCancel'>
                      Cancel Filter
                    </label>
                  </div>
                </div>



              </form>
            </div>



            <div className='px-6 grid grid-cols-2 gap-5 pb-5'>
              {data?.data?.map((job) => (
                <JobCard jobData={job} />
              ))}
            </div>
          </>
          :
          <h1 className="text-gray-500 text-2xl my-64 font-bold text-center">{user?.firstName} {user?.lastName} you have not applied any job yet</h1>
      }




    </div>
  );
};

export default AppliedJobs;
