import React from 'react';
import { useSelector } from 'react-redux';

const DashboardHomePage = () => {
    
    const user = useSelector(state => state.auth.user);
    
    return (
        <div>
            <h1 className=' text-center text-black font-semibold mt-56 md:text-4xl text-3xl'>Welcome, <span className='text-primary font-bold'>{user?.firstName} {user?.lastName}</span> to your Dashboard</h1>
            <p className='text-center my-8 text-xl font-semibold'>You are logged in as {user?.role === 'candidate' ? 'a' : 'an' } <span className='text-red-600 text-2xl font-bold'>{user?.role}</span></p>
        </div>
    );
};

export default DashboardHomePage;