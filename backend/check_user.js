const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/job-portal');
        console.log('Connected to MongoDB');
        const user = await User.findOne({ email: 'nainaverma71515@gmail.com' });
        console.log('User from DB:', JSON.stringify(user, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
