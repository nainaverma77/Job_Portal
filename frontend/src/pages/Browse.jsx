import React from 'react'
import Navbar from '../components/shared/Navbar'
import Job from '../components/Job'
import Footer from '../components/shared/Footer'
import { useSelector } from 'react-redux'
import useGetAllJobs from '../hooks/useGetAllJobs'

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-3xl my-8 text-gray-800'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Browse
