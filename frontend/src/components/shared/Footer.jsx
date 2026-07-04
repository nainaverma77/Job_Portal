import { Globe, ExternalLink } from 'lucide-react'

const Footer = () => {
    return (
        <footer className='border-t border-t-gray-200 bg-white py-12'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-wrap justify-between gap-8'>
                    <div className='w-full md:w-1/3'>
                        <h2 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h2>
                        <p className='text-gray-500 mt-4 leading-relaxed'>
                            Connecting talent with opportunity. We provide a platform for job seekers and recruiters to find the perfect match. Your career journey starts here.
                        </p>
                    </div>
                    <div className='flex gap-16'>
                        <div>
                            <h3 className='font-bold text-gray-800 mb-4'>Quick Links</h3>
                            <ul className='space-y-2 text-gray-500'>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Home</li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Jobs</li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Browse</li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>About Us</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-800 mb-4'>Support</h3>
                            <ul className='space-y-2 text-gray-500'>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Feedback</li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Help Center</li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Contact</li>
                                <li className='hover:text-[#6A38C2] cursor-pointer'>Privacy Policy</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4'>
                    <div className='text-sm text-gray-400'>
                        © {new Date().getFullYear()} JobPortal. All rights reserved.
                    </div>
                    <div className='flex gap-4'>
                        <Globe className='w-5 h-5 text-gray-400 hover:text-[#6A38C2] cursor-pointer' />
                        <ExternalLink className='w-5 h-5 text-gray-400 hover:text-[#6A38C2] cursor-pointer' />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
