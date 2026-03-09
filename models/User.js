const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User accounts drive authentication and role-based access in the app.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  role: { type: String, enum: ['manager', 'agent', 'director'], required: true },
  branch: { type: String, enum: ['branch maganjo', 'branch matugga'], required: true },
  contact: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Contact must be a 10-digit phone number']
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  // Only hash when password is new/changed to avoid double hashing.
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare plain text login password with the stored hash.
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
