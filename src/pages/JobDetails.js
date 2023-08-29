import React, { useEffect, useRef, useState } from "react";
import meeting from "../assets/meeting.jpg";
import { BsArrowRightShort, BsArrowReturnRight, BsClock } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { useApplyJobMutation, useAskQuestionMutation, useGetJobByIDQuery, useGetMessageForEmployerQuery, useGetReplyMessageForCandidateQuery, useJobStatusToggleMutation, useReplyMutation, useSentMessageByEmployerMutation, useSentReplyByCandidateMutation } from "../features/Job/JobAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";








const JobDetails = () => {

  const [randomNumber, setRandomNumber] = useState('')
  const getNumber = Math.floor(Math.random() * (100000000000 - 999999999999 + 1)) + 999999999999;
  const getRandomNumber = () => {
    setRandomNumber(getNumber.toString())
  }





  //this ISOSPostedDate is used to filter the data by dates from server
  const ISOSPostedDateWhenJobApply = new Date().toISOString();
  // console.log("Date: ", ISOSPostedDateWhenJobApply);

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
  // console.log("User State", user);


  const { handleSubmit, register, reset, control } = useForm();

  const { id } = useParams();
  const navigate = useNavigate()




  const { data } = useGetJobByIDQuery(id, { pollingInterval: 1000 })
  // console.log('Job Details', data)


  const { _id, position, companyName, employmentType, experience, location, overview, requirements, responsibilities, salaryRange, skills, workLevel, queries, applicantDetails, jobStatus, employerTexts } = data || {}





  const [details, setDetails] = useState({})
  // useEffect(() => {
  //   fetch(`http://localhost:5000/job/${id}`)
  //     .then(res => res.json())
  //     .then(data => setDetails(data))
  // }, [id])
  // const { _id, position, companyName, employmentType, experience, location, overview, requirements, responsibilities, salaryRange, skills, workLevel, queries, applicantDetails, jobStatus } = details || {}







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
      appliedJob: position,
      applyStatus: true,
    }
    // console.log("User Data", data);
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
            // console.log("Job Data Inside", data);
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
  // console.log("Applied Button Toggle", getEmailForAppliedButtonToggle?.email);



  //function for add questions to a job only by the candidate
  const [sendQuestion] = useAskQuestionMutation()
  const submitQuestion = (data) => {

    if (data.question === '') {
      return toast('Please write a question')
    }
    const questionData = {
      userId: user._id, //sign up er por user er jei id thake oi id 
      jobId: _id, // post post korar po jb er id thakbe oi id ta user kora holo
      email: user?.email, //sign up er por user er email
      question: data.question
    }
    // console.log(questionData);
    sendQuestion(questionData)
    toast.success('Question Added')
    reset()
  }




  // function for replying the questions only by the employer
  const [reply, setReply] = useState("");
  const [sendReply] = useReplyMutation()
  const handleReplySubmit = (id, question) => {
    const data = {
      reply: reply,
      userId: id,
      jobId: _id,
      employerEmail: user?.email,
      question: question
    }
    // console.log("Reply Data: ", data);
    sendReply(data)
  }













  //function for chage the job status from open to close and vise versa
  const [toggleStatus] = useJobStatusToggleMutation()
  const handleToggleJobStatus = () => {
    const data = {
      jobId: _id,
      jobStatus: jobStatus
    }
    toggleStatus(data)
    toast.success('Job Status Changed')
  }



  const [openMessageModal, setOpenMessageModal] = useState(null);
  const handleCloseMessageModal = () => {
    setOpenMessageModal(null);
  }




  const [openFirstModal, setOpenFirstModal] = useState(false);
  const handleOpenFirstModal = () => {
    setOpenFirstModal(true)
  }
  const closeFirstModal = () => {
    setOpenFirstModal(false)
  }


  const [getCandidateEmail, setGetCandidateEmail] = useState('')
  const [openConversationModal, setOpenConversationModal] = useState(null);
  const handleOpenConversationModal = (allData) => {
    setOpenConversationModal(allData)
    setGetCandidateEmail(allData)
    const newDetails = {
      candidateEmail: allData?.email,
      appliedJob: allData?.appliedJob,
      jobId: _id,
      replyTime: jobAppliedTime,
      candidateID: allData?.id,
    }
    setReplyData(newDetails)

  }
  // console.log("State Email Outside: ", getCandidateEmail);
  const closeConversationModal = () => {
    setOpenConversationModal(null)
  }



  //Codes for displaying conversation with the employer on a modal from the candidate's perspective
  const [conversationModalForCandidate, setConversationModalForCandidate] = useState(false);
  //this state is used to set the required dta to get the reply data by the  candidate
  const [replyData, setReplyData] = useState('')

  const [replyMessageByCandidate, setReplyMessageByCandidate] = useState('')


  const handleConversationModalForCandidate = () => {
    setConversationModalForCandidate(true)
    const candidateData = {
      email: user?.email,
      appliedJob: position
    }
    setGetCandidateEmail(candidateData);

    const newDetails = {
      candidateEmail: user?.email,
      appliedJob: position,
      jobId: _id,
      replyTime: jobAppliedTime,
      candidateID: user?._id,
      reply: replyMessageByCandidate
    }
    setReplyData(newDetails)

  }
  const closeConversationModalForCandidate = () => {
    setConversationModalForCandidate(false)
  }



  const { data: messageData } = useGetMessageForEmployerQuery(getCandidateEmail, { pollingInterval: 1000 })
  // console.log("Message Data 1: ", data);
  // console.log("Message Data: ", messageData);
















  const [sendMessage] = useSentMessageByEmployerMutation()
  const [message, setMessage] = useState('')
  const sendMessageToCandidate = (firstName, lastName, candidateEmail, appliedJob, candidateID) => {

    if (message === '') {
      return toast('You can not send empty text.. Please write a message')
    }
    // setRandomNumber(getNumber.toString())
    const details = {
      candidateFullName: firstName + ' ' + lastName,
      candidateEmail: candidateEmail,
      appliedJob: appliedJob,
      employerFullName: user?.firstName + ' ' + user?.lastName,
      employerEmail: user?.email,
      candidateID: candidateID,
      userId: user?._id,
      message: message,
      jobId: _id,
      messageSentTime: jobAppliedTime,
      randomNumber: getNumber.toString()
    }
    // console.log("Message Data:", details);
    sendMessage(details)
    setMessage('')
    toast.success('Message Sent...')
  }









  // Reply messages to a particular job position by the candidate

  const [replyByCandidate] = useSentReplyByCandidateMutation()
  const handleReplyMessageByCandidate = () => {
    if (replyMessageByCandidate === '') {
      return toast('You can not reply with an empty text..')
    }

    const details = {
      candidateEmail: user?.email,
      appliedJob: position,
      jobId: _id,
      replyTime: jobAppliedTime,
      candidateID: user?._id,
      reply: replyMessageByCandidate
    }
    console.log("Reply Details: ", details);
    replyByCandidate(details)
    toast.success('Reply Sent')
    setReplyMessageByCandidate('')
  }


  const { data: replyMessageData } = useGetReplyMessageForCandidateQuery(replyData, { pollingInterval: 1000 })




  // console.log("Message Data:", messageData);
  // console.log("Reply Data: ", replyMessageData);



  // used to concat messageData and replyMessageData array into a single array so that I can show the messages by the employer and the replies by the candidate in a manner that the messages and replies will align one after another in real time along with vice versa direction

  const mergedArray = [];
  let i = 0;
  let j = 0;
  while (i < messageData?.length && j < replyMessageData?.length) {
    mergedArray.push(messageData[i]);
    mergedArray.push(replyMessageData[j]);
    i++;
    j++;
  }
  // If the arrays are not of the same length, add the remaining elements
  while (i < messageData?.length) {
    mergedArray.push(messageData[i]);
    i++;
  }
  while (j < replyMessageData?.length) {
    mergedArray.push(replyMessageData[j]);
    j++;
  }
  console.log("Merged Array Data: ", mergedArray);

































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
              // query er moddhe id ta hocche user er id
              <div>
                <p className='text-lg font-medium text-red-600'><span>{index + 1}.</span> {question}</p>
                <p className="text-gray-600 text-[11px] font-semibold -mt-1">Asked By: {email}</p>
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
                        onClick={() => handleReplySubmit(id, question)}
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

        <div className={`${user?.role === 'candidate' && 'mb-16'} mt-5 rounded-xl bg-primary/10 p-5 text-primary space-y-5`}>
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

          <div className="mb-12 text-center mx-auto ">
            <label htmlFor="firstModal" onClick={handleOpenFirstModal} className=' mt-8 btn' title='View Candidates'>
              View Candidates
            </label>
          </div>
        }








        {
          user?.role === 'candidate' &&
          <div className=" text-center mx-auto ">
            <label htmlFor="conversationModalForCandidate" onClick={handleConversationModalForCandidate} className='cursor-pointer conversationBtn' title='See Conversation'>
              See Conversation With Employer
            </label>
          </div>
        }

      </div>







      <>
        {
          openFirstModal &&
          <>
            <>
              <input type="checkbox" id="firstModal" className="modal-toggle" />
              <div className="modal mx-6 md:mx-0">
                <div className="modal-box  w-11/12 max-w-5xl  bg-gray-800 rounded-md mx-auto">

                  <label onClick={closeFirstModal} htmlFor="firstModal" className=" text-white  border-2 border-red-600 bg-red-600 hover:bg-red-600  scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="font-extrabold text-white">✕</span></label>


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
                                  <h1 className="font-semibold text-gray-600">Applied For: {applicant.appliedJob}</h1>
                                  <h1 className="font-semibold text-gray-600">Applicant ID: {applicant.id}</h1>
                                  <h1 className="font-semibold text-gray-600">Job ID: {_id}</h1>

                                  <div className="divider my-2 font-bold">Address</div>

                                  <p className="font-semibold text-gray-600">Address: {applicant.address}, {applicant.city}</p>
                                  <p className="font-semibold text-gray-600">Country: {applicant.country}</p>
                                  <p className="font-semibold text-gray-600">Job Applied: {applicant.jobAppliedTime}</p>


                                  <div className="flex justify-between items-center md:flex-row flex-col md:gap-x-4 md:gap-y-0 gap-x-0 gap-y-3">

                                    <div className="text-center  mx-auto my-4">
                                      <label htmlFor="newModal1" onClick={() => setOpenMessageModal(applicant)} className='btn1'>
                                        Message
                                      </label>
                                    </div>

                                    <div className="text-center  mx-auto my-4">
                                      <label htmlFor="conversationModal" onClick={() => handleOpenConversationModal(applicant)} className=' conversationBtn' title='View Messages'>
                                        See Conversation
                                      </label>
                                    </div>

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




                </div>
              </div>
            </>

          </>
        }
      </>








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
                            <h1 className="font-semibold text-gray-600">Applied For: {applicant.appliedJob}</h1>
                            <h1 className="font-semibold text-gray-600">Applicant ID: {applicant.id}</h1>
                            <h1 className="font-semibold text-gray-600">Job ID: {_id}</h1>

                            <div className="divider my-2 font-bold">Address</div>

                            <p className="font-semibold text-gray-600">Address: {applicant.address}, {applicant.city}</p>
                            <p className="font-semibold text-gray-600">Country: {applicant.country}</p>
                            <p className="font-semibold text-gray-600">Job Applied: {applicant.jobAppliedTime}</p>


                            <div className="text-center  mx-auto my-4">
                              <label htmlFor="newModal1" onClick={() => setOpenMessageModal(applicant)} className='btn1'>
                                Message
                              </label>
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




      <>

        {
          openMessageModal &&
          <>
            <input type="checkbox" id="newModal1" className="modal-toggle" />
            <div className="modal mx-6 md:mx-0">
              <div className="modal-box   bg-gray-800 rounded-md mx-auto">

                <label onClick={handleCloseMessageModal} htmlFor="newModal1" className=" text-white  border-2 border-red-600 bg-red-600 hover:bg-red-600  scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="font-extrabold text-white">✕</span></label>


                <h1 className="text-center mb-2 text-yellow-500 font-semibold">Employer: {user?.firstName} {user?.lastName}</h1>

                <div>
                  <h1 className="text-white text-md">Applicant Name: {openMessageModal.firstName} {openMessageModal.lastName}</h1>
                  <h1 className="text-white text-md">Applicant Email: {openMessageModal.email}</h1>
                  <h1 className="text-white text-md">Applied For: {openMessageModal.appliedJob}</h1>
                  <h1 className="text-white text-md">Applicant ID: {openMessageModal.id}</h1>
                  <h1 className="text-white text-md">User ID: {user?._id}</h1>
                  <h1 className="text-white text-md">Job ID: {_id}</h1>
                </div>

                <>
                  <div className='flex flex-col w-full'>
                    <div className=' mb-5 flex items-center gap-3'>
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} className=' rounded-md  text-black border-primary lg:w-full md:w-full w-full mt-4' type='text' rows={3} />
                      <button
                        onClick={() => sendMessageToCandidate(openMessageModal.firstName, openMessageModal.lastName, openMessageModal.email, openMessageModal.appliedJob, openMessageModal.id)}
                        type='button'
                        className='mt-4 -ml-[140px] grid place-items-center rounded-full px-4 flex-shrink-0 bg-primary border h-11 w-28 group transition-all text-white text-lg hover:w-[122px]'
                      >
                        <div className="flex justify-center items-center gap-x-2">
                          <p>Send</p>
                          <BiSend size={20}></BiSend>
                        </div>
                      </button>
                    </div>
                  </div>

                </>

              </div>
            </div>
          </>
        }
      </>





      <>
        {
          openConversationModal &&
          <>
            <input type="checkbox" id="conversationModal" className="modal-toggle" />
            <div className="modal mx-6 md:mx-0 ">
              <div className="modal-box w-11/12 max-w-5xl relative bg-gray-800 rounded-md mx-auto">

                <label onClick={closeConversationModal} htmlFor="conversationModal" className=" text-white  border-2 border-red-600 bg-red-600 hover:bg-red-600  scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="font-extrabold text-white">✕</span></label>

                <div>




                  {
                    messageData?.length > 0 ?
                      <>
                        <h1 className="mb-6 font-semibold text-center text-green-600">Conversation with Candidate <span className="text-yellow-500 font-semibold ">{openConversationModal.firstName} {openConversationModal.lastName} ({openConversationModal.email})</span> </h1>


                        {/* {
                          messageData?.map((data, index) =>
                            <div key={index}>

                              <div>
                                <p className='text-yellow-500 font-semibold text-[11px] flex justify-end items-center gap-1 relative'>
                                  <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                </p>
                                <div className="flex justify-end">
                                  <div className="chat chat-end mb-3">
                                    <div className="chat-bubble bg-gray-700">
                                      <h1 className=" text-[12px] text-white font-semibold ">{data.message}</h1>
                                      <p className="text-blue-500  font-semibold text-[10px] ">Sent: {data.messageSentTime}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }


                        {
                          replyMessageData && replyMessageData.length > 0 &&
                          <>
                            {
                              replyMessageData.map((data, index) =>
                                <div key={index}>
                                  <div className="flex justify-start">
                                    <div className="chat chat-start mb-3">
                                      <div className="chat-bubble bg-blue-800 ">
                                        <h1 className=" text-[12px] text-white font-semibold ">{data.reply}</h1>
                                        <p className="text-yellow-600 font-bold text-[10px]">Sent: {data.replyTime}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          </>
                        } */}




                        {
                          mergedArray && mergedArray.length > 0 &&
                          <>
                            {
                              mergedArray.map((data, index) =>
                                <div key={index}>

                                  {
                                    data?.message &&
                                    <>
                                      <div>
                                        <p className='text-yellow-500 font-semibold text-[11px] flex justify-end items-center gap-1 relative'>
                                          <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                        </p>
                                        <div className="chat chat-end">
                                          <div className="chat-bubble bg-gray-700 px-4">
                                            <h1 className=" text-[12px] text-white font-semibold ">{data.message}</h1>
                                            <p className="text-blue-500  font-semibold text-[10px] ">Sent: {data.messageSentTime}</p>
                                          </div>
                                        </div>
                                        {/* <p className="text-end text-blue-500  font-semibold text-[10px] ">Sent: {data.messageSentTime}</p> */}
                                      </div>
                                    </>
                                  }

                                  {
                                    data?.reply &&
                                    <>
                                      <div className="chat chat-start ">
                                        <div className="chat-bubble bg-blue-800 px-4 ">
                                          <h1 className=" text-[12px] text-white font-semibold ">{data.reply}</h1>
                                          <p className="text-yellow-600 font-bold text-[10px]">Sent: {data.replyTime}</p>
                                        </div>
                                      </div>
                                      {/* <p className="text-yellow-600 font-bold text-[10px]">Sent: {data.replyTime}</p> */}
                                    </>
                                  }

                                </div>
                              )
                            }
                          </>
                        }






                      </>

                      :

                      <div>
                        <h1 className="text-center text-lg text-gray-300 my-10">You have not start conversation with {openConversationModal.firstName} {openConversationModal.lastName}</h1>
                      </div>
                  }








                  <div className='mt-20 flex flex-col w-full'>
                    <div className=' mb-2 flex items-center gap-3'>

                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type Message..." className='text-black rounded-md  border-primary lg:w-full md:w-full w-full mt-4' type='text' rows={2} />
                      <button
                        onClick={() => { sendMessageToCandidate(openConversationModal.firstName, openConversationModal.lastName, openConversationModal.email, openConversationModal.appliedJob, openConversationModal.id) }}
                        type='button'
                        className='mt-4 -ml-[140px] grid place-items-center rounded-full px-4 flex-shrink-0 bg-primary border h-11 w-28 group transition-all text-white text-lg hover:w-[122px]'
                      >
                        <div className="flex justify-center items-center gap-x-2">
                          <p>Send</p>
                          <BiSend size={20}></BiSend>
                        </div>
                      </button>
                    </div>
                  </div>




                </div>

              </div>
            </div>
          </>
        }
      </>
















      <>

        {
          conversationModalForCandidate &&
          <>
            <input type="checkbox" id="conversationModalForCandidate" className="modal-toggle" />
            <div className="modal mx-6 md:mx-0">
              <div className="modal-box w-11/12 max-w-5xl  bg-gray-800 rounded-md mx-auto">

                <label onClick={closeConversationModalForCandidate} htmlFor="conversationModalForCandidate" className=" text-white  border-2 border-red-600 bg-red-600 hover:bg-red-600  scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="font-extrabold text-white">✕</span></label>


                {
                  messageData?.length > 0 ?
                    <>
                      <h1 className="mb-6 font-semibold text-center text-green-600">Conversation with Employer For <span className="text-yellow-500  font-semibold">{position}</span> Position</h1>



                      {
                        mergedArray && mergedArray.length > 0 &&
                        <>
                          {
                            mergedArray.map((data, index) =>
                              <div key={index}>

                                {
                                  data?.message &&
                                  <>
                                    <div>
                                      <p className='text-yellow-500 font-semibold text-[11px] flex justify-start items-center gap-1 relative'>
                                        <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                      </p>
                                      <div className="chat chat-start">
                                        <div className="chat-bubble bg-gray-700 px-4">
                                          <h1 className=" text-[12px] text-white font-semibold ">{data.message}</h1>
                                          <p className="text-blue-500  font-semibold text-[10px] ">Sent: {data.messageSentTime}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                }

                                {
                                  data?.reply &&
                                  <>
                                    <div className="chat chat-end">
                                      <div className="chat-bubble bg-blue-800 px-4">
                                        <h1 className=" text-[12px] text-white font-semibold ">{data.reply}</h1>
                                        <p className="text-yellow-600 font-bold text-[10px]">Sent: {data.replyTime}</p>
                                      </div>
                                    </div>
                                  </>
                                }

                              </div>
                            )
                          }
                        </>
                      }



























                      {/* {
                        messageData?.map((data, index) =>
                          <div key={index}>

                            <div>

                              <p className='text-yellow-500 font-semibold text-[11px] flex justify-start items-center gap-1 relative'>
                                <BsArrowReturnRight /> Message For: {data?.appliedJob} Position
                              </p>

                              <div className="flex justify-start">
                                <div className="chat chat-start mb-3">
                                  <div className="chat-bubble bg-gray-700 ">
                                    <h1 className=" text-[12px] text-white font-semibold ">{data.message}</h1>
                                    <p className="text-blue-500 font-semibold text-[10px] ">Sent: {data.messageSentTime}</p>
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>
                        )
                      } */}






                    </>

                    :

                    <div>
                      <h1 className="text-center text-lg text-gray-300 my-10">No message available. Once an employer texts you only then you can have a conversation with the employer..</h1>
                    </div>
                }



                {/* {
                  replyMessageData && replyMessageData.length > 0 &&
                  <>
                    {
                      replyMessageData.map((data, index) =>
                        <div key={index}>
                          <div className="flex justify-end">
                            <div className="chat chat-end mb-3">
                              <div className="chat-bubble bg-blue-800 ">
                                <h1 className=" text-[12px] text-white font-semibold ">{data.reply}</h1>
                                <p className="text-yellow-600 font-bold text-[10px]">Sent: {data.replyTime}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </>
                } */}







                <>
                  {
                    messageData?.length > 0 &&
                    <>
                      <div className='mt-8 flex flex-col w-full'>
                        <div className=' mb-5 flex items-center gap-3'>
                          <textarea value={replyMessageByCandidate} onChange={(e) => setReplyMessageByCandidate(e.target.value)} className=' rounded-md  text-black border-primary lg:w-full md:w-full w-full mt-4' type='text' rows={3} />
                          <button
                            onClick={handleReplyMessageByCandidate}
                            type='button'
                            className='mt-4 -ml-[140px] grid place-items-center rounded-full px-4 flex-shrink-0 bg-primary border h-11 w-28 group transition-all text-white text-lg hover:w-[122px]'
                          >
                            <div className="flex justify-center items-center gap-x-2">
                              <p>Reply</p>
                              <BiSend size={20}></BiSend>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  }

                </>

              </div>
            </div>
          </>
        }
      </>

    </div>


  );
};

export default JobDetails;
