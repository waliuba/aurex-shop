import AdminActivityLog from '../modules/AdminActivityLog.js';

export const logAdminActivity = async ({ adminId, actionType, description = '', targetEntity = '', meta = {} }) => {
  try {
    if (!adminId || !actionType) return;
    await AdminActivityLog.create({
      admin_id: adminId,
      action_type: actionType,
      description,
      target_entity: targetEntity,
      meta,
      timestamp: new Date(),
    });
  } catch {
    // Best-effort logging: never fail the request if logging fails.
  }
};

