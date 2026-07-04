import React, { useEffect, useState } from 'react'
import Navbar from '../components/shared/Navbar'
import HeroSection from '../components/HeroSection'
import CategoryCarousel from '../components/CategoryCarousel'
import LatestJobs from '../components/LatestJobs'
import Footer from '../components/shared/Footer'
import Job from '../components/Job'
import useGetAllJobs from '../hooks/useGetAllJobs'

const Home = () => {
    useGetAllJobs();
    const [recentJobs, setRecentJobs] = useState([]);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem("recentJobs") || "[]");
        setRecentJobs(recent);
    }, []);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <HeroSection />
            <div className='bg-white'> 
                 <CategoryCarousel />
            </div>
            <LatestJobs />
            {
                recentJobs.length > 0 && (
                    <div className='max-w-7xl mx-auto my-20 px-4'>
                        <h1 className='text-4xl font-bold mb-10'>Recently <span className='text-[#6A38C2]'>Viewed</span></h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {
                                recentJobs.map((job) => (
                                    <Job key={job._id} job={job} />
                                ))
                            }
                        </div>
                    </div>
                )
            }
            <Footer />
        </div>
    )
}

export default Home
