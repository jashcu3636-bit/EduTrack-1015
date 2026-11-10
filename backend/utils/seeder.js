const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');
const connectDB = require('../config/db');

dotenv.config();

const sampleUsers = [
  {
    name: 'Admin Faculty',
    email: 'admin@university.edu',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Prof. Sarah Jenkins',
    email: 'prof.sarah@university.edu',
    password: 'password123',
    role: 'faculty',
  },
];

const sampleStudents = [
  {
    studentId: 'CS2024-001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.edu',
    phone: '+91 98765 43210',
    dateOfBirth: '2003-05-14',
    gender: 'Male',
    department: 'Computer Science',
    semester: 6,
    section: 'A',
    cgpa: 9.2,
    attendanceRate: 94,
    status: 'Active',
    address: { street: '12 Brigade Rd', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001' },
    guardian: { name: 'Rajesh Sharma', relation: 'Father', phone: '+91 98765 00001' },
  },
  {
    studentId: 'IT2024-015',
    firstName: 'Ananya',
    lastName: 'Patel',
    email: 'ananya.patel@example.edu',
    phone: '+91 98123 45678',
    dateOfBirth: '2004-02-20',
    gender: 'Female',
    department: 'Information Technology',
    semester: 4,
    section: 'B',
    cgpa: 8.8,
    attendanceRate: 91,
    status: 'Active',
    address: { street: '45 SG Highway', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380001' },
    guardian: { name: 'Vikram Patel', relation: 'Father', phone: '+91 98123 00002' },
  },
  {
    studentId: 'AI2024-042',
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.verma@example.edu',
    phone: '+91 98234 56789',
    dateOfBirth: '2003-11-09',
    gender: 'Male',
    department: 'Data Science & AI',
    semester: 6,
    section: 'A',
    cgpa: 9.6,
    attendanceRate: 98,
    status: 'Active',
    address: { street: '88 FC Road', city: 'Pune', state: 'Maharashtra', zipCode: '411001' },
    guardian: { name: 'Sunita Verma', relation: 'Mother', phone: '+91 98234 00003' },
  },
  {
    studentId: 'EC2024-108',
    firstName: 'Diya',
    lastName: 'Nair',
    email: 'diya.nair@example.edu',
    phone: '+91 98345 67890',
    dateOfBirth: '2004-07-25',
    gender: 'Female',
    department: 'Electronics & Comm.',
    semester: 4,
    section: 'A',
    cgpa: 8.4,
    attendanceRate: 88,
    status: 'Active',
    address: { street: '22 Marine Drive', city: 'Kochi', state: 'Kerala', zipCode: '682001' },
    guardian: { name: 'Murugan Nair', relation: 'Father', phone: '+91 98345 00004' },
  },
  {
    studentId: 'ME2023-012',
    firstName: 'Karan',
    lastName: 'Singh',
    email: 'karan.singh@example.edu',
    phone: '+91 98456 78901',
    dateOfBirth: '2002-09-18',
    gender: 'Male',
    department: 'Mechanical Engineering',
    semester: 8,
    section: 'B',
    cgpa: 7.9,
    attendanceRate: 82,
    status: 'Graduated',
    address: { street: '17 Sector 17', city: 'Chandigarh', state: 'Punjab', zipCode: '160001' },
    guardian: { name: 'Harpreet Singh', relation: 'Father', phone: '+91 98456 00005' },
  },
  {
    studentId: 'CS2024-055',
    firstName: 'Priya',
    lastName: 'Sundaram',
    email: 'priya.sundaram@example.edu',
    phone: '+91 98567 89012',
    dateOfBirth: '2004-01-30',
    gender: 'Female',
    department: 'Computer Science',
    semester: 2,
    section: 'C',
    cgpa: 9.1,
    attendanceRate: 95,
    status: 'Active',
    address: { street: '31 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001' },
    guardian: { name: 'G. Sundaram', relation: 'Father', phone: '+91 98567 00006' },
  },
];

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Student.deleteMany();

    const createdUsers = await User.create(sampleUsers);
    const adminUser = createdUsers[0]._id;

    const sampleStudentsWithUser = sampleStudents.map((s) => ({
      ...s,
      createdBy: adminUser,
    }));

    await Student.create(sampleStudentsWithUser);

    console.log('✅ Demo Data Seeded Successfully!');
    console.log(`👤 Admin Account: admin@university.edu / password123`);
    console.log(`🎓 Total Demo Students: ${sampleStudents.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data seeding:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Student.deleteMany();

    console.log('⚠️ All Student and User Data Cleared!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data clearing:', error.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

