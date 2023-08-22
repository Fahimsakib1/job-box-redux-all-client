import React, { useEffect, useState } from "react";
import JobCard from "../components/reusable/JobCard";
import { useGetAllJobsQuery } from "../features/Job/JobAPI";





const Jobs = () => {


  // const { allJobs, isLoading, isSuccess, isError, error } = useGetAllJobsQuery() //kaj kore na 
  // console.log('All Jobs: ', allJobs)



  const [allJobs, setJobs] = useState()
  useEffect(() => {
    fetch('http://localhost:5000/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
  }, [])



  return (
    <div className='pt-14'>
      <div className='bg-primary/10 p-5 rounded-2xl'>
        <h1 className='font-semibold text-xl'>Find Jobs</h1>

        <div  className='grid grid-cols-2 gap-5 mt-5'>
          {
            allJobs &&
            <>
              {
                allJobs?.map((jobData, index) => <JobCard key={index} jobData={jobData}></JobCard>
                )
              }
            </>
          }
        </div>

      </div>
    </div>
  );
};

export default Jobs;
