import React from "react";
import { useSelector } from "react-redux";
import JobCard from "../../components/reusable/JobCard";
import Loading from "../../components/reusable/Loading";
import { useUserAppliedJobsQuery } from "../../features/Job/JobAPI";
import { useLocation } from "react-router-dom";


const AppliedJobs = () => {
  
  
  const {pathname} = useLocation()
  console.log("Pathname: ", pathname);
  
  const user = useSelector((state) => state.auth.user);
  console.log("User:", user);


  //ei khane data chara onno name diye destructure korle kaj korbe na
  const { data, isLoading, isSuccess, isError, error } = useUserAppliedJobsQuery(user?.email)


  if (isLoading) {
    return <Loading />;
  }




  return (
    <div>
      <h1 className='text-center text-xl py-5 text-bold'>Applied Jobs By <span className="font-semibold text-blue-600">{user?.firstName}</span></h1>

      <div className='px-6 grid grid-cols-2 gap-5 pb-5'>
        {data?.data?.map((job) => (
          <JobCard jobData={job} />
        ))}
      </div>

    </div>
  );
};

export default AppliedJobs;
