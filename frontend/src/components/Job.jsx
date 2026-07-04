import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { setUser } from '../redux/authSlice'
import { Bookmark, MapPin, Clock, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const isSaved = user?.savedJobs?.includes(job?._id);

    const saveJobHandler = async () => {
        if (!user) {
            toast.error("Please login first to save jobs!");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/user/save/${job?._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                // Update user in redux
                const updatedUser = {
                    ...user,
                    savedJobs: isSaved 
                        ? user.savedJobs.filter(id => id !== job?._id)
                        : [...user.savedJobs, job?._id]
                };
                dispatch(setUser(updatedUser));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again to save jobs.");
            } else {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        }
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 mb-6'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{job?.createdAt?.split("T")[0]}</p>
                <button 
                    onClick={saveJobHandler}
                    className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-[#6A38C2] text-white' : 'hover:bg-gray-100'}`}
                >
                    <Bookmark className='w-4 h-4' />
                </button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <div className='h-12 w-12 rounded-md bg-[#6A38C2] bg-opacity-10 text-[#6A38C2] font-bold text-xl uppercase flex items-center justify-center overflow-hidden border border-gray-100'>
                    {
                        job?.company?.logo ? (
                            <img src={job?.company?.logo} alt="logo" className='w-full h-full object-cover' />
                        ) : (
                            <span>{job?.company?.name?.charAt(0) || "J"}</span>
                        )
                    }
                </div>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <div className='flex items-center gap-1 text-gray-500 text-xs'>
                        <MapPin className='w-3 h-3' /> {job?.location}
                    </div>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2'>
                    {job?.description}
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <span className='px-3 py-1 bg-[#eff6ff] text-blue-700 font-bold border border-blue-200 rounded-full text-[10px] uppercase tracking-wider'>{job?.positions} Positions</span>
                <span className='px-3 py-1 bg-[#fef2f2] text-[#F83002] font-bold border border-red-200 rounded-full text-[10px] uppercase tracking-wider'>{job?.jobType}</span>
                <span className='px-3 py-1 bg-[#f5f3ff] text-[#7209b7] font-bold border border-purple-200 rounded-full text-[10px] uppercase tracking-wider'>{job?.salary} LPA</span>
            </div>

            <div className='flex items-center gap-4 mt-6'>
                <button 
                    onClick={() => navigate(`/description/${job?._id}`)}
                    className='px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium'
                >
                    Details
                </button>
                <button 
                    onClick={saveJobHandler}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${isSaved ? 'bg-gray-200 text-gray-800' : 'bg-[#7209b7] text-white hover:bg-[#5b30a6]'}`}
                >
                    {isSaved ? "Saved" : "Save For Later"}
                </button>
            </div>
        </div>
    )
}

export default Job
