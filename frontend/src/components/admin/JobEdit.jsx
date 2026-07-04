import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Footer from '../shared/Footer'

const JobEdit = () => {
    const params = useParams();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        positions: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const { allAdminJobs } = useSelector(store => store.job);
    const { companies } = useSelector(store => store.company);
    const navigate = useNavigate();

    useEffect(() => {
        const job = allAdminJobs.find(j => j._id === params.id);
        if (job) {
            setInput({
                title: job.title || "",
                description: job.description || "",
                requirements: job.requirements?.join(",") || "",
                salary: job.salary || "",
                location: job.location || "",
                jobType: job.jobType || "",
                experience: job.experienceLevel || "",
                positions: job.positions || 0,
                companyId: job.company?._id || ""
            })
        }
    }, [params.id, allAdminJobs]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`http://localhost:5000/api/v1/job/update/${params.id}`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-10 px-4'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl w-full bg-white border border-gray-100 rounded-2xl shadow-xl'>
                    <div className='flex items-center gap-5 mb-10'>
                        <button onClick={() => navigate("/admin/jobs")} className='flex items-center gap-2 text-gray-500 font-bold hover:text-[#6A38C2] transition-colors'>
                            <ArrowLeft className='w-5 h-5' />
                            <span>Back</span>
                        </button>
                        <h1 className='font-bold text-2xl'>Edit <span className='text-[#6A38C2]'>Job</span></h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4 pb-8 border-b'>
                        <div>
                            <label className='block font-medium mb-2'>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Requirements</label>
                            <input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Salary (LPA)</label>
                            <input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Job Type</label>
                            <input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Experience Level</label>
                            <input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>No of Positions</label>
                            <input
                                type="number"
                                name="positions"
                                value={input.positions}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                    </div>
                    {
                        loading ? (
                            <button className='w-full bg-gray-400 text-white font-bold py-3 rounded-xl flex items-center justify-center' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </button>
                        ) : (
                            <button type="submit" className='w-full bg-[#6A38C2] text-white font-bold py-4 rounded-xl hover:bg-[#5b30a6] transition-colors shadow-lg mt-4'>
                                Update Job
                            </button>
                        )
                    }
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default JobEdit
