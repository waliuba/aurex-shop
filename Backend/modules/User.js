import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },
    // `select: false` keeps the hashed password out of normal queries/responses by default
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    adminRole: { type: String, enum: ['super_admin', 'moderator', 'staff'], default: undefined },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  },
  { timestamps: true }
);

// Hash password before saving (only when it changes)
// IMPORTANT: Don't mix `async` + `next` in Mongoose middleware, it can lead to
// "next is not a function". Use promise-style middleware with no `next`.
userSchema.pre('save', function () {
  if (!this.isModified('password')) return;

  // Use sync helpers for maximum compatibility with bcryptjs across environments.
  // (bcryptjs async helpers are callback-based; sync avoids "missing callback" issues.)
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

// Helper to compare a plain password with the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

// Ensure password never leaks in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
