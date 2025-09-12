const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Customer = require('../models/Customer');

describe('Customer Endpoints', () => {
  let userToken, adminToken, userId, adminId;

  beforeEach(async () => {
    // Create a regular user
    const user = new User({
      name: 'John Doe',
      email: 'user@example.com',
      passwordHash: 'password123',
      role: 'user'
    });
    const savedUser = await user.save();
    userId = savedUser._id;

    // Create an admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'password123',
      role: 'admin'
    });
    const savedAdmin = await admin.save();
    adminId = savedAdmin._id;

    // Get tokens
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userLogin.body.data.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLogin.body.data.token;
  });

  describe('POST /api/customers', () => {
    it('should create a customer successfully', async () => {
      const customerData = {
        name: 'Acme Corp',
        email: 'contact@acme.com',
        phone: '555-0123',
        company: 'Acme Corporation'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${userToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(customerData.name);
      expect(response.body.data.ownerId.toString()).toBe(userId.toString());
    });

    it('should not create customer without authentication', async () => {
      const customerData = {
        name: 'Acme Corp',
        email: 'contact@acme.com'
      };

      await request(app)
        .post('/api/customers')
        .send(customerData)
        .expect(401);
    });
  });

  describe('GET /api/customers', () => {
    beforeEach(async () => {
      // Create customers for different users
      await Customer.create({
        name: 'User Customer',
        email: 'user-customer@example.com',
        ownerId: userId
      });

      await Customer.create({
        name: 'Admin Customer',
        email: 'admin-customer@example.com',
        ownerId: adminId
      });
    });

    it('should get own customers for regular user', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('User Customer');
    });

    it('should get all customers for admin', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/customers?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.data).toHaveLength(1);
    });
  });
});