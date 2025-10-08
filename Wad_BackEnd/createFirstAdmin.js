// Wad_Back-End/createFirstAdmin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({ email: 'admin@pvpsit.ac.in' });
        if (adminExists) {
            console.log('Admin user already exists.');
            mongoose.disconnect();
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = new User({
            fullName: 'Admin User',
            phoneNumber: '0000000000',
            email: 'admin@pvpsit.ac.in',
            gender: 'Not Specified',
            designation: 'Admin',
            password: hashedPassword,
            dateOfBirth: new Date(),
            employeeId: 'ADMIN001', // This is the admin's login ID
            department: 'Administration',
            role: 'Admin',
            status: 'Active',
            forcePasswordChange: false // Admin does not need to change password
        });

        await adminUser.save();
        console.log('SUCCESS: First admin user has been created.');
        console.log('Employee ID: ADMIN001');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();