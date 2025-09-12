// /backend/utils/debugPassword.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'admin@dev.com';
  const plainPassword = 'Admin@123';

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    return process.exit(0);
  }

  console.log('--- Debugging password for:', email, '---');
  console.log('Stored hash:', user.passwordHash);

  const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
  console.log(`Does "${plainPassword}" match hash?`, isMatch);

  process.exit(0);
})();
