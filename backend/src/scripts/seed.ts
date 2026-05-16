import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { LeadSource, LeadStatus, UserRole } from '../types';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gigflow');
  console.log('Connected to DB');

  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@gigflow.com',
    password: 'Admin@123',
    role: UserRole.ADMIN,
  });

  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@gigflow.com',
    password: 'Sales@123',
    role: UserRole.SALES,
  });

  const sources = Object.values(LeadSource);
  const statuses = Object.values(LeadStatus);
  const names = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh', 'Vikram Reddy',
    'Ananya Nair', 'Rohan Gupta', 'Deepa Verma', 'Kiran Mehta', 'Siddharth Joshi',
    'Meera Iyer', 'Arjun Pillai', 'Pooja Shah', 'Nikhil Chopra', 'Divya Rao',
    'Suresh Menon', 'Kavita Banerjee', 'Arun Tiwari', 'Neha Kapoor', 'Rajesh Bose',
  ];

  const leads = names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    notes: i % 3 === 0 ? `Note for ${name}` : undefined,
    createdBy: i % 3 === 0 ? admin._id : sales._id,
  }));

  await Lead.insertMany(leads);

  console.log('✅ Seeded:');
  console.log('   Admin: admin@gigflow.com / Admin@123');
  console.log('   Sales: sales@gigflow.com / Sales@123');
  console.log(`   Leads: ${leads.length} records`);

  await mongoose.disconnect();
};

seed().catch(console.error);
