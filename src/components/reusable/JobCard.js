import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";





const JobCard = ({ jobData }) => {

  const user = useSelector(state => state.auth.user)

  const navigate = useNavigate();
  const { _id, position, companyName, location, employmentType, applicantDetails, jobStatus } =
    jobData || {};
  // console.log("Job Data:", jobData);





  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCancelLogOutOnModal = () => {
    setOpenModal(false);
  }



















  return (
    <div
      key={_id}
      className=' mt-4 border border-gray-300 shadow-xl p-5 rounded-xl text-primary'
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

                <label onClick={handleCancelLogOutOnModal} htmlFor="newModal" className=" text-white  border-2 border-red-600 bg-red-600 hover:bg-red-600  scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="font-extrabold text-white">✕</span></label>

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

              </div>
            </div>
          </>
        }
      </>





      <>

        <dialog id="my_modal_4" className="modal">
          <form method="dialog" className="bg-gray-800 modal-box w-11/12 max-w-5xl">
            <button className=" border-2 border-red-600 bg-red-600 hover:bg-red-600 font-extrabold scale-115 hover:p-0 hover:scale-120  btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><span className="text-white ">✕</span></button>
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

export default JobCard;
