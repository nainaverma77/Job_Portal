import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { setSingleCompany } from '../../redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/company/register", {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto p-10'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>

                <label className='block font-medium mb-2'>Company Name</label>
                <input
                    type="text"
                    className='w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6A38C2] transition-all'
                    placeholder='JobHunt, Microsoft etc.'
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-4 my-10'>
                    <button onClick={() => navigate("/admin/companies")} className='px-6 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors'>Cancel</button>
                    <button onClick={registerNewCompany} className='px-6 py-2 bg-[#6A38C2] text-white rounded-lg font-bold hover:bg-[#5b30a6] transition-colors shadow-lg'>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate
