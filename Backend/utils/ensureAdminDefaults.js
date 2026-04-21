import AdminPermissions from '../modules/AdminPermissions.js';
import AdminPreferences from '../modules/AdminPreferences.js';
import AdminTwoFactor from '../modules/AdminTwoFactor.js';

export const ensureAdminDefaults = async (adminId) => {
  if (!adminId) return;

  await Promise.all([
    AdminPermissions.updateOne({ admin_id: adminId }, { $setOnInsert: { admin_id: adminId } }, { upsert: true }),
    AdminPreferences.updateOne({ admin_id: adminId }, { $setOnInsert: { admin_id: adminId } }, { upsert: true }),
    AdminTwoFactor.updateOne({ admin_id: adminId }, { $setOnInsert: { admin_id: adminId } }, { upsert: true }),
  ]);
};

