// /backend/utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

let connectDB;
try {
  connectDB = require(path.join(__dirname, '..', 'config', 'db'));
} catch (err) {
  // ignore - fallback to direct mongoose connect
}

const User = require(path.join(__dirname, '..', 'models', 'User'));
const Customer = require(path.join(__dirname, '..', 'models', 'Customer'));
const Lead = require(path.join(__dirname, '..', 'models', 'Lead'));

async function mainConnect() {
  if (connectDB && typeof connectDB === 'function') {
    await connectDB();
    return;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment. Please set it in .env before running seed.');
    process.exit(1);
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mainConnect();
    console.log('Connected to DB.');

    // --- Create admin user if not exists ---
    const adminEmail = 'admin@dev.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash: hashed,
        role: 'admin'
      });
      console.log('Created admin user ->', adminEmail, 'password: Admin@123');
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    // --- Create two sample users if not exist ---
    const usersToCreate = [
      { name: 'Alice', email: 'alice@dev.com', password: 'Alice@123', role: 'user' },
      { name: 'Bob', email: 'bob@dev.com', password: 'Bob@123', role: 'user' }
    ];

    const createdUsers = [];
    for (const u of usersToCreate) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashed = await bcrypt.hash(u.password, 10);
        user = await User.create({
          name: u.name,
          email: u.email,
          passwordHash: hashed,
          role: u.role
        });
        console.log('Created user:', u.email, 'password:', u.password);
      } else {
        console.log('User exists:', u.email);
      }
      createdUsers.push(user);
    }

    // --- Create sample customers (owned by admin) if none exist ---
    const existingCustomers = await Customer.countDocuments();
    let customers;
    if (existingCustomers === 0) {
      customers = await Customer.insertMany([
        {
          name: 'Acme Corp',
          email: 'contact@acme.com',
          phone: '9991112222',
          company: 'Acme Corp',
          ownerId: admin._id
        },
        {
          name: 'Beta Solutions',
          email: 'hello@beta.com',
          phone: '9993334444',
          company: 'Beta Solutions',
          ownerId: admin._id
        },
        {
          name: 'Gamma Industries',
          email: 'info@gamma.com',
          phone: '9995556666',
          company: 'Gamma Industries',
          ownerId: admin._id
        }
      ]);
      console.log('Created sample customers:', customers.map(c => c.name).join(', '));
    } else {
      // fetch some existing customers - ensure they are full documents (with ownerId)
      customers = await Customer.find().limit(3).lean();
      console.log(`Found ${existingCustomers} existing customers - will use first ${customers.length} for seeding leads.`);
    }

    // --- Create sample leads for each customer (2 leads each) ---
    const leadStatuses = ['New', 'Contacted', 'Converted', 'Lost'];

    let totalLeadsCreated = 0;
    for (const cust of customers) {
      // If we used .lean() above, cust might be plain object, ensure _id exists
      const customerId = cust._id || cust.id;
      if (!customerId) {
        console.warn('Skipping customer - no _id found:', cust);
        continue;
      }

      // decide ownerId for lead: prefer customer.ownerId (if set), otherwise fallback to admin._id
      const ownerIdForLead = cust.ownerId || cust.owner || admin._id;

      // Check if this customer already has leads
      const existingLeads = await Lead.find({ customerId: customerId }).limit(1);
      if (existingLeads.length > 0) {
        console.log(`Customer ${cust.name || customerId} already has leads - skipping lead creation for this customer.`);
        continue;
      }

      const leadsToInsert = [
        {
          customerId: customerId,
          ownerId: ownerIdForLead,              // <-- required field added
          title: `Initial outreach - ${cust.name || customerId}`,
          description: `Reached out to ${cust.name || customerId} for initial discussion.`,
          status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
          value: Math.floor(Math.random() * 10000) + 500,
          createdAt: new Date()
        },
        {
          customerId: customerId,
          ownerId: ownerIdForLead,              // <-- required field added
          title: `Proposal sent - ${cust.name || customerId}`,
          description: `Sent a proposal to ${cust.name || customerId}.`,
          status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
          value: Math.floor(Math.random() * 20000) + 1000,
          createdAt: new Date()
        }
      ];

      const created = await Lead.insertMany(leadsToInsert);
      totalLeadsCreated += created.length;
      console.log(`Created ${created.length} leads for customer ${cust.name || customerId}`);
    }

    console.log('Seeding complete.');
    console.log(`Admin: ${adminEmail} (password: Admin@123)`);
    console.log(`Total users (incl admin): ${1 + createdUsers.length}`);
    console.log(`Total leads created in this run: ${totalLeadsCreated}`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
