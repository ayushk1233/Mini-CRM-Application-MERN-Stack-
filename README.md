# ClientSphere (Mini CRM Application) 🚀

> Manage your customers, track leads, and gain insights — all in one place.

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)
![React](https://img.shields.io/badge/React-v18+-blue.svg)

## 🌐 Live Demo

- Frontend: [Live](https://mini-crm-application-mern-stack.vercel.app/)
- Backend: [Live API](https://mini-crm-backend-1obf.onrender.com)
  - To login : Email: admin@dev.com  Password : Admin@123
## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control:
  - **Admin**: Full system access with CRUD capabilities
  - **User**: Read-only access to view customers and leads

### 👥 Customer Management
- Comprehensive customer database
- Advanced search and filtering
- Pagination for efficient data handling
- Full CRUD operations (Admin only)

### 📈 Lead Management
- Per-customer lead tracking
- Status workflow:
  - New → Contacted → Qualified → Won/Lost
- Lead value tracking
- Detailed lead history

### 📊 Analytics Dashboard
- Real-time data visualization
- Lead status distribution (Pie Chart)
- Lead value analysis (Bar Chart)
- Performance metrics

### 🎯 User Experience
- Modern, intuitive interface
- Responsive design (Desktop & Mobile)
- Smooth animations & transitions
- Real-time toast notifications

### 📸 Screenshots 
<img width="1401" height="765" alt="Screenshot 2025-09-14 at 3 38 30 AM" src="https://github.com/user-attachments/assets/bcd85103-7a7e-439a-bb9f-71d958b62628" />
<img width="1399" height="797" alt="Screenshot 2025-09-14 at 3 38 43 AM" src="https://github.com/user-attachments/assets/09baea12-226e-44bf-b65c-6d837da6005b" />
<img width="1397" height="793" alt="Screenshot 2025-09-14 at 3 38 53 AM" src="https://github.com/user-attachments/assets/39d80aca-655a-4eec-91eb-0bb76bdc3a75" />
<img width="1401" height="791" alt="Screenshot 2025-09-14 at 3 39 12 AM" src="https://github.com/user-attachments/assets/643969ad-a959-47a2-990e-f2be820d06d2" />
<img width="953" height="678" alt="Screenshot 2025-09-14 at 3 39 18 AM" src="https://github.com/user-attachments/assets/526e3b60-47bd-4a57-baf5-9563ca3a6b5f" />
<img width="737" height="450" alt="Screenshot 2025-09-14 at 3 39 25 AM" src="https://github.com/user-attachments/assets/a7660db9-2928-4ffd-a89b-918b238acfb1" />

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Charts**: react-chartjs-2
- **Animations**: Framer Motion
- **Notifications**: react-hot-toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: Bcrypt
- **API Documentation**: Swagger/OpenAPI

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database Hosting**: MongoDB Atlas
- **Version Control**: Git & GitHub

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas URI)
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/ayushk1233/Mini-CRM-Application-MERN-Stack-.git
   cd Mini-CRM-Application-MERN-Stack-
   ```

2. Install Backend Dependencies
   ```bash
   cd backend
   npm install
   ```

3. Configure Backend Environment
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Install Frontend Dependencies
   ```bash
   cd ../frontend
   npm install
   ```

5. Configure Frontend Environment
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start Backend Server
   ```bash
   cd backend
   npm run dev
   ```

2. Start Frontend Development Server
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📱 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Customers
- GET `/api/customers` - List all customers
- POST `/api/customers` - Create customer (Admin)
- GET `/api/customers/:id` - Get customer details
- PUT `/api/customers/:id` - Update customer (Admin)
- DELETE `/api/customers/:id` - Delete customer (Admin)

### Leads
- GET `/api/customers/:customerId/leads` - List customer leads
- POST `/api/customers/:customerId/leads` - Create lead (Admin)
- GET `/api/customers/:customerId/leads/:leadId` - Get lead details
- PUT `/api/customers/:customerId/leads/:leadId` - Update lead (Admin)
- DELETE `/api/customers/:customerId/leads/:leadId` - Delete lead (Admin)

### Analytics
- GET `/api/analytics/leads-by-status` - Lead distribution
- GET `/api/analytics/stats` - System statistics
- GET `/api/analytics/leads` - Detailed lead analytics

## 📚 Project Structure

```
ClientSphere/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── utils/         # Utility functions
│
├── frontend/
│   ├── src/
│   │   ├── api/       # API integration
│   │   ├── components/# Reusable components
│   │   ├── context/   # React context
│   │   ├── hooks/     # Custom hooks
│   │   ├── pages/     # Main pages
│   │   └── styles/    # CSS styles
│   └── public/        # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Chart.js](https://www.chartjs.org/)

---

Created with ❤️ by [Ayush Kumar](https://github.com/ayushk1233)
