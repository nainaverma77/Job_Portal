import React, { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '../redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Server error: Is the backend running?");
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto my-12 px-4'>
                <form onSubmit={submitHandler} className='w-full md:w-1/2 border border-gray-200 rounded-2xl p-8 shadow-xl bg-white'>
                    <h1 className='font-bold text-2xl mb-8 border-b pb-4'>Log <span className='text-[#6A38C2]'>In</span></h1>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                            <input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="name@example.com"
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent outline-none transition-all'
                                required
                            />
                        </div>
                        <div>
                            <div className='flex items-center justify-between mb-1'>
                                <label className='block text-sm font-medium text-gray-700'>Password</label>
                                <Link to="/forgot-password" className='text-sm text-[#6A38C2] hover:underline'>Forgot Password?</Link>
                            </div>
                            <input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="••••••••"
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent outline-none transition-all'
                                required
                            />
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className='cursor-pointer text-[#6A38C2] focus:ring-[#6A38C2]'
                                    />
                                    <label className='text-sm text-gray-700'>Student</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className='cursor-pointer text-[#6A38C2] focus:ring-[#6A38C2]'
                                    />
                                    <label className='text-sm text-gray-700'>Recruiter</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        loading ? (
                            <button className='w-full my-6 bg-gray-400 text-white py-3 rounded-lg flex items-center justify-center gap-2' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </button>
                        ) : (
                            <button type="submit" className='w-full my-6 bg-[#6A38C2] text-white py-3 rounded-lg hover:bg-[#5b30a6] transition-colors font-medium'>
                                Login
                            </button>
                        )
                    }
                    <p className='text-center text-sm text-gray-600'>
                        Don't have an account? <Link to="/signup" className='text-[#6A38C2] font-semibold hover:underline'>Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
