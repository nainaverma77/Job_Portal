import React, { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/v1/user/forgot-password', { email });
            if (res.data.success) {
                toast.success(res.data.message);
                setEmail("");
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
                    <h1 className='font-bold text-2xl mb-2'>Forgot Password</h1>
                    <p className='text-gray-500 mb-6'>Enter your email address and we'll send you a link to reset your password.</p>
                    <div className='my-4'>
                        <label className='font-medium block mb-2'>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="xyz@gmail.com"
                            className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#6A38C2]'
                            required
                        />
                    </div>
                    {
                        loading ? <button className='w-full my-4 bg-gray-400 text-white font-bold p-3 rounded-lg flex items-center justify-center' disabled> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </button> : <button type="submit" className='w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold p-3 rounded-lg transition-colors'>Send Reset Link</button>
                    }
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
