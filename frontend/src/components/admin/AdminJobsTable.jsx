import React, { useEffect, useState } from 'react'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs'

const AdminJobsTable = () => {
    useGetAllAdminJobs();
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJob, setFilterJob] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJob = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJob(filteredJob);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-10'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Company Name</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Role</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider'>Action</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {
                        filterJob?.map((job) => (
                            <tr key={job._id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800'>{job?.company?.name}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium'>{job?.title}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{job?.createdAt?.split("T")[0]}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                    <div className='relative group inline-block'>
                                        <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                                            <MoreHorizontal className='w-5 h-5 text-gray-400' />
                                        </button>
                                        <div className='absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-2'>
                                            <button 
                                                onClick={() => navigate(`/admin/jobs/${job._id}`)}
                                                className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6A38C2] rounded-md transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit</span>
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500 rounded-md transition-colors'
                                            >
                                                <Eye className='w-4 h-4' />
                                                <span>Applicants</span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    {
                        filterJob?.length === 0 && (
                            <tr>
                                <td colSpan={4} className='px-6 py-10 text-center text-gray-400 italic'>No jobs found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default AdminJobsTable
