import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Loader2, Plus, ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Footer from '../shared/Footer'

import useGetAllCompanies from '../../hooks/useGetAllCompanies'

const PostJob = () => {
    useGetAllCompanies();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        positions: 1,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Fetch companies from store
    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (e) => {
        setInput({ ...input, companyId: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/v1/job/post", input, {
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
                        <h1 className='font-bold text-2xl'>Post New <span className='text-[#6A38C2]'>Job</span></h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4 pb-8 border-b'>
                        <div>
                            <label className='block font-medium mb-2'>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='Software Engineer'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={input.description}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='Provide a brief job description...'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Requirements</label>
                            <input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='React, Node.js, Tailwind'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Salary (LPA)</label>
                            <input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='12'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='Hyderabad'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Job Type</label>
                            <input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='Full-time'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>Experience Level</label>
                            <input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                required
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='2 years'
                            />
                        </div>
                        <div>
                            <label className='block font-medium mb-2'>No of Positions</label>
                            <input
                                type="number"
                                name="positions"
                                value={input.positions}
                                onChange={changeEventHandler}
                                required
                                min="1"
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                            />
                        </div>
                    </div>
                    <div className='my-8'>
                        <label className='block font-bold mb-4 text-[#6A38C2]'>Select Company</label>
                        <select required onChange={selectChangeHandler} className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all bg-white font-medium'>
                            <option value="">Select a Company</option>
                            {companies?.map((company) => (
                                <option key={company._id} value={company._id}>{company.name}</option>
                            ))}
                        </select>
                    </div>
                    {
                        loading ? (
                            <button className='w-full bg-gray-400 text-white font-bold py-3 rounded-xl flex items-center justify-center' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Posting...
                            </button>
                        ) : (
                            <button type="submit" className='w-full bg-[#6A38C2] text-white font-bold py-4 rounded-xl hover:bg-[#5b30a6] transition-colors shadow-lg mt-4'>
                                Post Job
                            </button>
                        )
                    }
                    {
                        companies?.length === 0 && <p className='text-xs text-red-600 font-bold text-center mt-4'>*Please register a company first, before posting jobs</p>
                    }
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default PostJob
