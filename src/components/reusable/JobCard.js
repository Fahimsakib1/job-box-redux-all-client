import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiSend } from "react-icons/bi";
import { useGetMessageForEmployerQuery, useGetReplyMessageForCandidateQuery, useSentMessageByEmployerMutation } from "../../features/Job/JobAPI";
import { toast } from "react-hot-toast";
import { BsArrowReturnRight } from "react-icons/bs";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
























const JobCard = ({ jobData }) => {




  const [randomNumber, setRandomNumber] = useState('')
  const getNumber = Math.floor(Math.random() * (100000000000 - 999999999999 + 1)) + 999999999999





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







  const [replyData, setReplyData] = useState('')

  const [getCandidateEmail, setGetCandidateEmail] = useState('')
  const [openConversationModal, setOpenConversationModal] = useState(null);
  const handleOpenConversationModal = (allData) => {
    setOpenConversationModal(allData)
    setGetCandidateEmail(allData)
    console.log("Add data: ", allData);

    const newDetails = {
      candidateEmail: allData?.email,
      appliedJob: allData?.appliedJob,
      jobId: _id,
      replyTime: time,
      candidateID: allData?.id,
    }
    setReplyData(newDetails)
  }
  console.log("State Email Outside: ", getCandidateEmail);
  const closeConversationModal = () => {
    setOpenConversationModal(null)
  }









  const { data: messageData } = useGetMessageForEmployerQuery(getCandidateEmail, { pollingInterval: 1000 })
  // console.log("Message Data: ", messageData);
















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
      imageLink: '',
      isReply: false,
      jobId: _id,
      messageSentTime: time,
      randomNumber: getNumber.toString()
    }
    console.log("Message Data:", details);
    sendMessage(details)
    setMessage('')
    toast.success('Message Sent...')
  }






  const { data: replyMessageData } = useGetReplyMessageForCandidateQuery(replyData, { pollingInterval: 1000 })










  //states and function for image preview
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLink, setImageLink] = useState('')
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(selectedImage);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  //upload the image to imagebb and get the image link along with the image preview
  const imageHostKey = process.env.REACT_APP_imagebb_key
  const getImageLink = (firstName, lastName, candidateEmail, appliedJob, candidateID) => {
    setSelectedImage(null);
    setImagePreview(null);
    console.log("Selected Image : ", selectedImage);
    const formData = new FormData();
    formData.append('image', selectedImage);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(imageData => {
        if (imageData.success) {
          setImageLink(imageData.data.url)
          const details = {
            candidateFullName: firstName + ' ' + lastName,
            candidateEmail: candidateEmail,
            appliedJob: appliedJob,
            employerFullName: user?.firstName + ' ' + user?.lastName,
            employerEmail: user?.email,
            candidateID: candidateID,
            userId: user?._id,
            message: '',
            isReply: false,
            imageLink: imageData.data.url,
            jobId: _id,
            messageSentTime: time,
            randomNumber: getNumber.toString()
          }
          console.log("Message Data With Image Link:", details);
          sendMessage(details)
          toast.success("Image Uploaded")
        }
        else {
          toast.error("Please Select Image to Upload...")
        }
      })
  }

















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
  // console.log("Merged Array Data: ", mergedArray);











































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
                        <h1 className="mb-3 font-semibold text-center text-green-600">Conversation with <span className="text-yellow-500 font-semibold ">Candidate {openConversationModal.firstName} {openConversationModal.lastName}</span> ({openConversationModal.email})</h1>

                        <p className='text-yellow-500 font-semibold text-[15px] flex justify-center items-center gap-1 relative'>
                          <BsArrowReturnRight /> Applied For: {position}
                        </p>


                        {
                          mergedArray && mergedArray.length > 0 &&
                          <>
                            {
                              mergedArray.map((data, index) =>
                                <div key={index}>

                                  {/* {
                                    data?.message &&
                                    <>
                                      <div>
                                        <p className='text-yellow-500 font-semibold text-[11px] flex justify-end items-center gap-1 relative'>
                                          <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                        </p>
                                        <div className="chat chat-end">
                                          <div className="chat-bubble bg-gray-700 px-4">
                                            <h1 className=" text-[12px] text-white ">{data.message}</h1>
                                            <p className="text-blue-500  font-semibold text-[9px] ">Sent: {data.messageSentTime}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  }

                                  {
                                    data?.reply &&
                                    <>
                                      <div className="chat chat-start">
                                        <div className="chat-bubble bg-gradient-to-r from-indigo-800  to-blue-800 px-4">
                                          <h1 className=" text-[12px] text-white ">{data.reply}</h1>
                                          <p className="text-amber-500  font-bold text-[9px]">Sent: {data.replyTime}</p>
                                        </div>
                                      </div>
                                    </>
                                  } */}




                                  {
                                    (data?.imageLink === '' && data?.message !== '' && !data?.replyImageLink && !data?.reply)
                                    &&
                                    <>
                                      <div>
                                        {/* <p className='text-yellow-500 font-semibold text-[11px] flex justify-end items-center gap-1 relative'>
                                          <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                        </p> */}
                                        <div className="chat chat-end">
                                          <div className="chat-bubble bg-gray-700 px-4">
                                            <h1 className=" text-[12px] text-white  ">{data.message}</h1>
                                            <p className="text-blue-500 text-end font-semibold text-[9px] ">Sent: {data.messageSentTime}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  }



                                  {
                                    (data?.message === '' && data?.imageLink !== '' && !data?.replyImageLink && !data?.reply)
                                    &&
                                    <>
                                      <div>
                                        {/* <p className='text-yellow-500 font-semibold text-[11px] flex justify-end items-center gap-1 relative'>
                                          <BsArrowReturnRight /> Applied For: {data?.appliedJob}
                                        </p> */}
                                        <div className="flex justify-end">
                                          <div className="avatar">
                                            <div className="w-20 rounded">
                                              {/* <img src={data?.imageLink} alt='uploadedPicture' />  */}
                                              <PhotoProvider>
                                                <PhotoView src={data?.imageLink}>
                                                  <img className="hover:scale-110 cursor-pointer transition-all hover:-translate-y-2 delay-200 duration-200 ease-out hover:ease-in" src={data?.imageLink} alt='uploadedPicture' />
                                                </PhotoView>
                                              </PhotoProvider> 
                                            </div>
                                          </div>
                                        </div>
                                        <p className="text-blue-500 text-end font-semibold text-[9px] ">Sent: {data.messageSentTime}</p>
                                      </div>
                                    </>
                                  }



                                  {
                                    (data?.reply !== '' && data?.replyImageLink === '' && !data?.imageLink && !data?.message) &&
                                    <>
                                      <div className="chat chat-start ">
                                        <div className="chat-bubble bg-gradient-to-r from-indigo-800  to-blue-800 px-4 ">
                                          <h1 className=" text-[12px] text-white ">{data.reply}</h1>
                                          <p className="text-amber-500 text-start font-semibold text-[9px]">Sent: {data.replyTime}</p>
                                        </div>
                                      </div>
                                    </>
                                  }



                                  {
                                    (data?.reply === '' && data?.replyImageLink !== '' && !data?.imageLink && !data?.message)

                                    &&
                                    <>
                                      <div className="flex justify-start">
                                        <div className="avatar">
                                          <div className="w-20 rounded">
                                            {/* <img src={data?.replyImageLink} alt='uploadedPicture' /> */}
                                            <PhotoProvider>
                                              <PhotoView src={data?.replyImageLink}>
                                                <img className="hover:scale-110 cursor-pointer transition-all hover:-translate-y-2 delay-200 duration-200 ease-out hover:ease-in" src={data?.replyImageLink} alt='uploadedPicture' />
                                              </PhotoView>
                                            </PhotoProvider>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-amber-500  text-start font-semibold text-[9px] ">Sent: {data.replyTime}</p>
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
                        <h1 className="text-center text-lg text-gray-300 my-10">You have not start conversation with Candidate {openConversationModal.firstName} {openConversationModal.lastName}</h1>
                      </div>
                  }






                  <div className='mt-20 flex flex-col w-full'>
                    <div className=' mb-2 flex items-center gap-3'>

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







                  <hr className="mx-8 text-gray-600 bg-gray-600 my-3" />
                  <div className="mx-auto text-center flex justify-center items-center">
                    <div className=" flex justify-center items-center gap-x-4">
                      <div className="mt-3 flex items-center justify-center w-full">
                        {
                          imagePreview &&
                          (
                            <div className="ml-8 mr-6  text-center avatar ">
                              <div className="h-[56px] w-16 rounded">
                                <img src={imagePreview} alt="Preview" />
                              </div>
                            </div>
                          )
                        }
                        <label for="dropzone-file" className="flex flex-col items-center justify-center w-[400px] h-[60px] rounded-md cursor-pointer bg-gray-700  hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="mt-3 w-8 h-6 mb-1 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-400 ">Click here to upload image</p>
                          </div>
                          <input accept="image/*"
                            onChange={handleImageChange}
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className='w-full mt-3'>
                        <button onClick={() => getImageLink(openConversationModal.firstName, openConversationModal.lastName, openConversationModal.email, openConversationModal.appliedJob, openConversationModal.id)} className='rounded-md px-4 hover:w-[134px] bg-primary h-11 w-32 group transition-all text-white ' type='submit'>
                          Upload
                        </button>
                      </div>
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
