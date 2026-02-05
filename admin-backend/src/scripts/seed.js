require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const Topic = require('../models/Topic');
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

const seedRoles = [
  {
    role_name: ROLES.APP_ADMIN,
    description: 'Full system access including user and role management'
  },
  {
    role_name: ROLES.OWNER,
    description: 'Manage content and users, cannot modify roles'
  },
  {
    role_name: ROLES.EDITOR,
    description: 'Create, read, and update content'
  },
  {
    role_name: ROLES.VIEWER,
    description: 'Read-only access to content'
  }
];

const seedTopics = [
  {
    topic_name: 'Getting Started',
    description: 'Introduction and initial setup guide for new users',
    created_by: 'admin@techlifecorp.com'
  },
  {
    topic_name: 'User Management',
    description: 'Creating, updating, and managing user accounts and roles',
    created_by: 'admin@techlifecorp.com'
  },
  {
    topic_name: 'Content Publishing',
    description: 'Workflow for drafting, reviewing, and publishing content',
    created_by: 'owner@techlifecorp.com'
  },
  {
    topic_name: 'API Integration',
    description: 'Connecting external services with the platform API',
    created_by: 'editor@techlifecorp.com'
  },
  {
    topic_name: 'Reporting & Analytics',
    description: 'Generating reports and interpreting platform metrics',
    created_by: 'owner@techlifecorp.com'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`, {
      authSource: process.env.MONGODB_AUTH_SOURCE
    });
    console.log(`Connected to MongoDB – DB: ${process.env.MONGODB_DB}`);

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

    // Clear existing roles
    await Role.deleteMany({});
    console.log('Cleared existing roles');

    // Create seed roles
    for (const roleData of seedRoles) {
      const role = await Role.create(roleData);
      console.log(`Created role: ${role.role_name}`);
    }

    // Clear existing topics
    await Topic.deleteMany({});
    console.log('Cleared existing topics');

    // Create seed topics
    for (const topicData of seedTopics) {
      const topic = await Topic.create(topicData);
      console.log(`Created topic: ${topic.topic_name}`);
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
