import React, { useEffect, useRef, useState } from "react";
import meeting from "../assets/meeting.jpg";
import { BsArrowRightShort, BsArrowReturnRight } from "react-icons/bs";
import { useApplyJobMutation, useAskQuestionMutation, useGetJobByIDQuery, useReplyMutation } from "../features/Job/JobAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";






const JobDetails = () => {



  const user = useSelector(state => state.auth.user)
  console.log("User State", user);


  const { handleSubmit, register, reset, control } = useForm();

  const { id } = useParams();
  const navigate = useNavigate()

  const { data } = useGetJobByIDQuery(id,{
    pollingInterval: 1000
  } ) 
  console.log('Job Details', data) 
  const { _id, position, companyName, employmentType, experience, location, overview, requirements, responsibilities, salaryRange, skills, workLevel, queries, applicantDetails } = data || {}



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
      applyStatus: true
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


  console.log("Applicant Details", applicantDetails);
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






  return (

    <div className='absolute mt-10 md:px-10 px-4 pt-14 grid grid-cols-12 gap-5'>


      <div className='col-span-9 mb-10'>
        <div className='h-80 rounded-xl overflow-hidden'>
          <img className='h-full w-full object-cover' src={meeting} alt='' />
        </div>

        <div className='space-y-5'>
          <div className='flex justify-between items-center mt-5'>
            <h1 className='text-xl font-semibold text-primary'>{position}</h1>

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
                      <button className='btn' onClick={handleJobApply}>Apply</button>
                    </>
                }
              </>
            }

          </div>
          <div>
            <h1 className='text-primary text-lg font-medium mb-3 '>Overview</h1>
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
      </div>


    </div>













  );
};

export default JobDetails;
