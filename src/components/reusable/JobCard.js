import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiSend } from "react-icons/bi";
import { useGetMessageForEmployerQuery, useSentMessageByEmployerMutation } from "../../features/Job/JobAPI";
import { toast } from "react-hot-toast";
import { BsArrowReturnRight } from "react-icons/bs";








const JobCard = ({ jobData }) => {

  const user = useSelector(state => state.auth.user)

  const navigate = useNavigate();
  const { _id, position, companyName, location, employmentType, applicantDetails, jobStatus } =
    jobData || {};
  // console.log("Job Data:", jobData);
  // console.log("Applicant Details", applicantDetails);
  // console.log('Type of Applicant Details', typeof applicantDetails)


  //code for getting the  time and date
  const messageTime = new Date();
  const year = messageTime.getFullYear();
  const month = messageTime.getMonth() + 1;
  const day = messageTime.getDate();
  const hour = messageTime.getHours();
  const minute = messageTime.getMinutes();
  const currentTime = messageTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const MonthDateYear = [month, day, year].join('-');
  const time = MonthDateYear + ' ' + currentTime












  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true)
  }














  const [items, setItems] = useState(applicantDetails);
  console.log("Items On Job Card Page:", items);
  const handleShowMessageInputField = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, showInputField: !item.showInputField } : item
      )
    );
  }
  const handleCancelModal = () => {
    setOpenModal(false);
  }









  const [getCandidateEmail, setGetCandidateEmail] = useState('')
  const [openConversationModal, setOpenConversationModal] = useState(null);
  const handleOpenConversationModal = (allData) => {
    setOpenConversationModal(allData)
    ///////////////////////////////
    setGetCandidateEmail(allData)
    console.log("Add data: ", allData);
    console.log("Add data Email: ", allData.email);
    // console.log("State Email Inside: ", getCandidateEmail);
  }
  console.log("State Email Outside: ", getCandidateEmail);
  const closeConversationModal = () => {
    setOpenConversationModal(null)
  }









  const { data: messageData } = useGetMessageForEmployerQuery(getCandidateEmail, { pollingInterval: 1000 })
  console.log("Message Data: ", messageData);
















  const [sendMessage] = useSentMessageByEmployerMutation()

  const [message, setMessage] = useState('')
  const sendMessageToCandidate = (firstName, lastName, candidateEmail, appliedJob, candidateID) => {

    if (message === '') {
      return toast('You can not send empty text.. Please write a message')
    }
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
      messageSentTime: time
    }
    console.log("Message Data:", details);
    sendMessage(details)
    setMessage('')
    toast.success('Message Sent...')
  }



























  return (
    <div
      key={_id}
      className=' bg-gray-100 mt-4 border border-gray-300 shadow-xl p-5 rounded-xl text-primary'
    >
      <h1 className="text-center mt-2 mb-2 font-semibold text-blue-700">Total Applied : {applicantDetails?.length}</h1>
      <div className='flex justify-between  text-primary'>
        <div>
          <p className='text-xl'>{position}
            <span className={`${jobStatus === true ? 'font-bold text-[16px] text-green-600 ml-1' : 'text-[16px] text-red-600 ml-1 font-bold'}`}>
              {jobStatus === true ? "(Open)" : "(Closed)"}
            </span>
          </p>
          <small className='text-primary/70 '>
            by{" "}
            <span className='font-semibold hover:text-primary cursor-pointer hover:underline transition-all'>
              {companyName}
            </span>
          </small>
        </div>
        <p>{location}</p>
      </div>
      <div className='flex justify-between items-center mt-5'>
        <p>{employmentType}</p>
        <button className='btn' onClick={() => navigate(`/job-details/${_id}`)}>
          Details
        </button>
      </div>

      {
        user?.role === 'employer' &&
        <div className="text-center">
          {/* <button type="button" className='btn my-3' onClick={() => window.my_modal_4.showModal()}>
            View Candidates
          </button> */}
          <label htmlFor="newModal" onClick={handleOpenModal} className='btn2' title='View Applicants'>
            View Candidates
          </label>
        </div>
      }


      <>

        {
          openModal &&
          <>
            <input type="checkbox" id="newModal" className="modal-toggle" />
            <div className="modal mx-6 md:mx-0 ">
              <div className="modal-box w-11/12 max-w-5xl relative bg-gray-800 rounded-md mx-auto">

                <label onClick={handleCancelModal} htmlFor="newModal" className=" text-white  border-2 border-red-600 bg-red-600 hover:bg-red-600  scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="font-extrabold text-white">✕</span></label>

                {
                  applicantDetails && applicantDetails.length > 0
                    ?
                    <div>
                      <h1 className="text-white font-bold text-xl mt-2 text-center ">{applicantDetails.length} Candidates Applied For This Job So Far</h1>

                      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-3">
                        {
                          items?.map((applicant, index) =>
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


                                {/* <div className="text-center  mx-auto my-4">
                                  <button onClick={() => handleShowMessageInputField(applicant.id)} className='btn1'>Message</button>
                                </div> */}



                                <div className="flex justify-between items-center md:flex-row flex-col md:gap-x-4 md:gap-y-0 gap-x-0 gap-y-3">
                                  <div className="text-center  mx-auto my-4">
                                    <button onClick={() => handleShowMessageInputField(applicant.id)} className='btn1'>Message</button>
                                  </div>
                                  <div className="text-center  mx-auto my-4">
                                    <label htmlFor="conversationModal" onClick={() => handleOpenConversationModal(applicant)} className=' conversationBtn' title='View Messages'>
                                      See Conversation
                                    </label>
                                  </div>
                                </div>













                                {applicant.showInputField && (
                                  <div className='bg-gray-800 py-3 px-2 flex flex-col w-full'>
                                    <div className=' mb-5 flex items-center gap-3'>
                                      <input value={message} onChange={(e) => setMessage(e.target.value)} className=' rounded-md h-[54px] border-primary lg:w-full md:w-full w-full mt-4' type='text'
                                      />
                                      <button
                                        onClick={() => sendMessageToCandidate(applicant.firstName, applicant.lastName, applicant.email, applicant.appliedJob, applicant.id)}
                                        type='button'
                                        className='mt-4 -ml-[135px] grid place-items-center rounded-full px-4 flex-shrink-0 bg-primary border h-11 w-28 group transition-all text-white text-lg hover:w-[116px]'
                                      >
                                        <div className="flex justify-center items-center gap-x-2">
                                          <p>Send</p>
                                          <BiSend size={20}></BiSend>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                )}

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
                        <h1 className="mb-6 font-semibold text-center text-green-600">See Conversation with {openConversationModal.firstName} {openConversationModal.lastName} ({openConversationModal.email})</h1>
                        {
                          messageData?.map((data, index) =>
                            <div key={index}>

                              <div>
                                <p className='flex justify-end text-yellow-500 font-semibold text-[11px] items-center gap-1 relative'>
                                  <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                </p>

                                {/* <div className="mt-1 flex justify-end">
                                  <div className="md:w-1/2 w-3/4  bg-gray-300 px-3 py-1 rounded-md mb-4 border border-primary">
                                    <h1 className=" text-[12px] text-black font-bold ">{data.message}</h1>
                                    <p className="text-blue-700 font-bold text-[10px] ">Sent: {data.messageSentTime}</p>
                                  </div>
                                </div> */}


                                <div className="flex justify-end">
                                  <div className="chat chat-end mb-3">
                                    <div className="chat-bubble">
                                      <h1 className=" text-[12px] text-white font-bold ">{data.message}</h1>
                                      <p className="text-gray-500 font-bold text-[10px] ">Sent: {data.messageSentTime}</p>
                                    </div>
                                  </div>
                                </div>



                              </div>

                            </div>
                          )
                        }
                      </>

                      :

                      <div>
                        <h1 className="text-center text-lg text-gray-300 my-10">You have not start conversation with {openConversationModal.firstName} {openConversationModal.lastName}</h1>
                      </div>
                  }






                  <div className='mt-20 flex flex-col w-full'>
                    <div className=' mb-2 flex items-center gap-3'>
                      {/* <input value={message} onChange={(e) => setMessage(e.target.value)} className=' rounded-md h-[54px] border-primary lg:w-full md:w-full w-full mt-4' type='text'
                      /> */}
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type Message..." className=' text-md text-black rounded-md  border-primary lg:w-full md:w-full w-full mt-4' type='text' rows={2} />
                      <button
                        onClick={() => sendMessageToCandidate(openConversationModal.firstName, openConversationModal.lastName, openConversationModal.email, openConversationModal.appliedJob, openConversationModal.id)}
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




























    </div>
  );
};

export default JobCard;
