import AdminPreferences from '../modules/AdminPreferences.js';
import { ensureAdminDefaults } from '../utils/ensureAdminDefaults.js';
import { logAdminActivity } from '../utils/adminActivity.js';

const toDto = (p) => ({
  theme: p.theme,
  language: p.language,
  notifications_enabled: Boolean(p.notifications_enabled),
  dashboard_layout: p.dashboard_layout,
});

export const getAdminPreferences = async (req, res) => {
  await ensureAdminDefaults(req.user._id);
  const pref = await AdminPreferences.findOne({ admin_id: req.user._id });
  return res.json(toDto(pref));
};

export const updateAdminPreferences = async (req, res) => {
  try {
    await ensureAdminDefaults(req.user._id);
    const body = req.body || {};
    const $set = {};

    if (body.theme !== undefined) {
      const v = String(body.theme);
      if (!['dark', 'light'].includes(v)) return res.status(400).json({ message: 'Invalid theme' });
      $set.theme = v;
    }
    if (body.language !== undefined) {
      const v = String(body.language || '').trim();
      if (v.length > 16) return res.status(400).json({ message: 'Invalid language' });
      $set.language = v || 'en';
    }
    if (body.notifications_enabled !== undefined) {
      $set.notifications_enabled = Boolean(body.notifications_enabled);
    }
    if (body.dashboard_layout !== undefined) {
      const v = String(body.dashboard_layout);
      if (!['default', 'compact', 'comfortable'].includes(v)) return res.status(400).json({ message: 'Invalid dashboard layout' });
      $set.dashboard_layout = v;
    }

    const updated = await AdminPreferences.findOneAndUpdate({ admin_id: req.user._id }, { $set }, { new: true });

    await logAdminActivity({
      adminId: req.user._id,
      actionType: 'admin.preferences.update',
      description: 'Updated admin preferences',
      targetEntity: `admin:${req.user._id.toString()}`,
      meta: { fields: Object.keys($set) },
    });

    return res.json(toDto(updated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

