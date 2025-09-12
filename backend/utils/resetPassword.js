// /backend/utils/resetPassword.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  try {
    const [,, email, newPassword] = process.argv;
    if (!email || !newPassword) {
      console.error('Usage: node utils/resetPassword.js <email> <newPassword>');
      process.exit(1);
    }

    // Connect to Mongo
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      await mongoose.disconnect();
      process.exit(1);
    }

    // Assign plain password → pre-save hook will hash it
    user.passwordHash = newPassword;
    await user.save();

    // Verify immediately
    const isMatch = await bcrypt.compare(newPassword, user.passwordHash);
    console.log(`✅ Password for ${email} reset to: ${newPassword}`);
    console.log('Verification (bcrypt.compare):', isMatch);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
})();
