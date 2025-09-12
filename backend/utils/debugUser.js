require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'admin@dev.com' });
  console.log('User found:', user ? user.toObject() : null);
  process.exit(0);
})();
