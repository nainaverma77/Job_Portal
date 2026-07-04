import React from 'react'
import { Badge } from 'lucide-react' // Using icon as a placeholder for UI components
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/description/${job?._id}`)} className='p-6 rounded-xl shadow-md bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-[#6A38C2] bg-opacity-10 text-[#6A38C2] flex items-center justify-center p-1 overflow-hidden shrink-0 border border-gray-100 font-bold uppercase'>
                    {
                        job?.company?.logo ? (
                            <img src={job?.company?.logo} alt="logo" className='w-full h-full object-cover' />
                        ) : (
                            <span className='text-sm'>{job?.company?.name?.charAt(0) || "J"}</span>
                        )
                    }
                </div>
                <div>
                    <h1 className='font-bold text-lg text-gray-800 group-hover:text-[#6A38C2] transition-colors line-clamp-1'>{job?.company?.name}</h1>
                    <p className='text-xs text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div className='my-4'>
                <h1 className='font-bold text-xl text-gray-900 group-hover:text-[#6A38C2] transition-colors'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2 mt-2 leading-relaxed'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <span className='px-3 py-1 bg-[#eff6ff] text-blue-700 font-bold border border-blue-200 rounded-full text-[10px] uppercase tracking-wider'>{job?.positions} Positions</span>
                <span className='px-3 py-1 bg-[#fef2f2] text-[#F83002] font-bold border border-red-200 rounded-full text-[10px] uppercase tracking-wider'>{job?.jobType}</span>
                <span className='px-3 py-1 bg-[#f5f3ff] text-[#7209b7] font-bold border border-purple-200 rounded-full text-[10px] uppercase tracking-wider'>{job?.salary} LPA</span>
            </div>
        </div>
    )
}

export default LatestJobCards
