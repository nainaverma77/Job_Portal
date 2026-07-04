import React, { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}`}/api/v1/user/reset-password/${token}`, { password });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto mt-20 px-4'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-xl p-10 shadow-xl bg-white'>
                    <h1 className='font-bold text-2xl mb-2'>Set New Password</h1>
                    <p className='text-gray-500 mb-6'>Please enter your new password below.</p>
                    <div className='my-4'>
                        <label className='font-medium block mb-2'>New Password</label>
                        <input
                            type="password"
                            value={password}
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#6A38C2]'
                            required
                        />
                    </div>
                    <div className='my-4'>
                        <label className='font-medium block mb-2'>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            name="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#6A38C2]'
                            required
                        />
                    </div>
                    {
                        loading ? <button className='w-full my-4 bg-gray-400 text-white font-bold p-3 rounded-lg flex items-center justify-center' disabled> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </button> : <button type="submit" className='w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold p-3 rounded-lg transition-colors'>Reset Password</button>
                    }
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
