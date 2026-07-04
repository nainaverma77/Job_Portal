import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setFilterSelect } from '../redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Noida", "Chennai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "MERN Stack", "FullStack Developer", "Data Scientist", "AI/ML Engineer", "DevOps Engineer", "Software Engineer"]
    },
    {
        filterType: "Salary (LPA)",
        array: ["0-10", "10-25", "25-50", "50+"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(() => {
        dispatch(setFilterSelect(selectedValue));
    }, [selectedValue]);

    return (
        <div className='w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
            <h1 className='font-bold text-xl text-gray-800 mb-4'>Filter Jobs</h1>
            <hr className='mb-6' />
            <div className='space-y-6'>
                {
                    filterData.map((data, index) => (
                        <div key={index}>
                            <h2 className='font-bold text-md text-gray-700 mb-3'>{data.filterType}</h2>
                            <div className='flex flex-col gap-2'>
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={idx} className='flex items-center space-x-2'>
                                                <input 
                                                    type="radio" 
                                                    name={data.filterType} 
                                                    value={item}
                                                    id={itemId}
                                                    onChange={() => changeHandler(item)}
                                                    className='w-4 h-4 text-[#6A38C2] focus:ring-[#6A38C2] cursor-pointer'
                                                />
                                                <label htmlFor={itemId} className='text-sm text-gray-600 cursor-pointer font-medium hover:text-[#6A38C2] transition-colors'>
                                                    {item}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FilterCard
