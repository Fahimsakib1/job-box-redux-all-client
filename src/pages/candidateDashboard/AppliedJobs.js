import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JobCard from "../../components/reusable/JobCard";
import Loading from "../../components/reusable/Loading";
import { useLocation } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useTryFilterQuery, useUserAppliedJobsQuery } from "../../features/Job/JobAPI";







const AppliedJobs = () => {


  const user = useSelector((state) => state.auth.user);
  // console.log("User:", user);

  const [appliedJobs, setIsAppliedJobs] = useState([])
  useEffect(() => {
    fetch(`https://job-box-server-mu.vercel.app/applied-jobs/${user?.email}`)
      .then(res => res.json())
      .then(result => setIsAppliedJobs(result.data))
  }, [user?.email])





  const { register, reset, control } = useForm();
  const selectedRadio = useWatch({ control, name: "radioGroup" });


  const { pathname } = useLocation()
  // console.log("Pathname: ", pathname);








  const [filterValue, setFilterValue] = useState('')
  const handleRadioClick = (value) => {
    // console.log('Selected radio value:', value);
    setFilterValue(value)
  };

  const details = {
    email: user?.email,
    filterValue: 'filterByDate'
  }



  //ei khane data chara onno name diye destructure korle kaj korbe na
  // const { data, isLoading, isSuccess, isError, error } = useUserAppliedJobsQuery(user?.email, { pollingInterval: 500 })
  // console.log("Applied Data:", data?.data);





  const { data, isLoading, isSuccess, isError, error } = useTryFilterQuery(details, { pollingInterval: 1000 })


  let appliedJobContent;

  if (appliedJobs?.length > 0 && ( !filterValue || filterValue === 'filterCancel')) {
    appliedJobContent = <div>

      <div className='px-6 grid grid-cols-2 gap-5 pb-5'>
        {appliedJobs?.map((job) => (
          <JobCard jobData={job} />
        ))}
      </div>
    </div>
  }


  if (data && filterValue === 'filterByDate') {
    appliedJobContent = <div>
      <div className='px-6 grid grid-cols-2 gap-5 pb-5'>
        {data?.data?.map((job) => (
          <JobCard jobData={job} />
        ))}
      </div>
    </div>
  }




















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
                      className="cursor-pointer"
                      type='radio'
                      name="radioGroup"
                      id='filterByDate'
                      {...register("filter")}
                      value='filterByDate'
                      onClick={() => handleRadioClick('filterByDate')}
                    />
                    <label className="cursor-pointer ml-2 text-lg" for='filterByDate'>
                      Filter By Date
                    </label>
                  </div>

                  <div>
                    <input
                      className="cursor-pointer"
                      type='radio'
                      name="radioGroup"
                      id='filterCancel'
                      {...register("filter")}
                      value='filterCancel'
                      onClick={() => handleRadioClick('filterCancel')}
                    />
                    <label className='cursor-pointer ml-2 text-lg' for='filterCancel'>
                      Cancel Filter
                    </label>
                  </div>
                </div>

              </form>
            </div>

            {/* <div className='px-6 grid grid-cols-2 gap-5 pb-5'>
              {data?.data?.map((job) => (
                <JobCard jobData={job} />
              ))}
            </div> */}

            <div className=''>
              {appliedJobContent}
            </div>


          </>
          :
          <h1 className="text-gray-500 text-2xl my-64 font-bold text-center">{user?.firstName} {user?.lastName} you have not applied any job yet</h1>
      }




    </div>




  );
};

export default AppliedJobs;
