import React from 'react'
import { MoreHorizontal, Download, CheckCircle, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const shortlistingStatus = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}`}/api/v1/application/status/${id}/update`, { status }, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-10'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>FullName</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Email</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Contact</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Resume</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider'>Action</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {
                        applicants?.applications?.map((item) => (
                            <tr key={item._id} className='hover:bg-gray-50 transition-colors text-sm'>
                                <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-800'>{item?.applicant?.fullName}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{item?.applicant?.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{item?.applicant?.phoneNumber}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    {
                                        item?.applicant?.profile?.resume ? (
                                            <a href={item?.applicant?.profile?.resume} target="_blank" rel="noreferrer" className='text-[#6A38C2] hover:underline flex items-center gap-1 font-semibold'>
                                                <Download className='w-3 h-3' />
                                                Download
                                            </a>
                                        ) : <span>NA</span>
                                    }
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500'>{item?.createdAt?.split("T")[0]}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-right'>
                                    <div className='relative group inline-block'>
                                        <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                                            <MoreHorizontal className='w-5 h-5 text-gray-400' />
                                        </button>
                                        <div className='absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-2'>
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <button 
                                                        key={index}
                                                        onClick={() => statusHandler(status, item?._id)}
                                                        className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                                    >
                                                        {status === "Rejected" ? <XCircle className='w-4 h-4 text-red-500' /> : <CheckCircle className='w-4 h-4 text-[#6A38C2]' />}
                                                        <span>{status}</span>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ApplicantsTable
