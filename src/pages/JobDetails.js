import React, { useEffect, useRef, useState } from "react";
import meeting from "../assets/meeting.jpg";
import { BsArrowRightShort, BsArrowReturnRight } from "react-icons/bs";
import { useApplyJobMutation, useAskQuestionMutation, useGetJobByIDQuery, useJobStatusToggleMutation, useReplyMutation } from "../features/Job/JobAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";








const JobDetails = () => {

  //this ISOSPostedDate is used to filter the data by dates from server
  const ISOSPostedDateWhenJobApply = new Date().toISOString();
  
  //code for getting the  time and date
  const dateForJobApply = new Date();
  const year = dateForJobApply.getFullYear();
  const month = dateForJobApply.getMonth() + 1;
  const day = dateForJobApply.getDate();
  const hour = dateForJobApply.getHours();
  const minute = dateForJobApply.getMinutes();
  const currentTime = dateForJobApply.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const MonthDateYear = [month, day, year].join('-');
  const jobAppliedTime = MonthDateYear + ' ' + currentTime




  const user = useSelector(state => state.auth.user)
  console.log("User State", user);


  const { handleSubmit, register, reset, control } = useForm();

  const { id } = useParams();
  const navigate = useNavigate()




  const { data } = useGetJobByIDQuery(id, { pollingInterval: 1000 })
  console.log('Job Details', data)


  const { _id, position, companyName, employmentType, experience, location, overview, requirements, responsibilities, salaryRange, skills, workLevel, queries, applicantDetails, jobStatus } = data || {}


  console.log("Applicant Details", applicantDetails);
  console.log('Type of Applicant Details', typeof applicantDetails)
  console.log('Type of Responsibilities', typeof responsibilities)



  const [details, setDetails] = useState({})
  // useEffect(() => {
  //   fetch(`http://localhost:5000/job/${id}`)
  //     .then(res => res.json())
  //     .then(data => setDetails(data))
  // }, [])
  // const { _id, position, companyName, employmentType, experience, location, overview, requirements, responsibilities, salaryRange, skills, workLevel, queries } = details







  const [apply, { isLoading, isSuccess, isError, error }] = useApplyJobMutation()

  const handleJobApply = () => {

    if (user?.role === 'employer') {
      return toast.error("Only Candidate Can Apply for this job.. You Are an Employer")
    }

    if (user?.role === '') {
      return navigate('/register')
    }

    const data = {
      userId: user._id, //sign up er por user er jei id thake oi id 
      jobId: _id, // post post korar po jb er id thakbe oi id ta user kora holo
      email: user.email, //sign up er por user er email
      address: user?.address,
      city: user?.city,
      country: user?.country,
      firstName: user?.firstName,
      lastName: user?.lastName,
      gender: user?.gender,
      jobAppliedTime: jobAppliedTime,
      ISOSPostedDateWhenJobApply: ISOSPostedDateWhenJobApply,
      applyStatus: true,
    }
    console.log("User Data", data);
    apply(data)

  }


  const [isApplied, setIsApplied] = useState({});



  useEffect(() => {
    if (!isLoading && isSuccess) {

      fetch(`http://localhost:5000/job/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setDetails(data)
            console.log("Job Data Inside", data);
          }
        })
      toast.success("Job Applied Successfully...");
    }
    if (!isLoading && isError) {
      toast.error(error)
    }
  }, [isLoading, isSuccess, isError, error, reset]);


  // console.log("Applicant Details", details.applicantDetails);
  // const getEmailForAppliedButtonToggle = details.applicantDetails?.find(applicant => applicant.email === user?.email)
  // console.log("Applied Button Toggle", getEmailForAppliedButtonToggle?.email); 


  const getEmailForAppliedButtonToggle = Array.isArray(applicantDetails) ? applicantDetails.find(applicant => applicant.email === user?.email) : ''
  console.log("Applied Button Toggle", getEmailForAppliedButtonToggle?.email);



  const [sendQuestion] = useAskQuestionMutation()

  const submitQuestion = (data) => {

    const questionData = {
      userId: user._id, //sign up er por user er jei id thake oi id 
      jobId: _id, // post post korar po jb er id thakbe oi id ta user kora holo
      email: user.email, //sign up er por user er email
      question: data.question
    }
    console.log(questionData);
    sendQuestion(questionData)
    toast.success('Question Added')
    reset()
  }




  const [reply, setReply] = useState("");
  const [sendReply] = useReplyMutation()
  const handleReplySubmit = (id) => {
    const data = {
      reply: reply,
      userId: id
    }
    console.log("Reply Data: ", data);
    sendReply(data)
  }



  const [toggleStatus] = useJobStatusToggleMutation()


  const handleToggleJobStatus = () => {
    const data = {
      jobId: _id,
      jobStatus: jobStatus
    }
    toggleStatus(data)
    toast.success('Job Status Changed')
  }






  return (

    <div className='absolute mt-10 md:px-10 px-4 pt-14 grid grid-cols-12 gap-5'>


      <div className='col-span-9 mb-10'>

        <div className='h-80 rounded-xl overflow-hidden'>
          <img className='h-full w-full object-cover' src={meeting} alt='' />
        </div>

        <div className='space-y-5'>

          <div className="relative top-4 flex justify-between items-center">
            <h1 className="text-lg text-black font-bold">Job Status:
              <span className={`${jobStatus === true ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}`}>
                {jobStatus === true ? "Open" : "Closed"}
              </span>
            </h1>
            {
              user?.role === 'employer' &&
              <>
                <button onClick={handleToggleJobStatus} type="button" className='btn'>Change Status</button>
              </>
            }
            {
              user?.role === 'candidate' && !data?.applyStatus && jobStatus === false &&
              <h1 className="font-semibold text-red-600 text-center text-md">Job Closed. You Can't Apply</h1>
            }
          </div>


          <div className='relative flex justify-between items-center top-4'>
            <h1 className='text-xl font-semibold text-primary mb-4'>{position} </h1>

            {
              user?.role === 'candidate' &&
              <>
                {
                  data?.applyStatus && getEmailForAppliedButtonToggle?.email === user?.email ?
                    <>
                      <button
                        onClick={() => toast('You Have Already Applied For This Job Role', {
                          icon: '👏'

                        })}

                        className='bg-green-700 px-3 py-2 rounded-md border-2 text-white'
                      >Already Applied</button>
                    </>
                    :
                    <>
                      {
                        jobStatus === true &&
                        <button className='btn' onClick={handleJobApply}>Apply</button>
                      }
                    </>
                }
              </>

            }

          </div>
          <div>
            <h1 className='text-primary text-lg font-medium mb-3'>Overview</h1>
            <p className="text-justify">{overview}</p>
          </div>
          <div>
            <h1 className='text-primary text-lg font-medium mb-3'>Skills</h1>
            <ul>
              {skills?.map((skill) => (
                <li className='flex items-center'>
                  <BsArrowRightShort /> <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className='text-primary text-lg font-medium mb-3'>
              Requirements
            </h1>
            <ul>
              {requirements?.map((skill) => (
                <li className='flex items-center'>
                  <BsArrowRightShort /> <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className='text-primary text-lg font-medium mb-3'>
              Responsibilities
            </h1>
            <ul>
              {responsibilities?.map((skill) => (
                <li className='flex items-center'>
                  <BsArrowRightShort /> <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <h1 className='text-xl font-semibold text-primary mb-5 underline'>
            General Q&A
          </h1>

          <div className='text-primary my-2'>
            {queries && queries?.map(({ question, id, reply, email }, index) => (
              <div>
                <p className='text-lg font-medium text-red-600'><span>{index + 1}.</span> {question}</p>
                <p className="text-[12px] font-semibold -mt-1">Asked By: {email}</p>
                {/* <p className="text-[12px] font-semibold">{id}</p> */}
                {reply.map((item) => (
                  <p className='font-semibold text-sm flex items-center gap-2 relative left-5'>
                    <BsArrowReturnRight /> {item}
                  </p>
                ))}

                {
                  user?.role === 'employer' &&
                  <>
                    <div className='flex gap-3 my-5'>
                      <input

                        onBlur={(e) => setReply(e.target.value)}

                        placeholder='Reply' type='text' className='w-full' />
                      <button
                        onClick={() => handleReplySubmit(id)}
                        className='shrink-0 h-14 w-14 bg-primary/10 border border-primary hover:bg-primary rounded-full transition-all  grid place-items-center text-primary hover:text-white'
                        type='button'
                      >
                        <BsArrowRightShort size={30} />
                      </button>
                    </div>
                  </>
                }



              </div>
            ))}
          </div>






          {
            user?.role === 'candidate' &&
            <>
              <div className='flex flex-col w-full'>
                <form
                  onSubmit={handleSubmit(submitQuestion)}
                >
                  <label className=' text-primary text-xl font-semibold' htmlFor='question'>Ask Question</label>
                  <div>
                    <div>
                      <div className=' mb-5 flex items-center gap-3'>
                        <input className=' h-[54px] border-primary lg:w-3/4 md:w-full w-full mt-4' {...register("question")} type='text'
                        />
                        <button
                          type='submit'
                          className='mt-4 -ml-[126px] grid place-items-center rounded-full px-6 flex-shrink-0 bg-primary border h-11 w-24 group transition-all text-white text-lg hover:w-[108px]'
                        >Add
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </>
          }


        </div>
        <hr className='my-5' />
      </div>




      <div className='col-span-3'>

        <h1 className='text-center text-lg font-bold text-blue-700 mb-3 '>
          Total Applied: {data?.applicantDetails?.length}
          <span className={`${jobStatus === true ? 'font-bold text-[16px] text-green-600 ml-1' : 'text-[16px] text-red-600 ml-1 font-bold'}`}>
            {jobStatus === true ? "(Open)" : "(Closed)"}
          </span>
        </h1>

        <div className='rounded-xl bg-primary/10 p-5 text-primary space-y-5'>
          <div>
            <p>Experience</p>
            <h1 className='font-semibold text-lg'>{experience}</h1>
          </div>
          <div>
            <p>Work Level</p>
            <h1 className='font-semibold text-lg'>{workLevel}</h1>
          </div>
          <div>
            <p>Employment Type</p>
            <h1 className='font-semibold text-lg'>{employmentType}</h1>
          </div>
          <div>
            <p>Salary Range</p>
            <h1 className='font-semibold text-lg'>{salaryRange}</h1>
          </div>
          <div>
            <p>Location</p>
            <h1 className='font-semibold text-lg'>{location}</h1>
          </div>
        </div>

        <div className='mt-5 rounded-xl bg-primary/10 p-5 text-primary space-y-5'>
          <div>
            <h1 className='font-semibold text-lg'>{companyName}</h1>
          </div>
          <div>
            <p>Company Size</p>
            <h1 className='font-semibold text-lg'>Above 100</h1>
          </div>
          <div>
            <p>Founded</p>
            <h1 className='font-semibold text-lg'>2001</h1>
          </div>
          <div>
            <p>Email</p>
            <h1 className='font-semibold text-lg'>company.email@name.com</h1>
          </div>
          <div>
            <p>Company Location</p>
            <h1 className='font-semibold text-lg'>Los Angeles</h1>
          </div>
          <div>
            <p>Website</p>
            <a className='font-semibold text-lg' href='#'>
              https://website.com
            </a>
          </div>
        </div>

        {
          user?.role === 'employer' &&
          <div className="text-center mx-auto ">
            <button onClick={() => window.my_modal_3.showModal()} type="button" className='mt-8 btn'>View Candidates</button>
          </div>
        }
      </div>




      <>

        <dialog id="my_modal_3" className="modal  ">
          <form method="dialog" className="bg-gray-800 modal-box w-11/12 max-w-5xl">
            <button className=" border-2 border-red-600 bg-red-600 hover:bg-red-600 font-extrabold scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <span className="text-white ">✕</span>
            </button>

            {
              applicantDetails && applicantDetails.length > 0
                ?
                <div>
                  <h1 className="text-white font-bold text-xl mt-2 text-center ">{applicantDetails.length} Candidates Applied For This Job So Far</h1>

                  <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-3">
                    {
                      applicantDetails?.map((applicant, index) =>
                        <div key={index}>
                          <div className="bg-white shadow-xl border-2 rounded-md mt-4 p-3">
                            <h1 className="font-semibold text-gray-600">Name: {applicant.firstName} {applicant.lastName}</h1>
                            <h1 className="font-semibold text-gray-600">Email: {applicant.email}</h1>
                            <div className="divider my-2 font-bold">Address</div>
                            <p className="font-semibold text-gray-600">Address: {applicant.address}, {applicant.city}</p>
                            <p className="font-semibold text-gray-600">Country: {applicant.country}</p>
                            <p className="font-semibold text-gray-600">Job Applied: {applicant.jobAppliedTime}</p>
                            <div className="text-center  mx-auto my-4">
                              <button className='btn1'>Message</button>
                            </div>
                          </div>

                        </div>
                      )
                    }

                  </div>

                </div>
                :
                <h1>
                  <h1 className="font-bold text-white text-xl mt-2 text-center ">No One Applied For This Job Yet...</h1>
                </h1>
            }
          </form>
        </dialog>
      </>




















    </div>


















  );
};

export default JobDetails;
