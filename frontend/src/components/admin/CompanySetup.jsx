import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { ArrowLeft, Loader2, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

import useGetCompanyById from '../../hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setInput({
            name: singleCompany?.name || "",
            description: singleCompany?.description || "",
            website: singleCompany?.website || "",
            location: singleCompany?.location || "",
            file: singleCompany?.file || null
        })
    }, [singleCompany]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}`}/api/v1/company/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10 px-4'>
                <form onSubmit={submitHandler} className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
                    <div className='flex items-center gap-5 mb-10'>
                        <button onClick={() => navigate("/admin/companies")} className='flex items-center gap-2 text-gray-500 font-bold hover:text-[#6A38C2] transition-colors'>
                            <ArrowLeft className='w-5 h-5' />
                            <span>Back</span>
                        </button>
                        <h1 className='font-bold text-2xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block font-medium mb-2'>Company Name</label>
                            <input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                                placeholder='Microsoft, Google etc.'
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
                            <label className='block font-medium mb-2'>Website</label>
                            <input
                                type="text"
                                name="website"
                                value={input.website}
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
                        <div className='col-span-2'>
                            <label className='block font-medium mb-2'>Logo</label>
                            <div className='relative'>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={fileChangeHandler}
                                    className='hidden'
                                    id="logoInput"
                                />
                                <label htmlFor="logoInput" className='flex items-center gap-2 border border-dashed border-gray-400 p-3 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600 text-sm'>
                                    <Upload className='w-4 h-4' />
                                    {input.file ? input.file.name : "Select Company Logo"}
                                </label>
                            </div>
                        </div>
                    </div>
                    {
                        loading ? (
                            <button className='w-full my-8 bg-gray-400 text-white font-bold py-3 rounded-xl flex items-center justify-center' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </button>
                        ) : (
                            <button type="submit" className='w-full my-8 bg-[#6A38C2] text-white font-bold py-3 rounded-xl hover:bg-[#5b30a6] transition-colors shadow-lg'>
                                Update
                            </button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup
