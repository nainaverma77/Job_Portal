import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '../redux/authSlice'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { X, Loader2, Upload } from 'lucide-react'

const UpdateProfileModel = ({ open, setOpen }) => {
    const [loadingLocal, setLoadingLocal] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(",") || "",
        file: null
    });
    const dispatch = useDispatch();

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
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoadingLocal(true);
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoadingLocal(false);
        }
    }

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
            <div className='bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl relative overflow-hidden'>
                <div className='flex items-center justify-between p-6 border-b'>
                    <h1 className='font-bold text-xl'>Update Profile</h1>
                    <button onClick={() => setOpen(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                <form onSubmit={submitHandler} className='p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right font-medium'>Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={input.fullName}
                            onChange={changeEventHandler}
                            className='col-span-3 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#6A38C2]'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right font-medium'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className='col-span-3 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#6A38C2]'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right font-medium'>Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                            className='col-span-3 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#6A38C2]'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right font-medium'>Bio</label>
                        <textarea
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                            className='col-span-3 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#6A38C2] min-h-[80px]'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right font-medium'>Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={input.skills}
                            onChange={changeEventHandler}
                            placeholder="Html, Css, React, etc."
                            className='col-span-3 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#6A38C2]'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <label className='text-right font-medium'>Resume</label>
                        <div className='col-span-3 relative'>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className='hidden'
                                id="resumeInput"
                            />
                            <label htmlFor="resumeInput" className='flex items-center gap-2 border border-dashed border-gray-400 p-2 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600 text-sm'>
                                <Upload className='w-4 h-4' />
                                {input.file ? input.file.name : "Select PDF file"}
                            </label>
                        </div>
                    </div>
                    <div className='pt-6 border-t'>
                        {
                            loadingLocal ? (
                                <button className='w-full bg-gray-400 text-white font-bold py-3 rounded-xl flex items-center justify-center' disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                                </button>
                            ) : (
                                <button type='submit' className='w-full bg-[#6A38C2] text-white font-bold py-3 rounded-xl hover:bg-[#5b30a6] transition-colors shadow-lg'>
                                    Update Profile
                                </button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfileModel
