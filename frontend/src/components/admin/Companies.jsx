import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '../../redux/companySlice'
import Footer from '../shared/Footer'

const Companies = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between'>
                    <input
                        className='w-full md:w-1/3 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all bg-white'
                        placeholder='Filter by name'
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                        onClick={() => navigate("/admin/companies/create")}
                        className='whitespace-nowrap px-4 py-2 bg-[#6A38C2] text-white font-bold rounded-lg hover:bg-[#5b30a6] transition-colors shadow-md flex items-center h-11'
                    >
                        New Company
                    </button>
                </div>
                <CompaniesTable />
            </div>
            <Footer />
        </div>
    )
}

export default Companies
