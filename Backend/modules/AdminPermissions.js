import mongoose from 'mongoose';

const adminPermissionsSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    can_read: { type: Boolean, default: true },
    can_write: { type: Boolean, default: true },
    can_delete: { type: Boolean, default: false },
    can_manage_users: { type: Boolean, default: false },
    can_manage_system: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AdminPermissions = mongoose.model('AdminPermissions', adminPermissionsSchema);

export default AdminPermissions;

