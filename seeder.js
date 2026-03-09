require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const users = [
  {
    name: 'manager',
    username: 'manager-maganjo',
    password: 'manager123',
    role: 'manager',
    branch: 'branch maganjo',
    contact: '0700000001'
  },
  {
    name: 'manager',
    username: 'manager-matugga',
    password: 'manager123',
    role: 'manager',
    branch: 'branch matugga',
    contact: '0700000002'
  },
  {
    name: 'Agent',
    username: 'agent-maganjo',
    password: 'agent123',
    role: 'agent',
    branch: 'branch maganjo',
    contact: '0700000003'
  },
  {
    name: 'Agent',
    username: 'agent-matugga',
    password: 'agent123',
    role: 'agent',
    branch: 'branch matugga',
    contact: '0700000004'
  },
  {
    name: 'Mr. Orban',
    username: 'director',
    password: 'director123',
    role: 'director',
    branch: 'branch maganjo',
    contact: '0700000005'
  }
];

const seedDB = async () => {
  await connectDB();
  try {
    // Start clean so rerunning this script does not duplicate seed users.
    await User.deleteMany({});
    console.log('Cleared existing users...');

    for (const user of users) {
      // Password hashing is handled in the User model pre-save hook.
      await User.create(user);
      console.log(`✅ Created ${user.role}: ${user.username}`);
    }

    console.log('\n=============================');
    console.log('  Database seeded successfully!');
    console.log('=============================');
    console.log('\nTest Login Credentials:\n');
    console.log('MANAGER (Branch Maganjo)  → username: manager-maganjo  | password: manager123');
    console.log('MANAGER (Branch Matugga)  → username: manager-matugga  | password: manager123');
    console.log('AGENT   (Branch Maganjo)  → username: agent-maganjo    | password: agent123');
    console.log('AGENT   (Branch Matugga)  → username: agent-matugga    | password: agent123');
    console.log('DIRECTOR            → username: director | password: director123');
    console.log('\n');
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    // Close DB connection so the process exits right away.
    mongoose.connection.close();
    process.exit();
  }
};

seedDB();
