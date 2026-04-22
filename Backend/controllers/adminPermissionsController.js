import AdminPermissions from '../modules/AdminPermissions.js';
import { ensureAdminDefaults } from '../utils/ensureAdminDefaults.js';
import { logAdminActivity } from '../utils/adminActivity.js';

const toDto = (p) => ({
  can_read: Boolean(p.can_read),
  can_write: Boolean(p.can_write),
  can_delete: Boolean(p.can_delete),
  can_manage_users: Boolean(p.can_manage_users),
  can_manage_system: Boolean(p.can_manage_system),
});

export const getAdminPermissions = async (req, res) => {
  await ensureAdminDefaults(req.user._id);
  const p = await AdminPermissions.findOne({ admin_id: req.user._id });
  return res.json(toDto(p));
};

export const updateAdminPermissions = async (req, res) => {
  try {
    if (req.user.adminRole !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await ensureAdminDefaults(req.user._id);

    const body = req.body || {};
    const allowed = ['can_read', 'can_write', 'can_delete', 'can_manage_users', 'can_manage_system'];
    const $set = {};
    for (const key of allowed) {
      if (body[key] !== undefined) $set[key] = Boolean(body[key]);
    }

    const updated = await AdminPermissions.findOneAndUpdate(
      { admin_id: req.user._id },
      { $set },
      { new: true }
    );

    await logAdminActivity({
      adminId: req.user._id,
      actionType: 'admin.permissions.update',
      description: 'Updated admin permissions',
      targetEntity: `admin:${req.user._id.toString()}`,
      meta: { fields: Object.keys($set) },
    });

    return res.json(toDto(updated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

