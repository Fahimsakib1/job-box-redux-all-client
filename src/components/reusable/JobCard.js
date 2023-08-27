import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiSend } from "react-icons/bi";









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




  const [message, setMessage] = useState('')
  const sendMessageToCandidate = (firstName, lastName, candidateEmail, appliedJob, candidateID) => {
    const details = {
      candidateFullName: firstName + ' ' + lastName,
      candidateEmail: candidateEmail,
      appliedJob: appliedJob,
      employerFullName: user?.firstName  + ' ' + user?.lastName,
      employerEmail: user?.email,
      candidateID: candidateID,
      employerID: user?._id,
      message: message,
      messageSentTime: time
    }
    console.log("New Message Data:", details);
    setMessage('')
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

                                <div className="divider my-2 font-bold">Address</div>

                                <p className="font-semibold text-gray-600">Address: {applicant.address}, {applicant.city}</p>
                                <p className="font-semibold text-gray-600">Country: {applicant.country}</p>
                                <p className="font-semibold text-gray-600">Job Applied: {applicant.jobAppliedTime}</p>
                                <div className="text-center  mx-auto my-4">
                                  <button onClick={() => handleShowMessageInputField(applicant.id)} className='btn1'>Message</button>
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








    </div>
  );
};

export default JobCard;
