import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '../redux/jobSlice';
import axios from 'axios';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (selectedQuery) => {
        const finalQuery = typeof selectedQuery === 'string' ? selectedQuery : query;
        dispatch(setSearchedQuery(finalQuery));
        navigate("/jobs"); // Navigate to /jobs for the best filtering experience
    }

    // Debounced Suggestions Fetching
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/v1/job/suggestions?keyword=${query}`);
                    if (res.data.success) {
                        setSuggestions(res.data.suggestions);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className='relative overflow-hidden bg-white'>
            {/* Background Decorative Elements */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10'>
                <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6A38C2] rounded-full blur-[120px]'></div>
                <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F83002] rounded-full blur-[120px]'></div>
            </div>

            <div className='relative text-center py-20 md:py-32 max-w-7xl mx-auto px-4'>
                <div className='flex flex-col gap-6 animate-in fade-in zoom-in duration-700'>
                    <span className='mx-auto px-6 py-2 rounded-full bg-[#fdf2f2] text-[#F83002] font-bold text-sm tracking-wide shadow-sm border border-red-100'>
                        🚀 No. 1 Job Hunt Platform
                    </span>
                    <h1 className='text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight'>
                        Search, Apply & <br /> Get Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#9b6cf5]'>Dream Career</span>
                    </h1>
                    <p className='text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'>
                        Join thousands of professionals finding life-changing opportunities. Your next big career move starts with a single search.
                    </p>
                    
                    <div className='relative w-full md:w-[70%] lg:w-[60%] mx-auto mt-10'>
                        <div className='flex shadow-2xl border border-gray-100 pl-6 rounded-2xl items-center gap-4 bg-white focus-within:ring-4 focus-within:ring-[#6A38C2] focus-within:ring-opacity-20 transition-all duration-300'>
                            <input
                                type="text"
                                value={query}
                                placeholder='Search by Job Title, Skills or Company...'
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                                className='outline-none border-none w-full py-5 text-gray-700 font-medium placeholder:text-gray-400'
                            />
                            <button 
                                onClick={() => searchJobHandler()}
                                className='bg-[#6A38C2] p-5 text-white hover:bg-[#5b30a6] transition-all h-full px-10 rounded-r-2xl font-bold flex items-center gap-2 group'
                            >
                                <Search className='h-5 w-5 group-hover:scale-110 transition-transform' />
                                <span className='hidden sm:inline'>Search</span>
                            </button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className='absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left py-2'>
                                {suggestions.map((suggestion, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => {
                                            setQuery(suggestion);
                                            setShowSuggestions(false);
                                            searchJobHandler(suggestion);
                                        }}
                                        className='w-full px-6 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-medium transition-colors'
                                    >
                                        <Search className='h-4 w-4 text-gray-300' />
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-medium'>
                        <div className='flex items-center gap-2'><div className='w-2 h-2 rounded-full bg-green-500'></div> 5,000+ Active Jobs</div>
                        <div className='flex items-center gap-2'><div className='w-2 h-2 rounded-full bg-blue-500'></div> 20+ Top Companies</div>
                        <div className='flex items-center gap-2'><div className='w-2 h-2 rounded-full bg-purple-500'></div> Verified Recruiters</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
