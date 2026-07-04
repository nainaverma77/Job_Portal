import React, { useEffect, useState } from 'react'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '../../hooks/useGetAllCompanies'

const CompaniesTable = () => {
    useGetAllCompanies();
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length > 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany || []);
    }, [companies, searchCompanyByText]);

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto mt-10'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Logo</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Name</th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider'>Action</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {
                        filterCompany?.map((company) => (
                            <tr key={company._id} className='hover:bg-gray-50 transition-colors cursor-default'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-100 overflow-hidden">
                                         <img src={company.logo || "https://github.com/shadcn.png"} alt="logo" className='w-full h-full object-cover' />
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800'>{company.name}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{company.createdAt?.split("T")[0]}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                    <div className='relative group inline-block'>
                                        <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                                            <MoreHorizontal className='w-5 h-5 text-gray-400' />
                                        </button>
                                        <div className='absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'>
                                            <button 
                                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                className='flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6A38C2] rounded-md transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit</span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    {
                        filterCompany?.length === 0 && (
                            <tr>
                                <td colSpan={4} className='px-6 py-10 text-center text-gray-400 italic'>No companies found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CompaniesTable
