require('dotenv').config();

const mongoose = require('mongoose');
const User  = require('../models/User');
const Role  = require('../models/Role');
const Topic = require('../models/Topic');
const { ROLES } = require('../config/roles');

const ADMIN_EMAIL    = 'admin@techlifecorp.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME     = 'Admin User';

const roleDefinitions = [
  { role_name: ROLES.APP_ADMIN, description: 'Full system access including user and role management' },
  { role_name: ROLES.OWNER,     description: 'Manage content and users, cannot modify roles' },
  { role_name: ROLES.EDITOR,    description: 'Create, read, and update content' },
  { role_name: ROLES.VIEWER,    description: 'Read-only access to content' },
];

const initDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`, {
      authSource: process.env.MONGODB_AUTH_SOURCE
    });
    console.log(`Connected to MongoDB – DB: ${process.env.MONGODB_DB}`);

    // ── wipe every collection ────────────────────────────
    await User.deleteMany({});
    await Role.deleteMany({});
    await Topic.deleteMany({});
    console.log('Cleared all collections');

    // ── rebuild indexes ──────────────────────────────────
    await User.ensureIndexes();
    await Role.ensureIndexes();
    await Topic.ensureIndexes();
    console.log('Indexes ensured');

    // ── roles (reference data the app depends on) ────────
    for (const roleData of roleDefinitions) {
      await Role.create(roleData);
      console.log(`  Created role: ${roleData.role_name}`);
    }

    // ── single admin user ────────────────────────────────
    await User.create({
      email:    ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name:     ADMIN_NAME,
      role:     ROLES.APP_ADMIN,
      isActive: true
    });
    console.log(`  Created admin: ${ADMIN_EMAIL}`);

    // ── summary ──────────────────────────────────────────
    console.log('\n========================================');
    console.log(' Database initialized successfully!');
    console.log('========================================');
    console.log('\n  Admin Credentials:');
    console.log(`    Email:    ${ADMIN_EMAIL}`);
    console.log(`    Password: ${ADMIN_PASSWORD}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
