import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/axdb.js';
import User from '../modules/User.js';
import AdminPermissions from '../modules/AdminPermissions.js';
import AdminPreferences from '../modules/AdminPreferences.js';
import AdminTwoFactor from '../modules/AdminTwoFactor.js';

const requiredEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key} in environment variables`);
  return value;
};

const run = async () => {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Aurex Admin';
  const email = requiredEnv('ADMIN_EMAIL').toLowerCase().trim();
  const password = requiredEnv('ADMIN_PASSWORD');

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin seed skipped: user already exists (${email})`);
    return;
  }

  const username = (process.env.ADMIN_USERNAME || email.split('@')[0] || 'admin').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
    adminRole: process.env.ADMIN_ROLE || 'super_admin',
    username,
    status: 'active',
  });

  await Promise.all([
    AdminPermissions.updateOne(
      { admin_id: admin._id },
      {
        $setOnInsert: {
          admin_id: admin._id,
          can_read: true,
          can_write: true,
          can_delete: true,
          can_manage_users: true,
          can_manage_system: true,
        },
      },
      { upsert: true }
    ),
    AdminPreferences.updateOne(
      { admin_id: admin._id },
      { $setOnInsert: { admin_id: admin._id, theme: 'dark', language: 'en', notifications_enabled: true, dashboard_layout: 'default' } },
      { upsert: true }
    ),
    AdminTwoFactor.updateOne({ admin_id: admin._id }, { $setOnInsert: { admin_id: admin._id, enabled: false } }, { upsert: true }),
  ]);

  console.log(`Admin created: ${email} (username: ${username})`);
};

run()
  .catch((err) => {
    console.error('Seed admin failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
    } catch {
      // ignore
    }
  });
