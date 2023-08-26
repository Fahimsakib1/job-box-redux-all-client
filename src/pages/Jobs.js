import React, { useEffect, useState } from "react";
import JobCard from "../components/reusable/JobCard";
import { useGetAllJobsQuery } from "../features/Job/JobAPI";
import Loading from "../components/reusable/Loading";





const Jobs = (name) => {


  const { data, isLoading, isSuccess, isError, error } = useGetAllJobsQuery(name, {pollingInterval: 500})  
  console.log('All Jobs: ', data)



  // const [allJobs, setJobs] = useState()
  // useEffect(() => {
  //   fetch('http://localhost:5000/jobs')
  //     .then(res => res.json())
  //     .then(data => setJobs(data))
  // }, [])



  if(isLoading){
    return <Loading></Loading>
  }



  return (
    <div className='pt-14'>
      <div className='bg-primary/10 p-5 rounded-2xl'>
        <h1 className='font-semibold text-xl'>All Jobs</h1>

        {
          data && data.length > 0 ?
            <>
              <div className='grid grid-cols-2 gap-5 mt-5'>
                {
                  data &&
                  <>
                    {
                      data?.map((jobData, index) => <JobCard key={index} jobData={jobData}></JobCard>
                      )
                    }
                  </>
                }
              </div>
            </>
            :
            <h1 className="text-center my-20 font-bold text-2xl">No Job Added yet</h1>
        }

      </div>
    </div>
  );
};

export default Jobs;
