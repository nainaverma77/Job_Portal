import { useSelector } from 'react-redux'
import useGetAppliedJobs from '../hooks/useGetAppliedJobs'

const AppliedJobTable = () => {
    useGetAppliedJobs();
    const { allAppliedJobs } = useSelector(store => store.job);

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200 text-sm'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-wider'>Job Role</th>
                        <th className='px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-wider'>Company</th>
                        <th className='px-6 py-4 text-right font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {
                        allAppliedJobs?.length <= 0 ? <tr><td colSpan="4" className='px-6 py-10 text-center text-gray-400 italic'>No applied jobs yet</td></tr> : 
                        allAppliedJobs.map((appliedJob) => (
                            <tr key={appliedJob._id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-500 font-medium'>{appliedJob.createdAt?.split("T")[0]}</td>
                                <td className='px-6 py-4 whitespace-nowrap font-bold text-gray-800'>{appliedJob.job?.title}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-gray-600'>{appliedJob.job?.company?.name}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-right'>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm tracking-wider ${
                                        ['Rejected'].includes(appliedJob.status) ? 'bg-red-100 text-red-600' : 
                                        ['Applied', 'Under Review'].includes(appliedJob.status) ? 'bg-gray-100 text-gray-600' : 
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        {appliedJob.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default AppliedJobTable
