import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import { useAddJobMutation } from "../../features/Job/JobAPI";
import toast from 'react-hot-toast'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";







const AddJob = () => {


  //this ISOSPostedDate is used to filter the data by dates from server
  const ISOSPostedDate = new Date().toISOString();
  // console.log("ISOS Date: ", ISOSPostedDate);


  //code for getting the  time and date
  const dateForAddJob = new Date();
  const year = dateForAddJob.getFullYear();
  const month = dateForAddJob.getMonth() + 1;
  const day = dateForAddJob.getDate();
  const hour = dateForAddJob.getHours();
  const minute = dateForAddJob.getMinutes();
  const currentTime = dateForAddJob.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const MonthDateYear = [month, day, year].join('-');
  const jobPostedTime = MonthDateYear + ' ' + currentTime



  const user = useSelector(state => state.auth.user)

  const navigate = useNavigate()


  const { handleSubmit, register, reset, control } = useForm();

  const {
    fields: resFields,
    append: resAppend,
    remove: resRemove,
  } = useFieldArray({ control, name: "responsibilities" });

  const {
    fields: skillFields,
    append: skillAppend,
    remove: skillRemove,
  } = useFieldArray({ control, name: "skills" });

  const {
    fields: reqFields,
    append: reqAppend,
    remove: reqRemove,
  } = useFieldArray({ control, name: "requirements" });



  const [postJob, { isLoading, isError, isSuccess, error }] = useAddJobMutation()

  const onSubmit = (data) => {
    console.log(data);
    postJob({ ...data, jobStatus: true, ISOSPostedDate:ISOSPostedDate, jobPostedTime: jobPostedTime, applicantDetails: [], queries: [] })
  };


  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success("Job Posted Successfully...");
      reset();
    }
    if (!isLoading && isError) {
      toast.error(error)
    }
  }, [isLoading, isSuccess, isError, error, reset]);








  return (
    <div>
      {
        user?.role === 'candidate' &&
        <>
          <h1 className="text-2xl text-center mt-28 mb-6">Candidate Can't Add Jobs</h1>
          <button
            type='submit'
            onClick={() => navigate('/jobs')}
            className='text-center mx-auto grid place-items-center rounded-full px-6 flex-shrink-0 bg-primary border h-11 w-48 group transition-all text-white text-lg hover:w-52'
          >View Jobs
          </button>
        </>
      }

      {
        user?.role === 'employer' &&
        <>
          <div className='flex justify-center items-center overflow-auto p-10'>
            <form
              className='bg-secondary/20 shadow-lg p-10 rounded-2xl flex flex-wrap gap-3 max-w-3xl justify-between'
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className='w-full text-2xl text-primary mb-5'>
                Add a new position
              </h1>
              <div className='flex flex-col w-full max-w-xs'>
                <label className='mb-2' htmlFor='position'>
                  Position
                </label>
                <input type='text' id='position' {...register("position")} />
              </div>
              <div className='flex flex-col w-full max-w-xs'>
                <label className='mb-2' htmlFor='companyName'>
                  Company Name
                </label>
                <input

                  className='cursor-not-allowed'
                  type='text'
                  id='companyName'
                  {...register("companyName")}
                />
              </div>
              <div className='flex flex-col w-full max-w-xs'>
                <label className='mb-2' htmlFor='experience'>
                  Experience
                </label>
                <input type='text' id='experience' {...register("experience")} />
              </div>
              <div className='flex flex-col w-full max-w-xs'>
                <label className='mb-2' htmlFor='workLevel'>
                  Work Level
                </label>
                <input type='text' id='workLevel' {...register("workLevel")} />
              </div>
              <div className='flex flex-col w-full max-w-xs'>
                <label className='mb-2' htmlFor='employmentType'>
                  Employment Type
                </label>
                <input
                  type='text'
                  id='employmentType'
                  {...register("employmentType")}
                />
              </div>
              <div className='flex flex-col w-full max-w-xs'>
                <label className='mb-2' htmlFor='salaryRange'>
                  Salary Range
                </label>
                <input type='text' id='salaryRange' {...register("salaryRange")} />
              </div>
              <div className='flex flex-col w-full'>
                <label className='mb-2' htmlFor='location'>
                  Location
                </label>
                <input type='text' id='location' {...register("location")} />
              </div>
              <hr className='w-full mt-2 bg-black' />
              <div className='flex flex-col w-full'>
                <label className='mb-2' htmlFor='overview'>
                  Overview
                </label>
                <textarea rows={8} {...register("overview")} id='overview' />
              </div>


              <div className='flex flex-col w-full'>
                <label className='mb-2'>Skills</label>
                <div>
                  <div>
                    {skillFields.map((item, index) => {
                      return (
                        <div key={item.key} className='flex items-center gap-3 mb-5'>
                          <input
                            className='!w-full'
                            type='text'
                            {...register(`skills[${index}]`)}
                          />
                          <button
                            type='button'
                            onClick={() => skillRemove(index)}
                            className='grid place-items-center rounded-full flex-shrink-0 bg-red-500/20 border border-red-500 h-11 w-11 group transition-all hover:bg-red-500'
                          >
                            <FiTrash
                              className='text-red-500 group-hover:text-white transition-all'
                              size='20'
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <button
                      type='button'
                      onClick={() => skillAppend("")}
                      className='btn'
                    >
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>



              <div className='flex flex-col w-full'>
                <label className='mb-2'>Responsibilities</label>
                <div>
                  <div>
                    {resFields.map((item, index) => {
                      return (
                        <div key={item.key} className=' mb-5 flex items-center gap-3'>
                          <input
                            className='!w-full'
                            type='text'
                            {...register(`responsibilities[${index}]`)}
                          />
                          <button
                            type='button'
                            onClick={() => resRemove(index)}
                            className='grid place-items-center rounded-full flex-shrink-0 bg-red-500/20 border border-red-500 h-11 w-11 group transition-all hover:bg-red-500'
                          >
                            <FiTrash
                              className='text-red-500 group-hover:text-white transition-all'
                              size='20'
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <button
                      type='button'
                      onClick={() => resAppend("")}
                      className='btn'
                    >
                      Add Responsibility
                    </button>
                  </div>
                </div>
              </div>


              <div className='flex flex-col w-full'>
                <label className='mb-2'>Requirements</label>
                <div>
                  <div>
                    {reqFields.map((item, index) => {
                      return (
                        <div key={item.key} className=' mb-5 flex items-center gap-3'>
                          <input
                            className='!w-full'
                            type='text'
                            {...register(`requirements[${index}]`)}
                          />
                          <button
                            type='button'
                            onClick={() => reqRemove(index)}
                            className='grid place-items-center rounded-full flex-shrink-0 bg-red-500/20 border border-red-500 h-11 w-11 group transition-all hover:bg-red-500'
                          >
                            <FiTrash
                              className='text-red-500 group-hover:text-white transition-all'
                              size='20'
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <button
                      type='button'
                      onClick={() => reqAppend("")}
                      className='btn'
                    >
                      Add Requirement
                    </button>
                  </div>
                </div>
              </div>



              <div className='flex justify-end items-center w-full mt-3'>
                <button className='btn' type='submit'>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </>
      }
    </div>
  );
};

export default AddJob;

// Position name
// Company name
// Experience
// Work Level
// Salary Range
// Employment Type
// Location
// Overview
// Responsibilities
// Requirements
// Skills
