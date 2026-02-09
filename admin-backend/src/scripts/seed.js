require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const Topic = require('../models/Topic');
const SystemInfo = require('../models/SystemInfo');
const LoginTracker = require('../models/LoginTracker');
const Prompt = require('../models/Prompt');
const ChatEngine = require('../models/ChatEngine');
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
    topic_name: 'getting-started',
    topic_label: 'Getting Started',
    description: 'Introduction and initial setup guide for new users',
    created_by: 'admin@techlifecorp.com'
  },
  {
    topic_name: 'user-management',
    topic_label: 'User Management',
    description: 'Creating, updating, and managing user accounts and roles',
    created_by: 'admin@techlifecorp.com'
  },
  {
    topic_name: 'content-publishing',
    topic_label: 'Content Publishing',
    description: 'Workflow for drafting, reviewing, and publishing content',
    created_by: 'owner@techlifecorp.com'
  },
  {
    topic_name: 'api-integration',
    topic_label: 'API Integration',
    description: 'Connecting external services with the platform API',
    created_by: 'editor@techlifecorp.com'
  },
  {
    topic_name: 'reporting-analytics',
    topic_label: 'Reporting & Analytics',
    description: 'Generating reports and interpreting platform metrics',
    created_by: 'owner@techlifecorp.com'
  }
];

const seedPrompts = [
  {
    prompt_name: 'Welcome Message',
    prompt: 'Generate a friendly welcome message for new users joining the platform.',
    description: 'Default welcome message prompt for onboarding',
    created_by: 'admin@techlifecorp.com'
  },
  {
    prompt_name: 'Content Summary',
    prompt: 'Summarize the following content in 3-5 concise bullet points.',
    description: 'Summarization prompt for long-form content',
    created_by: 'editor@techlifecorp.com'
  },
  {
    prompt_name: 'Support Response',
    prompt: 'Draft a professional and helpful support response to the following customer inquiry.',
    description: 'Template prompt for customer support replies',
    created_by: 'owner@techlifecorp.com'
  },
  {
    prompt_name: 'Data Analysis',
    prompt: 'Analyze the provided dataset and identify key trends, outliers, and actionable insights.',
    description: 'Prompt for generating data analysis reports',
    created_by: 'admin@techlifecorp.com'
  }
];

const seedChatEngines = [
  {
    engine_name: 'OpenAI GPT-4',
    description: 'OpenAI GPT-4 chat completion engine',
    api_key: 'sk-placeholder-openai-key',
    active: true
  },
  {
    engine_name: 'Anthropic Claude',
    description: 'Anthropic Claude conversational AI engine',
    api_key: 'sk-placeholder-anthropic-key',
    active: true
  },
  {
    engine_name: 'Google Gemini',
    description: 'Google Gemini multi-modal AI engine',
    api_key: 'sk-placeholder-google-key',
    active: false
  }
];

const seedSystemInfo = [
  {
    companyOwner: 'TechLifeCorp',
    version: '1.0.0',
    buildNumber: '100'
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

    // Clear existing loginTracker
    await LoginTracker.deleteMany({});
    console.log('Cleared existing loginTracker');

    // Create sample login records using the seeded users
    const adminUser = await User.findOne({ email: 'admin@techlifecorp.com' });
    const ownerUser = await User.findOne({ email: 'owner@techlifecorp.com' });
    if (adminUser) {
      await LoginTracker.create({ userId: adminUser._id, dateTimeStamp: new Date('2025-12-01T08:30:00Z') });
      await LoginTracker.create({ userId: adminUser._id, dateTimeStamp: new Date('2025-12-02T09:15:00Z') });
      console.log('Created sample login records for admin');
    }
    if (ownerUser) {
      await LoginTracker.create({ userId: ownerUser._id, dateTimeStamp: new Date('2025-12-01T10:45:00Z') });
      console.log('Created sample login records for owner');
    }

    // Clear existing systemInfo
    await SystemInfo.deleteMany({});
    console.log('Cleared existing systemInfo');

    // Create seed systemInfo
    for (const infoData of seedSystemInfo) {
      const info = await SystemInfo.create(infoData);
      console.log(`Created systemInfo: ${info.companyOwner} v${info.version} (build ${info.buildNumber})`);
    }

    // Clear existing chat engines
    await ChatEngine.deleteMany({});
    console.log('Cleared existing chat engines');

    // Create seed chat engines
    const createdEngines = {};
    for (const engineData of seedChatEngines) {
      const engine = await ChatEngine.create(engineData);
      createdEngines[engine.engine_name] = engine._id;
      console.log(`Created chat engine: ${engine.engine_name}`);
    }

    // Clear existing prompts
    await Prompt.deleteMany({});
    console.log('Cleared existing prompts');

    // Create seed prompts with chat engine linkage
    const promptEngineMap = {
      'Welcome Message': 'OpenAI GPT-4',
      'Content Summary': 'Anthropic Claude',
      'Support Response': 'OpenAI GPT-4',
      'Data Analysis': 'Anthropic Claude'
    };
    for (const promptData of seedPrompts) {
      const engineName = promptEngineMap[promptData.prompt_name];
      const prompt = await Prompt.create({
        ...promptData,
        chat_engine: engineName ? createdEngines[engineName] : null
      });
      console.log(`Created prompt: ${prompt.prompt_name} → ${engineName || 'no engine'}`);
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
