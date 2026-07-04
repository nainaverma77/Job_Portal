import React, { useState } from 'react'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setUser } from '../../redux/authSlice'
import { setFilterSelect, setSearchedQuery } from '../../redux/jobSlice'
import axios from 'axios'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/logout", {}, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const resetFilters = () => {
        dispatch(setSearchedQuery(""));
        dispatch(setFilterSelect(""));
        setIsMenuOpen(false);
    }

    return (
        <div className='bg-white border-b border-b-gray-200'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className='md:hidden flex items-center'>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-gray-800 hover:text-[#6A38C2]'>
                        {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>

                <div className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 p-6 md:p-0 transition-all duration-300 z-50 ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
                    <ul className='flex flex-col md:flex-row font-medium items-start md:items-center gap-5 w-full md:w-auto'>
                        <li><Link to="/" className='hover:text-[#6A38C2] transition-colors block w-full' onClick={resetFilters}>Home</Link></li>
                        <li><Link to="/jobs" className='hover:text-[#6A38C2] transition-colors block w-full' onClick={resetFilters}>Jobs</Link></li>
                        <li><Link to="/browse" className='hover:text-[#6A38C2] transition-colors block w-full' onClick={() => setIsMenuOpen(false)}>Browse</Link></li>
                        
                        {user && user.role === 'recruiter' && (
                            <>
                                <li className='md:border-l md:border-gray-300 md:pl-5 w-full border-t border-gray-200 pt-2 md:pt-0 mt-2 md:mt-0'>
                                    <Link to="/admin/companies" className='text-[#6A38C2] font-semibold hover:text-[#5b30a6] transition-colors block w-full' onClick={() => setIsMenuOpen(false)}>My Companies</Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs" className='text-[#6A38C2] font-semibold hover:text-[#5b30a6] transition-colors block w-full' onClick={() => setIsMenuOpen(false)}>My Jobs</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {
                        !user ? (
                            <div className='flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto mt-4 md:mt-0'>
                                <Link to="/login" className='w-full' onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors'>Login</button>
                                </Link>
                                <Link to="/signup" className='w-full' onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full px-4 py-2 bg-[#6A38C2] text-white rounded-md hover:bg-[#5b30a6] transition-colors'>Signup</button>
                                </Link>
                            </div>
                        ) : (
                            <div className='relative group w-full md:w-auto mt-4 md:mt-0'>
                                <div className='flex items-center gap-2 cursor-pointer'>
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-[#6A38C2]">
                                        <img src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="avatar" />
                                    </div>
                                    <span className="md:hidden font-medium">{user?.fullName}</span>
                                </div>
                                <div className='md:absolute md:right-0 md:top-12 w-full md:w-80 p-4 bg-gray-50 md:bg-white md:shadow-xl border md:border-gray-100 rounded-lg md:opacity-0 md:invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 md:z-50 mt-2 md:mt-0'>
                                   <div className='flex gap-4 space-y-2'>
                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                            <img src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="avatar" />
                                        </div>
                                        <div>
                                            <h4 className='font-medium text-lg'>{user?.fullName}</h4>
                                            <p className='text-sm text-gray-500'>{user?.profile?.bio || "No bio added yet"}</p>
                                        </div>
                                   </div>
                                   <div className='flex flex-col my-4 text-gray-600 space-y-3'>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer hover:text-[#6A38C2] transition-colors'>
                                            <User2 className='w-4 h-4'/>
                                            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>View Profile</Link>
                                        </div>
                                        <div onClick={() => { logoutHandler(); setIsMenuOpen(false); }} className='flex w-fit items-center gap-2 cursor-pointer hover:text-red-500 transition-colors'>
                                            <LogOut className='w-4 h-4'/>
                                            <span>Logout</span>
                                        </div>
                                   </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar
