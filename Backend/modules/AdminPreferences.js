import mongoose from 'mongoose';

const adminPreferencesSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    language: { type: String, default: 'en' },
    notifications_enabled: { type: Boolean, default: true },
    dashboard_layout: { type: String, enum: ['default', 'compact', 'comfortable'], default: 'default' },
  },
  { timestamps: true }
);

const AdminPreferences = mongoose.model('AdminPreferences', adminPreferencesSchema);

export default AdminPreferences;

