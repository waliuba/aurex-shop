import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    device_info: { type: String, default: '' },
    ip_address: { type: String, default: '' },
    location: { type: String, default: '' },
    last_active: { type: Date, default: () => new Date() },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const AdminSession = mongoose.model('AdminSession', adminSessionSchema);

export default AdminSession;

