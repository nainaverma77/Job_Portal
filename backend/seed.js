const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const Company = require('./models/Company');

(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/job-portal');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Job.deleteMany({});
        await Company.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Create a test user (Recruiter)
        const user = await User.create({
            fullName: 'Naina Verma',
            email: 'nainaverma71515@gmail.com',
            password: 'password123',
            role: 'recruiter',
            phoneNumber: '8896256080',
            profile: {
                skills: ['Web Development'],
                profilePhoto: '/naina_profile.png'
            }
        });
        console.log('Created test recruiter: Naina Verma with photo');

        const companiesData = [
            { name: 'Google', description: 'Search and cloud computing', website: 'https://google.com', logo: 'https://logo.clearbit.com/google.com', location: 'Mountain View, CA' },
            { name: 'Microsoft', description: 'Building the future with AI and Cloud', website: 'https://microsoft.com', logo: 'https://logo.clearbit.com/microsoft.com', location: 'Redmond, WA' },
            { name: 'Amazon', description: 'E-commerce and cloud services', website: 'https://amazon.com', logo: 'https://logo.clearbit.com/amazon.com', location: 'Seattle, WA' },
            { name: 'Meta', description: 'Giving people the power to build community', website: 'https://meta.com', logo: 'https://logo.clearbit.com/meta.com', location: 'Menlo Park, CA' },
            { name: 'Apple', description: 'Think different', website: 'https://apple.com', logo: 'https://logo.clearbit.com/apple.com', location: 'Cupertino, CA' },
            { name: 'TCS', description: 'Empowering communities through technology', website: 'https://tcs.com', logo: 'https://logo.clearbit.com/tcs.com', location: 'Mumbai, MH' },
            { name: 'Infosys', description: 'Navigate your next', website: 'https://infosys.com', logo: 'https://logo.clearbit.com/infosys.com', location: 'Bengaluru, KA' },
            { name: 'HDFC Bank', description: 'We understand your world', website: 'https://hdfcbank.com', logo: 'https://logo.clearbit.com/hdfcbank.com', location: 'Mumbai, MH' },
            { name: 'State Bank of India', description: 'The banker to every Indian', website: 'https://sbi.co.in', logo: 'https://logo.clearbit.com/sbi.co.in', location: 'Mumbai, MH' },
            { name: 'ICICI Bank', description: 'Khayaal Aapka', website: 'https://icicibank.com', logo: 'https://logo.clearbit.com/icicibank.com', location: 'Mumbai, MH' },
            { name: 'JPMorgan Chase', description: 'Leading global financial services firm', website: 'https://jpmorganchase.com', logo: 'https://logo.clearbit.com/jpmorganchase.com', location: 'New York, NY' },
            { name: 'Goldman Sachs', description: 'Global investment banking', website: 'https://goldmansachs.com', logo: 'https://logo.clearbit.com/goldmansachs.com', location: 'New York, NY' },
            { name: 'Unilever', description: 'Making sustainable living commonplace', website: 'https://unilever.com', logo: 'https://logo.clearbit.com/unilever.com', location: 'London, UK' },
            { name: 'Procter & Gamble', description: 'Touching lives, improving life', website: 'https://pg.com', logo: 'https://logo.clearbit.com/pg.com', location: 'Cincinnati, OH' },
            { name: 'Deloitte', description: 'Audit, consulting, advisory, and tax services', website: 'https://deloitte.com', logo: 'https://logo.clearbit.com/deloitte.com', location: 'New York, NY' },
            { name: 'McKinsey & Company', description: 'Global management consulting', website: 'https://mckinsey.com', logo: 'https://logo.clearbit.com/mckinsey.com', location: 'New York, NY' },
            { name: 'Reliance Industries', description: 'Growth is Life', website: 'https://ril.com', logo: 'https://logo.clearbit.com/ril.com', location: 'Mumbai, MH' },
            { name: 'Tata Motors', description: 'Connecting Aspirations', website: 'https://tatamotors.com', logo: 'https://logo.clearbit.com/tatamotors.com', location: 'Mumbai, MH' }
        ];

        const companies = await Company.insertMany(companiesData.map(c => ({ ...c, userId: user._id })));
        console.log(`Successfully seeded ${companies.length} companies with proper logos!`);

        const jobsData = [
            { title: 'Backend Developer', description: 'Build and maintain core backend systems.', requirements: ['C++', 'Python', 'DS Algo'], salary: 45, location: 'Mountain View, CA', jobType: 'Full-Time', experienceLevel: '2+ years', positions: 10, company: companies[0]._id },
            { title: 'Graphic Designer', description: 'Design UI graphics and marketing material.', requirements: ['Photoshop', 'Illustrator', 'Figma'], salary: 35, location: 'Redmond, WA', jobType: 'Full-Time', experienceLevel: '5+ years', positions: 5, company: companies[1]._id },
            { title: 'Frontend Developer', description: 'Frontend development using React.', requirements: ['React', 'JavaScript', 'TailwindCSS'], salary: 40, location: 'Seattle, WA', jobType: 'Full-Time', experienceLevel: '3+ years', positions: 8, company: companies[2]._id },
            { title: 'Product UI Designer', description: 'Design user-centric social experiences.', requirements: ['React', 'Figma', 'UI/UX'], salary: 38, location: 'Menlo Park, CA', jobType: 'Full-Time', experienceLevel: '4+ years', positions: 3, company: companies[3]._id },
            { title: 'iOS Developer', description: 'Build iPhone applications.', requirements: ['Swift', 'Objective-C', 'iOS SDK'], salary: 42, location: 'Cupertino, CA', jobType: 'Full-Time', experienceLevel: '3+ years', positions: 12, company: companies[4]._id },
            { title: 'Financial Analyst', description: 'Analyze financial data and trends.', requirements: ['Excel', 'Financial Modeling', 'Accounting'], salary: 18, location: 'Mumbai, MH', jobType: 'Full-Time', experienceLevel: '2+ years', positions: 15, company: companies[7]._id },
            { title: 'Branch Manager', description: 'Oversee bank branch operations.', requirements: ['Banking', 'Leadership', 'Sales'], salary: 25, location: 'Mumbai, MH', jobType: 'Full-Time', experienceLevel: '5+ years', positions: 3, company: companies[8]._id },
            { title: 'Investment Banker', description: 'Capital raising and M&A advisory.', requirements: ['Finance', 'Valuation', 'M&A'], salary: 50, location: 'New York, NY', jobType: 'Full-Time', experienceLevel: '3+ years', positions: 5, company: companies[10]._id },
            { title: 'Marketing Manager', description: 'Brand management and product marketing.', requirements: ['Marketing', 'FMCG', 'Strategy'], salary: 30, location: 'London, UK', jobType: 'Full-Time', experienceLevel: '5+ years', positions: 4, company: companies[12]._id },
            { title: 'Supply Chain Analyst', description: 'Optimize global supply chains.', requirements: ['Logistics', 'Analytics', 'SAP'], salary: 20, location: 'Cincinnati, OH', jobType: 'Full-Time', experienceLevel: '2+ years', positions: 10, company: companies[13]._id },
            { title: 'Management Consultant', description: 'Optimize business processes.', requirements: ['Business Analytics', 'Client Management'], salary: 18, location: 'New York, NY', jobType: 'Full-Time', experienceLevel: '5+ years', positions: 15, company: companies[14]._id },
            { title: 'Operations Manager', description: 'Manage large scale operations.', requirements: ['Operations', 'Six Sigma', 'Leadership'], salary: 35, location: 'Mumbai, MH', jobType: 'Full-Time', experienceLevel: '8+ years', positions: 2, company: companies[16]._id },
            { title: 'Automotive Design Engineer', description: 'Design next generation vehicles.', requirements: ['CAD', 'Automotive', 'Mechanical'], salary: 22, location: 'Pune, MH', jobType: 'Full-Time', experienceLevel: '3+ years', positions: 8, company: companies[17]._id }
        ];

        await Job.insertMany(jobsData.map(j => ({ ...j, created_by: user._id })));
        console.log(`Successfully seeded ${jobsData.length} jobs with Wikimedia logos!`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
})();
