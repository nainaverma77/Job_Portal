import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '../redux/jobSlice';

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (category) => {
        dispatch(setSearchedQuery(category));
        navigate("/jobs");
    }

    return (
        <div className='py-12 bg-white'>
            <div className='max-w-7xl mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8 italic text-slate-400'>Browse by Sector</h2>
                <div className='flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar justify-center'>
                    {
                        categories.map((cat, index) => (
                            <button
                                key={index}
                                onClick={() => searchJobHandler(cat)}
                                className='rounded-full border border-gray-200 px-6 py-2 whitespace-nowrap hover:bg-[#6A38C2] hover:text-white transition-all duration-300 font-medium'
                            >
                                {cat}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CategoryCarousel
