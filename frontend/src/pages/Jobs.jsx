import React from 'react'
import Navbar from '../components/shared/Navbar'
import FilterCard from '../components/FilterCard'
import Job from '../components/Job'
import Footer from '../components/shared/Footer'

import { useSelector } from 'react-redux'
import useGetAllJobs from '../hooks/useGetAllJobs'

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery, filterSelect } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = React.useState(allJobs);
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    React.useEffect(() => {
        let filtered = allJobs;

        // 1. Filter by Search Query (Keyword)
        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            filtered = filtered.filter((job) => {
                return job.title.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query) ||
                    job.company?.name?.toLowerCase().includes(query) ||
                    job.location.toLowerCase().includes(query);
            });
        }

        // 2. Filter by Sidebar Selection (Category/Location/Salary)
        if (filterSelect) {
            const select = filterSelect.toLowerCase();
            filtered = filtered.filter((job) => {
                const isLocationMatch = job.location.toLowerCase().includes(select);
                const isTitleMatch = job.title.toLowerCase().includes(select);
                const isTypeMatch = job.jobType?.toLowerCase().includes(select);
                
                // Salary Range Logic (e.g., "10-25")
                let isSalaryMatch = false;
                if (select.includes("-")) {
                    const [min, max] = select.split("-").map(v => parseInt(v.trim()));
                    isSalaryMatch = job.salary >= min && job.salary <= (max || Infinity);
                } else if (select.includes("+")) {
                    const min = parseInt(select.replace("+", "").trim());
                    isSalaryMatch = job.salary >= min;
                }

                return isLocationMatch || isTitleMatch || isTypeMatch || isSalaryMatch;
            });
        }

        setFilterJobs(filtered);
    }, [allJobs, searchedQuery, filterSelect]);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-10 px-4'>
                <div className='flex flex-col md:flex-row gap-8'>
                    {/* Filter Toggle for Mobile */}
                    <div className='md:hidden flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm'>
                        <h1 className='font-bold text-gray-800'>Filter Career</h1>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className='px-4 py-2 bg-[#6A38C2] text-white rounded-lg text-sm font-medium hover:bg-[#5b30a6] transition-colors shadow-sm'
                        >
                            {isFilterOpen ? "Close Filters" : "Show Filters"}
                        </button>
                    </div>

                    {/* Filter Sidebar */}
                    <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-[25%] transition-all duration-300 lg:w-[20%]`}>
                        <FilterCard />
                    </div>

                    {
                        filterJobs.length <= 0 ? (
                            <div className='flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100'>
                                <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
                                    <h1 className='text-4xl'>🔍</h1>
                                </div>
                                <h1 className='text-2xl font-bold text-gray-800'>No jobs found</h1>
                                <p className='text-gray-500 mt-2 text-center max-w-sm'>
                                    Try adjusting your filters or search keywords to find the perfect career match.
                                </p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className='mt-8 px-6 py-2 border-2 border-[#6A38C2] text-[#6A38C2] rounded-full font-bold hover:bg-[#6A38C2] hover:text-white transition-all text-sm'
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto no-scrollbar pb-10'>
                                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                                    {
                                        filterJobs.map((job) => (
                                            <div key={job._id} className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
                                                <Job job={job} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Jobs
