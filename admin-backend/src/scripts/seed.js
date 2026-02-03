require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../config/roles');

const seedUsers = [
  {
    email: 'admin@techlifecorp.com',
    password: 'admin123',
    name: 'Admin User',
    role: ROLES.APP_ADMIN,
    isActive: true
  },
  {
    email: 'owner@techlifecorp.com',
    password: 'owner123',
    name: 'Owner User',
    role: ROLES.OWNER,
    isActive: true
  },
  {
    email: 'editor@techlifecorp.com',
    password: 'editor123',
    name: 'Editor User',
    role: ROLES.EDITOR,
    isActive: true
  },
  {
    email: 'viewer@techlifecorp.com',
    password: 'viewer123',
    name: 'Viewer User',
    role: ROLES.VIEWER,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create seed users
    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = await User.create(userData);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('\nDefault Admin Credentials:');
    console.log('  Email:    admin@techlifecorp.com');
    console.log('  Password: admin123');
    console.log('\nOther test users:');
    console.log('  owner@techlifecorp.com / owner123');
    console.log('  editor@techlifecorp.com / editor123');
    console.log('  viewer@techlifecorp.com / viewer123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
