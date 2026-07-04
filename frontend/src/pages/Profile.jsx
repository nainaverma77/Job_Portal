import React, { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import { Contact, Mail, Pen } from 'lucide-react'
import AppliedJobTable from '../components/AppliedJobTable'
import UpdateProfileModel from '../components/UpdateProfileModel'
import { useSelector } from 'react-redux'
import Footer from '../components/shared/Footer'

const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl my-10 p-8 shadow-xl'>
                <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
                    <div className='flex flex-col sm:flex-row items-center gap-6'>
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-[#6A38C2] shrink-0 shadow-lg">
                            <img src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                        </div>
                        <div className='text-center sm:text-left'>
                            <h1 className='font-bold text-2xl text-gray-800'>{user?.fullName || "Full Name"}</h1>
                            <p className='text-gray-500 mt-1'>{user?.profile?.bio || "No bio added yet. Add one to stand out!"}</p>
                        </div>
                    </div>
                    <button onClick={() => setOpen(true)} className='p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm'>
                        <Pen className='w-4 h-4 text-[#6A38C2]' />
                    </button>
                </div>
                <div className='my-8 space-y-3'>
                    <div className='flex items-center gap-3 text-gray-600 font-medium'>
                        <Mail className='w-4 h-4 text-[#6A38C2]' />
                        <span>{user?.email || "email@example.com"}</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600 font-medium'>
                        <Contact className='w-4 h-4 text-[#6A38C2]' />
                        <span>{user?.phoneNumber || "No phone added"}</span>
                    </div>
                </div>
                <div className='my-8'>
                    <h1 className='text-lg font-bold text-gray-800 mb-4'>Skills</h1>
                    <div className='flex flex-wrap items-center gap-2'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                <span key={index} className='px-4 py-1.5 bg-[#6A38C2] text-white rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default'>
                                    {item}
                                </span>
                            )) : <span className='text-gray-400 italic'>No skills added yet</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5 mb-8'>
                    <h1 className='text-lg font-bold text-gray-800 mb-2'>Resume</h1>
                    {
                        isResume ? (
                            <a target='blank' href={user?.profile?.resume} className='text-[#6A38C2] w-fit font-semibold hover:underline flex items-center gap-2'>
                                {user?.profile?.resumeOriginalName || "View Resume"}
                            </a>
                        ) : <span className='text-gray-400 italic'>No resume uploaded</span>
                    }
                </div>

                <div className='mt-8 pt-8 border-t border-gray-100'>
                    <h1 className='text-lg font-bold text-gray-800 mb-4'>Extended Profile</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <h2 className='font-semibold text-gray-700 mb-2'>Links</h2>
                            <p className='text-sm text-gray-600 mb-1'><span className='font-medium'>GitHub:</span> {user?.profile?.githubUrl ? <a href={user?.profile?.githubUrl} target="_blank" className='text-[#6A38C2] hover:underline'>View Profile</a> : "N/A"}</p>
                            <p className='text-sm text-gray-600 mb-1'><span className='font-medium'>LinkedIn:</span> {user?.profile?.linkedinUrl ? <a href={user?.profile?.linkedinUrl} target="_blank" className='text-[#6A38C2] hover:underline'>View Profile</a> : "N/A"}</p>
                            <p className='text-sm text-gray-600 mb-1'><span className='font-medium'>Portfolio:</span> {user?.profile?.portfolioUrl ? <a href={user?.profile?.portfolioUrl} target="_blank" className='text-[#6A38C2] hover:underline'>View Portfolio</a> : "N/A"}</p>
                        </div>
                        <div>
                            <h2 className='font-semibold text-gray-700 mb-2'>Education</h2>
                            {user?.profile?.education?.length > 0 ? (
                                <ul className='list-disc list-inside text-sm text-gray-600'>
                                    {user.profile.education.map((edu, i) => <li key={i}>{edu}</li>)}
                                </ul>
                            ) : <p className='text-sm text-gray-400 italic'>No education added</p>}
                        </div>
                        <div>
                            <h2 className='font-semibold text-gray-700 mb-2'>Experience</h2>
                            {user?.profile?.experience?.length > 0 ? (
                                <ul className='list-disc list-inside text-sm text-gray-600'>
                                    {user.profile.experience.map((exp, i) => <li key={i}>{exp}</li>)}
                                </ul>
                            ) : <p className='text-sm text-gray-400 italic'>No experience added</p>}
                        </div>
                        <div>
                            <h2 className='font-semibold text-gray-700 mb-2'>Projects</h2>
                            {user?.profile?.projects?.length > 0 ? (
                                <ul className='list-disc list-inside text-sm text-gray-600'>
                                    {user.profile.projects.map((proj, i) => <li key={i}>{proj}</li>)}
                                </ul>
                            ) : <p className='text-sm text-gray-400 italic'>No projects added</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl my-5 p-8 shadow-xl'>
                <h1 className='font-bold text-xl text-gray-800 mb-6'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl my-5 p-8 shadow-xl mb-20'>
                <h1 className='font-bold text-xl text-gray-800 mb-6'>Saved Jobs</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {
                        user?.savedJobs?.length > 0 ? 
                        // Note: To show real jobs, they must be populated in the backend or 
                        // filtered from allJobs in the frontend.
                        // For simplicity, showing a message or placeholder if jobs aren't fetched.
                        <p className='text-gray-500 italic'>Feature coming soon in full persistence mode.</p>
                        : <p className='text-gray-400 italic'>No jobs saved yet</p>
                    }
                </div>
            </div>
            <UpdateProfileModel open={open} setOpen={setOpen} />
            <Footer />
        </div>
    )
}

export default Profile
