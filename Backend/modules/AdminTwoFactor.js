import mongoose from 'mongoose';

const adminTwoFactorSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    enabled: { type: Boolean, default: false },
    secret_base32: { type: String, default: '' },
    verified_at: { type: Date, default: null },
  },
  { timestamps: true }
);

const AdminTwoFactor = mongoose.model('AdminTwoFactor', adminTwoFactorSchema);

export default AdminTwoFactor;

