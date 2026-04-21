import mongoose from 'mongoose';

const adminActivityLogSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action_type: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    target_entity: { type: String, default: '' },
    timestamp: { type: Date, default: () => new Date(), immutable: true, index: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: false }
);

const AdminActivityLog = mongoose.model('AdminActivityLog', adminActivityLogSchema);

export default AdminActivityLog;

