import React, { useEffect, useState } from 'react'
import Navbar from '../components/shared/Navbar'
import { Badge, MapPin, Briefcase, DollarSign, Calendar, Users } from 'lucide-react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Footer from '../components/shared/Footer'

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;
    const { user } = useSelector(store => store.auth);
    const [singleJob, setSingleJob] = useState(null);
    const dispatch = useDispatch();

    const isApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login to apply for this job.");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/application/apply/${jobId}`, {}, { withCredentials: true });
            if (res.data.success) {
                // Fetch the job again to update the application list
                const response = await axios.get(`http://localhost:5000/api/v1/job/get/${jobId}`, { withCredentials: true });
                if (response.data.success) {
                    setSingleJob(response.data.job);
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again to apply for jobs.");
            } else {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/job/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    setSingleJob(res.data.job);
                    
                    // Recently Viewed Jobs Logic
                    const recent = JSON.parse(localStorage.getItem("recentJobs") || "[]");
                    const updatedRecent = [res.data.job, ...recent.filter(j => j._id !== res.data.job._id)].slice(0, 5);
                    localStorage.setItem("recentJobs", JSON.stringify(updatedRecent));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
                    <div className='p-8 md:p-12 border-b border-gray-100'>
                        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                            <div className='flex items-center gap-6'>
                                <div className="w-20 h-20 rounded-xl bg-[#6A38C2] bg-opacity-10 text-[#6A38C2] flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden font-bold text-3xl uppercase">
                                    {
                                        singleJob?.company?.logo ? (
                                            <img src={singleJob?.company?.logo} alt="company logo" className='w-full h-full object-cover' />
                                        ) : (
                                            <span>{singleJob?.company?.name?.charAt(0) || "J"}</span>
                                        )
                                    }
                                </div>
                                <div>
                                    <h1 className='font-bold text-3xl text-gray-800'>{singleJob?.title}</h1>
                                    <div className='flex flex-wrap items-center gap-4 mt-3'>
                                        <div className='flex items-center gap-1.5 px-3 py-1 bg-[#eff6ff] text-blue-700 font-bold border border-blue-200 rounded-full text-xs'>
                                            <Users className='w-3 h-3'/> {singleJob?.positions} Positions
                                        </div>
                                        <div className='flex items-center gap-1.5 px-3 py-1 bg-[#fef2f2] text-[#F83002] font-bold border border-red-200 rounded-full text-xs'>
                                            {singleJob?.jobType}
                                        </div>
                                        <div className='flex items-center gap-1.5 px-3 py-1 bg-[#f5f3ff] text-[#7209b7] font-bold border border-purple-200 rounded-full text-xs'>
                                            <DollarSign className='w-3 h-3'/> {singleJob?.salary} LPA
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`px-10 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 ${isApplied ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white hover:scale-105'}`}
                            >
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </button>
                        </div>
                    </div>

                    <div className='p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12'>
                        <div className='lg:col-span-2'>
                            <h2 className='text-2xl font-bold text-gray-800 border-b-4 border-[#6A38C2] w-fit pb-1 mb-6'>Job Description</h2>
                            <p className='text-gray-600 leading-relaxed text-lg'>
                                {singleJob?.description}
                            </p>
                            
                            <h2 className='text-2xl font-bold text-gray-800 mt-10 mb-6'>Key Requirements</h2>
                            <ul className='space-y-3'>
                                {singleJob?.requirements?.map((item, idx) => (
                                    <li key={idx} className='flex items-start gap-3 text-gray-600'>
                                        <div className='w-2 h-2 rounded-full bg-[#6A38C2] mt-2 shrink-0' />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='bg-gray-50 rounded-2xl p-8 border border-gray-100 h-fit space-y-6'>
                            <h3 className='font-bold text-xl text-gray-800 border-b pb-4'>Job Overview</h3>
                            <div className='space-y-4'>
                                <div className='flex items-center gap-3'>
                                    <Briefcase className='w-5 h-5 text-[#6A38C2]' />
                                    <div>
                                        <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>Role</p>
                                        <p className='font-semibold text-gray-800'>{singleJob?.title}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <MapPin className='w-5 h-5 text-[#6A38C2]' />
                                    <div>
                                        <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>Location</p>
                                        <p className='font-semibold text-gray-800'>{singleJob?.location}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <DollarSign className='w-5 h-5 text-[#6A38C2]' />
                                    <div>
                                        <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>Salary</p>
                                        <p className='font-semibold text-gray-800'>{singleJob?.salary} LPA</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Calendar className='w-5 h-5 text-[#6A38C2]' />
                                    <div>
                                        <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>Posted Date</p>
                                        <p className='font-semibold text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default JobDescription
