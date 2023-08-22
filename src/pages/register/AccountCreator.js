import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import candidate from "../../assets/candidate.svg";
import employer from "../../assets/employer.svg";
import CandidateRegistration from "./CandidateRegistration";
import EmployerRegistration from "./EmployerRegistration";




const AccountCreator = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  if (type === "candidate") {
    return <CandidateRegistration />;
  }

  if (type === "employer") {
    return <EmployerRegistration />;
  }

  return (
    <div className='h-screen pt-14'>
      <h1 className='text-center my-10 text-2xl'>Continue as ...</h1>
      <div className='flex justify-evenly '>
        
        <div
          onClick={() => navigate("/register/candidate")}
          className='cursor-pointer flex flex-col justify-between transition-all rounded-lg px-5 py-2 border  border-primary scale-95 hover:shadow-2xl hover:scale-100 group'
        >
          <img className='w-full h-96' src={candidate} alt='' />
          <p className=' my-3 text-center text-3xl'>Candidate</p>
        </div>



        <div
          onClick={() => navigate("/register/employer")}
          className='cursor-pointer flex flex-col justify-between transition-all rounded-lg px-5 py-2 border  border-primary scale-95 hover:shadow-2xl hover:scale-100 group'
        >
          <img className='w-full h-96 -mt-2' src={employer} alt='' />
          <p className='my-3 text-center text-3xl'>Employer</p>
        </div>


      </div>
    </div>
  );
};

export default AccountCreator;
